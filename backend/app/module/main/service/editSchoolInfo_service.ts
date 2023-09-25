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


    async editInfo(ruleFormEdit: any,school_code:string): Promise<any> {
        const conn = await this.mysql.beginTransaction(); // 初始化事务
        try {
            for (const item of ruleFormEdit) {
                const options = {
                    where: {
                        school_code: school_code,
                        id:item.id
                    }
                };
                if (item.id){
                    const result = await conn.update("xt",item,options)
                    if (result.affectedRows!==1){
                        throw new Error("Method not implemented.")
                    }
                }else {
                    const result2 = await conn.insert('xt', item );
                    if (result2.affectedRows!==1){
                        throw new Error("Method not implemented.")
                    }
                }
            }
            await conn.commit(); // 提交事务
        } catch (e) {
            console.log('eeeeeeeeeeeeeeeee', e)
            await conn.rollback()//捕获异常后回滚事务！！
            throw e
        }

    }


}

export interface editSchoolInfo {
    ruleFormEdit: any,
    school_code:string
}
