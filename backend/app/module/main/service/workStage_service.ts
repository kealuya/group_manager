import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggMySQL } from 'egg-mysql';
import { EggLogger } from 'egg';


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

    async getList(search: string, page: number, pageSize: number): Promise<any> {
        let where = '';
        let whereParam = '';
        if (search == '' || search == null) {
            where = ' 1=1 '
        } else {
            where = ' AND ( title like :where1 OR school_code like :where1 OR school_name like :where1 )';
            whereParam = search;
        }

        let sqlForCount = `SELECT 
                            count(*) as count
                            FROM work 
                            WHERE
                                ${where}`
        let sqlForSearch = `SELECT 
                           *
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

export interface getWorkList {
    search: string;
    page: number;
    pageSize: number;
}
