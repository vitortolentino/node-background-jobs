import nodemailer, { Transporter } from "nodemailer";
import { EmailData, IMailProvider } from "../IMailProvider";


export class MailProvider implements IMailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_API_KEY,
      },
    });
  }

  async sendEmail({ to, subject, text, html }: EmailData): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    });
  }
}
