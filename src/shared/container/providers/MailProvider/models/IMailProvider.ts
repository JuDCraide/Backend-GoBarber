import ISendMailProvider from '../dtos/ISendMailProvider';

export default interface IMailProvider {
  sendMail(data: ISendMailProvider): Promise<void>;
};
