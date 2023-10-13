import { EggAppConfig, EggLogger } from "egg";
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from "@eggjs/tegg";
import { ControllerResponse } from "@/module/main/controller/index";
import helper from "../../../extend/helper";
import { FileService } from "@/module/main/service/file_service";

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
      查询文件
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
      查询文件
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


