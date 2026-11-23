import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export const SORT_FIELDS = ['eventDate', 'title'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];


export class FindEventsQueryDto {
  // ---- filters ----
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  search?: string; 

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: SortField;

  @IsOptional()
  @IsIn(SORT_ORDERS)
  order?: SortOrder = 'asc';

  // ---- pagination ----
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 5;
}
