import { Test, TestingModule } from '@nestjs/testing';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';

describe('ShowController', () => {
  let controller: ShowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowController],
      providers: [ShowService],
    }).compile();

    controller = module.get<ShowController>(ShowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
