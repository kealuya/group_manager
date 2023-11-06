import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + "_1693811591796_8363";

    // add your egg config in here
    config.middleware = ["jwtCheck"];

    // 上传必须追加file模式，并且扩展默认文件扩展名
    config.multipart = {
        mode: "file",
        fileExtensions: ['.pdf','.png','.jpg']
    };


    // add your special config in here
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`
    };

    config.security = {
        csrf: {
            enable: false
        }
    };

    config.mysql = {
        // 单数据库信息配置
        client: {
            // host
            host: "124.70.48.30",
            // 端口号
            port: "3306",
            // 用户名
            user: "root",
            // 密码
            password: "renhao666",
            // 数据库名
            database: "group_manager"
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false
    };
    config.jwt = {
        secret: "zq"//自定义 token 的加密条件字符串
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig
    };
};
