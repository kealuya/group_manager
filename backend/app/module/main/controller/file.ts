import { EggAppConfig, EggLogger } from "egg";
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from "@eggjs/tegg";
import { ControllerResponse } from "@/module/main/controller/index";
import helper from "../../../extend/helper";
import { FileService } from "@/module/main/service/file_service";
import * as fs from "fs";

@HTTPController({
    path: "/file"
})
export class FileController {
    @Inject()
    logger: EggLogger;
    @Inject()
    fileService: FileService;
    @Inject()
    config: EggAppConfig;


    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: "/uploadFile"
    })
    async uploadFile(@Context() ctx, @HTTPBody() body: any): Promise<ControllerResponse> {
        // json数据获取

        let fileNameArray: Array<string> = [];
        fileNameArray.push("ddd");

        console.log(body);
        console.log("got %d files", ctx.request.files.length);
        // 修改实际路径
        const targetPath = `/Users/kealuya/mywork/my_git/group_manager/backend/app/`;
        for (const file of ctx.request.files) {
            console.log("field: " + file.fieldname);
            console.log("filename: " + file.filename);
            console.log("encoding: " + file.encoding);
            console.log("mime: " + file.mime);
            console.log("tmp filepath: " + file.filepath);
            let result;

            try {

                const reader = fs.createReadStream(file.filepath);//读取文件，返回文件流
                // eggjs 默认app/public 就是静态文件输出   http://127.0.0.1:7001/public/1.txt
                let filePath = targetPath + "public/upload/" + `${new Date().getTime()}-${file.filename}`;//创建文件的存储路径，并对文件进行重命名
                const upStream = fs.createWriteStream(filePath);// 创建可写流，传入路径
                reader.pipe(upStream);//通过管道，完成存储

            } finally {
                // eventloop下次循环再执行删除   ！！ 所有对与磁盘文件的操作都是异步操作，即使存储文件的命令执行完，也不代表真的执行完，需要再稍等一会。。。。
                setTimeout(async () => {
                    // 需要删除临时文件
                    await fs.unlink(file.filepath, () => {
                    });
                }, 10);

            }
            console.log(result);
        }

        let cr = helper.makeControllerResponse({ fileNameArray });
        // 业务错误处理
        return cr;
    }


    /*
      查询文件
     */
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: "/getDocList"
    })
    async login(@Context() ctx, @HTTPBody() body: PagingInfo): Promise<ControllerResponse> {
        console.log("用户:", ctx.session.userInfo);
        const { pageSize, page, sortCol, search } = body;

        const result = await this.fileService.getDocFileListByCondition(pageSize, page, sortCol, search);


        let cr = helper.makeControllerResponse(result);
        // 业务错误处理
        return cr;
    }


    /*
      文件更新
     */
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: "/updateDoc"
    })
    async updateDoc(@Context() ctx, @HTTPBody() body: DocFile): Promise<ControllerResponse> {
        console.log("用户:", ctx.session.userInfo);
        this.logger.info(body);
        console.log(body);
        let cr = helper.makeControllerResponse(null);
        // DocFile 处理
        try {
            await this.fileService.updateDocHandler(body);
        } catch (e) {
            cr.msg = "更新文档发生错误";
            cr.success = false;
        }

        // 业务错误处理
        return cr;
    }


    /*
      文件新建
     */
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: "/newDoc"
    })
    async newDoc(@Context() ctx, @HTTPBody() body: DocFile): Promise<ControllerResponse> {
        console.log("用户:", ctx.session.userInfo);
        this.logger.info(body);
        console.log(body);
        let cr = helper.makeControllerResponse(null);
        // DocFile 处理
        try {
            await this.fileService.newDocHandler(body);
        } catch (e) {
            cr.msg = "创建文档发生错误";
            cr.success = false;
        }

        // 业务错误处理
        return cr;
    }


    /*
      文件权限更新
     */
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: "/updateAuthorityDoc"
    })
    async updateAuthorityDoc(@Context() ctx, @HTTPBody() body: DocFile): Promise<ControllerResponse> {
        console.log("用户:", ctx.session.userInfo);
        this.logger.info(body);
        console.log(body);
        let cr = helper.makeControllerResponse(null);
        // DocFile 处理
        try {
            await this.fileService.updateAuthorityDocHandler(body);
        } catch (e) {
            cr.msg = "更新文档权限发生错误";
            cr.success = false;
            this.logger.error("updateAuthorityDoc发生错误::", e, JSON.stringify(body));
        }

        // 业务错误处理
        return cr;
    }


}

export interface PagingInfo {
    proId: number;
    page: number;
    pageSize: number;
    sortCol: { [key: string]: string };
    search: string;
}


export interface DocFile {
    docType: string;
    versionShow: string;
    docName: string;
    fileName: string;
    ownerId: string;
    docId: string;
    proId: string;
    createDate: string;
    isDiscard: string;
    isOwnerEdit: string;
    isRelease: string;
    owner: string;
    updateContent: string;
    updateDate: string;
    updateUser: string;
}


