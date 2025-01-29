import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LocalOnlyMiddleware } from './middleware/consumer.middleware';
@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LocalOnlyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
