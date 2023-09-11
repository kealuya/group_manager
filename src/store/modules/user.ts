import { defineStore } from "pinia";
import service from "@/api/request";


export const useUserStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: "userInfo",
    // state: 返回对象的函数
    state: (): { token: any, userInfo: UserInfo, roles: any } => ({
        // 登录token
        token: null,
        // 登录用户信息
        userInfo: null,
        // 角色
        roles: localStorage.roles ? JSON.parse(localStorage.roles) : []

    }),
    getters: {},
    // 可以同步 也可以异步
    actions: {
        // 登录
        async login(userInfo: { code: string, password: string }) {
            return new Promise<BackendData<UserInfo>>(async (resolve, reject) => {

                const { code, password } = userInfo;

                let response = await service.post<BackendData<UserInfo>>("/user/login", userInfo);
                const backendData = response.data;
                // console.log(backendData)
                if (!backendData.success) {
                    resolve(backendData);
                    return;
                }
                this.token = backendData.data.jwt;
                this.userInfo = backendData.data;
                this.roles = backendData.data.role;
                resolve(backendData);
            });
        },

        async test() {
            return new Promise(async (resolve, reject) => {
                let t = await service.post("/user/test");
                console.log(t);
            });
        },
        // 获取用户信息 ，如实际应用中 可以通过token通过请求接口在这里获取用户信息
        getInfo(roles) {
            return new Promise((resolve, reject) => {
                this.roles = roles;
                resolve(roles);
            });
        },
        // 退出
        logout() {
            return new Promise((resolve, reject) => {
                this.token = null;
                this.userInfo = {};
                this.roles = [];
                resolve(null);
            });
        }

    },
    // 进行持久化存储
    persist: {
        // 本地存储的名称
        key: "userInfo",
        //保存的位置
        storage: window.localStorage//localstorage
    }

});

export interface UserInfo {
    id: number;
    code: string;
    name: string;
    role: string;
    jwt: string;
}
