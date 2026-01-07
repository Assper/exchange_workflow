import { Exchange } from '../entities/exchange.entity';

export interface ExchangeRepo {
  create(exchange: Exchange): Promise<void>;
  readById(id: string): Promise<Exchange | null>;
  readPrev(exchange: Exchange): Promise<Exchange | null>;
}
