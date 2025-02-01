import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { JwtService } from '@nestjs/jwt';
import { ErrorService } from 'src/error/error.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FeedsController],
  providers: [FeedsService, JwtService, ErrorService, PrismaService],
})
export class FeedsModule {}
