import { Injectable } from '@nestjs/common';
import { CreatePropertyAgentDto } from './dto/create-property_agent.dto';
import { UpdatePropertyAgentDto } from './dto/update-property_agent.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertyAgentsService {
  constructor(private prisma: PrismaService) {}

  async upsert(updatePropertyAgentDto: UpdatePropertyAgentDto) {
    const { id, ...data } = updatePropertyAgentDto;

    if (id) {
      return this.prisma.propertyAgent.update({
        where: { id },
        data,
      });
    }

    return this.prisma.propertyAgent.create({
      data: data as CreatePropertyAgentDto,
    });
  }

  async findAll() {
    return this.prisma.propertyAgent.findMany({
      include: {
        properties: true,
        notes: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.propertyAgent.findUnique({
      where: { id },
      include: {
        properties: {
          include: {
            family: {
              include: {
                tenants: true,
              },
            },
          },
        },
        notes: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.propertyAgent.delete({
      where: { id },
    });
  }
}
