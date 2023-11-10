<template>
    <dialogBox :popup="valueHere" top="100px" :title="title" width="478px" @cancelOrConfirm="handelCloseDialog">
      <div class="dialogBox-center">
        <div>
          <div class="dialogBox-contentList">
            <span>赛事：</span>
            <el-select
              placeholder="请选择赛事"
              disabled
              v-model="filterData.contestTypeId"
              style="width: 224px"
            >
              <el-option
                v-for="item in contestTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="dialogBox-contentList">
            <span>加减分：</span>
            <el-select
              placeholder="请选择"
              v-model="filterData.scoreType"
              style="width: 224px"
            >
              <el-option
                v-for="item in scoreTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="dialogBox-contentList">
            <span>分值：</span>
            <el-input
              v-model="filterData.score"
              placeholder="请输入分值"
              size="small"
              min="0"
              style="width: 224px"
            ></el-input>
          </div>
          <div class="dialogBox-contentList">
            <span>评分详情：</span>
            <el-input
            type="textarea"
              v-model="filterData.content"
              placeholder="请输入内容"
              size="small"
              style="width: 368px"
            ></el-input>
          </div>
        </div>
      </div>
      <dialogBox :popup.sync="dialog.value" @cancelOrConfirm="handleCloseConfirmDialog">
        <span class="dialogBox-content">{{dialog.content}}</span>
      </dialogBox>
    </dialogBox>
  </template>
  
  <script>
  import dialogBox from "@/components/accountManage/dialog.vue";
  import * as api_account from "@/api/account";
  export default {
    name: "editScore",
    components: { dialogBox },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      filterData: {
        type: Object,
        default: () => ({})
      },
      contestTypeOptions: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: "评分"
      }
    },
    data() {
      return {
        valueHere: false,
        scoreTypeOptions: [
          {label: "加分", value: 1},
          {label: "减分", value: 0}
        ],
        dialog: {
          value: false,
          type: "",
          content: ""
        }
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
      },
      valueHere(nowVal) {
        this.$emit("input", nowVal);
      },
      "filterData.score"() {
        this.filterData.score = this.filterData.score.replace(/\D/g, "");
      }
    },
    methods: {
      handelCloseDialog(type) {
        if(type == "cancel") {
          this.dialog.type = "cancel";
          this.dialog.content = "取消之后对于已作出的修改不会保存";
        } else {
          if(this.filterData.score && this.filterData.scoreType !== "" && this.filterData.content != "") {
            this.dialog.type = "confirm";
            this.dialog.content = "确定要修改对该裁判的评分吗？"
          } else {
            this.$message.error("请检查表单是否填写完整")
            return
          }
        }
        this.dialog.value = true
      },
      handleCloseConfirmDialog(type) {
        if(type == "confirm") {
          if(this.dialog.type == "confirm") {
            this.confirmMethod()
          } else {
            this.valueHere = false;
          }
        }
      },
      confirmMethod() {
        console.log("confirm")
        if(this.filterData.scoreLogId) {
          // 修改
          var api = api_account.editRefereeOtherScore;
          var params = {
            userId: this.$store.getters.userInfo.id,
            scoreLogId: this.filterData.scoreLogId,
            scoreType: this.filterData.scoreType,
            score: this.filterData.score,
            content: this.filterData.content
          }
        } else {
          var api = api_account.addRefereeOtherScore;
          var params = {
            userId: this.$store.getters.userInfo.id,
            contestTypeId: this.filterData.contestTypeId,
            refereeId: this.filterData.refereeId,
            scoreType: this.filterData.scoreType,
            score: this.filterData.score,
            content: this.filterData.content
          }
        }
        api(params).then(res => {
          console.log(res);
          this.valueHere = false;
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
  .dialogBox-contentList {
  width: 100%;
  span {
    width: 80px;
  } 
}
  </style>