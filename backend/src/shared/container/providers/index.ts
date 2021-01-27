import { container } from 'tsyringe';

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);
