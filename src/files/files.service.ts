import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorService } from 'src/error/error.service';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private errorService: ErrorService,
  ) {}
  async create(createFileDto: any, feed_id: any) {
    const data = [];
    createFileDto.map((file) => {
      data.push({
        file_name: file.filename,
        created_at: new Date(),
        updated_at: new Date(),
        nota: false,
        feed_id: +feed_id,
      });
    });
    try {
      const createFiles = await this.prisma.files.createMany({
        data,
      });
      if (!createFiles) {
        throw new Error('PROCESS_FAILED-Failed to create files');
      }
      return {
        status: 201,
        message: 'Files uploaded successfully',
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  async createNota(createFileDto: any, feed_id: any) {
    const data = [];
    createFileDto.map((file) => {
      data.push({
        file_name: file.filename,
        created_at: new Date(),
        updated_at: new Date(),
        nota: true,
        feed_id: +feed_id,
      });
    });
    try {
      const createFiles = await this.prisma.files.createMany({
        data,
      });
      if (!createFiles) {
        throw new Error('PROCESS_FAILED-Failed to create files');
      }
      return {
        status: 201,
        message: 'Nota uploaded successfully',
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  // findAll() {
  //   return `This action returns all files`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} file`;
  // }

  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} file`;
  // }
}
