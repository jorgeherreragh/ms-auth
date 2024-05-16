import { Test, TestingModule } from '@nestjs/testing';
import { UserCredentialsService } from './user-credentials.service';

describe('UserCredentialsService', () => {
  let service: UserCredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCredentialsService],
    }).compile();

    service = module.get<UserCredentialsService>(UserCredentialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
