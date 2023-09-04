<template>
  <el-card class="m-dept-side" >
    <template #header>
      <div class="card-header">
        <div class="text">负责院校</div>
        <el-input v-model="input1" class="w-50 m-2" placeholder="输入名称">
          <template #prefix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <el-checkbox class="checkbox" v-model="checked1" label="本人负责" size="large" />
      </div>
    </template>
    <el-scrollbar class="scrollbar">
      <div v-for="item in listData" :key="item.key" class="item">{{ item.name }}</div>
    </el-scrollbar>

  </el-card>
</template>

<script lang="ts" setup>

import { ref } from "vue";
const input1 = ref("");
const checked1 = ref(true);
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
</script>

<style scoped>
@import "../index.scss";
</style>
