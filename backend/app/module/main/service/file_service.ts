import { EggLogger } from "egg";
import { AccessLevel, Inject, SingletonProto } from "@eggjs/tegg";
import { EggMySQL } from "egg-mysql";
import { DocFile } from "@/module/main/controller/file";
import moment from "moment";

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


    async updateDocHandler(docFile: DocFile): Promise<any> {
        // 获取file的最大version
        let resultForMaxId = await this.mysql.queryOne("select max(version) as version from file where doc_id = :doc_id", { doc_id: docFile.docId });

        if (resultForMaxId.version == null) {
            // 业务异常，通过throw传达给父类统一处理
            throw new Error("resultForMaxId.version == null ::" + JSON.stringify(docFile.docId));
        }
        //
        // file处理
        const resultForUpdateFile = await this.mysql.insert("file", {
            doc_id: docFile.docId,// 自动返回自增主键
            version: resultForMaxId.version + 1,
            version_show: docFile.versionShow,
            update_content: docFile.updateContent,
            update_user_id: docFile.ownerId,
            update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            file_name: docFile.fileName
        });

        if (resultForUpdateFile.affectedRows != 1) {
            console.log("resultForUpdateFile.affectedRows!=1");
            // 业务异常，通过throw传达给父类统一处理
            throw new Error("resultForUpdateFile.affectedRows!=1 ::" + JSON.stringify(docFile));
        }


    }

    async newDocHandler(docFile: DocFile): Promise<any> {
        const conn = await this.mysql.beginTransaction(); // 初始化事务
        try {
            // doc处理 fileName , docName , docType , ownerId ,proId 传过来
            const resultForDoc = await conn.insert("doc", {
                doc_name: docFile.docName,
                owner_id: docFile.ownerId,
                create_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                doc_type: docFile.docType,
                is_release: "true",
                is_owner_edit: "true",
                pro_id: docFile.proId,
                is_discard: "false"
            });

            if (resultForDoc.affectedRows != 1) {
                // console.log("result.affectedRows!=1");
                // 业务异常，通过throw传达给父类统一处理
                throw new Error("resultForDoc.affectedRows != 1 ::" + JSON.stringify(docFile));
            }

            // file处理
            const resultForFile = await conn.insert("file", {
                doc_id: resultForDoc.insertId,// 自动返回自增主键
                version: 1,
                version_show: docFile.versionShow,
                update_content: "初始化",
                update_user_id: docFile.ownerId,
                update_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                file_name: docFile.fileName
            });

            if (resultForFile.affectedRows != 1) {
                console.log("resultForFile.affectedRows!=1");
                // 业务异常，通过throw传达给父类统一处理
                throw new Error("resultForFile.affectedRows!=1 ::" + JSON.stringify(docFile));
            }

            await conn.commit();

        } catch (e) {
            await conn.rollback();
            this.logger.error("newDocHandler发生错误::", e, JSON.stringify(docFile));
            throw e;
        }

    }

    // 封装业务
    async getDocFileListByCondition(pageSize: number, page: number,
                                    sortCol: { [key: string]: string },
                                    search: string): Promise<any> {

        let where = "";
        let whereParam = "";
        if (search == "" || search == null) {
            // @ts-ignore
            ;
        } else {
            where = " AND ( doc_name like :where1 OR u1.name like :where1 OR u2.name like :where1 )";
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

        let sqlForCount = `
                SELECT
                    count(*) as count
                FROM
                    doc doc
                    INNER JOIN ( SELECT f1.* FROM file f1,
                    ( SELECT doc_id  ,MAX( version ) AS version1 FROM file GROUP BY doc_id ) ff WHERE f1.version = ff.version1 and f1.doc_id = ff.doc_id ) f
                    ON doc.doc_id = f.doc_id
                    LEFT JOIN user u1 ON doc.owner_id = u1.code
                    LEFT JOIN user u2 ON f.update_user_id = u2.code 
                WHERE
                    doc.is_discard = 'false' 
                    AND doc.is_release = 'true' 
                    ${where}
         `;

        const countObj = await this.mysql.query(sqlForCount, {
            where1: "%" + whereParam + "%"
        });


        let sqlForSearch = `
                SELECT
                    *,
                    date_format( create_date, '%Y-%m-%d %T' ) AS create_date,
                    date_format( update_date, '%Y-%m-%d %T' ) AS update_date,
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

        const result = await this.mysql.query(sqlForSearch, {
            limit1: (page - 1) * pageSize,
            limit2: pageSize,
            where1: "%" + whereParam + "%"
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
