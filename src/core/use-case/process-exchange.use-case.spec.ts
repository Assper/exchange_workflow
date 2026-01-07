import { Test, TestingModule } from '@nestjs/testing';
import { ProcessExchangeUseCase } from './process-exchange.use-case';
import { EXCHANGE_REPO } from '../provider-tokens';
import { Exchange, ExchangeRepo } from '../domain';

class ExchangeRepoMock implements ExchangeRepo {
  create = jest.fn();
  readById = jest.fn();
}

describe('ProcessExchangeUseCase', () => {
  let useCase: ProcessExchangeUseCase;
  let exchangeRepoMock: ExchangeRepoMock;

  // Use values within range 80,000 - 100,000 for success
  const validRate = 85000;
  const mockExchange = new Exchange(
    '123e4567-e89b-12d3-a456-426614174000',
    validRate,
    'BTC',
    'USDT',
    Date.now(),
  );

  beforeEach(async () => {
    exchangeRepoMock = new ExchangeRepoMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessExchangeUseCase,
        {
          provide: EXCHANGE_REPO,
          useValue: exchangeRepoMock,
        },
      ],
    }).compile();

    useCase = module.get<ProcessExchangeUseCase>(ProcessExchangeUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should process exchange successfully when within limit', async () => {
    await useCase.exec(mockExchange);

    // Verify repository was called
    expect(exchangeRepoMock.create).toHaveBeenCalledWith(mockExchange);
  });

  it('should throw error if limit exceeded (up)', async () => {
    // 150,000 > 100,000 (default max)
    const highRateExchange = new Exchange(
      '123e4567-e89b-12d3-a456-426614174001',
      150000,
      'BTC',
      'USDT',
      Date.now(),
    );

    await expect(useCase.exec(highRateExchange)).rejects.toThrow(
      'Exchange limit exceeded',
    );

    // Verify repo is still called even if it fails later
    expect(exchangeRepoMock.create).toHaveBeenCalledWith(highRateExchange);
  });

  it('should throw error if limit exceeded (down)', async () => {
    // 50,000 < 80,000 (default min)
    const lowRateExchange = new Exchange(
      '123e4567-e89b-12d3-a456-426614174002',
      50000,
      'BTC',
      'USDT',
      Date.now(),
    );

    await expect(useCase.exec(lowRateExchange)).rejects.toThrow(
      'Exchange limit exceeded',
    );

    // Verify repo is still called
    expect(exchangeRepoMock.create).toHaveBeenCalledWith(lowRateExchange);
  });
});
