import { Module } from '@nestjs/common';
import { SummitsController } from './summits.controller';
import { SummitsService } from './summits.service';

@Module({
  controllers: [SummitsController],
  providers: [SummitsService]
})
export class SummitsModule {}
