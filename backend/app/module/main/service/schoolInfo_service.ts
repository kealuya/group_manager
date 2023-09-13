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
        const result = await this.mysql.query<Array<SchoolInfo>>("SELECT * FROM `xt` WHERE school_code=:school",{
            school:school
        });
        if (result.length > 0){
            return result
        }
        return null
    }
}
export interface SchoolInfo {
    school: string;

}
