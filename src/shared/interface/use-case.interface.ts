export interface UseCase<TParams, TResult> {
  exec(params: TParams): Promise<TResult>;
}
