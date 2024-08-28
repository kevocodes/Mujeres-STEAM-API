import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateSummitDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  title: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  description: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  location: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  modality: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: 'The time must be in HH:mm format (24-hour)',
  })
  startHour: string;

  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: 'The time must be in HH:mm format (24-hour)',
  })
  endHour: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  link?: string;
}

export class UpdateSummitDto extends PartialType(CreateSummitDto) {}
