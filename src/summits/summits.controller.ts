import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from 'src/common/guards/emailVerified.guard';
import { RolesGuardGuard } from 'src/common/guards/roles-guard.guard';
import { CreateSummitDto, UpdateSummitDto } from './dtos/summits.dto';
import { SummitsService } from './summits.service';
import { ApiResponse } from 'src/common/types/response.type';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';

@ApiTags('summits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuardGuard, EmailVerifiedGuard)
@Controller('summits')
export class SummitsController {
  constructor(private readonly summitsService: SummitsService) {}

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Post()
  async createSummit(@Body() summit: CreateSummitDto): Promise<ApiResponse> {
    return this.summitsService.createSummit(summit);
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Get()
  async getSummits(): Promise<ApiResponse> {
    return this.summitsService.getSummits();
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Get(':id')
  async getSummitById(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<ApiResponse> {
    return this.summitsService.getSummitById(id);
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Delete(':id')
  async deleteSummit(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<ApiResponse> {
    return this.summitsService.deleteSummit(id);
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Put(':id')
  async updateSummit(
    @Param('id', MongoIdPipe) id: string,
    @Body() summit: UpdateSummitDto,
  ): Promise<ApiResponse> {
    return this.summitsService.updateSummit(id, summit);
  }

  @Roles(Role.ADMIN, Role.CONTENT_MANAGER)
  @Put(':id/activate')
  async activateSummit(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<ApiResponse> {
    return this.summitsService.markAsActive(id);
  }
}
