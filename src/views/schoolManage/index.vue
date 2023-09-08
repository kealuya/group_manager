<template>
  <div class="app-container m-user">
    <SchoolSide @getSchool="getName"/>
    <SchoolForm :msg='schoolName'/>
  </div>
</template>

<script lang="ts" setup>
import SchoolSide from "@/components/SchoolList/schoolSide";
import SchoolForm from "./component/schoolForm";
import { ref } from "vue";

const schoolName = ref("");
const getName = (name) => {
  schoolName.value = name
  console.log(schoolName.value,222)
};
</script>

<style scoped>
@import "index.scss";
</style>
