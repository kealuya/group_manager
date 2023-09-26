<template>
  <el-card class="m-dept-side">
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
        <el-checkbox class="checkbox" v-model="isOwner" label="本人负责" size="large" @change="getList"/>
      </div>
    </template>
    <el-scrollbar height="500px" class="scrollbar">
      <div v-for="item in listData" :key="item.school_code" class="item" @click="chooseSchool(item.school_code,item.school_name)">
        {{ item.school_name }}
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script lang="ts" setup>

import { defineEmits, onMounted, ref, watch } from "vue";
import { getSchoolList1 } from "@/api/schoolList";
import { useUserStore } from "@/store/modules/user";
import { toRaw } from "@vue/reactivity";
import { useCommonStore } from "@/store/modules/common";
import { storeToRefs } from "pinia";

const input1 = ref("");
const isOwner = ref(true);
const listData =  ref([])
const userStore = ref({})
const emit = defineEmits(['getSchool'])
const commonStore = useCommonStore();
const { updateListValue } = storeToRefs(commonStore);

const getList = async ()=>{
  const userStore = useUserStore();
  const userInfo   = toRaw(userStore.userInfo) ;
  let e = await getSchoolList1(userInfo.code,isOwner.value);
  listData.value = e.data.data
  // commonStore.schoolListFirstCode =
  // listData.value.forEach((item)=>console.log('item',item))
  let a = Object.values(listData)
  console.log('schoolListFirstCode',toRaw(listData[0]))
}

const chooseSchool = (code,name) => {

  commonStore.selectedSchoolCode = code
  commonStore.selectedSchoolName = name
  // emit('getSchool',name)
};
watch(() => updateListValue.value , ( ) => {
  console.log('newValue, oldValue' )
  getList()
})
onMounted( () => {
   getList()
});

</script>

<style scoped>
@import "../../views/workStage/index.scss";
</style>
