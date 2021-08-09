interface IMailConfig {
  driver: 'ethereal' | 'ses';

  from: {
    email: string;
    name: string;
  };

  config: {
    aws: {
      region: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  from: {
    email: process.env.MAIL_FROM_EMAIL,
    name: process.env.MAIL_FROM_NAME,
  },

  config: {
    aws: {
      region: process.env.MAIL_AWS_SES_REGION,
    },
  },
} as IMailConfig;
