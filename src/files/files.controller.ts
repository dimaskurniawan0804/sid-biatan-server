import {
  Controller,
  // Get,
  Post,
  // Body,
  UseGuards,
  UseInterceptors,
  Req,
  // UploadedFile,
  // Param,
  // Patch,
  UploadedFiles,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UserGuard } from 'src/middleware/users.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(new UserGuard())
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination:
          '/Users/dimaskurniawan/Documents/alek/multer-files/sid-biatan', // Development
        // destination: '/www/wwwroot/uploads', // VPS
        filename: (req, file, cb) => {
          try {
            const now = new Date();
            const jakartaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
              .toISOString()
              .replace('Z', '+07:00');

            const sanitizedOriginalName = file.originalname.replace(
              /[^a-zA-Z0-9.]/g,
              '_',
            ); // Remove special chars

            const filename = `${uuidv4()}*${jakartaTime}*${sanitizedOriginalName}`;
            cb(null, filename);
          } catch (error) {
            cb(error, '');
          }
        },
      }),
    }),
  )
  @Post()
  async uploadFile(@Req() req, @UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.create(files, req.body.feed_id);
  }

  @UseGuards(new UserGuard())
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination:
          '/Users/dimaskurniawan/Documents/alek/multer-files/sid-biatan', // Development
        // destination: '/www/wwwroot/uploads', // VPS
        filename: (req, file, cb) => {
          try {
            const now = new Date();
            const jakartaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
              .toISOString()
              .replace('Z', '+07:00');

            const sanitizedOriginalName = file.originalname.replace(
              /[^a-zA-Z0-9.]/g,
              '_',
            ); // Remove special chars

            const filename = `nota*${uuidv4()}*${jakartaTime}*${sanitizedOriginalName}`;
            cb(null, filename);
          } catch (error) {
            cb(error, '');
          }
        },
      }),
    }),
  )
  @Post('/nota')
  async uploadFileNota(
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.filesService.createNota(files, req.body.feed_id);
  }

  // @Post()
  // create(@Body() createFileDto: CreateFileDto) {
  //   return this.filesService.create(createFileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.filesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.filesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.filesService.update(+id, updateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
