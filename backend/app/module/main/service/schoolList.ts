import { AccessLevel, Inject, SingletonProto } from "@eggjs/tegg";
import { EggLogger } from "egg";
import { EggMySQL } from "egg-mysql";

@SingletonProto({
    accessLevel: AccessLevel.PUBLIC
})

export class SchoolList {
    // 注入一个 logger
    @Inject()
    logger: EggLogger;
    @Inject()
    mysql: EggMySQL;
    async getList(code: string, isOwner: boolean): Promise<Array<SchoolInfo> | null> {

        const sql1 = `SELECT DISTINCT
                         b.school_name,
                         b.school_code,
                         b.bz
                        FROM
                         xt a
                         INNER JOIN school b ON a.school_code = b.school_code `;
        // left join 查询 会导致 出现空记录，在前端处理时，数组内有一条对象，但是schoolname、code都为空，需要改成inner join就不会有空数据 ren
        // INNER JOIN user c ON a.fzr1 = c.CODE  or a.fzr2 = c.CODE
        const sql2 = `WHERE 
                       a.fzr1 = :code  
                        OR a.fzr2 = :code `;

        let sql = "";
        if (isOwner) {
            sql = sql1 + sql2;

        } else {
            sql = sql1;

        }


        const result = await this.mysql.query<Array<SchoolInfo>>(sql,
          {
              code: code,
              isOwner: isOwner
          });
        if (result.length > 0) {
            return result;
        }
        return null;
    }


}

export interface SchoolInfo {
    school_code: number;
}
