import crypto from 'crypto';
import path from 'path';

import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IStorageConfig {
  driver: 'disk' | 's3';

  tmpFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {
      storageFolder: string;
    };
    aws: {
      region: string;
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tmpFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {
      storageFolder: path.resolve(tmpFolder, 'uploads'),
    },
    aws: {
      region: process.env.STORAGE_AWS_S3_REGION,
      bucket: process.env.STORAGE_AWS_S3_BUCKET,
    },
  },
} as IStorageConfig;
