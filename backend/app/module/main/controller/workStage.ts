import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { EggLogger } from 'egg';
import { Validator } from '../../../../typings';
import { workStage_service } from '@/module/main/service/workStage_service';
import helper from '../../../extend/helper';
import { ControllerResponse } from '@/module/main/controller/index';

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
            }
        }
        const result = this.validator.validate(rule,body)
        if (result){
            ng.msg = "入参不正确";
            ng.success = false;
            ng.data = result;
            return ng
        }
        const { search,page,pageSize } = body;
        let workList
        try {
            workList = await this.workStageService.getList(search,page,pageSize);
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
export interface workListParam {
    search:string;
    page:number;
    pageSize:number;
}
