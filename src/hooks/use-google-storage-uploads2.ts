'use server';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';
import crypto from 'crypto';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { join } from 'path';

const isValidFileTypes = (str: string) => {
  const validFileType = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
  const isValid = validFileType.find((v: any) => String(v) === String(str));
  return isValid;
};
const validateMagicNumber = (buf: any) => {
  const magicNumberStr = buf.toString('hex', 0, 4).toLowerCase();
  const webpSignature = buf.toString('hex', 8, 12).toLowerCase(); // Check for WEBP after RIFF

  return (
    magicNumberStr === '25504446' || // PDF
    magicNumberStr === '89504e47' || // PNG
    magicNumberStr === 'ffd8ffe0' || // JPEG (EXIF)
    magicNumberStr === 'ffd8ffe1' || // JPEG (EXIF alternate)
    magicNumberStr === 'ffd8ffe2' || // JPEG (Canon)
    magicNumberStr === 'ffd8ffe3' || // JPEG (EXIF alternate 2)
    magicNumberStr === 'ffd8ffdb' || // JPEG (standalone DQT)
    (magicNumberStr === '52494646' && webpSignature === '57454250') // WebP
  );
};

const calculateHash = (buffer: Buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};
const storage = new Storage({
  keyFilename: join(process.cwd(), 'json/adroit-solstice-257307-0068b54143dd.json'),
});

const bucket = storage.bucket('storage.apgitsolutions.com');

const fileDefaults = async (fileName: string) => {
  try {
    const [exists] = await bucket.file(fileName).exists();
    await bucket.makePublic();
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
      const fileName = `mediko_connect_files/${folderUploadName}/${userFolder}/${uniqueName}`;
      const isDefaults = await fileDefaults(fileName);

      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream();

      //  blob.name = `mediko_connect_files/${blob.name}`;

      if (isDefaults) {
        return new Promise((resolve) => {
          const publicUrl = `https://${bucket.name}/${blob.name}`;
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

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err: any) => {
          reject(new GraphQLError(err));
        });

        blobStream.on('finish', async () => {
          await blob.makePublic();
          const publicUrl = `https://${bucket.name}/${blob.name}`;

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
