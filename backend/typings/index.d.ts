import "egg";
import { IgnoreOrMatch } from "egg";

declare module "egg" {
  interface Application {
    jwt: JWT;
    validator: Validator;
  }

  interface EggAppConfig {
    jwt: {
      secret: string;
      enable?: boolean;
      sign?: SignOptions;
      verify?: VerifyOptions;
      ignore?: IgnoreOrMatch;
      match?: IgnoreOrMatch;
    };
  }


  interface Context {
    validate: (rules: any, data?: any) => void;
  }

}

export interface JWT {


  /**
   * call jsonwebtoken's sign() method
   * @param payload datas. datas to be signed
   * @param secretOrPrivateKey secret key. string or { key, passphrase }
   * @param options jwt options。see more details in https://github.com/auth0/node-jsonwebtoken
   * @param callback callback
   */
  sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string,
    options?: SignOptions,
    callback?: SignCallback
  ): string;

  /**
   * call jsonwebtoken's verify() method
   * @param token jwt token.
   * @param secretOrPrivateKey secret key。string or { key, passphrase }
   * @param options jwt options。see more details in https://github.com/auth0/node-jsonwebtoken
   * @param callback callback
   */
  verify(token: string, secretOrPrivateKey: string, options?: VerifyOptions, callback?: VerifyCallback): string;

  /**
   * call jsonwebtoken's decode() method
   * @param token jwt token
   */
  decode(token: string): string;


}


export interface Validator {
  addRule: (type: string, check: RegExp | CheckHandlerFunc) => void;
  validate: (rules: any, data: any) => ValidateError[];
}
