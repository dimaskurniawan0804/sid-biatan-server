import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface errorShape {
  statusCode: number | string;
  error: {
    code: string;
    message: string;
  };
}
@Injectable()
export class ErrorService {
  errorData = {
    statusCode: 0,
    error: {
      code: '',
      message: '',
    },
  };
  async mappingError(err: any) {
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('<<< Error Prisma Client >>> ', err);
      switch (err.code) {
        case 'P2002':
          this.errorData.statusCode = 400;
          this.errorData.error.code = 'BAD-REQUEST';
          this.errorData.error.message = `duplicate value at table (${err.meta.modelName}) column (${err.meta.target}). Value must be unique`;
          break;
        default:
          this.errorData.statusCode = 999;
          this.errorData.error.code = 'UNHANDLED ERROR';
          this.errorData.error.message = 'UNHANDLED ERROR ' + err.message;
          break;
      }
    } else {
      if (!err.message) {
        this.errorData.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        this.errorData.error.code = 'UNHANDLED ERROR';
        this.errorData.error.message = err;
        return this.errorData;
      }
      /**
       * error[0] is code
       * error[1] is message
       */
      const error = err.message.split('-');
      switch (error[0]) {
        case 'NOT_FOUND':
          this.errorData.statusCode = HttpStatus.NOT_FOUND;
          this.errorData.error.code = error[0];
          this.errorData.error.message = error[1];
          break;
        case 'BAD_REQUEST':
          this.errorData.statusCode = HttpStatus.BAD_REQUEST;
          this.errorData.error.code = error[0];
          this.errorData.error.message = error[1];
          break;
        case 'FORBIDDEN':
          this.errorData.statusCode = 403;
          this.errorData.error.code = error[0];
          this.errorData.error.message = error[1];
          break;
        case 'CONFLICT':
          this.errorData.statusCode = HttpStatus.CONFLICT;
          this.errorData.error.code = error[0];
          this.errorData.error.message = error[1];
        case 'LOGIN_FAILED':
          this.errorData.statusCode = HttpStatus.BAD_REQUEST;
          this.errorData.error.code = error[0];
          this.errorData.error.message = error[1];
          break;
        case 'PROCESS_FAILED':
          this.errorData.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          this.errorData.error.code = error[0];
          this.errorData.error.message = error[1];
          break;

        default:
          this.errorData.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          this.errorData.error.code = 'UNHANDLED ERROR';
          this.errorData.error.message = 'UNHANDLED ERROR - ' + error[1];
          break;
      }
    }
    return this.errorData;
  }
}
