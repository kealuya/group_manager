import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { EggLogger } from 'egg';
import { Validator } from '../../../../typings';
import { workStage_service } from '@/module/main/service/workStage_service';
import helper from '../../../extend/helper';

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
    async addInfo(@Context() _, @HTTPBody() body: AddInfoParam):Promise<any>{
        let ng = helper.makeControllerResponse(null);
        const { addData } = body;
        console.log(addData)
        let addSchoolInfo
        try {
            addSchoolInfo = await this.workStageService.addInfo(addData);

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
    addData: object
}
