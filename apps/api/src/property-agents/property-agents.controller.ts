import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, apiResponse } from '../common/responses/api-response';
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
  async create(
    @Body() dto: CreatePropertyAgentDto,
  ): Promise<ApiResponse<PropertyAgentResponse>> {
    const agent = await this.propertyAgentsService.create(dto);
    return apiResponse('Property agent created successfully.', agent);
  }

  @Get()
  async findAll(): Promise<ApiResponse<PropertyAgentResponse[]>> {
    const agents = await this.propertyAgentsService.findAll();
    return apiResponse('Property agents retrieved successfully.', agents);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<PropertyAgentDetailResponse>> {
    const agent = await this.propertyAgentsService.findOne(id);
    return apiResponse('Property agent retrieved successfully.', agent);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyAgentDto,
  ): Promise<ApiResponse<PropertyAgentResponse>> {
    const agent = await this.propertyAgentsService.update(id, dto);
    return apiResponse('Property agent updated successfully.', agent);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<ApiResponse<PropertyAgentResponse>> {
    const agent = await this.propertyAgentsService.remove(id);
    return apiResponse('Property agent deleted successfully.', agent);
  }
}
