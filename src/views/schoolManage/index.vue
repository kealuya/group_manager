<template>
  <div class="app-container m-user">
    <SchoolSide/>
    <SchoolForm/>
  </div>
</template>

<script lang="ts" setup>
import SchoolSide from "@/components/SchoolList/schoolSide";
import SchoolForm from "./component/schoolForm";

</script>

<style scoped>
@import "index.scss";
</style>
