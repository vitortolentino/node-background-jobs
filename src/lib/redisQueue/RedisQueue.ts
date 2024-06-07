import Queue from "bull";
import { EmailData } from "../../providers/IMailProvider";
import { BaseQueue } from "../BaseQueue";
import { MailProvider } from "../../providers/implementations/MailProvider";

export class RedisQueue extends BaseQueue<EmailData, Queue.Queue> {
  constructor(
    private mailProvider: MailProvider,
    protected queue: Queue.Queue
  ) {
    super(queue)
  }

  async add(data: EmailData) {
    this.queue.add(data);
  }

  async remove(): Promise<void> {}

  async process(options: { maxRetries: number }): Promise<void> {
    this.queue.process(async (job) => {
      const { to, text, subject, html } = job.data;

      try {
        await this.mailProvider.sendMail({ to, text, subject, html });
        console.log("email enviado pelo redis + bull");
      } catch (error) {
        console.log("Deu erro ao enviar redis + bull");
      }
    });
  }
}
