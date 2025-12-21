import { Test, TestingModule } from '@nestjs/testing';
import { ShowseatService } from './showseat.service';

describe('ShowseatService', () => {
  let service: ShowseatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowseatService],
    }).compile();

    service = module.get<ShowseatService>(ShowseatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
