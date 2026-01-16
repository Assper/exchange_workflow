import { Inject, Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import type { Exchange, LimitRepo } from 'src/core/domain'
import { LIMIT_REPO } from 'src/core/provider-tokens'
import { BinanceConfig } from 'src/global/config/binance.config'
import type { Plain } from 'src/shared'
import { v7 } from 'uuid'
import WebSocket from 'ws'
import { BinanceWsError } from './enums'

@Injectable()
export class ExchangeProducer {
  private readonly logger = new Logger(ExchangeProducer.name)
  private reconnectTimeout: NodeJS.Timeout | undefined
  private tickers: string[] = []
  private ws: WebSocket | null = null

  constructor(
    private readonly binanceConfig: BinanceConfig,
    private readonly eventEmitter: EventEmitter2,
    @Inject(LIMIT_REPO) private readonly limits: LimitRepo,
  ) {}

  disconnect() {
    if (!this.ws) return
    this.ws.close(BinanceWsError.Close)
    this.ws.removeAllListeners()
    this.ws = null
  }

  async connect() {
    this.ws = await this.getConnection()

    this.ws.on('open', () => {
      this.logger.log('Connected to Binance WebSocket')
    })

    this.ws.on('message', (data) => {
      this.handleMessage(data)
    })

    this.ws.on('error', (err) => {
      this.logger.error('Error connecting to Binance WebSocket:', err)
      this.handleClose(BinanceWsError.Disconnect)
    })

    this.ws.on('close', (code, reason) => {
      this.logger.warn(`WebSocket closed. Code: ${code}, Reason: ${reason.toString()}`)
      this.handleClose(code)
    })
  }

  private async getConnection() {
    const limits = await this.limits.getAll()
    this.tickers = limits.map((limit) => limit.from + limit.to)
    const streams: string = this.tickers
      .map((ticker) => `${ticker.toLowerCase()}@miniTicker`)
      .join('/')
    return new WebSocket(`${this.binanceConfig.streamSocket}?streams=${streams}`)
  }

  private handleMessage(data: WebSocket.RawData) {
    try {
      const message = JSON.parse(data.toString('utf8'))
      const { data: ticker } = message

      if (ticker) {
        this.eventEmitter.emit('exchange', {
          id: v7(),
          from: ticker.s.slice(0, 3),
          to: ticker.s.slice(3),
          rate: Number(ticker.c),
          timestamp: Date.now(),
        } as Plain<Exchange>)
      }
    } catch (err) {
      this.logger.error('Error parsing message:', err)
    }
  }

  private handleClose(code: BinanceWsError) {
    if (code !== BinanceWsError.Close) {
      // Don't reconnect on normal close
      this.logger.log('Reconnecting in 5 seconds...')
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout)
      }
      this.reconnectTimeout = setTimeout(this.reconnect.bind(this), 5000)
    }
  }

  private async reconnect() {
    if (this.ws) {
      this.ws.removeAllListeners()
    }
    await this.connect()
  }
}
