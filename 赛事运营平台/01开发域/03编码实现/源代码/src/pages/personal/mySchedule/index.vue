<template>
  <div>
    <pcContent v-if="!isMobile()"></pcContent>
    <mbContent v-else></mbContent>
  </div>
</template>
<script>
import pcContent from "./components/mySchedule/index.vue"
import mbContent from "./components/myScheduleMb/index.vue"
export default {
  components: {
    pcContent,
    mbContent
  },
  data() {
    return {
    };
  }

};
</script>
<style lang="css" scoped>
</style>
