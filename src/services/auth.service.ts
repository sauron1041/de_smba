import { isEmptyObject } from "@core/utils/helpers";
import { HttpException } from "@core/exceptions";
import bcryptjs from 'bcryptjs';
import database from "@core/config/database";
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import LoginDto from "../dtos/auth/login.dto";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RowDataPacket } from "mysql2/promise";
import mysql from "mysql2/promise";
import changePasseword from "../dtos/auth/changePassword.dto";
import UpdateProfileDao from "../dtos/auth/updateProfile.dto";
import { checkExist } from "@core/utils/checkExist";
import errorMessages from "@core/config/constants";

class AuthServices {
    private tableName = 'users';

    public login = async (model: LoginDto) => {
        try {
            const user = await checkExist(this.tableName, 'username', model.username);
            if (user == false)
                return new HttpException(404, errorMessages.USERNAME_NOT_EXISTED, 'username');
            const validPassword = user && await bcryptjs.compare(model.password, (user as any)[0].password);
            if (!validPassword)
                return new HttpException(400, errorMessages.PASSWORD_INCORRECT, 'password');
            let id = (user as RowDataPacket[])[0].id;

            const accessToken = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
            const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
            let query = `update ${this.tableName} set token = ? where username = ?`;
            await database.executeQuery(query, [refreshToken, model.username]);
            if (Array.isArray(user) && user.length === 0)
                return new HttpException(404, errorMessages.USERNAME_NOT_EXISTED, 'username');
            delete (user as RowDataPacket[])[0].password;
            delete (user as RowDataPacket[])[0].token;
            return {
                data: {
                    user: {
                        ...(user as RowDataPacket[])[0]
                    },
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            }
        } catch (error) {
            return error;
        }
    }
    public changePassword = async (model: changePasseword) => {
        try {
            const user = await checkExist(this.tableName, 'id', model.id!.toString());
            if (user == false)
                return new HttpException(404, errorMessages.NOT_EXISTED, 'id');
            const validPassword = user && await bcryptjs.compare(model.password, (user as any)[0].password);
            if (!validPassword)
                return new HttpException(400, errorMessages.PASSWORD_INCORRECT, 'password');
            const hashedNewPassword = await bcryptjs.hash(model.newPassword, 10);
            const result = await database.executeQuery(`UPDATE ${this.tableName} SET password = ? WHERE id = ?`, [hashedNewPassword, model.id]);
            if ((result as mysql.ResultSetHeader).affectedRows === 0)
                return new HttpException(400, errorMessages.UPDATE_FAILED);
            if ((result as mysql.ResultSetHeader).affectedRows > 0)
                return
        } catch (error) {
            return new HttpException(500, errorMessages.UPDATE_FAILED);
        }
    }
    public async logout(refreshToken: string) {
        const result = await database.executeQuery(`update  ${this.tableName} set token = null WHERE token = ?`, [refreshToken]);
        if ((result as mysql.ResultSetHeader).affectedRows === 0)
            return new HttpException(400, errorMessages.LOGOUT_FAILED);
        return
    }
    private createFolderIfNotExist(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    public uploadImage = async (code: string, file: Express.Multer.File) => {
        const allowedFile = ['.png', '.jpg', '.jpeg']
        if (!allowedFile.includes(path.extname(file.originalname)))
            return new HttpException(400, errorMessages.INVALID_FILE);
        const userDir = path.join(__dirname, process.env.USER_UPLOAD_IMAGE_PATH as string, code);

        this.createFolderIfNotExist(userDir)
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
                path.join(__dirname, process.env.USER_UPLOAD_IMAGE_PATH as string, '..'),
                uploadPath
            );
            return relativePath
        }
        return new HttpException(400, errorMessages.UPLOAD_FAILED);
    }
    public refreshToken = async (refreshToken: string) => {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE token = ?`;
            const result = await database.executeQuery(query, [refreshToken]);
            if ((result as RowDataPacket[]).length === 0)
                return new HttpException(400, errorMessages.REFRESH_TOKEN_FAILED);
            else {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload
                if (!decoded)
                    return new HttpException(400, errorMessages.REFRESH_TOKEN_FAILED);
                const id = decoded.id;
                const accessToken = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
                return {
                    data: {
                        accessToken: accessToken
                    }
                }
            }
        } catch (error) {
            return new HttpException(500, errorMessages.REFRESH_TOKEN_FAILED);
        }
    }
    public getProfileById = async (id: number) => {
        const result = await checkExist(this.tableName, 'id', id.toString());
        if (result == false)
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        delete (result as RowDataPacket[])[0].password;
        delete result[0].token;
        return {
            data: (result as RowDataPacket[])[0]
        };
    }
}

export default AuthServices;