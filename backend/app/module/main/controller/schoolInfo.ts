import { EggLogger } from 'egg';
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { SchoolInfo_service} from "@/module/main/service/schoolInfo_service"
import { ControllerResponse } from '@/module/main/controller/index';
import helper from '../../../extend/helper';
import { Validator } from '../../../../typings';

@HTTPController({
    path:"school"
})

export class schoolInfoController {
    @Inject()
    logger:EggLogger;
    @Inject()
    schoolInfoService: SchoolInfo_service;
    @Inject()
    validator: Validator;


    @HTTPMethod({
        method:HTTPMethodEnum.POST,
        path:"info"
    })
    async getInfo(@Context() _,@HTTPBody() body:InfoParam):Promise<ControllerResponse>{
        const rule = {
            school:{
                required:true,
                type:"string"
            }
        };
        let ng = helper.makeControllerResponse(null);
        const result = this.validator.validate(rule,body);
        if (result){
            ng.msg = "入参不正确";
            ng.success = false;
            ng.data = result;
            return ng
        }
        const {school} = body;
        const schoolInfo = await this.schoolInfoService.getInfo(school);
        ng.data = schoolInfo!
        return ng
    }
}
export interface InfoParam{
    school:string
}
