import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggMySQL } from 'egg-mysql';
import { EggLogger } from 'egg';

@SingletonProto({
    accessLevel: AccessLevel.PUBLIC,
})


export class editSchoolInfo_service {
    @Inject()
    mysql: EggMySQL
    @Inject()
    logger: EggLogger;


    async editInfo(ruleFormEdit: any,school_code:string): Promise<any > {
        // const conn = await this.mysql.beginTransaction(); // 初始化事务
        try {

            for (const item of ruleFormEdit) {
                const options = {
                    where: {
                        school_code: school_code,
                        id:item.id
                    }
                };
                console.log('数组',item)
                const result = await this.mysql.update("xt",item,options)
                console.log('result', result)
                // null;
                return result.affectedRows === ruleFormEdit.length
            }

            // xt 表
            // UPDATE xt set service = '222' WHERE school_code= :school_code
        } catch (e) {
            console.log('eeeeeeeeeeeeeeeee', e)
            throw e
        }

    }


}

export interface editSchoolInfo {
    ruleFormEdit: any,
    school_code:string
}
