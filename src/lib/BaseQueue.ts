import { IMailProvider } from "../providers/IMailProvider";

export abstract class BaseQueue<T, Q> {
  constructor(protected queue: Q) { }
  protected readonly MAX_ATTEMPTS: number = 3;
  public abstract add(data: T): Promise<void>;
  public abstract remove(): Promise<void>;
  public abstract process(options: { maxRetries: number }): Promise<void | (() => void)>;
}
