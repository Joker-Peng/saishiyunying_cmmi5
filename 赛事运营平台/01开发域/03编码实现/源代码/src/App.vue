<template>
	<div id="app">
		<router-view v-if="contestTypeLoaded" />
    <errorToast ref="errorToast" v-bind="refereeWarnData"></errorToast>
	</div>
</template>

<script>
import {mapGetters} from "vuex" 
import * as api_account from "@/api/account.js"
import errorToast from "@/components/errorToast"
export default {
  name: "App",
  components: {errorToast},
  data() {
    return {
      contestTypeLoaded: false
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    refereeWarnData() {
      return {
        visible: this.userInfo?.refereeStatus == 2,
        title: "您的账号已经冻结",
        formData: [
          {label: "冻结时间", value: `${this.userInfo.freezeStart}至${this.userInfo.freezeEnd}`},
          {label: "冻结原因", value: this.userInfo.freezeReason},
        ]
      }
    },
  },
  watch: {
    "userInfo.id": {
      handler(nowVal) {
        nowVal && this.getContestType()
      },
      immediate: true
    },
  },
  mounted() {
    setTimeout(() => {
      if(!this.userInfo.id) {
        this.contestTypeLoaded = true;
      }
    },200)
  },
  methods: {
    getContestType() {
      api_account.getContestType({}).then((res) => {
        if (res.success) {
          this.$dictionary.contestType = res.data.map(d => ({
            ...d,
            label: d.contestTypeName,
            value: d.contestTypeId,
            isSelect: d.isSelect
          }))
        }
        this.$nextTick(()=> {
          this.contestTypeLoaded = true;
        })
      });
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
body {
  margin: 0px;
}
button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background-color: transparent;
}
.boxtWrap{
  overflow: hidden;
}
.box{
  background: #FFFFFF;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin:10px 0;
}
.title {
  padding: 20px;
  font-size: 20px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
  border-bottom: 1px solid #dde1e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.opop .cell{
    padding-left: none !important;
   }.page-container {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.el-dialog__header, .el-dialog__body{
  padding: 0 !important;
}
.el-dialog__footer{
  padding: 20px !important;
}
.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
.dialogBox-contentList /deep/ .area-select {
  background: #f5f7fa !important;
  cursor: not-allowed !important;
  border-color: #e4e7ed !important;
  color: #c0c4cc !important;
  margin-left: 0px;
}
.dialogBox-center {
  border-bottom: 1px solid #dde1e6;
  padding: 18px;
}
.dialogBox-contentList {
  width: 80%;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #666666;
  padding-bottom: 10px;
}

.dialogBox-contentList>span {
  width: 100px;
}
.dialogBox-contentList /deep/ .el-input {
  height: 40px;
  width: 224px;
  display: flex;
  align-items: center;
}
</style>
