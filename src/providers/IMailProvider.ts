export interface IMailProvider {
  sendEmail(emailData: EmailData): Promise<void>;
}

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}
