import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UserGuard } from 'src/middleware/users.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { memoryStorage } from 'multer';
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly imgService: ImagekitService,
  ) {}

  @UseGuards(new UserGuard())
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  @Post()
  async uploadFile(@Req() req, @UploadedFiles() files: Express.Multer.File[]) {
    const uploadResults = await Promise.all(
      files.map((file) => {
        const base64 = file.buffer.toString('base64');
        const mimetype = file.mimetype.split('/')[1];
        const filename = `${uuidv4()}.${mimetype}`;

        return this.imgService.uploadImage(
          `data:${file.mimetype};base64,${base64}`,
          filename,
        );
      }),
    );

    return this.filesService.create(uploadResults, req.body.feed_id);
  }

  @UseGuards(new UserGuard())
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  @Post('/nota')
  async uploadFileNota(
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadResults = await Promise.all(
      files.map((file) => {
        const base64 = file.buffer.toString('base64');
        const mimetype = file.mimetype.split('/')[1];
        const filename = `nota*${uuidv4()}.${mimetype}`;

        return this.imgService.uploadImage(
          `data:${file.mimetype};base64,${base64}`,
          filename,
          true,
        );
      }),
    );
    return this.filesService.createNota(uploadResults, req.body.feed_id);
  }

  @Get('/nota/:feed_uuid')
  async fetchNotaByFeedId(@Param('feed_uuid') feed_uuid: string) {
    return this.filesService.findNotaByFeedId(feed_uuid);
  }
}
