import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePropertyAgentDto } from './dto/create-property-agent.dto';
import { UpdatePropertyAgentDto } from './dto/update-property-agent.dto';
import {
  PropertyAgentDetailResponse,
  PropertyAgentResponse,
} from './property-agents.mapper';
import { PropertyAgentsService } from './property-agents.service';

@Controller('property-agents')
export class PropertyAgentsController {
  constructor(private readonly propertyAgentsService: PropertyAgentsService) {}

  @Post()
  create(@Body() dto: CreatePropertyAgentDto): Promise<PropertyAgentResponse> {
    return this.propertyAgentsService.create(dto);
  }

  @Get()
  findAll(): Promise<PropertyAgentResponse[]> {
    return this.propertyAgentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PropertyAgentDetailResponse> {
    return this.propertyAgentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyAgentDto,
  ): Promise<PropertyAgentResponse> {
    return this.propertyAgentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.propertyAgentsService.remove(id);
  }
}
