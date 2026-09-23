import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropertyAgentsService } from './property_agents.service';
import { CreatePropertyAgentDto } from './dto/create-property_agent.dto';
import { UpdatePropertyAgentDto } from './dto/update-property_agent.dto';

@Controller('property-agents')
export class PropertyAgentsController {
  constructor(private readonly propertyAgentsService: PropertyAgentsService) {}

  @Post()
  create(@Body() createPropertyAgentDto: CreatePropertyAgentDto) {
    return this.propertyAgentsService.create(createPropertyAgentDto);
  }

  @Get()
  findAll() {
    return this.propertyAgentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyAgentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyAgentDto: UpdatePropertyAgentDto) {
    return this.propertyAgentsService.update(+id, updatePropertyAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyAgentsService.remove(+id);
  }
}
