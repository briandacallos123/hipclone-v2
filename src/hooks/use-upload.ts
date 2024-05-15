
import fs from 'fs';
import pathInfo from 'path';
import mime from 'mime';
import { GraphQLError } from 'graphql/error/GraphQLError';

type useUploadType = {
    fileName: String;
    fileSize: String;
    fileType: String;
    fileExtension: String;
    path: String;
}
const isValidFileTypes = (str: string) => {
    const validFileType = [
       'application/pdf',
       'image/png',
       'image/jpeg'
       
    ]

    const isValid = validFileType.find((v:any) => String(v) === String(str))
    return isValid;
}
export const useUpload = (sFile: any, filePath: any) => {
    let response: any = [];
    try{
        if (sFile) {
            if (Array.isArray(sFile)) {
    
                // CHECK FILE EXTENTION
                // MATCH MAGIC NUMBER
                // png image/png - 89 50 4e 47
                // pdf application/pdf - 	25 50 44 46 [%PDF]
                // jpg/jpeg image/jpeg - ff d8 ff e0
    
                sFile.map(async (v) => {
    
                    let buf =  Buffer.concat(v.blobParts);
                    const dirRoot = filePath;
                    if (!fs.existsSync(dirRoot)) {
                        fs.mkdirSync(dirRoot, { recursive: true });
                    }
                    const path = `${filePath}${Date.now()}-${v.name}`;
                    fs.writeFileSync(path, buf);

                    if(!isValidFileTypes(v.type)){
                        fs.unlinkSync(path);
                        throw new GraphQLError('Invalid file type.');   
                    }
                    if(v.type === 'application/pdf'){
                        // 25 50 44 46 [%PDF]
                        const magicNumberStr : string = buf.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').slice(0,16);
                        const isValid = magicNumberStr.includes('25504446');
                        if(!isValid){
                            fs.unlinkSync(path);
                            throw new GraphQLError('Invalid file type [PDF]');   
                        }
                    }
                    if(v.type === 'image/png'){
                        // 89 50 4e 47
                        const magicNumberStr : string = buf.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').slice(0,16);
                        const isValid = magicNumberStr.includes('89504e47');
                        if(!isValid){
                            fs.unlinkSync(path);
                            throw new GraphQLError('Invalid file type [PNG]');   
                        }
                    }
                    if(v.type === 'image/jpeg'){
                        // 89 50 4e 47
                        const magicNumberStr : string = buf.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').slice(0,16);
                        const isValid = magicNumberStr.includes('ffd8ffe0');
                        if(!isValid){
                            fs.unlinkSync(path);
                            throw new GraphQLError('Invalid file type [JPEG]');   
                        }
                    }
    
                    // Use path.basename to get the file name
                    const fileName = pathInfo.basename(path);
                    // Use path.extname to get the file extension
                    const fileExtension = pathInfo.extname(path);
    
                    // Use fs.stat to get the file size
                    const fileType = mime.getType(path);
                    const { size } = fs.statSync(path);
                    let fileSize = size;
                    response.push({
                        fileName,
                        fileType,
                        fileSize,
                        fileExtension,
                        path
                    })
    
    
                    return v
                })
    
            } else {
                let buf = Buffer.concat(sFile.blobParts);
            
                const dirRoot = filePath;
                if (!fs.existsSync(dirRoot)) {
                    fs.mkdirSync(dirRoot, { recursive: true });
                }
                const path = `${filePath}${Date.now()}-${sFile.name}`;
                fs.writeFileSync(path, buf);

                if(!isValidFileTypes(sFile.type)){
                    fs.unlinkSync(path);
                    throw new GraphQLError('Invalid file type.');   
                }
                if(sFile.type === 'application/pdf'){
                    // 25 50 44 46 [%PDF]
                    const magicNumberStr : string = buf.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').slice(0,16);
                    const isValid = magicNumberStr.includes('25504446');
                    if(!isValid){
                        fs.unlinkSync(path);
                        throw new GraphQLError('Invalid file type [PDF]');   
                    }
                }
                if(sFile.type === 'image/png'){
                    // 89 50 4e 47
                    const magicNumberStr : string = buf.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').slice(0,16);
                    const isValid = magicNumberStr.includes('89504e47');
                    if(!isValid){
                        fs.unlinkSync(path);
                        throw new GraphQLError('Invalid file type [PNG]');   
                    }
                }
                if(sFile.type === 'image/jpeg'){
                        // 89 50 4e 47
                        const magicNumberStr : string = buf.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').slice(0,16);
                        const isValid = magicNumberStr.includes('ffd8ffe0');
                        if(!isValid){
                            fs.unlinkSync(path);
                            throw new GraphQLError('Invalid file type [JPEG]');   
                        }
                }
    
                // Use path.basename to get the file name
                const fileName = pathInfo.basename(path);
                // Use path.extname to get the file extension
                const fileExtension = pathInfo.extname(path);
    
                // Use fs.stat to get the file size
                const fileType = mime.getType(path);
                const { size } = fs.statSync(path);
                let fileSize = size;
                response.push({
                    fileName, 
                    fileType,
                    fileSize,
                    fileExtension,
                    path
                })
    
            }
        }
    
        return response;
    }catch(error){
        throw new GraphQLError(error);
    }
    
}