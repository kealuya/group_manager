import {Application, Context, EggAppConfig } from "egg";
import helper from "../extend/helper";

/*
  jwt验证 且获取错误
 */
export default function jwt_check(_: EggAppConfig, app: Application): any {

  return async (ctx: Context, next: () => Promise<any>) => {

    // 这些地址可以过滤掉，比如登录，报错，测试等
    const exceptJwtUrl = ["/user/login", "/error"];

    if (exceptJwtUrl.includes(ctx.request.url)) {
      await next();
      return;
    }

    // 首先从header去的auth
    const jwt = ctx.request.header.authorization;
    if (jwt) {
      try {
        // 解码token
        const decode = app.jwt.verify(jwt, app.config.jwt.secret);
        console.log(decode);
        // try包括了这里的next ，后续的错误统一在这里获取
        await next();
      } catch (error) {
        ctx.logger.error(error);
        ctx.status = 400;
        let re = helper.makeControllerResponse(null);
        re.msg =  "发生预料外的错误"
        re.success = false;
        ctx.body = error;
        return;
      }
    } else {
      ctx.status = 401;
      let re = helper.makeControllerResponse(null);
      re.msg = "没有token";
      re.success = false;
      ctx.body = re;
      return;
    }

  };
}
