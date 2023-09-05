import "egg";
import { EggMySQL, EggMySqlConfig } from "egg-mysql";

declare module "egg" {
  interface Application {
    mysql: EggMySQL;
    mysqls: {
      get(clientId: string): EggMySQL;
    };
  }

  interface EggAppConfig {
    mysql: EggMySqlConfig;
  }
}
