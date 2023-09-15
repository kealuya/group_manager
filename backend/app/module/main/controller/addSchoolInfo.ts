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

        console.log(4234234)


        // const rule = {
        //     ruleFormAdd:{
        //         required:true,
        //         type:"object"
        //     }
        //     // school: {
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // fzr1: {
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // fzr2: {
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // xt: {
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // buildStage: {
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // service:{
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // fwsxy_start_date:{
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // fwsxy_end_date:{
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // qtxy:{
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //     // remark:{
        //     //     required: true,
        //     //     type: "string"
        //     // },
        //
        //
        // };
        let ng = helper.makeControllerResponse(null);
        // // const result = this.validator.validate(rule, body);
        // if (result) {
        //     ng.msg = "入参不正确";
        //     ng.success = false;
        //     ng.data = result;
        //     return ng;
        // }
        // school, fzr1,fzr2,xt,buildStage,service,fwsxy_start_date,fwsxy_end_date,qtxy,remark
        const { ruleFormAdd } = body;
        console.log(ruleFormAdd)
        const addSchoolInfo = await this.addSchoolServer.addInfo(ruleFormAdd);
        // ng.data = addSchoolInfo!;
        ng.data = addSchoolInfo!
        return ng
    }
}

export interface AddInfoParam {
    ruleFormAdd: object
    // school: string;
    // fzr1: string;
    // fzr2:string;
    // xt:string;
    // buildStage:string;
    // service:string;
    // fwsxy_start_date:string;
    // fwsxy_end_date:string;
    // qtxy:string;
    // remark:string;
}
