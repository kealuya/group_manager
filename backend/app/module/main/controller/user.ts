import { EggLogger } from "egg";
import { Context, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from "@eggjs/tegg";
import { UserService } from "@/module/main/service/UserService";

@HTTPController({
  path: "/user"
})
export class UserController {
  @Inject()
  logger: EggLogger;
  @Inject()
  userService: UserService;

  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: "/login"
  })
  async login(@Context() ctx, @HTTPBody() body: LoginParam) {
    // this.logger.info("hello egg logger");
    this.logger.info(body);
    this.logger.info(ctx);


    const userInfo = await this.userService.login("1666", "666");

    return userInfo;
  }
}

export interface LoginParam {
  code: string;
  password: string;
}
