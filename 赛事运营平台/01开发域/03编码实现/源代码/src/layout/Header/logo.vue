<template>
	<div class="logo"></div>
</template>

<script>
export default {
  name: 'LogoCom'
}
</script>
<style lang="less" scoped>
@import "../../styles/base/variables.less";
.logo{
  font-size: 22px;
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid @mainBorderColor;
}
</style>
