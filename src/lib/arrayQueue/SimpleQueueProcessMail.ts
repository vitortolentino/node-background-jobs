import { EmailData, IMailProvider } from "../../providers/IMailProvider";
import { ArrayQueue } from "./ArrayQueue";

export class SimpleQueueProcessMail extends ArrayQueue<EmailData> {
  constructor(
    private mailProvider: IMailProvider,
    protected queue: EmailData[] = []
  ) {
    super(queue);
  }

  public async process(options: { maxRetries: number }) {
    while (this.queue.length > 0) {
      const data = this.queue[0];
      if (!data) continue;
      await this.mailProvider.sendMail(data);

      this.remove();

      console.log("Email enviado");
      try {
      } catch (error) {
        console.log("Falha ao enviar o email");
      }
    }
  }
}
