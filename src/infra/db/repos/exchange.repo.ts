import { Injectable } from '@nestjs/common'
import { Exchange, type ExchangeRepo } from 'src/core'
import { Decimal, RecordId, Uuid } from 'surrealdb'
import { SurrealClient } from '../surreal/surreal.client'
import { Table } from '../surreal/table.enum'

type ExchangeRecord = {
  id: RecordId
  from: string
  to: string
  rate: Decimal
  timestamp: Date
}

@Injectable()
export class ExchangeRepoIml implements ExchangeRepo {
  constructor(private readonly surreal: SurrealClient) {}

  async create(exchange: Exchange): Promise<void> {
    const data = exchange.toPlain()
    await this.surreal.db.create(Table.Exchange, {
      id: new RecordId(Table.Exchange, new Uuid(data.id)),
      from: data.from,
      to: data.to,
      rate: new Decimal(data.rate),
      timestamp: new Date(data.timestamp),
    })
  }

  async readPrev(exchange: Exchange): Promise<Exchange | null> {
    const data = exchange.toPlain()
    const [[record]] = await this.surreal.db.query<ExchangeRecord[][]>(`
      SELECT * FROM ${Table.Exchange}
      WHERE from = "${data.from}" AND to = "${data.to}" AND timestamp > time::now() - 24h
      ORDER BY timestamp DESC
      LIMIT 1
    `)
    if (!record) return null

    return Exchange.fromPlain({
      id: record.id.id.toString(),
      from: record.from,
      to: record.to,
      rate: Number(record.rate.decimal),
      timestamp: record.timestamp.getTime(),
    })
  }

  async readById(id: string): Promise<Exchange | null> {
    const [[record]] = await this.surreal.db.query<ExchangeRecord[][]>(
      `SELECT * FROM ${Table.Exchange} WHERE id = ${id}`,
    )
    if (!record) return null

    return Exchange.fromPlain({
      id: record.id.id.toString(),
      from: record.from,
      to: record.to,
      rate: Number(record.rate.toString()),
      timestamp: record.timestamp.getTime(),
    })
  }
}
