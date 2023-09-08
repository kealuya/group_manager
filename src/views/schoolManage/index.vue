<template>
  <div class="app-container m-user">
    <SchoolSide @getSchool="getName"/>
    <SchoolForm v-model='schoolName'/>
  </div>
</template>

<script lang="ts" setup>
import SchoolSide from "@/components/SchoolList/schoolSide";
import SchoolForm from "./component/schoolForm";
import { ref } from "vue";

const schoolName = ref("22");
const getName = (name) => {
  schoolName.value = name
  console.log(schoolName.value,222)
};
</script>

<style scoped>
@import "index.scss";
</style>
