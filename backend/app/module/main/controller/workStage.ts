import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { EggLogger } from 'egg';
import { Validator } from '../../../../typings';
import { workStage_service } from '@/module/main/service/workStage_service';
import helper from '../../../extend/helper';
import { ControllerResponse } from '@/module/main/controller/index';
import * as fs from "fs";

@HTTPController({
    path: '/work',
})

export class workStageController {
    @Inject()
    logger: EggLogger;
    @Inject()
    validator: Validator;
    @Inject()
    workStageService: workStage_service

    // 新建项目
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: '/addInfo',
    })
    async addInfo(@Context() _, @HTTPBody() body: AddInfoParam): Promise<any> {
        let ng = helper.makeControllerResponse(null);
        const { addData } = body;
        let addWorkInfo
        try {
            addWorkInfo = await this.workStageService.addInfo(addData);

        } catch (e) {
            ng.msg = '提交信息异常'
            ng.success = false
            return ng
        }
        ng.data = addWorkInfo!
        return ng
    }

    // 新建项目上传文件部分
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: '/uploadFile',
    })
    async upload(@Context() ctx, @HTTPBody() body: any): Promise<ControllerResponse> {
        console.log('body',body)
        console.log('got %d files', ctx.request.files.length);

        let result
        let fileNameArray :Array<string> = [];//返回给前台的filename数组
        const targetPath = `D:\\work_project\\program\\group_manager\\backend\\app`
        for (const file of ctx.request.files){
            console.log('field: ' + file.field);
            console.log('filename: ' + file.filename);
            console.log('encoding: ' + file.encoding);
            console.log('mime: ' + file.mime);
            console.log('tmp filepath: ' + file.filepath);
            try {
                const reader = fs.createReadStream(file.filepath);//读取文件，返回文件流
                let path1 = `${new Date().getTime()}-${file.filename}`
                let filePath = targetPath + "/public/upload/" + path1;
                const upStream = fs.createWriteStream(filePath);// 创建可写流，传入路径
                reader.pipe(upStream);//通过管道，完成存储
                console.log('filePath',filePath)
                fileNameArray.push(path1)
            }finally {
                setTimeout(async () => {
                    // 需要删除临时文件
                    await fs.unlink(file.filepath, () => {
                    });
                }, 10);
            }
            console.log(result);
        }
        let ng = helper.makeControllerResponse({ fileNameArray });
        console.log('返回的路径',ng)
        return ng
    }

    //编辑项目
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: '/editInfo',
    })
    async editInfo(@Context() _, @HTTPBody() body: EditInfoParam): Promise<any> {
        let ng = helper.makeControllerResponse(null);
        const { editData } = body;
        let editWorkInfo
        try {
            editWorkInfo = await this.workStageService.editInfo(editData);

        } catch (e) {
            console.log(e)
            ng.msg = '提交信息异常'
            ng.success = false
            return ng
        }
        ng.data = editWorkInfo!
        return ng
    }

    //删除项目
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: '/deleteInfo',
    })
    async deleteInfo(@Context() _, @HTTPBody() body: DeleteInfoParam): Promise<any> {
        let ng = helper.makeControllerResponse(null);
        const { id } = body;
        let deleteWorkInfo
        try {
            deleteWorkInfo = await this.workStageService.deleteInfo(id);

        } catch (e) {
            console.log(e)
            ng.msg = '提交信息异常'
            ng.success = false
            return ng
        }
        ng.data = deleteWorkInfo!
        return ng
    }


    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: '/getList',
    })
    async getList(@Context() _, @HTTPBody() body: workListParam): Promise<ControllerResponse> {
        let ng = helper.makeControllerResponse(null);
        const rule = {
            search:{
                required:false,
                type:"string"
            },
            page:{
                required: true,
                type: "number"
            },
            pageSize:{
                required: true,
                type: "number"
            },
            owner:{
                required:false,
                type:"string"
            }
        }
        const result = this.validator.validate(rule,body)
        if (result){
            ng.msg = "入参不正确";
            ng.success = false;
            ng.data = result;
            return ng
        }
        const { search,page,pageSize,owner } = body;
        let workList
        try {
            workList = await this.workStageService.getList(search,page,pageSize,owner);
        } catch (e) {
            console.log(e)
            ng.msg = '提交信息异常'
            ng.success = false
            return ng
        }
        ng.data = workList!
        return ng
    }


}

export interface AddInfoParam {
    addData: object
}
export interface EditInfoParam {
    editData: object
}
export interface DeleteInfoParam {
    id: number
}
export interface workListParam {
    search:string;
    page:number;
    pageSize:number;
    owner:string;
}
