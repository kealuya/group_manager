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


    async addInfo(ruleFormAdd: object): Promise<Array<addSchoolInfo> | null> {

        // const a = Object.keys(ruleFormAdd)
        // const b = Object.values(ruleFormAdd)
        // let sql1 = ``
        // school 表
        const result = await this.mysql.insert('school', { school_name: ruleFormAdd["school_name"],school_code: ruleFormAdd["school_code"] });
        // const result = await this.mysql.query<Array<addSchoolInfo>>("INSERT INTO school (school_name,school_code) VALUES (':school_name',':school_code')",{
        //     school_name:ruleFormAdd["school_name"],
        //     school_code:ruleFormAdd["school_code"]
        // });
        console.log('result',result)


        const ruleFormAdd2 = JSON.parse(JSON.stringify(ruleFormAdd))
        delete ruleFormAdd2['school_name']



        //
        // const a2 = Object.keys(ruleFormAdd2)
        // const b2 = Object.values(ruleFormAdd2)
        // let sql = `INSERT INTO xt (` + (a2) + `) VALUES (` + (b2) + `)`

        // xt 表
        // const result2 = await this.mysql.query<Array<addSchoolInfo>>(sql,ruleFormAdd2);
        const result2 = await this.mysql.insert('xt', ruleFormAdd2);

        console.log('result2',result2)
        // if (result.length > 0) {

        // }
        // if (result2.length > 0) {
        //     return result2
        // }
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
