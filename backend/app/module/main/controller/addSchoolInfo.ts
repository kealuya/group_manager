import {Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { EggLogger } from 'egg'
import { Validator } from '../../../../typings';
import { addSchoolInfo_service } from '@/module/main/service/addSchoolInfo_service';
import { ControllerResponse } from '@/module/main/controller/index';
import helper from '../../../extend/helper';

@HTTPController({
    path:"/school"
})

export class addSchoolController {
    @Inject()
    logger:EggLogger;
    @Inject()
    validator:Validator;
    @Inject()
    addSchoolServer:addSchoolInfo_service;

    @HTTPMethod({
        method:HTTPMethodEnum.POST,
        path:"addInfo"
    })
    async addInfo(@Context() _, @HTTPBody() body:AddInfoParam):Promise<ControllerResponse>{
        const rule = {
            school:{
                required: true,
                type: "string"
            },
            fzr1:{
                required: true,
                type:"string"
            }
        };
        let ng = helper.makeControllerResponse(null)
        const result = this.validator.validate(rule, body);
        if (result) {
            ng.msg = "入参不正确";
            ng.success = false;
            ng.data = result;
            return ng;
        }
        const {school,fzr1} = body;
        const addSchoolInfo = await this.addSchoolServer.addInfo(school,fzr1)
        ng.data = addSchoolInfo!
     }
}
export interface AddInfoParam {
    school: string;
    fzr1:string
}
