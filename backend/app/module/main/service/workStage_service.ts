import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggMySQL } from 'egg-mysql';
import { Context, EggLogger } from 'egg';

// const Controller = require('egg').Controller;
const fs = require('fs/promises');



@SingletonProto({
    accessLevel: AccessLevel.PUBLIC,
})

export class workStage_service {
    @Inject()
    mysql: EggMySQL
    @Inject()
    logger: EggLogger;


    async addInfo(addData: object): Promise<Array<addWorkInfo> | null> {
        try {
            delete addData['id']
            const result = await this.mysql.insert('work', addData)

            // const insertSuccess = result.affectedRows === 1;
            if (result.affectedRows !== 1) {
                throw new Error('Method not implemented.')
            }
            return null
        } catch (e) {
            throw e
        }

    }

    async upload(ctx:Context):Promise<any> {
        // const { ctx } = this;
        console.log(ctx.request.body);
        console.log('got %d files', ctx.request.files.length);
        for (const file of ctx.request.files) {
            console.log('field: ' + file.field);
            console.log('filename: ' + file.filename);
            console.log('encoding: ' + file.encoding);
            console.log('mime: ' + file.mime);
            console.log('tmp filepath: ' + file.filepath);
            let result;
            try {
                // 处理文件，比如上传到云端
                result = await ctx.oss.put(
                    'egg-multipart-test/' + file.filename,
                    file.filepath,
                );
            } finally {
                // 需要删除临时文件
                await fs.unlink(file.filepath);
            }
            console.log(result);
        }
    }



    async editInfo(editData: object): Promise<Array<editWorkInfo> | null> {
        try {
            const result = await this.mysql.update('work', editData)

            // const insertSuccess = result.affectedRows === 1;
            if (result.affectedRows !== 1) {
                throw new Error('Method not implemented.')
            }
            return null
        } catch (e) {
            throw e
        }

    }

    async deleteInfo(id: number): Promise<any> {
        try {
            const result = await this.mysql.delete('work', {
                id:id
            })
            console.log('删除tableProgram时的result',result)
        } catch (e) {
            throw e
        }
    }

    async getList(search: string, page: number, pageSize: number): Promise<any> {
        let where = '';
        let whereParam = '';
        if (search == '' || search == null) {
            where = ' 1=1 '
        } else {
            where = ' title like :where1 OR xt like :where1 OR school_name like :where1';
            whereParam = search;
        }

        let sqlForCount = `SELECT 
                            count(*) as count
                            FROM work 
                            WHERE
                                ${where}`
        let sqlForSearch = `SELECT 

                           title,
                           id,
                           school_code,
                           school_name,
                           xt,
                           create_people,
                           priority,
                           process_people,
                           program_type,
                           status,
                           remark,
                           date_format( create_time, '%Y-%m-%d %T' ) AS create_time,
                           content
                           FROM work 
                           WHERE
                            ${where}
                             LIMIT :limit1,:limit2`
        const countObj = await this.mysql.query(sqlForCount, {
            where1: '%' + whereParam + '%',
        });
        const result = await this.mysql.query(sqlForSearch, {
            limit1: (page - 1) * pageSize,
            limit2: pageSize,
            where1: '%' + whereParam + '%',
        });
        if (result.length > 0) {
            return { array: result, count: countObj[0].count };
        }
        return null
    }

}

export interface addWorkInfo {
    addData: object;
}
export interface editWorkInfo {
   editData: object;
}
export interface deleteWorkInfo {
    id: number;
}

export interface getWorkList {
    search: string;
    page: number;
    pageSize: number;
}
