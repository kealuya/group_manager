<template>
  <div class="app-container m-user">
    <SchoolSide />
    <WorkTable />
  </div>

</template>

<script lang="ts" setup>
import WorkTable from "@/views/workStage/component/workTable.vue";
import SchoolSide from "@/components/SchoolList/schoolSide.vue";
</script>

<style scoped>
@import "index.scss";
</style>
