import { BaseQueue } from "../BaseQueue";

export abstract class ArrayQueue<T> extends BaseQueue<T, T[]> {
  public async add(data: T) {
    this.queue.push(data);
  }

  public async remove() {
    if (this.queue.length === 0) return;

    console.log("removendo o dado da fila");
    this.queue.shift();
  }
}
