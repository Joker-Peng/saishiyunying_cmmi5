<template>
  <dialogBox :popup="valueHere" top="100px" :title="title" width="1000px" @cancelOrConfirm="handleOpenPopup">
    <div>
      <div class="form">
        <div class="form-item">
          <el-select
            v-model="formData.event"
            :disabled="true"
            placeholder="请输入内容"
            size="small"
            style="width: 224px"
          >
            <el-option
              v-for="item in eventOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="form-item">
          <span>赛事名称：</span>
          <el-input
            v-model="formData.name"
            placeholder="请输入赛事名称"
            size="small"
            style="width: 224px"
          ></el-input>
        </div>
        <div class="form-item">
            <span>薪资配置：</span>
          <el-select
            v-model="formData.salary"
            placeholder="请选择薪资名"
            size="small"
            style="width: 224px"
          >
            <el-option
              v-for="item in salaryOptions"
              :key="item.id"
              :label="item.salaryName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="table">
        <div class="table-header">
          <span>BO</span>
          <span>主裁判薪资</span>
          <span>场上裁判薪资</span>
          <span>场下裁判薪资</span>
          <span v-if="showLeaderReferee">场下裁判Leader薪资</span>
          <span v-if="showAssistantReferee">助理主裁判薪资</span>
        </div>
        <div class="table-main">
          <template v-if="tableData.length">
            <div
              v-for="(item, index) in tableData"
              :key="index"
              class="table-item"
            >
              <span>{{ item.bo }}</span>
              <span>{{ item.mainReferee }}</span>
              <span>{{ item.onReferee }}</span>
              <span>{{ item.offReferee }}</span>
              <span v-if="showLeaderReferee">{{ item.leaderReferee }}</span>
              <span v-if="showAssistantReferee">{{ item.assistantReferee }}</span>
            </div>
          </template>
          <div class="nodata" v-else>
            <img src="@/assets/eventManage/nodata.png" alt="" />
            <p>暂无列表信息</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增赛程二次弹框 -->
    <dialogBox
      :popup="popup"
      @cancelOrConfirm="handelClosePopup"
    >
      <div class="dialogBox-content">{{confirmTips}}</div>
    </dialogBox>
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
    formData: {
      type: Object,
      default: () => ({}),
    },
    eventOptions: {
      type: Array,
      default: () => [],
    },
    salaryOptions: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      valueHere: false,
      popup: false
    };
  },
  computed: {
    tableData() {
      let salaryIdSelected = this.formData.salary;
      let salarySelected = this.salaryOptions.find(d => d.id == salaryIdSelected);
      console.log(salarySelected)
      return salarySelected?.salaryBos || [];
    },
    confirmTips() {
      return this.title == "新增赛事" ? "确定是否提交新增赛事?" : "确定是否修改此赛事?";
    },
    // 显示场下裁判leader
    showLeaderReferee() {
      return this.formData.event == 2
    },
    // 显示主力主裁判
    showAssistantReferee() {
      return this.formData.event == 2 || this.formData.event == 3
    }
  },
  watch: {
    value(nowVal) {
      this.valueHere = nowVal;
    },
    valueHere(nowVal) {
      this.$emit("input", nowVal);
    },
  },
  methods: {
    handleOpenPopup(type) {
      if(type == "cancel") {
        this.valueHere = false;
      } else {
        this.popup = true;
      }
    },
    handelClosePopup(type) {
      this.popup = false
      if(type == "confirm") {
        this.title == "新增赛事" ? this.addContest() : this.updateContest();
      }
    },
    addContest() {
      api_account.addContest({
        contestTypeId: this.formData.event,
        contestName: this.formData.name,
        salaryId: this.formData.salary
      })
      .then((res) => {
        if (res.success) {
          this.$message({
            message: "赛事新增成功",
            type: "success",
          });
          this.valueHere = false;
        }
      });
    },
    updateContest() {
      api_account.updateContest({
        contestId: this.formData.contestId,
        contestName: this.formData.name,
        isPublish: this.formData.status,
        salaryId: this.formData.salary
      })
      .then((res) => {
        if (res.success) {
          this.$message({
            message: "赛事修改成功",
            type: "success",
          });
          this.valueHere = false;
        }
      });
    },
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
  display: flex;
  flex-wrap: wrap;
  width: 960px;
  &-item {
    margin-right: 20px;
    display: flex;
    align-items: center;
    span {
      width: max-content;
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
.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
</style>