<template>
  <div class="referee-container">
    <!-- 查看详情按钮 -->
    <button class="referee-fixed" @click="linkToDetail(value.refereeId)">详情<i class="el-icon-d-arrow-right"></i></button>
    <!-- 头像块 -->
    <section class="referee-box-head">
      <img :src="value.image || defaultImg" alt="">
      <span>{{value.name}}</span>
      <span>{{value.updatedAt}}</span>
    </section>
    <!-- 详细信息 -->
    <section class="referee-box-detail">
      <p class="space-between">
        <span class="label">
          <img src="@/assets/common/icon_mobile.png" alt="">手机
        </span>
        <span class="value">{{value.mobile}}</span>
      </p>
      <p class="space-between">
        <span class="label">
          <img src="@/assets/common/icon_email.png" alt="">邮箱
        </span>
        <span class="value">{{value.email}}</span>
      </p>
      <p class="space-between">
        <span class="label">
          <img src="@/assets/common/icon_number.png" alt="">裁判编号
        </span>
        <span class="value">{{value.refereeNumber}}</span>
      </p>
      <p class="space-between">
        <span class="label">
          <img src="@/assets/common/icon_card.png" alt="">身份
        </span>
        <span class="value" :title="value.identity">{{value.identity}}</span>
      </p>
    </section>
    <!-- 状态 -->
    <section class="referee-box-status" v-if="showButton">
      <el-popover
        placement="top"
        width="200"
        trigger="hover"
        :disabled="value.refereeStatus != 2"
        :content="'冻结原因：'+value.freezeReason">
        <span slot="reference" class="status" :class="refereeStatusClass">{{refereeStatusText}}</span>
      </el-popover>
      <div v-if="value.refereeStatus == 2" class="reason">
        <span>{{value.freezeStart}}</span>
        <span>至</span>
        <span>{{value.freezeEnd}}</span>
      </div>
    </section>
    <!-- 操作 -->
    <section class="referee-box-button" v-if="showButton">
      <template v-if="value.refereeStatus == 1">
        <button class="blue-button" @click="handleSetOut">设为离职</button>
        <button class="red-button" @click="handleOpenLockDialog">冻结</button>
      </template>
      <template v-else-if="value.refereeStatus == 2">
        <button class="blue-button" @click="handleSetUnlock">解冻</button>
      </template>
      <template v-else>
        <button class="blue-button" @click="handleSetIn">设为在职</button>
      </template>
    </section>

    <!-- 冻结弹窗 -->
    <dialogBox :popup="showLockDialog" top="100px" title="冻结设置" width="500px" @cancelOrConfirm="handleCloseLockDialog">
      <div class="dialog-lock">
        <p class="dialog-lock-header">
          <span class="dialog-lock-header-name">{{value.name}}</span>
          （裁判编号：{{value.refereeNumber}}）
        </p>
        <div class="dialog-lock-form">
          <span class="label">冻结时间：</span>
          <el-date-picker
            class="value"
            v-model="lockDialogData.dateRange"
            type="daterange"
            format="yyyy/MM/dd"
            range-separator="~"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="dialog-lock-form">
          <span class="label">冻结原因：</span>
          <el-input
            class="value"
            type="textarea"
            :rows="3"
            placeholder="请输入冻结原因"
            v-model="lockDialogData.reason">
          </el-input>
        </div>
      </div>
    </dialogBox>
  </div>
</template>

<script>
import dialogBox from "@/components/accountManage/dialog.vue";
import * as api_account from "@/api/account";
export default {
  components: {dialogBox},
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
      return {
          defaultImg: require("@/assets/upload/head_default.png"),
          showLockDialog: false,
          lockDialogData: {
            dateRange: [this.$moment().format("YYYY/MM/DD"), this.$moment().add(1, "days").format("YYYY/MM/DD")],
            reason: ""
          },
          pickerOptions: {
            disabledDate: date => {
              return date.valueOf() < this.$moment().add(-1, "days").valueOf()
            }
          }
      };
  },
  computed: {
    showButton() {
      return this.value.refereeStatus == 1 || this.value.refereeStatus == 2 || this.value.refereeStatus == 3
    },
    refereeStatusText() {
      // 1:在职 2冻结 3离职
      return this.$dictionary.refereeStatus.find(d => d.value == this.value.refereeStatus)?.label || "";
    },
    refereeStatusClass() {
      return ["", "green", "red", "gray"][this.value.refereeStatus]
    }
  },
  watch: {
    showLockDialog(nowVal) {
      // 关闭弹窗 重置所有数据
      if(!nowVal) {
        this.$nextTick(() => {
          this.lockDialogData = {
            dateRange: [this.$moment().format("YYYY/MM/DD"), this.$moment().add(1, "days").format("YYYY/MM/DD")],
            reason: ""
          }
        })
      }
    }
  },
  methods: {
    setStatus(status) {
      let params = {
        refereeId: this.value.refereeId,
        refereeStatus: status
      }
      if(status == 2) {
        params = {
          ...params,
          freezeStart: this.lockDialogData.dateRange[0],
          freezeEnd: this.lockDialogData.dateRange[1],
          freezeReason: this.lockDialogData.reason
        }
      }
      api_account.refereeStatusEdit(params).then(res => {
        if(res.success) {
          this.showLockDialog = false;
          // 通知外部刷新数据
          this.$emit("change");
        }
      })
    },
    // 设为离职
    handleSetOut() {
      this.$confirm(`确认要将裁判${this.value.name}(裁判编号：${this.value.refereeNumber})设为离职吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setStatus(3)
      })
    },
    // 解冻
    handleSetUnlock() {
      this.$confirm(`确认要将裁判${this.value.name}(裁判编号：${this.value.refereeNumber})解冻吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setStatus(1)
      })
    },
    // 设为在职
    handleSetIn() {
      this.$confirm(`确认要将裁判：${this.value.name}(裁判编号：${this.value.refereeNumber})设为在职吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setStatus(1)
      })
    },
    // 冻结
    handleSetLock() {
      this.$confirm(`确认要将裁判${this.value.name}(裁判编号：${this.value.refereeNumber})冻结吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setStatus(2)
      })
    },
    handleOpenLockDialog() {
      this.showLockDialog = true;
    },
    handleCloseLockDialog(type) {
      if(type == "confirm") {
        if(this.lockDialogData.dateRange?.length != 2){
          this.$message.error("请输入日期")
          return
        }
        if(!this.lockDialogData.reason) {
          this.$message.error("请输入冻结原因")
          return
        }
        this.handleSetLock();
      } else {
        this.showLockDialog = false;
      }
    },
    linkToDetail(id) {
      this.$router.push({
        path: "/refereeManage/member",
        query: {
          id: id
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box
}
.blue-button {
  border: 1px solid rgb(18, 107, 238);
  color: rgb(18, 107, 238);
}
.red-button {
  border: 1px solid rgb(255, 0, 92);
  color: rgb(255, 0, 92);
}
.green {
  color: rgb(0, 180, 0);
  &.status:before {
    content: " ";
    display: block;
    margin-right: 6px;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    background-color: rgb(0, 180, 0);
  }
}
.red {
  color: rgb(255, 0, 92);
  &.status:before {
    content: " ";
    display: block;
    margin-right: 6px;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    background-color: rgb(255, 0, 92);
  }
}
.gray {
  color: #999999;
  &.status:before {
    content: " ";
    display: block;
    margin-right: 6px;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    background-color: #999999;
  }
}
.space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .label {
    display: flex;
    align-items: center;
    width: 100px;
    flex: none;
    img {
      margin-top: -2px;
      margin-right: 6px;
      height: 14px;
      width: 14px;
      object-fit: contain;
    }
  }
  .value {
    text-align: right;
    width: 0;
    flex: auto;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }

}
.referee-container {
  position: relative;
  display: flex;
  align-items: center;
  padding: 30px 0;
  height: 200px;
  background: #FFFFFF;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.05);
  border-radius: 4px;
  font-size: 14px;
  color: #666666;
  .referee-fixed {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 14px;
    color: #1D81EE;
    line-height: 20px;
  }
  > section {
    padding: 0 20px;
    height: 100%;
    border-right: 1px solid #E5E5E5;
    &:last-of-type {
      border-right: 0;
    }
  }
  .referee-box-head {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 260px;
    img {
      margin-bottom: 12px;
      width: 78px;
      height: 78px;
      object-fit: cover;
      border-radius: 50%;
    }
    span:first-of-type {
      margin-bottom: 6px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    span:last-of-type {
      font-size: 12px;
      color: #999999;
    }
  }
  .referee-box-detail {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 300px;
    flex-grow: 1;
  }
  .referee-box-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 130px;
    .status {
      display: flex;
      align-items: center;
    }
    .reason {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 12px;
      font-size: 12px;
      color: #999999;
    }
  }
  .referee-box-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: 10px;
    width: 238px;
    button {
      margin-bottom: 10px;
      width: 80px;
      height: 32px;
      border: 1px solid;
      border-radius: 4px;
      cursor: pointer;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
.dialog-lock {
  padding: 20px;
  color: #333333;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  &-header {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    &-name {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
  }
  .label {
    flex: none;
    width: 80px;
    line-height: 40px;
  }
  .value {
    flex: auto;
    width: 0;
  }
  &-form {
    display: flex;
    margin-bottom: 10px;
    height: 40;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>