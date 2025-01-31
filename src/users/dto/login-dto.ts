import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  password: string;
}
