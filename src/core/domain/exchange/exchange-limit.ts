import { Validate } from 'src/shared'
import { IsDownLimit } from './decorators/down-limit.decorator'
import { IsUpLimit } from './decorators/up-limit.decorator'
import type { Exchange } from './entities/exchange.entity'

@Validate()
export class ExchangeLimit {
  @IsUpLimit()
  readonly up: number

  @IsDownLimit()
  readonly down: number

  constructor(
    readonly exchange: Exchange,
    { up = 1, down = 0 }: { up?: number; down?: number },
  ) {
    this.up = up
    this.down = down
  }

  isUpper(): boolean {
    return this.up > this.exchange.rate
  }

  isLower(): boolean {
    return this.down < this.exchange.rate
  }

  isWithin(): boolean {
    return this.isUpper() && this.isLower()
  }
}
