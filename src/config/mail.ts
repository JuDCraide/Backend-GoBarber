interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'juliadcraide@semdominio.com.br',
      name: 'Júlia D. C.',
    },
  },
} as IMailConfig;
