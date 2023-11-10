<template>
  <dialogBox
    :popup.sync="valueHere"
    top="100px"
    title="操作记录"
    width="1000px"
    height="700px"
    :showFooter="false"
    :showClose="true"
  >
    <div class="main">
      <p class="main-header">
        赛事：<span>{{ data.gameTime }}</span
        ><span>{{ data.teamA }}</span
        >v.s<span>{{ data.teamB }}</span>
      </p>
      <div class="list-container">
        <div class="list" v-for="(item, index) in listData" :key="index">
          <p class="list-header">
            <span>{{ item.operationTime }}</span>
            <span>操作人：{{ item.operator }}</span>
          </p>
          <div class="list-main">
            <span>{{ item.type }}</span>
            <span>{{ item.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </dialogBox>
</template>
      
<script>
import * as api_account from "@/api/account";
import dialogBox from "@/components/accountManage/dialog.vue";
export default {
  components: { dialogBox },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      valueHere: false,
      listData: new Array(5).fill({
        type: "管理员同意了调班申请",
        operationTime: "2022-11-24 14:44:57",
        content:
          "管理员同意了调班申请，时间：2022-11-21 周一 10:00，赛程：明星队 vs 传奇队，位置：A边主裁判；裁判：何磊 换至 李斌",
        operator: "何磊",
      }),
    };
  },
  watch: {
    value(nowVal) {
      this.valueHere = nowVal;
      if (nowVal) {
        this.loadData();
      }
    },
    valueHere(nowVal) {
      this.$emit("input", nowVal);
    },
  },
  methods: {
    loadData() {
      api_account.operationLog({
        contestScheduleId: this.data.contestScheduleId,
        page: 1,
        pageNum: 100
      }).then(res => {
        if(res.success) {
          this.listData = res.data.log.rows || [];
        }
      })
    }
  },
};
</script>
      
<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 640px;
  box-sizing: border-box;
  &-header {
    flex: none;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    height: 24px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 24px;
    font-weight: bold;
    span {
      color: #666666;
      padding: 0 5px;
    }
  }
  .list {
    width: inherit;
    padding-left: 18px;
    padding-bottom: 16px;
    position: relative;
    box-sizing: border-box;
    &-header {
      position: relative;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 22px;
      font-size: 14px;
      font-family: HelveticaNeue;
      color: #999999;
      &:before {
        display: block;
        content: " ";
        position: absolute;
        top: 4px;
        left: -25px;
        width: 8px;
        height: 8px;
        background: #BFBFBF;
        border: 3px solid #ffffff;
        border-radius: 50%;
        z-index: 2;
      }
    }
    &:first-of-type {
      &:after {
        background: #1890ff;
      }
      .list-header:before {
        background: #1890ff;
      }
      .list-main span:first-of-type {
        color: #1890FF
      }
    } 
    &:after {
      display: block;
      content: " ";
      position: absolute;
      left: -1px;
      width: 2px;
      height: calc(100% - 10px);
      top: 14px;
      background: #DDE1E6;
    }
    &:last-of-type:after {
      display: none;
    }
    &-main {
      padding: 15px;
      height: auto;
      background: #fafafa;
      border-radius: 5px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      font-weight: 400;
      line-height: 22px;
      span {
        display: block;
        &:first-of-type {
          margin-bottom: 10px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
        }
      }
    }
    &-container {
      height: 0;
      width: 100%;
      padding-right: 16px;
      padding-left: 4px;
      flex: auto;
      overflow: auto;
    }
  }
}
</style>