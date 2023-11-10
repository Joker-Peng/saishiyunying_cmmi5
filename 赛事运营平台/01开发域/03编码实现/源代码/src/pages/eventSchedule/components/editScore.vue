<template>
  <dialogBox
    :popup="valueHere"
    top="100px"
    :title="title"
    width="1220px"
    @cancelOrConfirm="handleCloseDialog"
  >
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
          <span>分值</span>
          <span>评分详情</span>
          <span>操作</span>
        </div>
        <div class="table-main">
          <div v-for="(item, index) in tableData" :key="index" class="table-item">
            <span>
              <el-select v-model="item.scoreType" :disabled="item.lock" placeholder="请选择" size="mini" style="width: 173px">
                <el-option v-for="item in scoreTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </span>
            <span>
              <el-input
                :disabled="item.lock"
                v-model="item.score"
                @input="item.score=item.score.replace(/\D/g, '')"
                size="mini"
                style="width: 173px"
              ></el-input>
            </span>
            <span>
              <el-input
                :disabled="item.lock"
                v-model="item.content"
                size="mini"
                style="width: 494px"
              ></el-input>
            </span>
            <span>
              <el-button
                v-if="item.lock"
                type="primary"
                size="mini"
                icon="el-icon-unlock"
                @click="item.lock=!item.lock"
              >解锁</el-button>
              <template v-else>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-lock"
                  @click="item.lock=!item.lock"
                >锁定</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDeleteScore(index)"
                >删除</el-button>
              </template>
            </span>
          </div>
        </div>
        <div class="table-add" @click="handleAddScore">
          <span style="margin-right: 10px">+</span>添加评分
        </div>
      </div>
    </div>
    <dialog-box :popup="cancelConfirm" @cancelOrConfirm="handelCloseCancelDialog">
      <div class="edit-confirm">
        <p>取消之后对于已作出的修改不会保存</p>
      </div>
    </dialog-box>
    <dialog-box :popup="editConfirm" @cancelOrConfirm="handleCloseConfirmDialog">
      <div class="edit-confirm">
        <p>确定要修改该裁判的评分吗？</p>
      </div>
    </dialog-box>
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
      default: false
    },
    referee: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      valueHere: false,
      scoreTypeOptions: [
        {label: "减分", value: 0},
        {label: "加分", value: 1},
      ],
      tableData: [],
      editConfirm: false,
      cancelConfirm: false
    };
  },
  computed: {
    title() {
      return `(${this.referee.name})赛事评分`
    },
    formConfig() {
      return [
        { label: "赛事：", value: this.formData.contestName },
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
      ];
    },
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
    }
  },
  methods: {
    // 评分数据
    loadData() {
      api_account.getScore({
        refereeId: this.referee.refereeUserId,
        userWorkScheduleId: this.referee.userWorkScheduleId
      }).then(res => {
        if(res.success) {
          this.tableData = res.data.scoreDetail.map(d => ({
            ...d,
            lock: true
          }))
        }
      })
    },
    scoreConfirm() {
      return new Promise((resolve, reject) => {
        api_account.setScore({
          userId: this.$store.getters.userInfo.id,
          refereeId: this.referee.refereeUserId,
          userWorkScheduleId: this.referee.userWorkScheduleId,
          scores: this.tableData.map(d => `${d.scoreType},${d.score},${d.content}`)
        }).then(res => {
          if(res.success) {
            this.$message.success("修改成功")
            resolve()
          } else {
            reject()
          }
        }, err => {
          reject();
        })
      })
    },
    handleAddScore() {
      this.tableData.push({
        salaryType: "",
        salary: "",
        content: "",
        lock: false
      });
    },
    handleDeleteScore(index) {
      this.tableData.splice(index, 1);
    },
    handleCloseDialog(type) {
      if (type == "confirm") {
        // 判断是否全部填写
        if (
          this.tableData.every(
            d => d.scoreType !== "" && d.score && d.content
          )
        ) {
          this.editConfirm = true;
        } else {
          this.$message.error("请检查是否填写完整");
        }
      } else {
        this.cancelConfirm = true;
      }
    },
    handelCloseCancelDialog(type) {
      this.cancelConfirm = false;
      if (type == "confirm") {
        this.valueHere = false;
      }
    },
    handleCloseConfirmDialog(type) {
      this.editConfirm = false;
      if (type == "confirm") {
        this.scoreConfirm().then(() => {
          this.valueHere = false;
        });
      }
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
  width: 1180px;
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
      display: block;
      width: 173px;
      flex: auto;
      text-align: center;
      &:nth-of-type(3) {
        width: 494px;
      }
    }
  }
  &-header {
    position: sticky;
    top: 0;
    font-weight: bold;
    color: #666666;
    background-color: #fafafa;
    z-index: 9;
  }
  &-main {
    display: flex;
    flex-direction: column;
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
  &-add {
    margin-top: 20px;
    width: 100%;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px dashed #1d81ee;
    color: #1d81ee;
    text-align: center;
    line-height: 32px;
    box-sizing: border-box;
    cursor: pointer;
  }
}
.edit-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-size: 14px;
  line-height: 24px;
  color: #333333;
}
::v-deep .el-button--primary {
  color: #1d81ee;
  background: transparent;
  border-color: #1d81ee;
}
::v-deep .el-button--danger {
  color: #ff005c;
  background: transparent;
  border-color: #ff005c;
}
</style>