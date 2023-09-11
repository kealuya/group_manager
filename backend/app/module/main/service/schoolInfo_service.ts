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

    async getInfo(school:string):Promise<schoolInfo|null>{
        const  result = await this.mysql.query<Array<schoolInfo>>("",{
            school:school
        });
        if (result.length > 0){
            return result[0];
        }
        return null
    }
}
export interface schoolInfo {
    school: string;

}
