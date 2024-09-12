import database from "@core/config/database"
import { RowDataPacket } from "mysql2"

export async function generateCode(type: string, length: number) {
    let key = ''
    let pre = ''
    if (type == 'customer') {
        key = 'customers'
        pre = 'KH'
    }
    if (type == 'service_package') {
        key = 'service_pack'
        pre = 'DV'
    }
    const lastRow = await database.executeQuery(`SELECT id, code FROM ${key} ORDER BY id DESC LIMIT 1`)
    let codeNumber = ''
    if (Array.isArray(lastRow) && lastRow.length == 0) {
        codeNumber = '1'.padStart(length - pre.length, '0')
        return pre + codeNumber
    }
    if (Array.isArray(lastRow) && lastRow.length > 0) {
        const lastCode = (lastRow as RowDataPacket[])[0].code
        codeNumber = lastCode.substring(pre.length)
    }
    const newCode = pre + (parseInt(codeNumber, 10) + 1).toString().padStart(length - pre.length, '0');
    return newCode
}

export async function generateCodeRandom(tableName: string, length: number): Promise<string> {
    let code: string
    let result: any
    const query = `SELECT * FROM ${tableName} WHERE code = ?`
    const generateCode = () => Math.random().toString(36).substring(2, 2 + length);
    do {
        code = generateCode()
        result = await database.executeQuery(query, [code])
    } while (Array.isArray(result) && result.length > 0)

    return code.toUpperCase()
}

export async function gennerateCodeRandomWithPrefix(tableName: string, prefix: string, length: number): Promise<string> {
    let code: string
    let result: any
    const query = `SELECT * FROM ${tableName} WHERE code = ?`
    const generateCode = () => Math.random().toString(36).substring(2, 2 + length - prefix.length);
    do {
        code = prefix + generateCode()
        result = await database.executeQuery(query, [code])
    } while (Array.isArray(result) && result.length > 0)

    return code.toUpperCase()
}

export async function generateCodeWithPrefix(tableName: string, prefix: string, length: number) {
    let key = ''
    let result = ''
    const query = `select * from ${tableName} where \`code\` like '${prefix}%' and \`code\` regexp '[0-9]$' order by \`code\` desc limit 1`;
    const lastRow = await database.executeQuery(query);;
    if (Array.isArray(lastRow) && lastRow.length == 0) {
        result = prefix + '1'.padStart(length - prefix.length, '0');
        return result;
    }
    if (Array.isArray(lastRow) && lastRow.length > 0) {
        const lastCode = (lastRow as RowDataPacket[])[0].code;
        const codeNumber = lastCode.substring(prefix.length);
        result = prefix + (parseInt(codeNumber, 10) + 1).toString().padStart(length - prefix.length, '0');
    }
    return result;
}