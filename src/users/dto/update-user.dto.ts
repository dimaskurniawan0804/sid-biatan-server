import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
  @IsNotEmpty()
  status: boolean;
  @IsNotEmpty()
  @IsString()
  uuid: string;
}
