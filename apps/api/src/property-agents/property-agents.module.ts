import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PropertyAgentsController } from './property-agents.controller';
import { PropertyAgentsService } from './property-agents.service';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyAgentsController],
  providers: [PropertyAgentsService],
  exports: [PropertyAgentsService],
})
export class PropertyAgentsModule {}
