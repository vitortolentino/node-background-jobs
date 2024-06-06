import { EmailData, IMailProvider } from "../../providers/IMailProvider";
import { BaseQueue } from "../BaseQueue";
import Queue from "bull";

export class RedisQueue extends BaseQueue<EmailData, Queue.Queue> {
  constructor(private mailProvider: IMailProvider, protected queue: Queue.Queue) {
    super(queue);
  }

  async add(data: EmailData): Promise<void> {
    console.log(`[REDIS][ADD] Adding email to queue: ${data.to}`);
    await this.queue.add(data);
  }

  async remove(): Promise<void> {}

  async process(options: { maxRetries: number }): Promise<void> {
    console.log('[REDIS][PROCESS] Processing emails...');
    this.queue.process(async (job) => {
      console.log(`[REDIS][PROCESS] Sending email to ${job.data.to}`);
      const { to, subject, text, html } = job.data;
      const msg = { to, from: process.env.FROM_EMAIL, subject, text, html };
      try {
        await this.mailProvider.sendEmail(msg);
      } catch (error) {
        console.log(`[PROCESS] Failed to send email to ${to}: ${error}`);
        await retry(job, options);
      }
    });

    async function retry(job: Queue.Job<EmailData>, options: { maxRetries: number }): Promise<void> {
      let retries = options.maxRetries;

      if (retries === 0) return;

      while (retries > 0) {
        try {
          if (job.attemptsMade < options.maxRetries) {
            console.log(`[REDIS][RETRY] Send to ${job.data.to}`);
            job.retry();
          }
          break;
        } catch (error) {
          console.log(`[REDIS][RETRY] Failed to send email to ${job.data.to}: ${error}`);
          retries--;
        }
      }
    }

  }

}
