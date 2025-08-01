import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LocalOnlyMiddleware } from './middleware/consumer.middleware';
import { FeedsModule } from './feeds/feeds.module';
import { FilesModule } from './files/files.module';
import { SanitizerService } from './sanitizer/sanitizer.service';
import { ImagekitService } from './imagekit/imagekit.service';

@Module({
  imports: [PrismaModule, UsersModule, FeedsModule, FilesModule],
  controllers: [AppController],
  providers: [AppService, SanitizerService, ImagekitService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LocalOnlyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
