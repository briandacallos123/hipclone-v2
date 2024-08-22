'use server';

import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { join } from 'path';

const isValidFileTypes = (str: string) => {
  const validFileType = ['application/pdf', 'image/png', 'image/jpeg'];
  const isValid = validFileType.find((v: any) => String(v) === String(str));
  return isValid;
};
const validateMagicNumber = (buf: any) => {
  const magicNumberStr = buf.toString('hex', 0, 4).toLowerCase();
  return (
    magicNumberStr === String('25504446').toLowerCase() ||
    magicNumberStr === String('89504e47').toLowerCase() ||
    magicNumberStr === String('ffd8ffe0').toLowerCase()
  );
};

const calculateHash = (buffer: Buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};
const storage = new Storage({
  keyFilename: join(process.cwd(), 'json/adroit-solstice-257307-0068b54143dd.json'),
});

const bucket = storage.bucket('mediko_connect_files');

const fileDefaults = async (fileName: string) => {
  try {
    const [exists] = await bucket.file(fileName).exists();
    return exists;
  } catch {
    return false;
  }
};

const useGoogleStorage = async (sFile: any, userId: any, folderUploadName: any) => {
  let response: any = [];
  try {
    const processFile = async (file: any) => {
      if (!file || !file.blobParts || !file.type) {
        throw new GraphQLError('Invalid file structure');
      }

      let buf = Buffer.concat(file.blobParts);
      if (!isValidFileTypes(file.type)) {
        throw new GraphQLError(`File type not allowed. ${file?.type}`);
      }
      if (!validateMagicNumber(buf)) {
        throw new GraphQLError(`Invalid File Type. ${file?.type}`);
      }

      const fileHash = calculateHash(buf);
      const userFolder = `user_${userId}`; // Create a user-specific folder
      const uniqueName = file?.name?.includes('defaults')
        ? file?.name
        : `${uuidv4()}_${file?.name}`;
      const fileName = `${folderUploadName}/${userFolder}/${uniqueName}`;
      const isDefaults = await fileDefaults(fileName);

      if (isDefaults) {
        return new Promise((resolve) => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          resolve({
            hash: fileHash,
            fileName: fileName,
            fileType: file?.type,
            fileSize: 2000,
            fileExtension: file?.type,
            path: publicUrl,
          });
        });
      }

      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream();

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err: any) => {
          reject(new GraphQLError(err));
        });

        blobStream.on('finish', async () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve({
            hash: fileHash,
            fileName: fileName,
            fileType: file?.type,
            fileSize: blob?.metadata?.size,
            fileExtension: file?.type,
            path: publicUrl,
          });
        });

        blobStream.end(buf);
      });
    };
    if (Array.isArray(sFile)) {
      response = await Promise.all(sFile.map(processFile));
    } else if (sFile) {
      response = await processFile(sFile);
    } else {
      throw new GraphQLError('No file provided');
    }

    return response;
  } catch (error) {
    throw new GraphQLError(error);
  }
};

export default useGoogleStorage;
