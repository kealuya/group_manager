import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggLogger } from 'egg';
import { EggMySQL } from "egg-mysql";

@SingletonProto({
    accessLevel:AccessLevel.PUBLIC
})

export class SchoolList{
    // 注入一个 logger
    @Inject()
    logger: EggLogger;
    @Inject()
    mysql: EggMySQL;


    async getList(schoolName:string,schoolCode:number): Promise<SchoolInfo | null>{
        const result = await this.mysql.query<Array<SchoolInfo>>("SELECT * FROM school",{
            schoolName:schoolName,
            schoolCode:schoolCode
        });
        if (result.length > 0){
            return result[0]
        }
        return null
    }


}
export interface SchoolInfo {
    schoolCode: string;
    schoolName: number;
}
