import fs from 'fs';
import path from 'path';

import aws, { S3 } from 'aws-sdk';
import mime from 'mime';

import storageConfig from '@config/storage';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: storageConfig.config.aws.region,
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(storageConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found.');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: storageConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: storageConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
