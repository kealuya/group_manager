import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggMySQL } from "egg-mysql";
import { EggLogger } from 'egg';

@SingletonProto({
    accessLevel:AccessLevel.PUBLIC
})
export class SchoolInfo_service{
    @Inject()
    mysql:EggMySQL;
    @Inject()
    logger: EggLogger;

    async getInfo(school:string):Promise<Array<SchoolInfo> | null>{
        const result = await this.mysql.query<Array<SchoolInfo>>(
          `SELECT
            school_code,
            id,
            service,
            xt,
            buildStage,
            qtxy,
            remark,
            fzr1,
            fzr2,
            date_format( create_date, '%Y-%m-%d %T' ) AS create_date,
            date_format( fwsxy_start_date, '%Y-%m-%d %T' ) AS fwsxy_start_date,
            date_format( fwsxy_end_date, '%Y-%m-%d %T' ) AS fwsxy_end_date 
        FROM
            xt
         WHERE school_code=:school`,{
            school:school
        });

        this.logger.info(result)

        if (result.length > 0){
            return result
        }
        return null
    }
}
export interface SchoolInfo {
    school: string;

}
