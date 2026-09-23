import { Injectable } from '@nestjs/common';
import { CreatePropertyAgentDto } from './dto/create-property_agent.dto';
import { UpdatePropertyAgentDto } from './dto/update-property_agent.dto';

@Injectable()
export class PropertyAgentsService {
  create(createPropertyAgentDto: CreatePropertyAgentDto) {
    return 'This action adds a new propertyAgent';
  }

  findAll() {
    return `This action returns all propertyAgents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} propertyAgent`;
  }

  update(id: number, updatePropertyAgentDto: UpdatePropertyAgentDto) {
    return `This action updates a #${id} propertyAgent`;
  }

  remove(id: number) {
    return `This action removes a #${id} propertyAgent`;
  }
}
