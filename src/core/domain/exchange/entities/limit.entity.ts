import { IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator'
import { type Entity, type Json, type Plain, type Serializable, Validate } from 'src/shared'
import { IsDownLimit } from '../decorators/down-limit.decorator'
import { IsUpLimit } from '../decorators/up-limit.decorator'

@Validate()
export class Limit implements Entity, Serializable {
  @IsUUID()
  readonly id: string

  @IsUpLimit()
  readonly up: number

  @IsDownLimit()
  readonly down: number

  @IsPositive()
  readonly threshold: number

  @IsString()
  @IsNotEmpty()
  readonly from: string

  @IsString()
  @IsNotEmpty()
  readonly to: string

  @IsPositive()
  readonly timestamp: number

  constructor(
    id: string,
    up: number,
    down: number,
    threshold: number,
    from: string,
    to: string,
    timestamp = Date.now(),
  ) {
    this.id = id
    this.up = up
    this.down = down
    this.from = from
    this.threshold = threshold
    this.to = to
    this.timestamp = timestamp
  }

  static fromPlain(plain: Plain<Limit>): Limit {
    return new Limit(
      plain.id,
      plain.up,
      plain.down,
      plain.threshold,
      plain.from,
      plain.to,
      plain.timestamp,
    )
  }

  static fromJson(json: Json): Limit {
    try {
      const plain = JSON.parse(json) as Plain<Limit>
      return Limit.fromPlain(plain)
    } catch (error: unknown) {
      throw new Error(`Invalid JSON data for ${Limit.name}`, {
        cause: error,
      })
    }
  }

  toJson(): Json {
    return JSON.stringify(this)
  }

  toPlain(): Plain<Limit> {
    return {
      id: this.id,
      up: this.up,
      down: this.down,
      from: this.from,
      threshold: this.threshold,
      to: this.to,
      timestamp: this.timestamp,
    }
  }
}
