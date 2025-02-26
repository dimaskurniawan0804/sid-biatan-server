import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  UseGuards,
  Query,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UserGuard } from 'src/middleware/users.guard';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @UseGuards(new UserGuard())
  @Post()
  create(@Body() createFeedDto: CreateFeedDto) {
    return this.feedsService.create(createFeedDto);
  }

  @Get()
  findAll(@Query('size') size: string, @Query('page') page: string) {
    return this.feedsService.findAllFeeds(+size, +page);
  }

  @UseGuards(new UserGuard())
  @Get('/user')
  findByUserId() {
    return this.feedsService.findAllFeedsByUserId();
  }

  @UseGuards(new UserGuard())
  @Get(':uuid')
  findByFeedUUID(@Param('uuid') uuid: string) {
    return this.feedsService.findOneFeedByUUID(uuid);
  }

  @UseGuards(new UserGuard())
  @Patch(':uuid')
  updateFeedStatus(@Param('uuid') uuid: string) {
    return this.feedsService.updateFeedStatusByUUID(uuid);
  }

  @UseGuards(new UserGuard())
  @Put(':uuid')
  updateFeed(
    @Param('uuid') uuid: string,
    @Body() createFeedDto: CreateFeedDto,
  ) {
    return this.feedsService.updateFeedDataByUUID(uuid, createFeedDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.feedsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
  //   return this.feedsService.update(+id, updateFeedDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.feedsService.remove(+id);
  // }
}
