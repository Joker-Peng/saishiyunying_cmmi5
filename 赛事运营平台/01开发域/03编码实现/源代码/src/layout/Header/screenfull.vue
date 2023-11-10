<template>
	<div>
		<i :class="['el-icon-full-screen', isFullscreen? 'screen' : '']" @click="clickFullscreen" style="color: #1D81EE"></i>
	</div>
</template>

<script>
import screenfull from "screenfull";

export default {
  name: "ScreenFull",
  data() {
    return {
      isFullscreen: false,
    };
  },
  methods: {
    clickFullscreen() {
      this.isFullscreen = !this.isFullscreen;
      if (!screenfull.isEnabled) {
        this.$message({message: "您的浏览器不支持此功能！！！", type: "warning",});
        return false;
      }
      screenfull.toggle();
    },
  },
};
</script>
<style lang="css" scoped>
.screen{
  transform: scale(1.5);
}
</style>
