import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PropertyAgentsService } from './property_agents.service';
import { UpdatePropertyAgentDto } from './dto/update-property_agent.dto';

@Controller('property-agents')
export class PropertyAgentsController {
  constructor(private readonly propertyAgentsService: PropertyAgentsService) {}

  @Post('upsert')
  upsert(@Body() updatePropertyAgentDto: UpdatePropertyAgentDto) {
    return this.propertyAgentsService.upsert(updatePropertyAgentDto);
  }

  @Get()
  findAll() {
    return this.propertyAgentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyAgentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyAgentsService.remove(id);
  }
}
