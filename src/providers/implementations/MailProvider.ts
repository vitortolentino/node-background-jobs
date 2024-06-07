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
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendMail({ to, subject, text, html }: EmailData) {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
      html,
    });
  }
}
