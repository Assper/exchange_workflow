export type Plain<O extends object> = {
  [K in keyof O as O[K] extends (...args: any[]) => any
    ? never
    : K]: O[K] extends object ? Plain<O[K]> : O[K];
};

export type Constructor<
  TInstance = object,
  TParams extends Array<any> = any[],
> = new (...args: TParams) => TInstance;
