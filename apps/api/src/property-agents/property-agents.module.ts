import { Module } from '@nestjs/common';
import { PropertyAgentsService } from './property_agents.service';
import { PropertyAgentsController } from './property_agents.controller';

@Module({
  controllers: [PropertyAgentsController],
  providers: [PropertyAgentsService],
})
export class PropertyAgentsModule {}
