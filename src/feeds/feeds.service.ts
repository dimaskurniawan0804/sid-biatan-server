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
      const createFeed = await this.prisma.feeds.create({
        data,
      });
      if (!createFeed) {
        throw new Error('PROCESS_FAILED-Failed to create feed');
      }
      return {
        status: 201,
        data: {
          feed_id: createFeed.id,
        },
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  // use for main page
  async findAllFeeds(size: number, page: number) {
    try {
      const feeds = await this.prisma.feeds.findMany({
        take: size,
        skip: (page - 1) * size,
        where: {
          status: true,
          user: {
            status: true,
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        select: {
          uuid: true,
          name: true,
          description: true,
          likes: true,
          location: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
          files: {
            where: {
              nota: false,
            },
            select: {
              file_name: true,
              file_url: true,
              file_id: true,
            },
          },
        },
      });
      return {
        status: 200,
        data: feeds,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  // find all feeds by user_id
  // use for specific user feeds
  async findAllFeedsByUserId() {
    try {
      const { id } = await this.findUser();

      const feeds = await this.prisma.feeds.findMany({
        // take: size,
        // skip: (page - 1) * size,
        where: {
          user_id: id,
        },
        orderBy: {
          created_at: 'desc',
        },
        select: {
          name: true,
          description: true,
          likes: true,
          location: true,
          uuid: true,
          files: {
            where: {
              nota: false,
            },
            select: {
              file_name: true,
              file_url: true,
              file_id: true,
            },
          },
        },
      });
      if (!feeds.length) {
        throw new Error('NOT_FOUND-User has no feeds');
      }
      return {
        status: 200,
        data: feeds,
        message: `Success get feeds`,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  async findOneFeedByUUID(feed_uuid: string) {
    try {
      const feed = await this.prisma.feeds.findUnique({
        where: {
          uuid: feed_uuid,
        },
        select: {
          uuid: true,
          name: true,
          description: true,
          likes: true,
          location: true,
          status: true,
          files: {
            where: {
              nota: false,
            },
            select: {
              file_name: true,
              file_url: true,
              file_id: true,
            },
          },
        },
      });
      if (!feed) {
        throw new Error('NOT_FOUND-Feed not found');
      }
      return {
        status: 200,
        data: feed,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  private async findFeedOwner(feed_uuid: string) {
    const feedOwner = await this.prisma.feeds.findFirst({
      where: {
        uuid: feed_uuid,
      },
      select: { user: { select: { uuid: true } } },
    });
    const isFeedOwner = feedOwner.user.uuid === this.req.user.uuid;

    if (!feedOwner) {
      throw new Error('NOT_FOUND-Feed not found');
    }

    if (!isFeedOwner) {
      throw new Error(
        'UNAUTHORIZED-You are not authorized to update this feed',
      );
    }
    return true;
  }

  async updateFeedStatusByUUID(feed_uuid: string) {
    try {
      const feed = await this.prisma.feeds.update({
        where: {
          uuid: feed_uuid,
        },
        data: {
          status: false,
        },
      });
      if (!feed) {
        throw new Error('NOT_FOUND-Feed not found');
      }
      return {
        status: 200,
        message: 'Feed deleted successfully',
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  async updateFeedDataByUUID(feed_uuid: string, data: any) {
    try {
      await this.findFeedOwner(feed_uuid);

      const updateFeed = await this.prisma.feeds.update({
        where: {
          uuid: feed_uuid,
        },
        data,
      });
      if (!updateFeed) {
        throw new Error('NOT_FOUND-Feed not found');
      }
      return {
        status: 200,
        message: 'Feed updated successfully',
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  async findAllFeedsByYearadnUserId(year: string, uuid: string) {
    try {
      const { id } = await this.prisma.users.findUnique({
        where: {
          uuid,
        },
      });
      const feeds = await this.prisma.feeds.findMany({
        where: {
          user_id: id,
          created_at: {
            gte: new Date(`${year}-01-01T00:00:00.000Z`), // ISO format with UTC
            lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`), // ISO format with UTC
          },
        },
        select: {
          name: true,
          description: true,
          location: true,
          files: {
            select: {
              file_name: true,
              file_url: true,
              file_id: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
          created_at: true,
        },
      });

      const splitFiles = (data) => {
        return data.map((item) => {
          const fileGroups = {
            files: [],
            notas: [],
          };

          item.files.forEach((file) => {
            if (file.file_name.startsWith('nota')) {
              fileGroups.notas.push(file);
            } else {
              fileGroups.files.push(file);
            }
          });

          return {
            ...item,
            files: fileGroups.files,
            notas: fileGroups.notas,
          };
        });
      };
      const result = splitFiles(feeds);

      return {
        status: 200,
        data: result,
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
