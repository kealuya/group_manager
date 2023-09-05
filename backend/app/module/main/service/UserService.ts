import { EggLogger } from "egg";
import { AccessLevel, Inject, SingletonProto } from "@eggjs/tegg";
import { EggMySQL } from "egg-mysql";

@SingletonProto({
  // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
  accessLevel: AccessLevel.PUBLIC
})
export class UserService {


  @Inject()
  mysql: EggMySQL;

  // 注入一个 logger
  @Inject()
  logger: EggLogger;

  // 封装业务
  async login(code: string, password: string): Promise<UserInfo | null> {
    const result = await this.mysql.query<Array<UserInfo>>("select * from user where code=:code and password=:password", {
      code: code,
      password: password
    });
    if (result.length > 0) {
      return result[0];
    }

    return null;
  }
}


export interface UserInfo {
  id: number;
  code: string;
  name: string;
  role: string;
}
