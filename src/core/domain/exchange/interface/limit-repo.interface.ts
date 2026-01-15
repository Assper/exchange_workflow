import type { Limit } from '../entities/limit.entity'

export interface LimitRepo {
  getAll(): Promise<Limit[]>
  save(limit: Limit): Promise<void>
  delete(limit: Limit): Promise<void>
}
