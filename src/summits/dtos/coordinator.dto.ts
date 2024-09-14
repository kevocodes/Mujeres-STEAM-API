import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoordinatorDTO {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  degree: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class UpdateCoordinatorDTO extends PartialType(CreateCoordinatorDTO) {}
