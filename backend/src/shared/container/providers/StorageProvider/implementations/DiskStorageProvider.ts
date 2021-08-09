import fs from 'fs';
import path from 'path';

import storageConfig from '@config/storage';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(storageConfig.tmpFolder, file),
      path.resolve(storageConfig.config.disk.storageFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(
      storageConfig.config.disk.storageFolder,
      file,
    );

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
