import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyAgentDto } from './create-property-agent.dto';

export class UpdatePropertyAgentDto extends PartialType(CreatePropertyAgentDto) {}
