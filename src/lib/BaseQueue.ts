export abstract class BaseQueue<T, Q> {
  constructor(protected queue: Q) {}
  protected MAX_ATTEMPTS = 3;

  public abstract add(data: T): Promise<void>;
  public abstract remove(): Promise<void>;
  public abstract process(options: { maxRetries: number }): Promise<void>;
}
