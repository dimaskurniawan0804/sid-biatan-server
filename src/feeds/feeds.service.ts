import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
// import { UpdateFeedDto } from './dto/update-feed.dto';

import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ErrorService } from 'src/error/error.service';
import { SanitizerService } from 'src/sanitizer/sanitizer.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class FeedsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private errorService: ErrorService,
    private sanitizerService: SanitizerService,
    @Inject(REQUEST) private req: any,
  ) {}

  async findUser() {
    const user = await this.prisma.users.findUnique({
      where: {
        uuid: this.req.user.uuid,
      },
    });

    return user;
  }

  async create(createFeedDto: CreateFeedDto) {
    const { id: user_id } = await this.findUser();
    createFeedDto.description = this.sanitizerService.sanitize(
      createFeedDto.description,
    );

    const data = {
      ...createFeedDto,
      user_id,
      uuid: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
      status: true,
    };
    try {
      // console.log(data);
      const createFeed = await this.prisma.feeds.create({
        data,
      });
      if (!createFeed) {
        throw new Error('PROCESS_FAILED-Failed to create feed');
      }
      return createFeed;
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  async findAllFeeds(size: number, page: number) {
    try {
      const feeds = await this.prisma.feeds.findMany({
        take: size,
        skip: (page - 1) * size,
        where: {
          status: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
          uuid: true,
          user: {
            select: {
              id: true,
              uuid: true,
              username: true,
            },
          },
          created_at: true,
          updated_at: true,
        },
      });
      return {
        status: 200,
        data: feeds,
        message: `Success get feeds`,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  // find all feeds by user_id
  async findAllFeedsByUserId() {
    try {
      const feeds = await this.prisma.feeds.findMany({
        where: {
          user_id: this.req.user.id,
          status: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        select: {
          id: true,
          uuid: true,
          user: {
            select: {
              id: true,
              uuid: true,
              username: true,
            },
          },
          created_at: true,
          updated_at: true,
        },
      });
      return {
        status: 200,
        data: feeds,
        message: `Success get feeds`,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
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
