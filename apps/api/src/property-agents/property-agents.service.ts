import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyAgentDto } from './dto/create-property-agent.dto';
import { UpdatePropertyAgentDto } from './dto/update-property-agent.dto';
import {
  PropertyAgentDetailResponse,
  PropertyAgentResponse,
  propertyAgentDetailSelect,
  propertyAgentSummarySelect,
  toPropertyAgentDetailResponse,
  toPropertyAgentResponse,
} from './property-agents.mapper';

const isRecordNotFound = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

@Injectable()
export class PropertyAgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePropertyAgentDto): Promise<PropertyAgentResponse> {
    const agent = await this.prisma.propertyAgent.create({
      data: dto,
      select: propertyAgentSummarySelect,
    });

    return toPropertyAgentResponse(agent);
  }

  async findAll(): Promise<PropertyAgentResponse[]> {
    const rows = await this.prisma.propertyAgent.findMany({
      select: propertyAgentSummarySelect,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    return rows.map(toPropertyAgentResponse);
  }

  async findOne(id: string): Promise<PropertyAgentDetailResponse> {
    const agent = await this.prisma.propertyAgent.findUnique({
      where: { id },
      select: propertyAgentDetailSelect,
    });

    if (!agent) {
      throw new NotFoundException(`Property agent with id "${id}" was not found.`);
    }

    return toPropertyAgentDetailResponse(agent);
  }

  async update(
    id: string,
    dto: UpdatePropertyAgentDto,
  ): Promise<PropertyAgentResponse> {
    try {
      const agent = await this.prisma.propertyAgent.update({
        where: { id },
        data: dto,
        select: propertyAgentSummarySelect,
      });

      return toPropertyAgentResponse(agent);
    } catch (error) {
      if (isRecordNotFound(error)) {
        throw new NotFoundException(`Property agent with id "${id}" was not found.`);
      }

      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.propertyAgent.delete({ where: { id } });
    } catch (error) {
      if (isRecordNotFound(error)) {
        throw new NotFoundException(`Property agent with id "${id}" was not found.`);
      }

      throw error;
    }
  }
}
