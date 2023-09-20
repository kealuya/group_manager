import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggLogger } from 'egg';
import { EggMySQL } from 'egg-mysql';

@SingletonProto({
    accessLevel: AccessLevel.PUBLIC,
})

export class UserList {
    // 注入一个 logger
    @Inject()
    logger: EggLogger;
    @Inject()
    mysql: EggMySQL;


    async getList(): Promise<Array<UserList> | null> {
        const result = await this.mysql.query<Array<UserList>>("SELECT * FROM `user`");
        if (result.length > 0){
            return result
        }
        return null
    }


}

export interface UserList {
    // schoolCode: string;
    school_code: number;
}
