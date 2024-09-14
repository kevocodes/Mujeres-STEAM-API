import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/types/response.type';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';
import { PrismaService } from 'src/config/prisma/prisma.service';
import {
  CreateCoordinatorDTO,
  UpdateCoordinatorDTO,
} from 'src/summits/dtos/coordinator.dto';
import { CoordinatorImageInfo } from './types/coordinatorImage';

@Injectable()
export class CoordinatorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getCoordinators(): Promise<ApiResponse> {
    const coordinators = await this.prismaService.coordinator.findMany();

    return {
      data: coordinators,
      message: 'Coordinators fetched successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getCoordinator(id: string): Promise<ApiResponse> {
    const coordinator = await this.prismaService.coordinator.findUnique({
      where: { id },
    });

    if (!coordinator) throw new NotFoundException('Coordinator not found');

    return {
      data: coordinator,
      message: 'Coordinator fetched successfully',
      statusCode: HttpStatus.OK,
    };
  }
  async addCoordinator(
    coordinator: CreateCoordinatorDTO,
    picture: Express.Multer.File,
  ): Promise<ApiResponse> {
    const uploadedPicture = await this.cloudinaryService.uploadFile(
      picture,
      'coordinators',
    );

    const createdCoordinator = await this.prismaService.coordinator.create({
      data: {
        ...coordinator,
        picture: uploadedPicture.url,
        picturePublicId: uploadedPicture.public_id,
      },
    });

    return {
      data: createdCoordinator,
      message: 'Coordinator created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async updateCoordinator(
    data: UpdateCoordinatorDTO,
    id: string,
    picture: Express.Multer.File,
  ): Promise<ApiResponse> {
    const coordinator = await this.prismaService.coordinator.findUnique({
      where: { id },
    });

    if (!coordinator) throw new NotFoundException('Coordinator not found');

    const imageInfo: CoordinatorImageInfo = {};

    // If a new thumbnail is provided, we upload the new image and delete the previous one
    if (picture) {
      const [upload] = await Promise.all([
        this.cloudinaryService.uploadFile(picture, 'coordinators'),
        this.cloudinaryService.deleteFiles([coordinator.picturePublicId]),
      ]);

      // Add the new image info to the imageInfo
      imageInfo.picture = upload.secure_url;
      imageInfo.picturePublicId = upload.public_id;
    }

    const updatedCoordinator = await this.prismaService.coordinator.update({
      where: { id },
      data: {
        ...data,
        ...imageInfo,
      },
    });

    return {
      data: updatedCoordinator,
      message: 'Coordinator updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async deleteCoordinator(id: string): Promise<ApiResponse> {
    const coordinator = await this.prismaService.coordinator.findUnique({
      where: { id },
    });

    if (!coordinator) throw new NotFoundException('Coordinator not found');

    await this.cloudinaryService.deleteFiles([coordinator.picturePublicId]);

    await this.prismaService.coordinator.delete({
      where: { id },
    });

    return {
      data: null,
      message: 'Coordinator deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
