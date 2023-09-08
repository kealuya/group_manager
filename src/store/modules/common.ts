import {defineStore} from 'pinia'
import request from "@/api/request";
import service from "@/api/request";
import {string} from "fast-glob/out/utils";


export const useCommonStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'common',
    // state: 返回对象的函数
    state: () => ({
        // 当前选中高校
        selectedSchool: "",

    }),
    getters: {},
    // 可以同步 也可以异步
    actions: {},
    // 进行持久化存储
    persist: {
        // 本地存储的名称
        key: "common",
        //保存的位置
        storage: window.localStorage,//localstorage
    },

})
