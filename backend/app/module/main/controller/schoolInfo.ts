import { EggLogger } from "egg";
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from "@eggjs/tegg";
import { SchoolInfo_service } from "@/module/main/service/schoolInfo_service";
import { ControllerResponse } from "@/module/main/controller/index";
import helper from "../../../extend/helper";
import { Validator } from "../../../../typings";
import {SchoolList} from "@/module/main/service/schoolList"


@HTTPController({
    path: "/school"
})

export class schoolInfoController {
    @Inject()
    logger: EggLogger;
    @Inject()
    schoolInfoService: SchoolInfo_service;
    @Inject()
    validator: Validator;
    @Inject()
    schoolServer:SchoolList


    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: "/getInfo"
    })
    async getInfo(@Context() _, @HTTPBody() body: InfoParam): Promise<ControllerResponse> {
        const rule = {
            school: {
                required: true,
                type: "string"
            }
        };
        let ng = helper.makeControllerResponse(null);
        const result = this.validator.validate(rule, body);
        if (result) {
            ng.msg = "入参不正确";
            ng.success = false;
            ng.data = result;
            return ng;
        }
        const { school } = body;
        const schoolInfo = await this.schoolInfoService.getInfo(school);
        ng.data = schoolInfo!;
        return ng;
    }

    //根据学校名称获取学校code
    @HTTPMethod({
        method: HTTPMethodEnum.POST,
        path: "/getSchoolCodeInfo"
    })
    async getSchoolCodeInfo(@Context() _, @HTTPBody() body: codeInfoParam): Promise<ControllerResponse> {
        let ng = helper.makeControllerResponse(null);
        try {
            const { school_name } = body;
            const schoolCodeInfo = await this.schoolInfoService.getSchoolCodeInfo(school_name);
            ng.data = schoolCodeInfo!;
            console.log('schoolCodeInfo',schoolCodeInfo)
            return ng;
        }catch (e) {
            ng.success = false
            ng.msg = JSON.stringify(e);
            return ng
        }
    }




    //获取学校列表
    @HTTPMethod({
        method:HTTPMethodEnum.POST,
        path:"/list"
    })
    async getList(@Context() _,@HTTPBody() body:listParam): Promise<ControllerResponse> {
        const rule = {
            code:{
                required:true,
                type:"string"
            },
            isOwner:{
                required: true,
                type: "boolean"
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
        const {code,isOwner} = body
        const schoolInfo = await this.schoolServer.getList(code,isOwner)
        ng.data = schoolInfo!
        return ng
    }


}

export interface InfoParam {
    school: string;
}
export interface codeInfoParam{
    school_name:string
}
export interface listParam {
    code:string;
    isOwner:boolean;
}
