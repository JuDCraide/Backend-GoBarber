import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tempFolder = path.resolve(__dirname, '..', '..', 'temp');
const uploadsFolder = path.resolve(tempFolder, 'uploads');

interface IUploadConfig {
  driver: 's3' | 'disk',

  tempFolder: string,
  uploadsFolder: string,

  multer: {
    storage: StorageEngine,
  },
  config: {
    disk: {
    },
    aws: {
      bucket: string,
    }
  }
}

export default {
  driver: 'disk',

  tempFolder,
  uploadsFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tempFolder,
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber',
    },
  },
} as IUploadConfig;
