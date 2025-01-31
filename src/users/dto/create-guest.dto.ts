import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateGUestDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
