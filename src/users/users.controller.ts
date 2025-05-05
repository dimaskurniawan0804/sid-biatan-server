import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  UploadedFile,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateGUestDto } from './dto/create-guest.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from '../middleware/users.guard';
import { LoginDTO } from './dto/login-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: process.env.STATIC_FILES_PATH, // Your upload folder
        filename: (req, file, cb) => {
          try {
            const now = new Date();
            const jakartaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
              .toISOString()
              .replace('Z', '+07:00');

            const sanitizedOriginalName = file.originalname.replace(
              /[^a-zA-Z0-9.]/g,
              '_',
            ); // Remove special chars

            const filename = `avatar*${jakartaTime}*${sanitizedOriginalName}`;
            cb(null, filename);
          } catch (error) {
            cb(error, '');
          }
        },
      }),
    }),
  )
  @UseGuards(new UserGuard())
  @Patch('/avatar')
  async uploadFile(@UploadedFile() files: Express.Multer.File[]) {
    return this.usersService.updateAvatar(files);
  }
}
