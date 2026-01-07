export const config = () => ({
  port: parseInt(process.env.PORT || '3000'),
  env: process.env.NODE_ENV || 'development',
  db: {
    rpc: process.env.SURREAL_RPC,
    user: process.env.SURREAL_USER,
    password: process.env.SURREAL_PASSWORD,
    db: process.env.SURREAL_DB,
    namespace: process.env.SURREAL_NAMESPACE,
  },
  binance: {
    streamSocket: process.env.BINANCE_STREAM_SOCKET,
  },
  n8n: {
    exchangeUrl: process.env.N8N_EXCHANGE_WORKFLOW_URL,
    apiToken: process.env.N8N_API_TOKEN,
  },
});

export type Config = ReturnType<typeof config>;
