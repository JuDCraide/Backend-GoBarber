import handlebars from 'handlebars';
import fs from 'fs';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export default class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ file, variables }: IParseMailTemplateDTO): Promise<string> {
    const template = await fs.promises.readFile(file, {
      encoding: 'utf8',
    });

    const parsedTemplate = handlebars.compile(template);

    return parsedTemplate(variables);
  }
}
