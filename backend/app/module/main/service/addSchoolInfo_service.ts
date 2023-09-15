import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
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


    async addInfo(ruleFormAdd:object): Promise<Array<addSchoolInfo> | null> {

        const a = Object.keys(ruleFormAdd)
        const b = Object.values(ruleFormAdd)
        console.log('55555555555555555',a)
        console.log('66666666666666666',ruleFormAdd)

        let sql = `INSERT INTO xt (` +(a)+ `) VALUES (` +(b)+ `)`


        const result = await this.mysql.query<Array<addSchoolInfo>>(sql, {
            ...ruleFormAdd,
        });
        if (result.length > 0) {
            return result
        }
        return null
    }


}

export interface addSchoolInfo {
    ruleFormAdd: object
    // school: string;
    // fzr1:string;
    // fzr2:string;
    // xt:string;
    // buildStage:string;
    // service:string;
    // fwsxy_start_date:string;
    // fwsxy_end_date:string;
    // qtxy:string;
    // remark:string;
}
