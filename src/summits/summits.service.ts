import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import envConfig from 'src/config/environment/env.config';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateSummitDto, UpdateSummitDto } from './dtos/summits.dto';
import { ApiResponse } from 'src/common/types/response.type';

@Injectable()
export class SummitsService {
  constructor(
    @Inject(envConfig.KEY)
    private readonly config: ConfigType<typeof envConfig>,
    private readonly prismaService: PrismaService,
  ) {}

  async createSummit(summit: CreateSummitDto): Promise<ApiResponse> {
    const summitCreated = await this.prismaService.summit.create({
      data: summit,
    });

    return {
      statusCode: 201,
      message: 'Summit created',
      data: summitCreated,
    };
  }

  async getSummits(): Promise<ApiResponse> {
    const summits = await this.prismaService.summit.findMany();

    return {
      statusCode: 200,
      message: 'Summits fetched',
      data: summits,
    };
  }

  async getSummitById(id: string): Promise<ApiResponse> {
    const summit = await this.prismaService.summit.findUnique({
      where: {
        id,
      },
      include: {
        coordinators: true,
        coorganizers: true,
      },
    });

    if (!summit) throw new NotFoundException('Summit not found');

    return {
      statusCode: 200,
      message: 'Summit fetched',
      data: summit,
    };
  }

  async deleteSummit(id: string): Promise<ApiResponse> {
    const summitExists = await this.prismaService.summit.findUnique({
      where: {
        id,
      },
    });

    if (!summitExists) throw new NotFoundException('Summit not found');

    await this.prismaService.summit.delete({
      where: {
        id,
      },
    });

    return {
      statusCode: 200,
      message: 'Summit deleted',
      data: null,
    };
  }

  async updateSummit(
    id: string,
    summit: UpdateSummitDto,
  ): Promise<ApiResponse> {
    const summitExists = await this.prismaService.summit.findUnique({
      where: {
        id,
      },
    });

    if (!summitExists) throw new NotFoundException('Summit not found');

    const summitUpdated = await this.prismaService.summit.update({
      where: {
        id,
      },
      data: summit,
    });

    return {
      statusCode: 200,
      message: 'Summit updated',
      data: summitUpdated,
    };
  }

  async markAsActive(id: string): Promise<ApiResponse> {
    const summitExists = await this.prismaService.summit.findUnique({
      where: {
        id,
      },
    });

    if (!summitExists) throw new NotFoundException('Summit not found');

    const currentActiveSummit = await this.prismaService.summit.findFirst({
      where: {
        active: true,
      },
    });

    if (currentActiveSummit) {
      // If there is an active summit, deactivate it
      await this.prismaService.summit.update({
        where: {
          id: currentActiveSummit.id,
        },
        data: {
          active: false,
        },
      });
    }

    const summitUpdated = await this.prismaService.summit.update({
      where: {
        id,
      },
      data: {
        active: true,
      },
    });

    return {
      statusCode: 200,
      message: 'Summit marked as active',
      data: summitUpdated,
    };
  }
}
