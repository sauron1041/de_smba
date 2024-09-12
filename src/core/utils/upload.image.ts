import { HttpException } from "@core/exceptions";
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export namespace UploadImage {
    export const createFolderIfNotExist = (dir: string) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    export const uploadImage = async (code: string, file: Express.Multer.File, UPLOAD_IMAGE_PATH: string) => {
        const allowedFile = ['.png', '.jpg', '.jpeg']
        if (!allowedFile.includes(path.extname(file.originalname)))
            return new HttpException(400, 'invalid file type')
        const userDir = path.join(__dirname, process.env.UPLOAD_IMAGE_PATH as string, code);

        createFolderIfNotExist(userDir)
        const fileExtension = path.extname(file.originalname);
        const uploadPath = path.join(userDir, `${code}${fileExtension}`)
        const upload = await sharp(file.buffer).toFile(uploadPath)

        const files = fs.readdirSync(userDir);
        for (const fileName of files) {
            fs.unlinkSync(path.join(userDir, fileName));
        }

        if (upload) {
            await sharp(file.buffer).toFile(uploadPath);
            const relativePath = path.relative(
                path.join(__dirname, process.env.UPLOAD_IMAGE_PATH as string, '..'),
                uploadPath
            );
            return relativePath
        }
        return new HttpException(400, 'upload failed')
    }
}