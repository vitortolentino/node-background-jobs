export interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface IMailProvider {
  sendMail(emailData: EmailData): Promise<void>;
}
