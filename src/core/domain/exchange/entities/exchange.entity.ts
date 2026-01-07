import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Entity, Json, Plain, Serializable, Validate } from 'src/shared';

@Validate()
export class Exchange implements Entity, Serializable {
  @IsUUID()
  readonly id: string;

  @IsNumber()
  @Min(0)
  readonly rate: number;

  @IsString()
  @IsNotEmpty()
  readonly from: string;

  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @IsPositive()
  readonly timestamp: number;

  constructor(
    id: string,
    rate: number,
    from: string,
    to: string,
    timestamp = Date.now(),
  ) {
    this.id = id;
    this.rate = rate;
    this.from = from;
    this.to = to;
    this.timestamp = timestamp;
  }

  static fromPlain(plain: Plain<Exchange>): Exchange {
    return new Exchange(
      plain.id,
      plain.rate,
      plain.from,
      plain.to,
      plain.timestamp,
    );
  }

  static fromJson(json: Json): Exchange {
    try {
      const plain = JSON.parse(json) as Plain<Exchange>;
      return this.fromPlain(plain);
    } catch (error: unknown) {
      throw new Error(`Invalid JSON data for ${Exchange.name}`, {
        cause: error,
      });
    }
  }

  toJson(): Json {
    return JSON.stringify(this);
  }

  toPlain(): Plain<Exchange> {
    return {
      id: this.id,
      rate: this.rate,
      from: this.from,
      to: this.to,
      timestamp: this.timestamp,
    };
  }
}
