import { Test, TestingModule } from '@nestjs/testing';
import { TheatreService } from './theatre.service';

describe('TheatreService', () => {
  let service: TheatreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TheatreService],
    }).compile();

    service = module.get<TheatreService>(TheatreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
