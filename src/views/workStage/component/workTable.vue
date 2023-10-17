<template>
  <div class="m-user-table">
    <div class="card-right-header">
      <el-button type="primary" @click="addProgram">+项目</el-button>
      <el-form :inline="true" :model="formInline" ref="ruleFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formInline.username" placeholder="请输入用户名" />
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
          :data="tableData" style="width: 100%;height: 100%" border>
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="school_name" label="学校" />
          <el-table-column prop="xt" label="系统" />
          <el-table-column prop="priority" label="优先级" />
          <el-table-column prop="program_type" label="分类" />
          <el-table-column prop="process_people" label="处理人" />
          <el-table-column prop="create_people" label="创建人" />
          <el-table-column prop="create_time" label="创建时间" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-switch
                inline-prompt
                active-text="已处理" inactive-text="待处理" active-value="1" inactive-value="0"
                v-model="scope.row.status" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="remark" :show-overflow-tooltip="true"
                           label="备注" align="center"/>
          <el-table-column prop="operator" label="操作" width="200"  align="center" fixed="right">
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
<!--      <div class="pagination">-->
<!--        <el-pagination-->
<!--          v-model:currentPage="currentPage1"-->
<!--          :page-count="pageCount"-->
<!--          background-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--        />-->
<!--      </div>-->
<!--      <template>-->
        <el-pagination background layout="prev, pager, next" v-model:currentPage="currentPage"
                       :page-count="pageCount"  @current-change="handleCurrentChange" />
<!--      </template>-->
    </div>
    <AddDialog ref="addDialog" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import AddDialog from './addDialog.vue'
import { getWorkList } from "@/api/workStage";
import ByteArray from "vue-qr/src/lib/gif.js/GIFEncoder";

const formInline = reactive({});
const ruleFormRef = ref<FormInstance>();
const loading = ref(true);
const currentPage = ref<number>(1);
const pageSize = ref(10)
const pageCount = ref<number>(1);
const headerData: WorkInfo[] = reactive([]);
const tableData: WorkInfo[] = reactive([]);
const tableLayout = ref('fixed')
const addDialog = ref()
const addProgram = () => {
  addDialog.value.show()
};
const onSubmit = () => {
  console.log("submit!", formInline);
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const reset = (formEl: FormInstance | undefined) => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
const editHandler = (row) => {
  addDialog.value.show(row)
}

const del = (row) => {
  ElMessageBox.confirm('你确定要删除当前项吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(() => {})
    .catch(() => {})
}
// const handleSizeChange = (val: number) => {
//   console.log(`${val} items per page`)
// }
//
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getList('',currentPage.value,pageSize.value)
}
const getList = async (search,page,pageSize)=>{
  let a = await getWorkList(search,page,pageSize)
  console.log('getWorkList',a)
  let result = a.data
  if (!result.success){
    setTimeout(() => {
      loading.value = false;
    }, 1000);
    ElMessage({
      type: "error",
      message: result.msg
    });
    return
  }
  tableData.length = 0;
  console.log(result)
  let data = result.data as { array: Array<WorkInfo>, count: number };
  tableData.push(...data.array)
  pageCount.value = Math.ceil(data.count / pageSize);
  console.log('pageCount.value',pageCount.value)
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}
onMounted(()=>{
  getList('',currentPage.value,pageSize.value)
  setTimeout(()=>{
    loading.value = false
  },1000)

})
</script>

<style scoped>
@import "../index.scss";
</style>
