import ISendMailProvider from '@shared/container/providers/MailProvider/dtos/ISendMailProvider';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendMailProvider[] = []

  public async sendMail(message: ISendMailProvider): Promise<void> {
    this.messages.push(message);
  }
}
