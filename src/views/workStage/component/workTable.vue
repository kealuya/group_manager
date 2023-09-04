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
        <el-table
          v-loading="loading" :table-layout="tableLayout"
          :data="tableData" style="width: 100%;height: 100%" border>
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="name" label="创建人" />
          <el-table-column prop="school" label="高校" />
          <el-table-column prop="address" label="Address" />
          <el-table-column prop="createTime" label="创建时间" />
<!--          <el-table-column prop="status" label="用户状态" align="center">-->
<!--            <template #default="scope">-->
<!--              <el-switch-->
<!--                inline-prompt-->
<!--                active-text="启用" inactive-text="禁用"-->
<!--                v-model="scope.row.status" @change="changeStatus(scope.row)" />-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column prop="describe"
                           :show-overflow-tooltip="true"
                           label="用户描述" align="center"/>
          <el-table-column prop="createTime" label="创建时间" align="center"/>
          <el-table-column prop="operator" label="操作"  align="center" fixed="right">
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
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage1"
          :page-size="10"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="1000"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <AddDialog ref="addDialog" />
  </div>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessageBox, FormInstance } from "element-plus";
import AddDialog from './addDialog.vue'

const formInline = reactive({});
const ruleFormRef = ref<FormInstance>();
const loading = ref(true);
const currentPage1 = ref(1);
const tableData = [
  {
    title: "差旅管家购票失败",
    name: "Tom",
    school:'中国传媒大学',
    address: "No. 189, Grove St, Los Angeles",
    createTime:"2023-8-23",
  },
  {
    title: "采购平台下单显示价格异常",
    name: "Tom",
    school:'中国传媒大学',
    address: "No. 189, Grove St, Los Angeles",
    createTime:"2023-8-23",
  },
  {
    title: "差旅管家购买重复扣费",
    name: "Tom",
    school:'中国传媒大学',
    address: "No. 189, Grove St, Los Angeles",
    createTime:"2023-8-23",
  },
  {
    title: "费控模态窗提交数据失败",
    name: "Tom",
    school:'中国传媒大学',
    address: "No. 189, Grove St, Los Angeles",
    createTime:"2023-8-23",
  }
];
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
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  currentPage1.value = val
}
onMounted(()=>{
  setTimeout(()=>{
    loading.value = false
  },1000)
})
</script>

<style scoped>
@import "../index.scss";
</style>
