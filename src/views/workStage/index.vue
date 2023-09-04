<template>
  <div class="app-container m-user">
    <WorkSide/>
    <WorkTable/>
  </div>
<!--    <div class="box-card-right">-->
<!--      <el-card class="card-right-box">-->
<!--        <div class="card-right-header">-->
<!--          <el-button type="primary" @click="addProgram">添加项目</el-button>-->
<!--          <el-input style="width: 300px" v-model="input2" class="w-50 m-2" placeholder="输入名称">-->
<!--            <template #prefix>-->
<!--              <el-icon class="el-input__icon">-->
<!--                <search />-->
<!--              </el-icon>-->
<!--            </template>-->
<!--          </el-input>-->
<!--        </div>-->
<!--      </el-card>-->

<!--      <el-card>-->
<!--        <el-table height="600" :data="tableData" style="width: 100%" :table-layout="tableLayout">-->
<!--          <el-table-column prop="title" label="标题"  />-->
<!--          <el-table-column prop="name" label="创建人"  />-->
<!--          <el-table-column prop="school" label="高校" />-->
<!--          <el-table-column prop="address" label="Address" />-->
<!--          <el-table-column prop="createTime" label="创建时间" />-->
<!--        </el-table>-->
<!--      </el-card>-->



<!--    </div>-->


<!--    <addDialog ref="addDialog"/>-->
<!--  </div>-->
</template>

<script lang="ts" setup>
import { ref } from "vue";
import WorkSide from "@/views/workStage/component/workSide.vue";
import WorkTable from "@/views/workStage/component/workTable.vue";

// import addDialog from './addDialog.vue'
// import { Search } from '@element-plus/icons-vue'
const input1 = ref("");
const input2 = ref("");
const checked1 = ref(true);
const tabPosition = ref("left");
const listData = [
  {
    name: "中国传媒大学",
    key: "CM"
  },
  {
    name: "清华大学",
    key: "QH"
  },
  {
    name: "北京大学",
    key: "BD"
  },
  {
    name: "天津大学",
    key: "BD"
  },
  {
    name: "南开大学",
    key: "BD"
  },
  {
    name: "北京医科附属大学",
    key: "BD"
  },
  {
    name: "天津工业大学",
    key: "BD"
  }
];
const tableLayout = ref('fixed')
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
const addProgram = ()=>{

}
</script>

<style scoped>
@import "index.scss";
</style>
