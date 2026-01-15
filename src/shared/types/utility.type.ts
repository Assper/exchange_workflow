export type Plain<O extends object> = {
  [K in keyof O as O[K] extends (...args: unknown[]) => unknown ? never : K]: O[K] extends object
    ? Plain<O[K]>
    : O[K]
}

export type Constructor<TInstance = object, TParams extends Array<unknown> = unknown[]> = new (
  ...args: TParams
) => TInstance
