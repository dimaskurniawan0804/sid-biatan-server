import { IsNotEmpty, IsString } from 'class-validator';
export class CreateFeedDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  location: string;
  organaizer: string;
  status: boolean;
}
