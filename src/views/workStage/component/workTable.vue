<template>
  <div class="m-user-table">
    <div class="card-right-header">
      <el-button type="primary" @click="addProgram">+项目</el-button>
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item label="用户名" prop="searchValue">
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
          <el-table-column prop="operator" label="操作" width="200" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)">
                编辑
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
import { onMounted, reactive, ref, watch, watchEffect } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { deleteProgram, getWorkList } from "@/api/workStage";
import { useCommonStore } from "@/store/modules/common";
import { storeToRefs } from "pinia";
import { Search } from "@element-plus/icons-vue";

const formInline = reactive({});
const searchValue = ref<string>("");
const ruleFormRef = ref<FormInstance>();
const loading = ref(true);
const currentPage = ref<number>(1);
const pageSize = ref(10);
const pageCount = ref<number>(1);
const headerData: WorkInfo[] = reactive([]);
const tableData: WorkInfo[] = reactive([]);
const tableLayout = ref("fixed");
const addDialogRef = ref();
const commonStore = useCommonStore();
const addProgram = () => {
  addDialogRef.value.show();
};
const onSubmit = () => {
  loading.value = true;
  getList(formInline["searchValue"], currentPage.value, pageSize.value);
  loading.value = false;
};

const reset = (formEl: FormInstance | undefined) => {
  formInline["searchValue"] = "";
  loading.value = true;
  getList("", currentPage.value, pageSize.value);
  loading.value = false;
};
const editHandler = (row) => {
  addDialogRef.value.show(row);
};

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
    await getList("", currentPage.value, pageSize.value);

  } catch (e) {
    // cancel的场合
  }


};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getList("", currentPage.value, pageSize.value);
};

// store调用，并更改页面数据的正确使用方案
const { schoolWorkState } = storeToRefs(commonStore);
const getList = async (search, page, pageSize) => {
  let processResult = await commonStore.getSchoolWorkState(search, page, pageSize);
  if (!processResult) {
    loading.value = false;
    return;
  }
  pageCount.value = Math.ceil(schoolWorkState.value.count / pageSize);
  loading.value = false;
  console.log('schoolWorkState.array',schoolWorkState.value)
};
// 废弃考虑
const getList_bak = async (search, page, pageSize) => {
  console.log("selectedSchoolName", selectedSchoolName);
  let a = await getWorkList(search, page, pageSize);
  let result = a.data;
  console.log(result.data);
  if (!result.success) {
    loading.value = false;
    ElMessage({
      type: "error",
      message: result.msg
    });
    return;
  }
  tableData.length = 0;
  let data = result.data as { array: Array<WorkInfo>, count: number };
  tableData.push(...data.array);
  pageCount.value = Math.ceil(data.count / pageSize);
  loading.value = false;
};
const { updateTableValue } = storeToRefs(commonStore);
const { selectedSchoolName } = storeToRefs(commonStore);

watch(() => updateTableValue.value, () => {
  formInline["searchValue"] = selectedSchoolName;
  onSubmit();
});


watchEffect(
  async () => {
    loading.value = true;
    await getList(formInline["searchValue"], currentPage.value, pageSize.value);
    loading.value = false;
  }
);

onMounted(() => {
  getList("", currentPage.value, pageSize.value);
  loading.value = false;

});
</script>

<style scoped>
@import "../index.scss";
</style>
