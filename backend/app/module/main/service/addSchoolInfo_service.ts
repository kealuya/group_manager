import {  AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggMySQL } from 'egg-mysql';
import { EggLogger } from 'egg';

@SingletonProto({
    accessLevel: AccessLevel.PUBLIC,
})


export class addSchoolInfo_service {
    @Inject()
    mysql: EggMySQL
    @Inject()
    logger: EggLogger;


    async addInfo(ruleFormAdd: object): Promise<Array<addSchoolInfo> | null > {
        const conn = await this.mysql.beginTransaction(); // 初始化事务
        try {
            const result = await conn.insert('school', {
                school_name: ruleFormAdd['school_name'],
                school_code: ruleFormAdd['school_code'],
            });
            console.log('result', result)
            const ruleFormAdd2 = JSON.parse(JSON.stringify(ruleFormAdd))
            delete ruleFormAdd2['school_name']
            // xt 表
            const result2 = await conn.insert('xt', ruleFormAdd2);
            console.log('result2', result2)
            await conn.commit(); // 提交事务
            return null
        } catch (e) {
            console.log('eeeeeeeeeeeeeeeee', e)
            await conn.rollback()//捕获异常后回滚事务！！
            throw e
        }

    }


}

export interface addSchoolInfo {
    ruleFormAdd: object
}
