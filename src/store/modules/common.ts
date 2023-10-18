import { defineStore } from "pinia";


export const useCommonStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: "common",
    // state: 返回对象的函数
    state: () => ({
        // 当前选中高校
        selectedSchoolName: "",
        selectedSchoolCode: "",
        updateListValue: false,
        schoolListFirstCode: "",
        schoolListFirstName: "",
        updateTableValue: false,
    }),
    getters: {},
    // 可以同步 也可以异步
    actions: {
        updateList() {
            this.updateListValue = !this.updateListValue;
        },
        updateTable() {
            this.updateTableValue = !this.updateTableValue;
        }
    },
    // 进行持久化存储
    persist: {
        // 本地存储的名称
        key: "common",
        //保存的位置
        storage: window.localStorage//localstorage
    }

});
