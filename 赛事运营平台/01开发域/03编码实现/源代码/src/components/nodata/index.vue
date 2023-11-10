<template>
  <div class="nodata">
    <img src="@/assets/eventManage/nodata.png" alt="" />
    <p>暂无列表信息</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.nodata {
    flex: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 0;
    height: 400px;
    img {
        margin-bottom: 20px;
        width: 90px;
        height: auto;
    }
    p {
        color: #999999;
        font-size: 14px;
    }
}
</style>