<template>
  <div class="m-user-table">
    <div class="card-right-header">
      <el-button type="primary" @click="addProgram()">+项目</el-button>
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item label="搜索" prop="searchValue">
          <el-input v-model="formInline.searchValue" placeholder="请输入搜索内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :icon="Search">查询</el-button>
          <el-button @click="reset(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="table-inner">
        <el-table empty-text="暂无,点击左上角按钮添加项目"
                  v-loading="loading" :table-layout="tableLayout"
                  :data="schoolWorkState.array " style="width: 100%;height: 100%" border>
          <el-table-column prop="title" min-width="120" label="问题简述" />
          <el-table-column prop="school_name" min-width="100" label="学校" />
          <el-table-column prop="xt" label="系统" />
          <el-table-column prop="priority" label="优先级">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-tag class="ml-2" effect="light" type="danger" v-if="scope.row.priority==='紧急'">紧急</el-tag>
                <el-tag class="ml-2" effect="light" type="warning" v-if="scope.row.priority==='高'">高</el-tag>
                <el-tag class="ml-2" effect="light" v-if="scope.row.priority==='中'">中</el-tag>
                <el-tag class="ml-2" effect="light" type="info" v-if="scope.row.priority==='低'">低</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="program_type" label="分类" />
          <el-table-column prop="process_people" label="处理人" />
          <el-table-column prop="create_people" label="创建人" />
          <el-table-column prop="create_time" min-width="160" label="创建时间" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-switch
                inline-prompt
                active-text="已处理" inactive-text="待处理" :active-value=1 :inactive-value=0
                v-model="scope.row.status" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="remark" :show-overflow-tooltip="true"
                           label="备注" align="center" />
          <el-table-column prop="operator" label="操作" width="180" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small"
                         v-show="scope.row.status===0&&(userInfo.code===scope.row.process_people||userInfo.name===scope.row.process_people)"
                         icon="Edit" @click="editHandler(scope.row,'edit')">
                编辑
              </el-button>
              <el-button type="success" size="small"
                         v-show="scope.row.status===1||(userInfo.code!==scope.row.process_people&&userInfo.name!==scope.row.process_people)"
                         icon="View" @click="editHandler(scope.row,'detail')">
                详情
              </el-button>
              <el-button @click="del(scope.row)" type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="height: 20px"></div>
      <el-pagination background layout="prev, pager, next" v-model:currentPage="currentPage"
                     :page-count="pageCount" />
      <!--  WARNING  以上事件不推荐使用（但由于兼容的原因仍然支持，在以后的版本中将会被删除）；如果要监听 current-page 和 page-size 的改变，使用 v-model 双向绑定是个更好的选择。-->
    </div>

  </div>
  <AddDialog ref="addDialogRef" />
</template>

<script lang="ts" setup>
import AddDialog from "@/views/workStage/component/addDialog.vue";
import { computed, reactive, ref, watchEffect } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { deleteProgram } from "@/api/workStage";
import { useCommonStore } from "@/store/modules/common";
import { storeToRefs } from "pinia";
import { Search } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/modules/user";

//获取当前用户信息
const UserStore = useUserStore();
const userInfo = computed(() => UserStore.userInfo);

//table
const loading = ref(true);
const tableLayout = ref("fixed");
const currentPage = ref<number>(1);
const pageSize = ref(10);
const pageCount = ref<number>(1);
const tableData: WorkInfo[] = reactive([]);
const commonStore = useCommonStore();
// store调用，并更改页面数据的正确使用方案
const { schoolWorkState } = storeToRefs(commonStore);
const { selectedOwner } = storeToRefs(commonStore);
const getList = async (search, page, pageSize, owner) => {
  let processResult = await commonStore.getSchoolWorkState(search, page, pageSize, owner);
  if (!processResult) {
    loading.value = false;
    return;
  }
  pageCount.value = Math.ceil(schoolWorkState.value.count / pageSize);
  loading.value = false;

};


//添加项目
const { clickStatus } = storeToRefs(commonStore);
const addDialogRef = ref();
const addProgram = () => {
  clickStatus.value = "add";
  addDialogRef.value.show();
};


//header搜索部分
const formInline = reactive({});
const searchValue = ref<string>("");
const ruleFormRef = ref<FormInstance>();
const onSubmit = () => {
  loading.value = true;
  getList(formInline["searchValue"], currentPage.value, pageSize.value, selectedOwner.value);
  // commonStore.updateTable();
  loading.value = false;
};
const reset = (formEl: FormInstance | undefined) => {
  formInline["searchValue"] = "";
  loading.value = true;
  getList("", currentPage.value, pageSize.value, selectedOwner.value);
  loading.value = false;
};


//table功能部分
//编辑
const editHandler = (row, value) => {
  clickStatus.value = value;
  addDialogRef.value.show(row);
};
//删除
const del = async (row) => {
  try {
    await ElMessageBox.confirm("你确定要删除当前项吗?", "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true
    });
    loading.value = true;
    let a = await deleteProgram(row.id);
    let result = a.data;
    if (!result.success) {
      loading.value = false;
      ElMessage({
        type: "error",
        message: result.msg
      });
      return;
    }
    loading.value = false;
    ElMessage({
      type: "success",
      message: "删除成功"
    });
    await getList("", currentPage.value, pageSize.value, selectedOwner.value);

  } catch (e) {
    // cancel的场合
  }


};


//watch更新列表
// const { updateTableValue } = storeToRefs(commonStore);
// const { selectedSchoolName } = storeToRefs(commonStore);
// watch(() => updateTableValue.value, () => {
//   formInline["searchValue"] = selectedSchoolName;
//   onSubmit();
// });
//

watchEffect(
  async () => {
    loading.value = true;

    await getList(formInline["searchValue"], currentPage.value, pageSize.value, selectedOwner.value);
    loading.value = false;
  }, {
    //https://cn.vuejs.org/api/reactivity-core.html#watcheffect
    // 默认情况下，侦听器将在组件渲染之前执行。设置 flush: 'post' 将会使侦听器延迟到组件渲染之后再执行
    // 解决页面初始化时 getList调用2次的问题
    flush: "post"
  }
);

const { selectedSchoolName } = storeToRefs(commonStore);
watchEffect(
  async () => {
    formInline["searchValue"] = selectedSchoolName;
  }
);

</script>

<style scoped>
@import "../index.scss";
</style>
