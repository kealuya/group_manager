import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggLogger } from 'egg';
import { EggMySQL } from 'egg-mysql';

@SingletonProto({
    accessLevel: AccessLevel.PUBLIC,
})

export class DeleteSchool {
    // 注入一个 logger
    @Inject()
    logger: EggLogger;
    @Inject()
    mysql: EggMySQL;


    async deleteSchool(school_code: string, id: number): Promise<any> {
        const conn = await this.mysql.beginTransaction(); // 初始化事务
        try {
            if (id){
                const result = await conn.delete('xt',{
                    school_code :school_code,
                    id:id
                })
                console.log('删除单独模块时的result',result)
            }else {
                const result = await conn.delete('xt',{
                    school_code :school_code,
                })
                const result2 = await conn.delete('school',{
                    school_code:school_code
                })
                console.log('删除整个学校时的result',result,result2)
            }
            await conn.commit(); // 提交事务
        }catch (e) {
            console.log('eeeeeeeeeeeeeeeee', e)
            await conn.rollback()//捕获异常后回滚事务！！
            throw e
        }
    }
}

export interface DeleteSchool {
    school_code: string;
    id: number
}
