import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface ErrorShape {
  statusCode: number;
  error: {
    code: string;
    message: string;
  };
}

@Injectable()
export class ErrorService {
  mappingError(err: any): never {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorShape = {
      statusCode,
      error: {
        code: 'UNHANDLED_ERROR',
        message: 'An unexpected error occurred',
      },
    };

    // ✅ Handle Prisma Errors
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002': // Unique constraint failed
          statusCode = HttpStatus.BAD_REQUEST;
          errorResponse = {
            statusCode,
            error: {
              code: 'BAD-REQUEST',
              message: `Duplicate value at table (${err.meta?.modelName}) column (${err.meta?.target}). Value must be unique`,
            },
          };
          break;
        default:
          statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          errorResponse = {
            statusCode,
            error: {
              code: 'UNHANDLED_PRISMA_ERROR',
              message: `Unhandled Prisma error - ${err.message}`,
            },
          };
          break;
      }
    }
    // ✅ Handle Generic Errors
    else {
      if (!err.message || typeof err.message !== 'string') {
        errorResponse = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: {
            code: 'MALFORMED_ERROR',
            message: 'An error occurred, but no valid message was provided',
          },
        };
        throw new HttpException(errorResponse, statusCode);
      }

      const errorParts = err.message.split('-');
      if (errorParts.length < 2) {
        errorResponse = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: {
            code: 'MALFORMED_ERROR',
            message: 'An error occurred, but it is not properly formatted',
          },
        };
        throw new HttpException(errorResponse, statusCode);
      }

      const [errorCode, errorMessage] = errorParts.map((part) => part.trim());

      const errorMapping: Record<string, number> = {
        NOT_FOUND: HttpStatus.NOT_FOUND,
        BAD_REQUEST: HttpStatus.BAD_REQUEST,
        FORBIDDEN: HttpStatus.FORBIDDEN,
        CONFLICT: HttpStatus.CONFLICT,
        LOGIN_FAILED: HttpStatus.BAD_REQUEST,
        PROCESS_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
        UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
      };

      statusCode = errorMapping[errorCode] || HttpStatus.INTERNAL_SERVER_ERROR;

      errorResponse = {
        statusCode,
        error: {
          code: errorCode,
          message: errorMessage,
        },
      };
    }

    throw new HttpException(errorResponse, statusCode); // ✅ Always throw the error
  }
}
