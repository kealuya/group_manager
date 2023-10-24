import { defineStore } from "pinia";
import { getWorkList } from "@/api/workStage";
import { ElMessage } from "element-plus";


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
        schoolWorkState: { array: [], count: 0 }
    }),
    getters: {},
    // 可以同步 也可以异步
    actions: {
        updateList() {
            this.updateListValue = !this.updateListValue;
        },
        updateTable() {
            this.updateTableValue = !this.updateTableValue;
        },
        async getSchoolWorkState(search, page, pageSize): Promise<boolean> {
            let workList = await getWorkList(search, page, pageSize);
            let result = workList.data;
            if (!result.success) {
                ElMessage({
                    type: "error",
                    message: result.msg
                });
                return false;
            }
            if (result.data == null || result.data.length == 0) {
                this.schoolWorkState = { array: [], count: 0 };
                return true;
            }

            this.schoolWorkState = result.data as { array: Array<WorkInfo>, count: number };
            return true;
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
