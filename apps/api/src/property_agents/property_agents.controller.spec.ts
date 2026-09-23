import { Test, TestingModule } from '@nestjs/testing';
import { PropertyAgentsController } from './property_agents.controller';
import { PropertyAgentsService } from './property_agents.service';

describe('PropertyAgentsController', () => {
  let controller: PropertyAgentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyAgentsController],
      providers: [PropertyAgentsService],
    }).compile();

    controller = module.get<PropertyAgentsController>(PropertyAgentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
