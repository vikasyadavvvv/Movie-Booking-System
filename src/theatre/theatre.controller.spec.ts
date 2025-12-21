import { Test, TestingModule } from '@nestjs/testing';
import { TheatreController } from './theatre.controller';
import { TheatreService } from './theatre.service';

describe('TheatreController', () => {
  let controller: TheatreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheatreController],
      providers: [TheatreService],
    }).compile();

    controller = module.get<TheatreController>(TheatreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
