import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { EggLogger } from 'egg';
import { Validator } from '../../../../typings';
import { addSchoolInfo_service } from '@/module/main/service/addSchoolInfo_service';
import helper from '../../../extend/helper';

@HTTPController({
    path: '/school',
})

export class addSchoolController {
    @Inject()
    logger: EggLogger;
    @Inject()
    validator: Validator;
    @Inject()
    addSchoolServer: addSchoolInfo_service;

    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: '/addInfo',
    })
    async addInfo(@Context() _, @HTTPBody() body: AddInfoParam): Promise<any> {
        let ng = helper.makeControllerResponse(null);
        // // const result = this.validator.validate(rule, body);
        // if (result) {
        //     ng.msg = "入参不正确";
        //     ng.success = false;
        //     ng.data = result;
        //     return ng;
        // }
        const { ruleFormAdd } = body;
        console.log(ruleFormAdd)
        let addSchoolInfo
        try {
              addSchoolInfo = await this.addSchoolServer.addInfo(ruleFormAdd);

        }catch (e) {
            ng.msg="提交信息异常"
            ng.success=false
            return ng
        }
        ng.data = addSchoolInfo!
        return ng
    }
}

export interface AddInfoParam {
    ruleFormAdd: object
}
