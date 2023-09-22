import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { EggLogger } from 'egg';
import { Validator } from '../../../../typings';
import { editSchoolInfo_service } from '@/module/main/service/editSchoolInfo_service';
import helper from '../../../extend/helper';

@HTTPController({
    path: '/school',
})

export class editSchoolController {
    @Inject()
    logger: EggLogger;
    @Inject()
    validator: Validator;
    @Inject()
    editSchoolServer: editSchoolInfo_service;

    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: '/editInfo',
    })
    async editInfo(@Context() _, @HTTPBody() body: EditInfoParam): Promise<any> {
        const rule = {
            ruleFormEditArray:{
                required:true,
                type:"array",
            },
            school_code:{
                required: true,
                type: "string"
            }
        }
        let ng = helper.makeControllerResponse(null);
        const result = this.validator.validate(rule, body);
        if (result) {
            ng.msg = "入参不正确";
            ng.success = false;
            ng.data = result;
            return ng;
        }
        const { ruleFormEditArray,school_code } = body;
        console.log(ruleFormEditArray)
        let editSchoolInfo
        try {
            editSchoolInfo = await this.editSchoolServer.editInfo(ruleFormEditArray,school_code);

        }catch (e) {
            ng.msg="提交信息异常"
            ng.success=false
            return ng
        }
        ng.data = editSchoolInfo!
        return ng
    }
}

export interface EditInfoParam {
    ruleFormEditArray: any,
    school_code:string
}
