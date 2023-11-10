<template>
  <div v-if="isMobile()" class="mobile-container" :style="{height: $setMobileHeightByVh()}">
    <van-nav-bar
        class="mobile-header"
        :title="$route.meta.title"
    >
    </van-nav-bar>
    <section class="mobile-main">
      <div class="mobile-upload-container">
        <UploadHeadImg class="mobile-upload" v-model="userInfo.image" :canUpload="!buttonDisabled"></UploadHeadImg>
      </div>
      <div v-if="buttonDisabled">
        <van-field
          v-for="(item, index) in editMessage"
          :key="index"
          v-model="item.text"
          :label="item.label"
          :readonly="buttonDisabled || item.readOnly"
          :disabled="!buttonDisabled && item.disabled"
          placeholder="--"
          input-align="right"
          @click-input="handleOpenArea(item)"
        />
      </div>
      <div v-else>
        <van-field
          v-for="(item, index) in editMessage"
          :key="index"
          v-model="item.text"
          :label="item.label"
          :readonly="buttonDisabled || item.readOnly"
          :disabled="!buttonDisabled && item.disabled"
          placeholder="--"
          input-align="right"
          @click-input="handleOpenArea(item)"
        />
      </div>

      <!-- 执裁经历 -->
      <div class="mobile-message-big" style="border-top: 1px solid #f0f3f7;">
        <p class="mobile-label">执裁经历：</p>
        <historyInput ref="historyInput" v-if="!buttonDisabled" v-model="experienceData"></historyInput>
        <div
          v-else
          v-for="year in Object.keys(experienceData).reverse()"
          :key="year"
          class="mobile-big-item"
        >
          <div class="mobile-big-label">{{ year }}</div>
          <div class="mobile-big-value">
            <span v-for="item in experienceData[year]" :key="item.value">
              {{item.label}}
            </span>
          </div>
        </div>
      </div>

      <!-- 身份 -->
      <div class="mobile-message-big" style="border-top: 1px solid #f0f3f7;">
        <p class="mobile-label">
          身份
          <span v-if="!buttonDisabled" @click="showAuthPopup=true">编辑<i icon="el-icon-arrow-right" /></span>
        </p>
        <div
          v-for="authKey in Object.keys(authDataMobile)"
          :key="authKey"
          class="mobile-big-item"
        >
          <div class="mobile-big-label">{{ authKey }}</div>
          <div class="mobile-big-value">
            <span v-for="item in authDataMobile[authKey]" :key="item.label">
              {{item.label}}
            </span>
          </div>
        </div>
      </div>
      <van-popup position="bottom" v-model="showArea">
        <Picker
          title="常驻城市"
          show-toolbar
          :columns="cityListMB"
          @confirm="confirmArea"
          @cancel="cancelArea"
        />
      </van-popup>
      <AuthInput ref="authInput" :show.sync="showAuthPopup" @confirm="res => (authDataMobile=res)"></AuthInput>
    </section>
    <section class="mobile-footer">
      <!-- 拒绝理由 -->
      <p class="mobile-footer-tip" v-if="rejectReason">拒绝理由：{{rejectReason}}</p>
      <div
        :class="!buttonDisabled ? 'button button-primary' : 'button button-gray'"
        @click="authenticateAction"
      >
        <span>立即认证</span>
        <span class="warnTextH5" v-if="buttonDisabled">
        （等待审核中）
    </span>
      </div>
    </section>
  </div>
  <div v-else>
    <div class="back">
      <div class="top">
        <div class="topImage"></div>
        <div class="pageTitle">赛事运营支持系统</div>
      </div>

      <div class="content">
        <!-- 拒绝理由 -->
        <p class="content-tip" v-if="rejectReason">拒绝理由：{{rejectReason}}</p>
        <div class="content-title">信息认证</div>
        <div class="dialogBox-center">
          <!-- 基本信息 -->
          <section class="message-basic">
            <div class="message-basic-left">
              <div class="dialogBox-contentList">
                <span><span style="color: red">*</span>姓名：</span>
                <el-input
                  class="contentListRight"
                  v-model="userInfo.name"
                  placeholder="请填写姓名"
                  size="small"
                  :disabled="buttonDisabled"
                ></el-input>
              </div>
              <div class="dialogBox-contentList">
                <span>手机号：</span>
                <el-input
                  class="contentListRight"
                  v-model="userInfo.mobile"
                  placeholder="请输入内容"
                  size="small"
                  :disabled="true"
                ></el-input>
              </div>
              <div class="dialogBox-contentList">
                <span>邮箱：</span>
                <el-input
                  class="contentListRight"
                  v-model="userInfo.email"
                  placeholder="请输入内容"
                  size="small"
                  :disabled="true"
                ></el-input>
              </div>
              <div class="dialogBox-contentList">
                <span>裁判编号：</span>
                <el-input
                  class="contentListRight"
                  v-model="userInfo.refereeNumber"
                  placeholder="请填写裁判编号"
                  size="small"
                  :disabled="buttonDisabled"
                ></el-input>
              </div>
              <div class="dialogBox-contentList">
                <span><span style="color: red">*</span>常驻城市：</span>
                <el-select
                  placeholder="请选择地区"
                  v-model="userInfo.city"
                  class="contentListRight"
                  :disabled="buttonDisabled"
                >
                  <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.city"
                    :value="item.city"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="message-basic-right">
              <UploadHeadImg v-model="userInfo.image" :canUpload="!buttonDisabled" @uploadSuccess="updateImage" class="upload" ></UploadHeadImg>
              <span>上传头像</span>
            </div>
          </section>
          <!-- 执裁经历 -->
          <section class="dialogBox-contentList">
            <span>执裁经历：</span>
            <historyInput ref="historyInput" v-model="experienceData" :readOnly="buttonDisabled"></historyInput>
          </section>
          <!-- 身份 -->
          <div class="dialogBox-contentList lastContentList">
            <div><span style="color: red">*</span>身份</div>
          </div>
          <div>
            <div
              class="identityList"
              v-for="(item, index) in identityList"
              :key="index"
            >
              <div class="contestTypeName">{{ item.contestTypeName }}</div>
              <div>
                <div class="dialogBox-checkout">
                  <el-checkbox-group v-model="identSelect">
                    <el-checkbox
                      :label="identity.identityName"
                      v-for="(identity, identityIndex) in item.identityList"
                      :key="identityIndex"
                      :disabled="buttonDisabled"
                    ></el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="flex:none">
          <div
            :class="{
              authenticateButton: true,
              buttonDisabled: buttonDisabled,
            }"
            @click="authenticateAction"
          >
            立即认证
          </div>
          <div class="warnText">{{ reason }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dialogBox from "../../components/accountManage/dialog.vue";
import * as api_account from "../../api/account";
import { area } from "@/utils/area-data";
import { Picker, Notify } from "vant";
import UploadHeadImg from "@/components/uploadHeadImg/index.vue"
import historyInput from "@/components/historyInput"
import AuthInput from "@/components/authInput"
export default {
  name: "accountManage",
  components: {
    dialogBox,
    Picker,
    UploadHeadImg,
    historyInput,
    AuthInput
  },
  data() {
    return {
      pcaa: area,
      name: "", //姓名
      event: "", //所属赛事
      ident: "", //身份
      limit: "", //权限
      state: "", //状态
      popup: true, //二次确认弹窗
      dialogTitle: "信息认证", //弹窗标题
      dialogMessage: "", //弹窗内容
      userInfo: {},
      experienceData: {}, //执裁经历
      identSelect: [],
      identityList: [],
      reason: "", //提示语
      buttonDisabled: false, //按钮是否禁用
      cityList: [], //全部城市列表
      authData: {},
      authValue: {},
      showArea: false,

      editMessage: [
        { label: "姓名：", text: "" },
        { label: "裁判编号：", text: ""},
        { label: "手机号：", text: "", disabled: true },
        { label: "邮箱：", text: "", disabled: true },
        { label: "常驻城市：", text: "", readOnly: true },
      ],
      showAuthPopup: false, //显示身份编辑弹窗
      authDataMobile: {},
      rejectReason: ""
    };
  },

  created() {
    this.getUserInfo();
  },
  computed: {
    cityListMB() {
      return this.cityList.map(d => d.city)
    }
  },
  watch: {
    "userInfo.refereeNumber"(nowVal) {
      let res = nowVal;
      let prepend = "REF";
      let herePend = res.slice(0,3);
      if(prepend != herePend && res) {
        res = prepend + res
      }
      res = res.slice(0, 3) + res.slice(3).replace(/\D/g,"");
      this.userInfo.refereeNumber = res.slice(0, 6);
    },
    "editMessage": {
      handler(nowVal) {
        let res = nowVal[1].text;
        let prepend = "REF";
        let herePend = res.slice(0,3);
        if(prepend != herePend && res) {
          res = prepend + res
        }
        res = res.slice(0, 3) + res.slice(3).replace(/\D/g,"");
        this.editMessage[1].text = res.slice(0, 6);
      },
      deep: true
    }
  },
  methods: {
    //先请求用户信息
    getUserInfo() {
      api_account.getUserInfo({}).then((res) => {
        if (res.success) {
          const {userInfo, userRefereeContestHistory} = res.data;
          // 执裁经历
          this.experienceData = userRefereeContestHistory.reduce((res, val) => {
            if(!Object.keys(res).some(d => d == val.year)) {
              res[val.year] = []
            }
            res[val.year].push({
              ...val,
              id: val.contestHistoryId,
              label: `${val.type} - ${val.name}`,
              value: val.contestHistoryId
            })
            return res;
          }, {})
          userInfo.refereeNumber = userInfo.refereeNumber ? "REF" + userInfo.refereeNumber : userInfo.refereeNumber;
          for (let i = 0; i < this.editMessage.length; i++) {
            const element = this.editMessage[i];
            switch (i) {
              case 0:
                element.text = userInfo.name;
                break;
              case 1: 
                element.text = userInfo.refereeNumber;
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
          if (userInfo.forbidden) {
            //封禁
            this.reason = "该账号已封禁，请联系管理员";
            this.buttonDisabled = true;
          } else {
            switch (userInfo.status) {
              case 1:
                this.reason = "等待管理员审核中";
                this.buttonDisabled = true;
                break;
              case 2:
                //已初次通过直接去个人中心
                this.$router.replace("/personal/personalDetail");
                break;
              case 3:
                //已初次通过直接去个人中心
                this.$router.replace("/personal/personalDetail");
                break;
              case 4:
                this.reason = "审核未通过请重新填写";
                this.rejectReason = res.data.rejectReason;
                break;
              default:
                break;
            }
          }
          this.userInfo = userInfo;
          this.getCityList();
          this.getIdentityList();
        }
      });
    },
    //去登录
    goLoginAction() {
      this.$router.replace("/login");
    },
    //获取城市列表
    getCityList() {
      api_account.cityList().then((res) => {
        if (res.success) {
          this.cityList = res.data.list;
        }
      });
    },
    //立即认证事件
    authenticateAction() {
      if (this.buttonDisabled) {
        return;
      }
      let params = {
        image: this.userInfo.image,
        contestHistoryId: this.$refs.historyInput.getIdList().join(",")
      };
      debugger
      if(this.isMobile()) {
        params.name = this.editMessage[0].text;
        params.city = this.editMessage[4].text;
        params.refereeNumber = this.editMessage[1].text.slice(3);
        params.identityId = this.$refs.authInput.getValue().join(",");
      } else {
        params.name = this.userInfo.name;
        params.city = this.userInfo.city;
        params.refereeNumber = this.userInfo.refereeNumber.slice(3);
        var submitIdentityArray = [];
        this.identityList.forEach((contest) => {
          contest.identityList.forEach((identity) => {
            if (this.identSelect.includes(identity.identityName)) {
              submitIdentityArray.push(identity.identityId);
            }
          });
        });
        params.identityId = submitIdentityArray.join(",");
      }
      if ( !params.name ) {
        this.$message.error("请填写姓名");
        return;
      }
      // if ( !params.refereeNumber ) {
      //   this.$message.error("请填写裁判编号");
      //   return;
      // }
      if (!params.city) {
        this.$message.error("请选择城市");
        return;
      }
      if ( !params.identityId ) {
        this.$message.error("请选择身份");
        return;
      }
      

      api_account
        .userAuth(params)
        .then((res) => {
          if (res.success) {
            this.$message.success("认证成功，请等待审核");
            setTimeout(() => {
              location.reload();
            }, 500);
          } else {
            this.$message.error("认证失败，请稍后再试");
          }
        });
    },

    confirmArea(city) {
      this.userInfo.city = city
      this.editMessage[4].text = city
      this.cancelArea();
    },
    cancelArea() {
      this.showArea = false;
    },

    //身份列表
    getIdentityList() {
      api_account.getIdentityList().then((res) => {
        if (res.success) {
          this.identityList = res.data.list;
          this.authDataMobile = res.data.list.reduce((res1, val) => {
            let temp = val.identityList.filter(d => d.select);
            if(temp?.length) {
              res1[val.contestTypeName] = temp.map(d => ({
                ...d,
                label: d.identityName,
                value: d.identityId
              }))
            }
            return res1;
          }, {});
          var selectArray = [];
          this.identityList.forEach((element) => {
            element.identityList.forEach((identity) => {
              if (identity.select === 1) {
                selectArray.push(identity.identityName);
              }
            });
          });
          this.identSelect = selectArray;
          var obj = {};
          var chooseObj = {};
          //全部身份数据处理
          this.identityList.forEach((element) => {
            var array = [];
            var idenArray = [];
            element.identityList.forEach((identity) => {
              var identityObj = {};
              identityObj.text = identity.identityName;
              array.push(identityObj);

              if (identity.select == 1) {
                idenArray.push(identity.identityName);
              }
            });
            obj[element.contestTypeName] = array;
            chooseObj[element.contestTypeName] = idenArray;
          });
          this.authData = obj;
          this.authValue = chooseObj;
        }
      });
    },

    handleOpenArea(item) {
      if ( !this.buttonDisabled && item.label.includes("城市")) {
        this.showArea = true;
      }
    },
    updateImage(url) {
      this.userInfo.image = url
    },
    handleEdit() {

    }
  },
};
</script>
<style scoped lang="less">
// 除去制裁经历的基本个人信息
.message-basic {
  display: flex;
  align-items: center;
  justify-content: space-between;
  &-left {
    width: 410px;
  }
  &-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-left: 50px;
    border-left: 1px solid #D9D9D9;
    height: 165px;
    width: 200px;
    font-size: 14px;
    color: #666666;
    .upload {
      margin-bottom: 10px;
      height: 96px;
      width: 96px;
    }
  }
}
.detail-list-left {
  flex: 4;
}
.dialogBox-center {
  padding: 20px 50px;
  height: 0;
  flex: auto;
  overflow: auto;
}
.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
.dialogBox-contentList {
  width: 100%;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #666666;
  padding-bottom: 10px;
}

.dialogBox-contentList span {
  flex: none;
  width: 87px;
  line-height: 40px;
  align-self: flex-start;
}
.dialogBox-checkname {
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
  margin-right: 48px;
  padding-left: 10px;
}
.dialogBox-check {
  display: flex;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #666666;
}
.limitCheck {
  margin-right: 10px !important;
  margin-bottom: 15px !important;
}
.limitmr .el-checkbox-group:nth-child(1) .limitCheck:nth-child(2) {
  margin-left: 13px !important;
}
.limitmr .el-checkbox-group:nth-child(1) .limitCheck:nth-child(3) {
  margin-left: 14px !important;
}
.limitmr .el-checkbox-group:nth-child(1) .limitCheck:nth-child(4) {
  margin-left: 15px !important;
}

.detail-time {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 500;
  color: #999999;
}
.detail {
  padding: 20px;
  padding-top: 9px;
}
.detail-list {
  padding: 20px;
  display: flex;
}
.detail-list-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #666666;
  font-size: 14px;
  margin-bottom: 16px;
}
.detail-split {
  height: 104px;
  border-right: 1px solid #e7e7e7;
  margin: auto 20px;
}

.detail-list-logo {
  display: flex;
  font-family: MicrosoftYaHei;
}
.detail-list-logo /deep/ .el-image__inner {
  width: auto !important;
  height: auto !important;
}
.detail-list-text {
  font-family: Helvetica;
}
.detail-list-tip {
  margin-left: 7px;
}
.detail-list-idot {
  width: 4px;
  height: 4px;
  margin-right: 7px;
}
.detail-list-center {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
}
.chunk-text {
  min-width: 42px;
}
.chunk-wrap {
  display: flex;
  margin-top: 10px;
}
.chunk {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  padding-left: 20px;
}
.chunk-text {
  min-width: 42px;
}
.el-input {
  height: 40px;
  width: 224px;
  display: flex;
  align-items: center;
}
.el-select {
  width: 224px;
}
.detail-list-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
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

.pageTitle {
  font-size: 24px;
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  font-weight: bold;
  color: #1d81ee;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  width: 850px;
  height: 600px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);
  border-radius: 4px 10px 10px 10px;
  box-sizing: border-box;
  overflow: auto;
  // transform: translate(-50%, -50%);
  background-color: white;
  &-tip {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    padding: 7px;
    line-height: 22px;
    text-align: center;
    background: rgba(247, 0, 0, 0.6);
    color: #ffffff;
    font-size: 16px;
  }
}
.content-title {
  flex: none;
  padding-bottom: 10px;
  font-size: 20px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #111111;
  text-align: center;
}

.contentListRight {
  width: 320px;
}
.el-input--small /deep/ .el-input__inner {
  height: 40px;
}
.lastContentList {
  margin-top: 10px;
}

.el-checkbox {
  margin-right: 16px;
}
.line {
  margin-top: 20px;
  height: 1px;
  background: #d8d8d8;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);
}
.authenticateButton {
  flex: none;
  width: 298px;
  height: 44px;
  background-color: #1d81ee;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #ffffff;
  line-height: 44px;
  text-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  text-align: center;
  margin: 30px auto 0;
  cursor: pointer;
}
.buttonDisabled {
  background-color: #d9e0e8;
  color: white;
}
.goLoginButton {
  width: 43px;
  height: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #1d81ee;
  line-height: 20px;
  text-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  margin: 20px auto 0;
  cursor: pointer;
}
.identityList {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 14px;
}
.contestTypeName {
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
  width: 87px;
}
.dialogBox-checkout /deep/ .el-checkbox__label {
  margin-left: 2px;
  padding-left: 0px;
}
.dialogBox-checkout /deep/ .el-checkbox {
  margin-right: 10px;
  width: auto;
  min-width: 110px;
}
.warnText {
  color: #ff0000;
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  margin-top: 3px;
}

.dialogBox-contentList /deep/ .is-disabled {
  background-color: #f5f7fa !important;
}
.back {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/accountAuthentication/back_image.png") !important;
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
}
.topImage {
  margin-top: 13px;
  width: 204px;
  height: 64px;
  background-image: url("../../assets/accountAuthentication/TJ_logo.png") !important;
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
}
.top {
  display: flex;
  padding-left: 20px;
  padding-top: 26px;
  align-items: center;
}

.head-title {
  margin-top: 16px;
}
.auth-container {
  padding-bottom: 13px;
  border-bottom: 1px solid #f0f3f7;
}
.auth-title {
  padding-right: 10px;
  width: 60px;
  font-size: 14px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  font-weight: 500;
  color: #676767;
}

.warnTextClass {
  color: #ff0000;
  text-align: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  text-align: center;
  padding-top: 4px;
}
.button {
  height: 44px;
  width: 100%;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  box-sizing: border-box;
  line-height: 44px;
  text-align: center;
}
.button-canEdit {
  background-color: #1d81ee;
  color: white;
  margin-top: 20px;
}
.button-EditDisable {
  background-color: #d9e0e8;
  color: white;
  margin-top: 20px;
}
.pageTitleMB {
  padding-top: 57px;
  text-align: center;
  color: #333333;
  font-size: 18px;
  font-weight: bold;
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
}
.contentBackMB {
  margin-top: 33px;
  padding: 0px 16px;
  height: calc(100vh - 200px);
  /* overflow: hidden; */
  overflow: scroll;
}
.contentMB {
  background-color: white;
  border-radius: 4px;
  padding: 0px 16px 20px;
}
.contentLine {
  height: 50px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.cellLeft {
  width: 95px;
  height: 100%;
  display: flex;
  align-items: center;
}
.cellRight {
  width: calc(100% - 95px);
  height: 100%;
}
.redStar {
  font-size: 14px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  font-weight: bold;
  color: #f70000;
}
.cellLeftText {
  font-size: 14px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  font-weight: Medium;
  color: #333333;
}
.cellLeftTextDisabled {
  font-size: 14px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  font-weight: Medium;
  color: #cccccc;
}

.cellRight {
  display: flex;
  align-items: center;
}
.cellRightInput {
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #666666;
  border: none;
}
.cellRightInputDisabled {
  font-size: 14px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #cccccc;
  border: none;
}

.auth-container
  /deep/
  .el-checkbox-group
  .el-checkbox:nth-child(1)
  .el-checkbox__label {
  width: 75px;
  padding-left: 4px;
}

.auth-container
  /deep/
  .el-checkbox-group
  .el-checkbox:nth-child(2)
  .el-checkbox__label {
  width: 90px;
  padding-left: 4px;
}

.auth-container
  /deep/
  .el-checkbox-group
  .el-checkbox:nth-child(3)
  .el-checkbox__label {
  width: 90px;
  padding-left: 4px;
}
.citySelectMB {
  position: relative;
}
.rightArrow {
  position: absolute;
  width: 8px;
  height:14px;
  top: 18px;
  right: 0px;
  font-size: 14px;
  line-height: 50px;
}

.mobile-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .mobile-upload {
    width: 96px;
    height: 96px;
    &-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 20px;
      padding: 20px 0;
      border-bottom: 1px solid #F0F3F7;
      width: calc(100% - 40px);
    }
  }
  ::v-deep .el-checkbox {
    margin: 0;
    color: #999999;
    &-group {
      display: flex;
      justify-content: space-between;
      padding: 13px 0;
    }
  }
  .head-title {
    margin: 19px 16px 5px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    color: #333333;
  }
  .mobile-main {
    height: 0;
    flex: auto;
    overflow: auto;
  }
  .mobile-header {
    flex: none
  }
  .mobile-footer {
    position: relative;
    flex: none;
    display: flex;
    padding: 16px 20px;
    height: 76px;
    background: #ffffff;
    box-shadow: 0px -2px 14px 0px rgba(68, 68, 68, 0.11);
    border-radius: 1px;
    box-sizing: border-box;
    &-tip {
      position: absolute;
      bottom: 76px;
      right: 0;
      left: 0;
      padding: 7px;
      line-height: 22px;
      text-align: center;
      background: rgba(247, 0, 0, 0.6);
      color: #ffffff;
      font-size: 16px;
    }
    .button {
      flex: 1;
      width: 100%;
      height: 100%;
    }
  }
  .auth-container {
    padding: 10px 16px 0;
    border-bottom: 1px solid #f0f3f7;
    .auth-title {
      padding-right: 10px;
      width: 60px;
      font-size: 14px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #676767;
    }
  }
}
.mobile-label,::v-deep .van-cell {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333333;
  font-size: 14px;
}
.mobile-message-big {
  margin: 0 20px;
  border-bottom: 1px solid #f0f3f7;
  .mobile-big-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
    line-height: 24px;
    font-size: 14px;
    color: #666666;
    .mobile-big-label {
      width: 110px;
      flex: none;
    }
    .mobile-big-value {
      display: flex;
      flex-direction: column;
      width: 0;
      flex: auto;
      text-align: right;
      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
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
}
</style>
