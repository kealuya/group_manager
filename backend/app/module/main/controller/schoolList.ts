import { EggLogger } from 'egg'
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { ControllerResponse } from '@/module/main/controller/index';
import helper from '../../../extend/helper';
import { Validator } from '../../../../typings';
import {SchoolList} from "@/module/main/service/schoolList"

@HTTPController({
    path:"/school"
})

export class schoolController {

    @Inject()
    logger: EggLogger;
    @Inject()
    validator: Validator;
    @Inject()
    schoolServer:SchoolList

    @HTTPMethod({
        method:HTTPMethodEnum.POST,
        path:"/list"
    })
    async getList(@Context() _,@HTTPBody() body:listParam): Promise<ControllerResponse> {
        this.logger.info(body)
        const rule = {
            schoolName:{
                required:true,
                type:"String"
            },
            schoolCode:{
                required: true,
                type: "Number"
            }
        }
        let ng = helper.makeControllerResponse(null)
        const result = this.validator.validate(rule,body)
        if (result){
            ng.msg = "入参不正确";
            ng.success = false;
            ng.data = result;
            return ng
        }
         const {schoolName,schoolCode} = body
         const schoolInfo = await this.schoolServer.getList(schoolName,schoolCode)
        ng.data = schoolInfo!


        return ng
    }

}
export interface listParam {
    schoolName:string;
    schoolCode:number;
}
