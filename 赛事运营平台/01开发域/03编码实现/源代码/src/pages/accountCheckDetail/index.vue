<template>
  <div class="page-container">
    <section class="pb27 border-b">
      <p class="head-title">{{title}}
        <span class="back" @click="onBack">
          <div class="backlogo"></div>
          <div>返回</div>
        </span>
      </p>
      <div class="message-container">
        <UploadHeadImg class="upload" v-model="userInfo.image" :canUpload="false"></UploadHeadImg>
        <div class="line"></div>
        <div class="message-list">
          <Message v-for="(item, index) in message" v-bind="item" :key="index">
            <el-input v-if="type == 'edit' && item.label == '裁判编号：'" type="text" v-model="item.text"
              :disabled="item.disabled" />
          </Message>
        </div>
      </div>
    </section>
    <section class="pb27">
      <section class="message-big">
        <p>执裁经历：</p>
        <div class="message-list chooseIdentityList">
          <!-- 如果是编辑，第一行新增添加行 -->
          <div class="auth-container" v-for="year in Object.keys(experienceData)" :key="year">
            <span class="auth-title">{{ year }}</span>
            <span class="auth-text">{{ experienceData[year].map(d => d.label).join("、") }}</span>
          </div>
        </div>
      </section>
      <section class="message-big">
        <p>身份：</p>
        <div class="message-list chooseIdentityList">
          <el-checkbox-group :disabled="type != 'edit'" v-model="authSelected">
            <div class="auth-container" v-for="authKey in Object.keys(authOptions)" :key="authKey">
              <div class="auth-title">{{ authKey }}</div>
              <div class="auth-text">
                <el-checkbox :label="item.value" v-for="item in authOptions[authKey]" :key="item.value">{{ item.label
                }}</el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </section>
      <section class="message-big">
        <p>权限：</p>
        <div class="message-list chooseIdentityList">
          <el-checkbox-group v-model="permissionSelected">
            <div class="auth-container" v-for="authKey in Object.keys(permissionOptions)" :key="authKey">
              <div class="auth-title">{{ authKey }}</div>
              <div class="auth-text">
                <el-checkbox :label="item.value" v-for="item in permissionOptions[authKey]" :key="item.value">{{
                  item.label }}</el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </section>
    </section>
    <!-- 底部按钮 -->
    <section class="mt-8">
      <template v-if="type == 'auth'">
        <div class="detail-list-handle" style="border: 1px solid #ff005c; color: #ff005c" @click="handleReject">
          <el-image :src="require('../../assets/accountManage/error.png')"></el-image>
          <div>拒绝</div>
        </div>
        <div class="detail-list-handle" style="
              border: 1px solid #00b400;
              color: #00b400;
              " @click="handlePass">
          <el-image :src="require('@/assets/accountManage/pass.png')"></el-image>
          <div>通过</div>
        </div>
      </template>
      <template v-else-if="type == 'edit'">
        <div class="detail-list-handle" style="
            border: 1px solid #126bee;
            color: #126bee;
            margin-top: 10px;
          " @click="confirmEdit">
          <el-image :src="require('@/assets/accountManage/edit.png')"></el-image>
          <div>提交</div>
        </div>
      </template>
      <template v-else>
        <div class="detail-list-handle" style="
                border: 1px solid #126bee;
                color: #126bee;
              " @click="handleUnlock">
          <el-image :src="require('@/assets/accountManage/edit.png')"></el-image>
          <div>解封</div>
        </div>
      </template>
    </section>
    <dialogBox :popup="showErrorDialog" top="0" width="637px" title="拒绝理由" @cancelOrConfirm="handleCloseErrorDialog">
      <div class="dialog-error">
        <span>拒绝理由：</span>
        <textarea v-model="rejectReason" name="" id=""></textarea>
      </div>
    </dialogBox>
  </div>
</template>
<script>
import Message from "./components/message.vue";
import * as api_account from "@/api/account";
import UploadHeadImg from "@/components/uploadHeadImg/index.vue";
import dialogBox from "@/components/accountManage/dialog.vue";
export default {
  components: {Message, UploadHeadImg, dialogBox},
  data() {
    return {
      message: [
        {label: "姓名：", text: ""},
        {label: "裁判编号：", text: ""},
        {label: "手机号：", text: "", disabled: true},
        {label: "邮箱：", text: "", disabled: true},
        {label: "常驻城市：", text: "", readOnly: true},
      ],
      userInfo: {},
      experienceData: {}, //执裁经历
      authOptions: {}, //身份
      authSelected: [],
      permissionOptions: {}, //权限
      permissionSelected: [], //权限列表
      showErrorDialog: false,
      rejectReason: "",
      type: "edit", //上级页面带过来 edit:编辑， auth：审核
    };
  },
  computed: {
    title() {
      return this.type == "edit" ? "账号编辑" : this.type == "auth" ? "账号审核" : "账号解封";
    }
  },
  watch: {
    "message": {
      handler(nowVal) {
        if (this.type == "edit") {
          let res = nowVal[1].text;
          let prepend = "REF";
          let herePend = res.slice(0, 3);
          if (prepend != herePend && res) {
            res = prepend + res;
          }
          res = res.slice(0, 3) + res.slice(3).replace(/\D/g, "");
          this.message[1].text = res.slice(0, 6);
        }
      },
      deep: true
    }
  },
  created() {
    this.type = this.$route.query.type;
    this.getUserInfo();
  },

  methods: {
    //请求用户信息
    getUserInfo() {
      api_account.getAccountDetail({accountId: parseInt(this.$route.query.accountId)}).then((resapi) => {
        if (resapi.success) {
          const {userInfo, userIdentity, userPermission, userRefereeContestHistory} = resapi.data;
          // 个人信息
          if (userInfo) {
            this.userInfo = userInfo;
            for (let i = 0; i < this.message.length; i++) {
              const element = this.message[i];
              switch (i) {
                case 0:
                  element.text = userInfo.name;
                  break;
                case 1:
                  element.text = userInfo.refereeNumber ? "REF" + userInfo.refereeNumber : userInfo.refereeNumber;
                  break;
                case 2:
                  element.text = userInfo.mobile;
                  break;
                case 3:
                  element.text = userInfo.email;
                  break;
                case 4:
                  element.text = userInfo.province + userInfo.city;
                  break;
                default:
                  break;
              }
            }
          }
          // 执裁经历
          if (userRefereeContestHistory) {
            this.experienceData = userRefereeContestHistory.reduce((res, val) => {
              if (!Object.keys(res).some(d => d == val.year)) {
                res[val.year] = [];
              }
              res[val.year].push({
                ...val,
                id: val.contestHistoryId,
                label: `${val.type} - ${val.name}`,
                value: val.contestHistoryId
              });
              return res;
            }, {});
          }
          if (userIdentity) {
            //  身份列表
            this.authOptions = userIdentity.reduce((res1, val) => {
              res1[val.contestTypeName] = val.identityList.map(d => ({
                ...d, label: d.identityName, value: d.identityId
              }));
              return res1;
            }, {});
            this.authSelected = userIdentity.reduce((res, val) => {
              res.push(...val.identityList.filter(d => d.select).map(d => d.identityId));
              return res;
            }, []);
          }
          if (userPermission) {
            this.permissionOptions = userPermission.reduce((res, val) => {
              res[val.permissionTypeName] = val.permissionList.map(d => ({
                ...d, label: d.permissionName, value: d.permissionId
              }));
              return res;
            }, {});
            this.permissionSelected = userPermission.reduce((res, val) => {
              res.push(...val.permissionList.filter(d => d.select).map(d => d.permissionId));
              return res;
            }, []);
          }
        }
      });
    },
    handleUnlock() {
      this.$confirm("确认要解封吗？").then(() => {
        this.confirmAuth(1);
      });
    },
    // 通过
    handlePass() {
      this.$confirm("确认要通过吗？").then(() => {
        this.confirmAuth(1);
      });
    },
    handleReject() {
      this.showErrorDialog = true;
    },
    handleCloseErrorDialog(type) {
      if (type == "confirm") {
        if (!this.rejectReason) {
          this.$message.error("请输入拒绝理由");
          return;
        }
        this.showErrorDialog = false;
        // 拒绝
        this.confirmAuth(0);
      } else {
        this.showErrorDialog = false;
      }
    },
    // 账号审核
    confirmAuth(status) {
      api_account.accountAuth({
        accountId: parseInt(this.$route.query.accountId),
        status: status,
        permissionId: this.permissionSelected.join(","),
        rejectReason: status == 0 ? this.rejectReason : ""
      }).then(res => {
        if (res.success) {
          this.$message.success("提交成功");
          this.onBack();
        }
      });
    },
    // 账号编辑
    confirmEdit() {
      if (!this.message[1].text.slice(3)) {
        this.$message.warning('请填写裁判编号');
        return;
      }
      this.$confirm("确认要提交吗？").then(() => {
        api_account.accountEdit({
          accountId: parseInt(this.$route.query.accountId),
          city: this.userInfo.city,
          identityId: this.authSelected.join(","),
          permissionId: this.permissionSelected.join(","),
          refereeNumber: this.message[1].text.slice(3)
        }).then(res => {
          if (res.success) {
            this.$message.success("提交成功");
            this.onBack()
            
          }
        });
      });
    },
    onBack() {
      if(this.$route.query.accountId == this.$store.getters.userInfo.id) {
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
            this.$router.go(-1);
          })
        });
      } else {
        this.$router.go(-1);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .van-cell__value {
  color: #323233;
}

.pb27 {
  padding-bottom: 27px;
}

.border-b {
  border-bottom: 1px solid #E5E8ED;
}

.mt-8 {
  margin-top: -8px;
  display: flex;
  justify-content: center;
  align-items: center;

  >div {
    margin-right: 10px;

    &:last-of-type {
      margin-right: 0;
    }
  }
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 104px;
  height: 40px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  box-sizing: border-box;

  &:hover {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
  }

  &-primary {
    background: #1d81ee;
    color: #ffffff;
  }

  &-red {
    background: #ee0a24;
    color: white;
  }

  &-gray {
    border: 1px solid #989898;
    color: #989898;
  }

  img {
    margin-right: 8px;
    height: 15px;
    width: 15px;
  }
}

.page-container {
  .head-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 24px;
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #111111;
    line-height: 24px;
    .backlogo {
      width: 16px;
      height: 13px;
      margin-top: 3px;
      margin-right: 3px;
      background-image: url("../../assets/eventAgent/back.png");
    }
    .back {
      display: flex;
      font-family: MicrosoftYaHei;
      align-items: center;
      color: #1d81ee;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .message-container {
    display: flex;
    margin-top: 20px;

    .upload {
      flex: none;
      margin-top: 20px;
      width: 136px;
      height: 136px;
    }

    .line {
      flex: none;
      margin: 20px 40px 0;
      height: 136px;
      width: 1px;
      background-color: #E5E8ED;
    }
  }

  .message-list {
    flex: auto;
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    ::v-deep .message-item {
      width: 50%;
      flex: auto;

      &:last-of-type {
        border-bottom: 0;
      }

      .el-input {
        width: 224px;
      }
    }

    // ::v-deep .el-checkbox-group {
    //   display: flex;
    //   justify-content: center;
    // }
  }

  .message-big {
    border-bottom: 1px dashed #E5E8ED;
    margin-top: 20px;
    font-size: 14px;
    color: #666666;
  }

  .auth-container {
    margin-bottom: 20px;
    display: flex;

    .auth-title {
      flex: none;
      padding-right: 10px;
      width: 70px;
      font-size: 14px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
    }

    .auth-input {
      flex: auto;
      width: 0;
      display: flex;
      align-items: center;
    }

    .auth-text {
      display: flex;
      align-items: center;
      flex: auto;
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;

      ::v-deep .el-checkbox__label {
        margin-left: 2px;
        padding-left: 0px;
      }

      ::v-deep .el-checkbox {
        margin-right: 10px;
        width: auto;
        min-width: 120px;
      }
    }
  }
}

.chooseIdentityList {
  padding-top: 20px;
}

.dialogText {
  text-align: center;
}

.detail-list-handle {
  width: 79px;
  height: 32px;
  border-radius: 2px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.detail-list-handle div {
  margin-left: 5px;
}

.dialog-error {
  display: flex;
  padding: 28px;
  font-weight: 400;
  font-size: 20px;
  color: #333333;

  span {
    flex: none;
    margin-right: 8px;
    line-height: 50px;
  }

  textarea {
    padding: 12px 16px;
    width: 456px;
    height: 130px;
    flex: auto;
    border-radius: 5px;
    border: 1px solid #ccc;
    line-height: 30px;
  }
}
</style>
