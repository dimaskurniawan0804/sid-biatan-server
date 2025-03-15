import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  // Param,
  // Delete,
  UseGuards,
  // Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateGUestDto } from './dto/create-guest.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from '../middleware/users.guard';
import { LoginDTO } from './dto/login-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(new UserGuard([1]))
  @Post('/apparatus')
  createUser(@Body() createUserDto: CreateUserDto) {
    const dto = {
      ...createUserDto,
      role_id: 2,
    };
    return this.usersService.createUser(dto);
  }

  @Post('/guest')
  async createGuest(@Body() createGuestDto: CreateGUestDto) {
    const dto = {
      ...createGuestDto,
      role_id: 3,
    };
    return await this.usersService.createUser(dto);
  }

  @Post('/auth')
  login(@Body() dto: LoginDTO) {
    return this.usersService.login(dto);
  }

  @UseGuards(new UserGuard([1]))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(new UserGuard([1]))
  @Put()
  putUser(@Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(dto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
