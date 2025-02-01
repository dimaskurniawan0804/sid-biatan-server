import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
// import { UpdateFeedDto } from './dto/update-feed.dto';

import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ErrorService } from 'src/error/error.service';

@Injectable()
export class FeedsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private errorService: ErrorService,
    @Inject(REQUEST) private req: any,
  ) {}

  create(createFeedDto: CreateFeedDto) {
    // const user_id = this.req.user.id;
    return createFeedDto;
    return 'This action adds a new feed';
  }

  // findAll() {
  //   return `This action returns all feeds`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} feed`;
  // }

  // update(id: number, updateFeedDto: UpdateFeedDto) {
  //   return `This action updates a #${id} feed`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} feed`;
  // }
}
