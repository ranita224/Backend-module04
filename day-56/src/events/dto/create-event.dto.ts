import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsDateString()
  eventDate!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
