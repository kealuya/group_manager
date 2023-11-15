<template>
  <el-card class="m-dept-side">
    <template #header>
      <div class="card-header">
        <div class="text">负责院校</div>
        <el-input v-model="inputForSearch" class="w-50 m-2" placeholder="输入名称">
          <template #prefix>
            <el-icon class="el-input__icon">
              <search />
            </el-icon>
          </template>
        </el-input>
        <el-checkbox class="checkbox" v-model="isOwner" label="本人负责" size="large" @change="isOwnerChange" />
      </div>
    </template>
<!--    <el-scrollbar height="550px" class="scrollbar">-->
    <div style="overflow-y: scroll;height: 570px;" >
      <div v-for="item in listData" :key="item.school_code" class="item"
           @click="chooseSchool(item.school_code,item.school_name)">
        {{ item.school_name }}
      </div>
    </div>

<!--    </el-scrollbar>-->
  </el-card>
</template>

<script lang="ts" setup>

import { computed, defineEmits, onMounted, ref, watch } from "vue";
import { getSchoolList1 } from "@/api/schoolList";
import { useUserStore } from "@/store/modules/user";
import { toRaw } from "@vue/reactivity";
import { useCommonStore } from "@/store/modules/common";
import { storeToRefs } from "pinia";



const inputForSearch = ref("");// input搜索框绑定值


const listData = ref([]);
let listDataCopy = [];//暂存数组
const commonStore = useCommonStore();
const { updateListValue } = storeToRefs(commonStore);
const getList = async () => {
  // 获取个人信息
  const userStore = useUserStore();
  const userInfo = toRaw(userStore.userInfo);

  let e = await getSchoolList1(userInfo.code, isOwner.value);
  listData.value = e.data.data;
  listDataCopy = toRaw(listData.value);
  //传递学校管理首个展示项
  commonStore.schoolListFirstCode = listData.value[0].school_code;
  commonStore.schoolListFirstName = listData.value[0].school_name;
};
//获取当前用户信息
const UserStore = useUserStore();
const userInfo = computed(() => UserStore.userInfo);
const { selectedOwner } = storeToRefs(commonStore);

const isOwner = ref(true);
const isOwnerChange = () => {
  inputForSearch.value = "";
  commonStore.selectedSchoolCode = ''
  commonStore.selectedSchoolName=''
  selectedOwner.value = isOwner.value===true?userInfo.value.code:""
  commonStore.updateTable();
  getList();

};
const chooseSchool = (code, name) => {
  commonStore.selectedSchoolCode = code;
  commonStore.selectedSchoolName = name;
  commonStore.updateTable()//更新工作台table
};
watch(() => updateListValue.value, () => {
  getList();
});

watch(() => inputForSearch.value, () => {
  if (inputForSearch.value == "") {
    listData.value = listDataCopy;
    return;
  }

  const matchValueList = listDataCopy.find((value, index) => {
    if (value.school_name.indexOf(inputForSearch.value) >= 0) {
      console.log(inputForSearch.value);
      return true;
    }
  });

  if (matchValueList == undefined) {
    listData.value = [];
    return;
  }

  listData.value = [];
  listData.value.push(matchValueList);

});



onMounted(() => {
  getList();
});

</script>

<style scoped>
@import "../../views/workStage/index.scss";
</style>
