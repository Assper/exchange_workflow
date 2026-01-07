import { Injectable } from '@nestjs/common';
import { Limit, LimitRepo } from 'src/core';
import { Table } from '../surreal/table.enum';
import { SurrealClient } from '../surreal/surreal.client';
import { Decimal, RecordId, Uuid } from 'surrealdb';

type LimitRecord = {
  id: RecordId;
  from: string;
  to: string;
  up: Decimal;
  down: Decimal;
  threshold: Decimal;
  timestamp: Date;
};

@Injectable()
export class LimitRepoIml implements LimitRepo {
  constructor(private readonly surreal: SurrealClient) {}

  async save(limit: Limit): Promise<void> {
    const data = limit.toPlain();
    await this.surreal.db.upsert(Table.Limit, {
      id: new RecordId(Table.Limit, new Uuid(data.id)),
      from: data.from,
      to: data.to,
      up: new Decimal(data.up),
      down: new Decimal(data.down),
      threshold: new Decimal(data.threshold),
      timestamp: new Date(data.timestamp),
    });
  }

  async getAll(): Promise<Limit[]> {
    const [records] = await this.surreal.db.query<LimitRecord[][]>(
      `SELECT * FROM ${Table.Limit}`,
    );

    return records.map((record) =>
      Limit.fromPlain({
        id: record.id.id.toString(),
        from: record.from,
        to: record.to,
        up: Number(record.up.decimal),
        down: Number(record.down.decimal),
        threshold: Number(record.threshold.decimal),
        timestamp: record.timestamp.getTime(),
      }),
    );
  }

  async delete(limit: Limit): Promise<void> {
    await this.surreal.db.query(
      `DELETE FROM ${Table.Limit} WHERE id = ${limit.id}`,
    );
  }
}
