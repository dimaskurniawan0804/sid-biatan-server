import { Test, TestingModule } from '@nestjs/testing';
import { SanitizerService } from './sanitizer.service';

describe('SanitizerService', () => {
  let service: SanitizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SanitizerService],
    }).compile();

    service = module.get<SanitizerService>(SanitizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
