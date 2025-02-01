import { IsNotEmpty, IsString } from 'class-validator';
export class CreateFeedDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  budget: string;
  @IsNotEmpty()
  @IsString()
  budget_source: string;
  description: string;
  location: string;
  organaizer: string;
}
