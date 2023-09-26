import { EggLogger } from 'egg'
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { ControllerResponse } from '@/module/main/controller/index';
import helper from '../../../extend/helper';
import { Validator } from '../../../../typings';
import {DeleteSchool} from "@/module/main/service/deleteSchool_service"

@HTTPController({
    path:"/school"
})

export class deleteSchoolController {

    @Inject()
    logger: EggLogger;
    @Inject()
    validator: Validator;
    @Inject()
    deleteSchoolServer:DeleteSchool

    @HTTPMethod({
        method:HTTPMethodEnum.POST,
        path:"/delete"
    })
    async deleteSchoolAll(@Context() _,@HTTPBody() body:deleteParam): Promise<ControllerResponse> {
        const rule = {
            school_code:{
                required:true,
                type:"string"
            },
            id:{
                required: false,
                type: "number"
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
        const {school_code,id} = body
        const deleteInfo = await this.deleteSchoolServer.deleteSchool(school_code,id)
        ng.data = deleteInfo!
        return ng
    }

}
export interface deleteParam {
    school_code:string;
    id:number;
}
