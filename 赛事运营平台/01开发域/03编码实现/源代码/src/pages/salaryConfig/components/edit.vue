<template>
    <dialogBox :popup="valueHere" top="100px" :title="title" width="1220px" @cancelOrConfirm="handleCloseDialog">
      <div>
        <div class="form">
          <div class="form-item">
            <el-select
              v-model="formData.contestTypeId"
              :disabled="true"
              placeholder="请输入内容"
              size="small"
              style="width: 224px"
            >
              <el-option
                v-for="item in contestTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="form-item">
            <span>薪资名：</span>
            <el-input
              v-model="formData.salaryName"
              placeholder="请输入薪资名"
              size="small"
              style="width: 224px"
            ></el-input>
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
            <span>操作</span>
          </div>
          <div class="table-main">
              <div
                v-for="(item, index) in formData.bo"
                :key="index"
                class="table-item"
              >
                <span>
                    <el-input :disabled="item.lock" v-model="item.bo" @input="item.bo=item.bo.replace(/\D/g, '')" size="mini" style="max-width: 120px"></el-input>    
                </span>
                <span>
                    <el-input :disabled="item.lock" v-model="item.mainReferee" @input="item.mainReferee=item.mainReferee.replace(/\D/g, '')" size="mini" style="width: 120px"></el-input> 
                    元/场   
                </span>
                <span>
                    <el-input :disabled="item.lock" v-model="item.onReferee" @input="item.onReferee=item.onReferee.replace(/\D/g, '')" size="mini" style="width: 120px"></el-input> 
                    元/场   
                </span>
                <span>
                    <el-input :disabled="item.lock" v-model="item.offReferee" @input="item.offReferee=item.offReferee.replace(/\D/g, '')" size="mini" style="width: 120px"></el-input>    
                    元/场 
                </span>
                <span v-if="showLeaderReferee">
                  <el-input :disabled="item.lock" v-model="item.leaderReferee" @input="item.leaderReferee=item.leaderReferee.replace(/\D/g, '')" size="mini" style="width: 120px"></el-input>    
                  元/场 
                </span>
                <span v-if="showAssistantReferee">
                  <el-input :disabled="item.lock" v-model="item.assistantReferee" @input="item.assistantReferee=item.assistantReferee.replace(/\D/g, '')" size="mini" style="width: 120px"></el-input>    
                    元/场 
                </span>
                <span>
                    <el-button v-if="item.lock" type="primary" size="mini" icon="el-icon-unlock" @click="item.lock=!item.lock">解锁</el-button>
                    <template v-else>
                        <el-button type="primary" size="mini" icon="el-icon-lock" @click="item.lock=!item.lock">锁定</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteBO(index)">删除</el-button>
                    </template>
                </span>
              </div>
          </div>
          <div class="table-add" @click="handelAddBO"><span style="margin-right: 10px">+</span>添加BO</div>
        </div>
      </div>
      <dialog-box :popup="cancelConfirm" @cancelOrConfirm="handelCloseCancelDialog">
        <div class="edit-confirm">
            <p>取消之后对于已作出的修改不会保存</p>
        </div>
      </dialog-box>
      <dialog-box :popup="editConfirm" @cancelOrConfirm="handleCloseConfirmDialog">
        <div class="edit-confirm">
            <p>确定要修改该薪资配置吗？</p>
            <p style="color: #999999">修改后未结算的薪资会按此计算，已结算的不会发生变化</p>
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
        default: false,
      },
      formData: {
        type: Object,
        default: () => ({}),
      },
      contestTypeOptions: {
        type: Array,
        default: () => [],
      },
      title: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        valueHere: false,
        salaryOptions: [],
        editConfirm: false,
        cancelConfirm: false
      };
    },
    computed: {
      // 显示场下裁判leader
      showLeaderReferee() {
        return this.formData.contestTypeId == 2
      },
      // 显示主力主裁判
      showAssistantReferee() {
        return this.formData.contestTypeId == 2 || this.formData.contestTypeId == 3
      }
    },
    watch: {
      value(nowVal) {
        this.valueHere = nowVal;
        if(nowVal) {
          this.loadData()
        }
      },
      valueHere(nowVal) {
        this.$emit("input", nowVal);
      },
    },
    methods: {
      // 获取薪资配置options
      loadData() {
          
      },
      salaryConfirm() {
        return new Promise((resolve, reject) => {
            let confirmSalary = api_account.addSalary;
            let params = {
                salaryName: this.formData.salaryName,
                bo: this.formData.bo.map(d => `${d.bo},${d.mainReferee},${d.onReferee},${d.offReferee},${d.leaderReferee || 0},${d.assistantReferee || 0}`)
            }
            if(this.formData.salaryId) {
                confirmSalary = api_account.editSalary;
                params.salaryId = this.formData.salaryId
            } else {
                params.contestTypeId = this.formData.contestTypeId;
            }
            confirmSalary(params).then(res => {
                if(res.success) {
                    resolve();
                } else {
                    reject();
                }
            }).catch(err => {
                reject()
            })
        })
      },
      handelAddBO() {
        this.formData.bo.push({
            bo: "",
            mainReferee: "",
            onReferee: "",
            offReferee: "",
            leaderReferee: "",
            assistantReferee: "",
            lock: false
        })
      },
      handleDeleteBO(index) {
        this.formData.bo.splice(index, 1)
      },
      handleCloseDialog(type) {
        if(type == "confirm") {
          // 判断是否全部填写
            if(this.formData.salaryName && this.formData.bo.every(d => {
              const normalCheck = d.bo && d.mainReferee && d.onReferee && d.offReferee;
              const checkAssistantReferee = !this.showAssistantReferee || d.assistantReferee;
              const checkLeaderReferee = !this.showLeaderReferee || d.leaderReferee;
              return normalCheck && checkAssistantReferee && checkLeaderReferee
            })) {
              this.editConfirm = true;
            } else {
              this.$message.error("请检查是否填写完整")
            }
        } else {
            this.cancelConfirm = true;
        }
      },
      handelCloseCancelDialog(type) {
        this.cancelConfirm = false;
        if(type == "confirm") {
            this.valueHere = false
        }
      },
      handleCloseConfirmDialog(type) {
        this.editConfirm = false;
        if(type == "confirm") {
            this.salaryConfirm().then(() => {
                this.valueHere = false
            })
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
    display: flex;
    flex-wrap: wrap;
    width: 1180px;
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
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px dashed #1D81EE;
        color: #1D81EE;
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
    color: #1D81EE;
    background: transparent;
    border-color: #1D81EE;
  }
  ::v-deep .el-button--danger {
    color: #FF005C;
    background: transparent;
    border-color: #FF005C;
  }
  </style>