import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { EmailVerifiedGuard } from 'src/common/guards/emailVerified.guard';
import { RolesGuardGuard } from 'src/common/guards/roles-guard.guard';
import { ApiResponse } from 'src/common/types/response.type';
import { getParseImagePipe } from 'src/common/utils/get-parse-file-pipe';
import {
  CreateCoordinatorDTO,
  UpdateCoordinatorDTO,
} from 'src/summits/dtos/coordinator.dto';
import { CoordinatorsService } from './coordinators.service';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';

@ApiTags('coordinators')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuardGuard, EmailVerifiedGuard)
@Controller('coordinators')
export class CoordinatorsController {
  constructor(private readonly coordinatorsService: CoordinatorsService) {}

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Get()
  async getCoordinators(): Promise<ApiResponse> {
    return await this.coordinatorsService.getCoordinators();
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Get(':id')
  async getCoordinator(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<ApiResponse> {
    return await this.coordinatorsService.getCoordinator(id);
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @UseInterceptors(FileInterceptor('picture'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['picture', 'fullName', 'degree', 'email'],
      properties: {
        picture: {
          type: 'string',
          format: 'binary',
        },
        fullName: { type: 'string' },
        degree: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @Post()
  async addCoordinator(
    @Body() coordinator: CreateCoordinatorDTO,
    @UploadedFile(getParseImagePipe({ required: false }))
    picture: Express.Multer.File,
  ): Promise<ApiResponse> {
    return await this.coordinatorsService.addCoordinator(coordinator, picture);
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @UseInterceptors(FileInterceptor('picture'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        picture: {
          type: 'string',
          format: 'binary',
        },
        fullName: { type: 'string' },
        degree: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @Put(':id')
  async UpdateCoordinator(
    @Body() coordinator: UpdateCoordinatorDTO,
    @UploadedFile(getParseImagePipe({ required: false }))
    picture: Express.Multer.File,
    @Param('id', MongoIdPipe) id: string,
  ) {
    return await this.coordinatorsService.updateCoordinator(
      coordinator,
      id,
      picture,
    );
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Delete(':id')
  async deleteCoordinator(@Param('id', MongoIdPipe) id: string) {
    return await this.coordinatorsService.deleteCoordinator(id);
  }
}
