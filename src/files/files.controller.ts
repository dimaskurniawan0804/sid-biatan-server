import {
  Controller,
  // Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  Param,
  Patch,
  UploadedFiles,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UserGuard } from 'src/middleware/users.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(new UserGuard())
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // 'files' should match the field name in FormData
      storage: diskStorage({
        destination:
          '/Users/dimaskurniawan/Documents/alek/multer-files/sid-biatan', // Development
        // destination: '/www/wwwroot/upload', // VPS
        filename: (req, file, cb) => {
          try {
            const now = new Date();
            const jakartaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000) // Convert UTC to GMT+7
              .toISOString()
              .replace('Z', '+07:00'); // Keep ISO format with GMT+7

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
    return {
      message: 'UPLOAD SUCCESS',
      filenames: files.map((file) => file.filename),
    };
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
