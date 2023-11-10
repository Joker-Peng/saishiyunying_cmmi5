<template>
    <div class="page">
      <div>共{{total}}页，每页{{pageSize}}条数据</div>
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="pageIndex"
          :total="total">
       </el-pagination>
      </div>
    </div>
</template>

<script>
export default {
    props: {
        total: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            pageIndex: 1,
            pageSize: 10,
        }
    }
}
</script>

<style scoped>
.page{
    display: flex;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #999999;
    padding: 20px;
    align-items: center;
    justify-content: space-between;
}
</style>