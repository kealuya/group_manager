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
      jwt 测试
     */
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: "/test"
    })
    async test(): Promise<ControllerResponse> {
        return helper.makeControllerResponse(null);
    }


}

export interface PagingInfo {
    proId: number;
    page: number;
    pageSize: number;
    sortCol: { [key: string]: string };
    search: string;
}





