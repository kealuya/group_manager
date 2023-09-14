import { EggLogger } from "egg";
import { AccessLevel, Inject, SingletonProto } from "@eggjs/tegg";
import { EggMySQL } from "egg-mysql";

@SingletonProto({
    // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
    accessLevel: AccessLevel.PUBLIC
})
export class FileService {

    @Inject()
    mysql: EggMySQL;

    // 注入一个 logger
    @Inject()
    logger: EggLogger;


    // 封装业务
    async getDocFileListByCondition(pageSize: number, page: number,
                                    sortCol: { [key: string]: string },
                                    search: string): Promise<any> {

        let sqlForCount = `
                SELECT
                  count(*) as count
                FROM
                    doc doc
                    INNER JOIN ( SELECT f1.* FROM file f1,
                    ( SELECT doc_id  ,MAX( version ) AS version1 FROM file GROUP BY doc_id ) ff WHERE f1.version = ff.version1 and f1.doc_id = ff.doc_id ) f
                    ON doc.doc_id = f.doc_id
                WHERE
                    doc.is_discard = 'false' 
                    AND doc.is_release = 'true' 
            
         `;

        const countObj = await this.mysql.query(sqlForCount);

        let where = "";
        let whereParam = "";
        if (search == "" || search == null) {
            ;
        } else {
            where = " AND ( doc_name like :where1 OR update_user like :where1 OR owner like :where1 )";
            whereParam = search;
        }

        let orderBy = "";
        if (Object.keys(sortCol).length !== 0) {
            if (sortCol[Object.keys(sortCol)[0]].indexOf("desc") >= 0) {
                orderBy = Object.keys(sortCol)[0] + " DESC";
            } else {
                orderBy = Object.keys(sortCol)[0] + " ASC";
            }
        } else {
            orderBy = " update_time desc ";
        }

        let sqlForSearch = `
                SELECT
                    *,
                    u1.name AS owner,
                    u2.name AS update_user 
                FROM
                    doc doc
                    INNER JOIN ( SELECT f1.* FROM file f1,
                    ( SELECT doc_id  ,MAX( version ) AS version FROM file GROUP BY doc_id ) ff WHERE f1.version = ff.version and f1.doc_id = ff.doc_id ) f
                    ON doc.doc_id = f.doc_id
                    LEFT JOIN user u1 ON doc.owner_id = u1.code
                    LEFT JOIN user u2 ON f.update_user_id = u2.code 
                WHERE
                    doc.is_discard = 'false' 
                    AND doc.is_release = 'true' 
                    ${where}
                ORDER BY
                    ${orderBy}
                    LIMIT :limit1,:limit2
        `;

        // console.log(sqlForSearch);
        const result = await this.mysql.query(sqlForSearch, {
            limit1: (page - 1) * pageSize,
            limit2: pageSize,
            where1: whereParam
        });

        if (result.length > 0) {
            // 通过doc 获取 file中 的修改记录 ，取前5个
            for (let i = 0; i < result.length; i++) {
                result[i]["update_content_list"] = await this.mysql.query(
                  "select version_show as versionShow, update_content as updateContent from file where doc_id = :doc_id order by update_date desc limit 5",
                  { doc_id: result[i].doc_id });
            }

            return { docFiles: result, count: countObj[0].count };
        }

        return null;
    }
}


export interface UserInfo {
    id: number;
    code: string;
    name: string;
    role: string;
    password?: string;
}
