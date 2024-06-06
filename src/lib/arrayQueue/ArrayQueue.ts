
import { BaseQueue } from "../BaseQueue";

export abstract class ArrayQueue<T> extends BaseQueue<T, T[]> {
  public abstract process(options: { maxRetries: number; }): Promise<void>;

  public async add(data: T): Promise<void> {
    this.queue.push(data);
  }

  public async remove(): Promise<void> {
    if (this.queue.length === 0) return;
    console.log('[REMOVE] Removing message from queue')
    this.queue.shift();
  }

}
