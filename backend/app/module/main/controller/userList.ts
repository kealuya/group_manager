import { EggLogger } from 'egg'
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { ControllerResponse } from '@/module/main/controller/index';
import helper from '../../../extend/helper';
import { Validator } from '../../../../typings';
import {UserList} from "@/module/main/service/userList_service"

@HTTPController({
    path:"/user"
})

export class userListController {

    @Inject()
    logger: EggLogger;
    @Inject()
    validator: Validator;
    @Inject()
    schoolServer:UserList

    @HTTPMethod({
        method:HTTPMethodEnum.POST,
        path:"/list"
    })
    async getList(@Context() _,@HTTPBody() body:listParam): Promise<ControllerResponse> {
        this.logger.info(body)
        let ng = helper.makeControllerResponse(null)
        const schoolInfo = await this.schoolServer.getList()
        ng.data = schoolInfo!
        return ng
    }

}
export interface listParam {
    // code:string;
    // isOwner:boolean;
}
