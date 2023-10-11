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

    // 根据学校编码获取学校信息
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

        if (result.length > 0){
            return result
        }
        return null
    }
    async getSchoolCodeInfo(school_name:string):Promise<Array<SchoolCodeInfo>|null>{
        const result1 = await this.mysql.query<Array<SchoolCodeInfo>>(
            `SELECT * FROM school WHERE school_name LIKE :school_name`,{
                school_name: "%"+school_name+"%"
            });
        console.log('result1result1result1',result1)
        if (result1.length > 0){
            return result1
        }
        return null
    }



}
export interface SchoolInfo {
    school: string;
}
export interface SchoolCodeInfo {
    school_name: string;
}
