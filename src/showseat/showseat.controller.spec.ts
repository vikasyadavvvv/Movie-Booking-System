import { Test, TestingModule } from '@nestjs/testing';
import { ShowseatController } from './showseat.controller';
import { ShowseatService } from './showseat.service';

describe('ShowseatController', () => {
  let controller: ShowseatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowseatController],
      providers: [ShowseatService],
    }).compile();

    controller = module.get<ShowseatController>(ShowseatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
