import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggMySQL } from "egg-mysql";
import { EggLogger } from 'egg';

@SingletonProto({
    accessLevel:AccessLevel.PUBLIC
})

export class addSchoolInfo_service{
    @Inject()
    mysql:EggMySQL
    @Inject()
    logger: EggLogger;


    async addInfo(school:string,fzr1:string):Promise<Array<addSchoolInfo>|null>{
        const result = await this.mysql.query<Array<addSchoolInfo>>("",{
            school:school,
            fzr1:fzr1
        });
        if (result.length > 0){
            return result
        }
        return null
    }


}
export interface addSchoolInfo {
    school: string;
    fzr1:string
}
