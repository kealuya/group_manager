import { EggAppConfig, EggLogger } from "egg";
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from "@eggjs/tegg";
import { User_service } from "@/module/main/service/user_service";
import { JWT, Validator } from "../../../../typings";
import { ControllerResponse } from "@/module/main/controller/index";
import helper from "../../../extend/helper";

@HTTPController({
  path: "/user"
})
export class UserController {
  @Inject()
  logger: EggLogger;
  @Inject()
  userService: User_service;
  @Inject()
  jwt: JWT;
  @Inject()
  config: EggAppConfig;
  @Inject()
  validator: Validator;


  /*
    登录验证
   */
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: "/login"
  })
  async login(@Context() _, @HTTPBody() body: LoginParam): Promise<ControllerResponse> {
    // this.logger.info(body);
    const rule = {
      username: {
        required: true,
        type: "string"
      },
      password: {
        required: true,
        type: "string"
      }
    };

    let cr = helper.makeControllerResponse(null);

    const result = this.validator.validate(rule, body);

    if (result) {
      // 参数错误处理
      cr.msg = "入参不正确";
      cr.success = false;
      cr.data = result;

      return cr;
    }


    const { username, password } = body;

    const userInfo = await this.userService.login(username, password);


    if (userInfo != null) {
      delete userInfo.password;
      const jwt = this.jwt.sign(JSON.stringify(userInfo), this.config.jwt.secret);

      cr.data = { jwt, ...userInfo };
      return cr;
    }
    // 业务错误处理
    cr.msg = "无用户";
    cr.success = false;
    return cr;
  }


  /*
    jwt 测试
   */
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: "/test"
  })
  async test(): Promise<ControllerResponse> {
    return helper.makeControllerResponse(null);
  }


}

export interface LoginParam {
  username: string;
  password: string;
}





