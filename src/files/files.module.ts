import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorService } from 'src/error/error.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, PrismaService, ErrorService],
})
export class FilesModule {}
