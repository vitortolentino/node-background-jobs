import { EmailData } from "../../providers/IMailProvider";
import { MailProvider } from "../../providers/implementations/MailProvider";
import { ArrayQueue } from "./ArrayQueue";

export class SimpleQueueProcessMail extends ArrayQueue<EmailData> {
  constructor(private mailProvider: MailProvider, protected queue: EmailData[] = []) {
    super(queue);
  }

  async process(options: { maxRetries: number }): Promise<void> {
    if (this.MAX_ATTEMPTS < options.maxRetries) {
      throw new Error('Max attempts exceeded');
    }

    while (this.queue.length > 0) {

      const [data] = this.queue;
      if (!data) continue;

      try {
        await this.mailProvider.sendEmail(data);
        console.log(`[SIMPLE_QUEUE][PROCESS] Email sent to ${data.to}`);
      } catch (error) {
        console.log(`[SIMPLE_QUEUE][PROCESS] Failed to send email to ${data.to}: ${error}`);
        await this.retry(data, options);
      } finally {
        await this.remove();
      }
    }

    console.log('[SIMPLE_QUEUE][PROCESS] Queue is empty, waiting for new emails...');
  }

  async retry(data: EmailData, options: { maxRetries: number }): Promise<void> {
    let retries = options.maxRetries;

    if (retries === 0) return;

    while (retries > 0) {
      try {
        console.log(`[SIMPLE_QUEUE][RETRY] Send to ${data.to}`);
        await this.mailProvider.sendEmail(data);
        break;
      } catch (error) {
        console.log(`[SIMPLE_QUEUE][RETRY] Failed to send email to ${data.to}: ${error}`);
        retries--;
      }
    }
  }
}
