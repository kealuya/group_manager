import {  AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { EggMySQL } from 'egg-mysql';
import { EggLogger } from 'egg';


@SingletonProto({
    accessLevel: AccessLevel.PUBLIC,
})

export class workStage_service {
    @Inject()
    mysql: EggMySQL
    @Inject()
    logger: EggLogger;


    async addInfo(addData:object):Promise<Array<addWorkInfo> | null>{
        try {
            const result = await this.mysql.insert('work',addData)

            // const insertSuccess = result.affectedRows === 1;
            if (result.affectedRows!==1){
                throw new Error("Method not implemented.")
            }
            return null
        }catch (e) {
            console.log('eeeeeeeeeeeeeeeee', e)
            throw e
        }

    }


}
export interface addWorkInfo {
    addData:object;

}
