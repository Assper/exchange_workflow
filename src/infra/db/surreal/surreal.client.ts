import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import type { DbConfig } from 'src/global/config/db.config'
import Surreal from 'surrealdb'

@Injectable()
export class SurrealClient implements OnModuleInit, OnModuleDestroy {
  readonly db = new Surreal()

  constructor(private readonly dbConfig: DbConfig) {}

  async onModuleInit() {
    try {
      await this.db.connect(this.dbConfig.rpc, {
        auth: {
          username: this.dbConfig.user,
          password: this.dbConfig.password,
        },
      })
      await this.db.use({
        namespace: this.dbConfig.namespace,
        database: this.dbConfig.db,
      })
    } catch (err) {
      console.error(
        'Failed to connect to SurrealDB:',
        err instanceof Error ? err.message : String(err),
      )
      await this.db.close()
      throw err
    }
  }

  async onModuleDestroy() {
    await this.db.close()
  }
}
