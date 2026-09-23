import { Test, TestingModule } from '@nestjs/testing';
import { PropertyAgentsService } from './property_agents.service';

describe('PropertyAgentsService', () => {
  let service: PropertyAgentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyAgentsService],
    }).compile();

    service = module.get<PropertyAgentsService>(PropertyAgentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
