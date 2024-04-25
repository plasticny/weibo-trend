<template>
  <div id="home_view">
    <QueryTrend style="width: 70%"/>
    <SearchHistory style="width: 30%"/>
  </div>
</template>

<script setup lang="ts">
import QueryTrend from '@/components/QueryTrend.vue'
import SearchHistory from '@/components/SearchHistory.vue'
</script>

<style lang="scss">
#home_view {
  display: flex;
}
</style>
