<template>
  <dialogBox :popup.sync="valueHere" top="100px" title="查看评分" width="1000px">
    <div>
      <div class="form">
        <p v-for="item in formConfig" :key="item.label">
          <span>{{ item.label }}</span>
          <span :class="item.class">{{ item.value }}</span>
        </p>
      </div>
      <div class="table">
        <div class="table-header">
          <span>加减分</span>
          <span>评分</span>
          <span>详情</span>
        </div>
        <div class="table-main">
          <template v-if="scoreDetail.length">
            <div
              v-for="(item, index) in scoreDetail"
              :key="index"
              class="table-item"
            >
              <span>{{ item.scoreType ? "加分" : "减分" }}</span>
              <span :class="item.scoreType ? 'green' : 'red'">{{ (item.scoreType ? "+" : "-") + item.score }}</span>
              <span>{{ item.content }}</span>
            </div>
          </template>
          <div class="nodata" v-else>
            <img src="@/assets/eventManage/nodata.png" alt="" />
            <p>暂无列表信息</p>
          </div>
        </div>
      </div>
    </div>
    <el-button slot="footer" type="primary" @click="valueHere = false"
      >关闭</el-button
    >
  </dialogBox>
</template>

<script>
import dialogBox from "@/components/accountManage/dialog.vue";
import * as api_account from "@/api/account";
export default {
  components: { dialogBox },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    refereeId: {
      type: [String, Number],
      default: ""
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      valueHere: false,
      scoreTotal: 0,
      scoreDetail: []
    };
  },
  computed: {
    formConfig() {
      return [
        { label: "赛事：", value: this.formData.match },
        {
          label: "队伍：",
          value: `${this.formData.teamA} VS ${this.formData.teamB}`,
        },
        { label: "赛事阶段：", value: this.formData.weekOfMonth },
        { label: "城市：", value: this.formData.city },
        {
          label: "时间：",
          value: `${this.formData.date} ${this.formData.time}`,
        },
        { label: "位置：", value: this.formData.part },
        { label: "赛事薪资：", value: this.formData.price },
        {
          label: "结算状态：",
          value: this.formData.status ? "已结算" : "未结算",
          class: this.formData.status ? "green" : "red",
        },
        { label: "评分合计：", value: this.scoreTotal, class: this.scoreTotal >= 0 ? "green" : "red" },
        { label: "-", key: "-" },
      ];
    },
  },
  watch: {
    value(nowVal) {
      this.valueHere = nowVal;
      this.loadData();
    },
    valueHere(nowVal) {
      this.$emit("input", nowVal);
    },
  },
  methods: {
    loadData() {
      api_account.getScore({
        refereeId: this.refereeId || this.$store.getters.userInfo.id,
        userWorkScheduleId: this.formData.userWorkScheduleId
      }).then(res => {
        if(res.success) {
          this.scoreTotal = res.data.scoreTotal;
          this.scoreDetail = res.data.scoreDetail
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.green {
  color: #00b400;
}
.red {
  color: #ff005c;
}
.form {
  margin: 20px auto;
  border-top: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 960px;
  p {
    flex: none;
    display: flex;
    width: 480px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #333333;
    span {
      display: block;
      width: 360px;
      padding: 0 10px;
      border-bottom: 1px solid #e8e8e8;
      &:first-of-type {
        width: 120px;
        border-left: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        color: #666666;
        background-color: #fafafa;
      }
    }
  }
}
.table {
  margin: 0 auto 20px;
  width: 960px;
  height: 455px;
  font-size: 14px;
  color: #333333;
  overflow: auto;
  &-header,
  &-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    min-height: 54px;
    span {
      width: 0;
      flex: 1;
      text-align: center;
    }
  }
  &-header {
    position: sticky;
    top: 0;
    font-weight: bold;
    color: #666666;
    background-color: #fafafa;
  }
  &-main {
    display: flex;
    flex-direction: column;
    min-height: 400px;
    .nodata {
      flex: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 0;
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
  }
}
</style>