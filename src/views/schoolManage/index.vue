<template>
  <div class="app-container m-user">
    <SchoolSide @getSchool="getName"/>
    <SchoolForm/>
  </div>
</template>

<script lang="ts" setup>
import SchoolSide from "@/components/SchoolList/schoolSide";
import SchoolForm from "./component/schoolForm";
import { ref } from "vue";

const schoolName = ref("");
const getName = (name) => {
  console.log(name)
};
</script>

<style scoped>
@import "index.scss";
</style>
