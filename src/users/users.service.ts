import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDTO } from './dto/login-dto';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ErrorService } from 'src/error/error.service';
import { compare, hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { jwtConfig } from 'src/config/jwt.config';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private errorService: ErrorService,
    @Inject(REQUEST) private req: any,
  ) {}

  async checkUserExist({ username, uuid }: any) {
    const filter: any = {};
    if (username) {
      filter.username = username;
    }
    if (uuid) {
      filter.uuid = uuid;
    }
    const user = await this.prisma.users.findFirst({
      where: filter,
      select: {
        id: true,
        uuid: true,
        username: true,
        password: true,
        role_id: true,
        status: true,
      },
    });
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await hash(
        createUserDto.password.toLowerCase(),
        12,
      );
      const createUser = await this.prisma.users.create({
        data: {
          uuid: uuidv4(),
          username: createUserDto.username,
          password: createUserDto.password,
          role_id: +createUserDto!.role_id,
          status: true,
        },
      });
      if (!createUser) {
        throw new Error('PROCESS_FAILED-Failed to create user');
      }
      return {
        status: 200,
        data: createUser,
        message: `Registraion with username : ${createUserDto.username} success`,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  generateJwtToken(payload) {
    return this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.expired,
    });
  }

  async login(loginDto: LoginDTO) {
    try {
      const findUser = await this.checkUserExist({
        username: loginDto.username,
      });
      if (!findUser) {
        throw new Error('NOT_FOUND-User not found');
      }

      const comparePassword = await compare(
        loginDto.password.toLocaleLowerCase(),
        findUser.password,
      );
      const accessToken = this.generateJwtToken(findUser);

      if (comparePassword) {
        return {
          statusCode: 200,
          accessToken,
          message: 'Login Success',
          data: {
            username: findUser.username,
            uuid: findUser.uuid,
            role_id: findUser.role_id,
          },
        };
      } else {
        throw new Error('LOGIN_FAILED-Invalid username or password');
      }
    } catch (error) {
      // console.log(error);
      return this.errorService.mappingError(error);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.users.findMany({
        where: {
          role_id: {
            not: 3,
          },
        },
        select: {
          uuid: true,
          username: true,
          status: true,
        },
      });
      return {
        status: 200,
        data: users,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  async updateUser(dto: UpdateUserDto) {
    try {
      dto.password = await hash(dto.password.toLowerCase(), 12);
      const updateUser = await this.prisma.users.update({
        where: {
          uuid: dto.uuid,
        },
        data: {
          username: dto.username,
          password: dto.password,
          status: dto.status,
        },
      });
      if (!updateUser) {
        throw new Error('PROCESS_FAILED-Failed to update user');
      }
      return {
        status: 200,
        data: updateUser,
        message: `Update user with username : ${updateUser.username} success`,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }

  async updateAvatar(avatar: any) {
    try {
      const updateUser = await this.prisma.users.update({
        where: {
          uuid: this.req.user.uuid,
        },
        data: {
          avatar: avatar.filename,
        },
      });
      if (!updateUser) {
        throw new Error('PROCESS_FAILED-Failed to update user');
      }
      return {
        status: 200,
        message: `Update user with username : ${updateUser.username} success`,
      };
    } catch (error) {
      return this.errorService.mappingError(error);
    }
  }
}
