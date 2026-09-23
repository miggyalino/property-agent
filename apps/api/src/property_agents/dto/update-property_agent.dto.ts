import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyAgentDto } from './create-property_agent.dto';

export class UpdatePropertyAgentDto extends PartialType(CreatePropertyAgentDto) {}
