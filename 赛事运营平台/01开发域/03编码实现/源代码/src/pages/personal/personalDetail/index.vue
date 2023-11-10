<template>
  <div v-if="isMobile()" class="mobile-container">
    <section class="mobile-main">
      <div class="mobile-upload-container">
        <UploadHeadImg class="mobile-upload" v-model="userInfo.image" :canUpload="editing"></UploadHeadImg>
      </div>
      <div v-if="!editing">
        <van-field v-for="(item, index) in message" :key="index" v-model="item.text" :label="item.label"
          :readonly="!editing || item.readOnly" :disabled="editing && item.disabled" placeholder="--" input-align="right"
          @click-input="handleOpenArea(item)" />
      </div>
      <div v-else>
        <van-field v-for="(item, index) in editMessage" :key="index" v-model="item.text" :label="item.label"
          :readonly="!editing || item.readOnly" :disabled="editing && item.disabled" placeholder="--" input-align="right"
          @click-input="handleOpenArea(item)" />
      </div>

      <!-- 执裁经历 -->
      <div class="mobile-message-big" style="border-top: 1px solid #f0f3f7;">
        <p class="mobile-label">
          执裁经历
        </p>
        <historyInput ref="historyInput" v-if="editing" v-model="experienceData"></historyInput>
        <div v-else v-for="year in Object.keys(experienceData).reverse()" :key="year" class="mobile-big-item">
          <div class="mobile-big-label">{{ year }}</div>
          <div class="mobile-big-value">
            <span v-for="item in experienceData[year]" :key="item.value">
              {{ item.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- 身份 -->
      <div class="mobile-message-big" style="border-top: 1px solid #f0f3f7;">
        <p class="mobile-label">
          身份
          <span v-if="editing" @click="showAuthPopup = true">编辑<i icon="el-icon-arrow-right" /></span>
        </p>
        <div v-for="authKey in Object.keys(authData)" :key="authKey" class="mobile-big-item">
          <div class="mobile-big-label">{{ authKey }}</div>
          <div class="mobile-big-value">
            <span v-for="item in authData[authKey]" :key="item.label">
              {{ item.label }}
            </span>
          </div>
        </div>
      </div>
      <van-popup position="bottom" v-model="showArea">
        <Picker title="常驻城市" show-toolbar :columns="cityList" @confirm="confirmArea" @cancel="cancelArea" />
      </van-popup>
      <AuthInput ref="authInput" :show.sync="showAuthPopup" @confirm="res => (authData = res)"></AuthInput>
    </section>
    <section class="mobile-footer">
      <template v-if="editing">
        <div class="button button-red" @click="phoneEditCancel">取消</div>
        <div class="button button-primary" @click="phoneSaveConfirm">保存</div>
      </template>
      <div v-else :class="canEdit ? 'button button-primary' : 'button button-gray'" @click="handleEdit">
        <span>编辑</span>
        <span class="warnTextH5" v-if="!editing && !canEdit">
          （等待审核中）
        </span>
      </div>
    </section>
  </div>
  <div v-else class="page-container">
    <section class="pb27 border-b">
      <p class="head-title">基本信息</p>
      <div class="message-container">
        <UploadHeadImg class="upload" v-model="userInfo.image" :canUpload="editing"></UploadHeadImg>
        <div class="line"></div>
        <div class="message-list">
          <template v-if="editing">
            <Message v-for="(item, index) in editMessage" v-bind="item" :key="index">
              <el-select v-if="item.label.includes('城市')" placeholder="请选择地区" v-model="selectCity">
                <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>

              <el-input v-else type="text" v-model="item.text" :disabled="item.disabled" />
            </Message>
          </template>

          <template v-else>
            <Message v-for="(item, index) in message" v-bind="item" :key="index">
            </Message>
          </template>
        </div>
      </div>
    </section>
    <section class="pb27">
      <section class="message-big">
        <p>
          执裁经历：
          <template v-if="!editing && Object.keys(experienceData).length > 2">
            <span @click="experienceOpen = true" v-if="!experienceOpen" style="color: #1D81EE; cursor:pointer">展开 <i
                class="el-icon-arrow-down"></i></span>
            <span @click="experienceOpen = false" v-else style="color: #1D81EE; cursor: pointer">收起 <i
                class="el-icon-arrow-up"></i></span>
          </template>
        </p>
        <div class="message-list chooseIdentityList">
          <!-- 如果是编辑，第一行新增添加行 -->
          <historyInput ref="historyInput" v-if="editing" class="auth-container" v-model="experienceData"></historyInput>
          <div v-else class="auth-container" v-for="year in Object.keys(experienceShowData).reverse()" :key="year">
            <span class="auth-title">{{ year }}</span>
            <span class="auth-text">{{ experienceShowData[year].map(d => d.label).join("、") }}</span>
          </div>
        </div>
      </section>
      <section class="message-big">
        <p>身份：</p>
        <AuthInput ref="authInput" class="chooseIdentityList" v-show="editing"></AuthInput>
        <div class="message-list chooseIdentityList" v-show="!editing">
          <div>
            <div class="auth-container" v-for="authKey in Object.keys(authData)" :key="authKey">
              <span class="auth-title">{{ authKey }}</span>
              <span class="auth-text">{{ authData[authKey].map(d => d.label).join("、") }}</span>
            </div>
          </div>
        </div>
      </section>
    </section>
    <!-- 底部按钮 -->
    <section class="mt-8">
      <template v-if="editing">
        <div class="button button-gray" @click="cancelDialog">取消</div>
        <div class="button button-primary" @click="saveDialog">保存</div>
      </template>
      <div v-else :class="canEdit ? 'button button-primary' : 'button button-gray'" @click="handleEdit">
        <img v-if="canEdit" src="@/assets/accountManage/edit_white.png" alt="" />
        <span @click="handleInputIdentify">编辑</span>
      </div>
    </section>
    <div class="warnText" v-if="!editing && !canEdit">
      等待审核中
    </div>

    <dialogBoxPC :popup.sync="saveDialogBox" @cancelOrConfirm="saveDialogCancelOrConfirm">
      <div class="dialogText">是否确认修改并提交审核？</div>
    </dialogBoxPC>
    <dialogBoxPC :popup.sync="cancelDialogBox" @cancelOrConfirm="cancelDialogCancelOrConfirm">
      <div class="dialogText">是否放弃本次修改？</div>
    </dialogBoxPC>
  </div>
</template>
<script>
import {areaList} from "@vant/area-data";
import Message from "./components/message.vue";
import * as api_account from "@/api/account";
import {area} from "@/utils/area-data";
import dialogBoxPC from "./components/dialogPC.vue";
import UploadHeadImg from "@/components/uploadHeadImg/index.vue";
import historyInput from "@/components/historyInput";
import AuthInput from "@/components/authInput";
import {Picker} from "vant";
export default {
  components: {Message, dialogBoxPC, Picker, UploadHeadImg, historyInput, AuthInput},
  data() {
    return {
      saveDialogBox: false, //保存提示
      cancelDialogBox: false, //取消提示
      area: area,
      message: [
        {label: "姓名：", text: ""},
        {label: "裁判编号：", text: ""},
        {label: "手机号：", text: "", disabled: true},
        {label: "邮箱：", text: "", disabled: true},
        {label: "常驻城市：", text: "", readOnly: true},
      ],
      editMessage: [
        {label: "姓名：", text: ""},
        {label: "裁判编号：", text: ""},
        {label: "手机号：", text: "", disabled: true},
        {label: "邮箱：", text: "", disabled: true},
        {label: "常驻城市：", text: "", readOnly: true},
      ],
      authData: {},
      experienceValue: [],
      experienceData: {}, //执裁经历
      areaList: areaList,
      editing: false, //编辑中
      showArea: false,
      userInfo: {},
      userIdentityCurrent: {}, //用户身份
      selectCity: "",
      identityList: [], //系统全部身份
      canEdit: true,
      res: {}, //保存接口数据 取消重置用
      cityList: [], //全部城市列表
      showAuthPopup: false, //显示身份编辑弹窗
      experienceOpen: false, //裁判经历展开状态
    };
  },
  computed: {
    // 转成elementui格式地址
    areaPc() {
      const {province_list, city_list, county_list} = this.areaList;
      const county = Object.keys(county_list).map((key) => ({
        label: county_list[key],
        value: key,
      }));
      const city = Object.keys(city_list).map((key) => ({
        label: city_list[key],
        value: key,
        children: county.filter(
          (d) => d.value - key >= 0 && d.value - key <= 100
        ),
      }));
      const province = Object.keys(province_list).map((key) => ({
        label: province_list[key],
        value: key,
        children: city.filter(
          (d) => d.value - key >= 0 && d.value - key <= 10000
        ),
      }));
      return province;
    },
    experienceShowData() {
      // 如果是收起状态且非编辑状态， 只展示两条数据
      if (this.editing || this.experienceOpen) {
        return this.experienceData;
      } else {
        // 取最近两年
        let yearArr = Object.keys(this.experienceData).sort((a, b) => b - a).slice(0, 2);
        return yearArr.reduce((res, val) => {
          res[val] = this.experienceData[val];
          return res;
        }, {});
      }
    }
  },
  watch: {
    "editMessage": {
      handler(nowVal) {
        if (this.editing) {
          let res = nowVal[1].text;
          let prepend = "REF";
          let herePend = res.slice(0, 3);
          if (prepend != herePend && res) {
            res = prepend + res;
          }
          res = res.slice(0, 3) + res.slice(3).replace(/\D/g, "");
          this.editMessage[1].text = res.slice(0, 6);
        }
      },
      deep: true
    }
  },
  created() {
    this.getUserInfo();
    this.getCityList();
  },

  methods: {
    //获取城市列表
    getCityList() {
      api_account.cityList().then((res) => {
        if (res.success) {
          var cityArray = [];
          res.data.list.forEach((element) => {
            cityArray.push(element.city);
          });

          this.cityList = cityArray;
        }
      });
    },
    handleInputIdentify() {

    },
    //手机端取消确认弹窗
    phoneEditCancel() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否放弃本次修改？",
        })
        .then(() => {
          this.editing = false;
        });
    },

    phoneSaveConfirm() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否确认修改并提交审核？",
        })
        .then(() => {
          this.authenticateAction();
        });
    },

    handleEdit() {
      if (!this.canEdit) {
        return;
      }
      this.editing = !this.editing;
      let userInfo = this.res.data.userInfo;
      this.selectCity = "";
      if (userInfo.city) {
        this.selectCity = userInfo.city;
      }

      this.userInfo = userInfo;
      for (let i = 0; i < this.message.length; i++) {
        const element = this.message[i];
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
            element.text = userInfo.city;
            break;
          default:
            break;
        }
      }
      //深拷贝
      this.editMessage = JSON.parse(JSON.stringify(this.message));
    },

    //保存信息二次弹窗
    saveDialog() {
      if (!this.editMessage[0].text) {
        this.$message.warning("请填写姓名");
        return;
      }
      if (!this.editMessage[1].text.slice(3)) {
        this.$message.warning("请填写裁判编号");
        return;
      }
      if (!this.selectCity) {
        this.$message.error("请选择城市");
        return;
      }
      this.saveDialogBox = true;
    },

    //保存信息二次弹窗点击事件
    saveDialogCancelOrConfirm(e) {
      if (e == "confirm") {
        this.authenticateAction();
      }
    },

    //保存基本信息重新审核
    authenticateAction() {
      let name = this.editMessage[0].text;
      let refereeNumber = this.editMessage[1].text.slice(3);
      api_account.userAuth({
        name, refereeNumber, city: this.selectCity, image: this.userInfo.image,
        identityId: this.$refs.authInput.getValue().join(","),
        contestHistoryId: this.$refs.historyInput.getIdList().join(",")
      }).then((res) => {
        if (res.success) {
          this.$message.success("编辑成功，请等待审核");
          setTimeout(() => {
            location.reload();
          }, 500);
        }
      });
    },

    //保存信息二次弹窗
    cancelDialog() {
      this.cancelDialogBox = true;
    },

    //取消编辑信息二次弹窗点击事件
    cancelDialogCancelOrConfirm(e) {
      if (e == "confirm") {
        this.handleEdit();
      }
    },

    handleOpenArea(item) {
      if (item.label.includes("城市") && this.editing) {
        this.showArea = true;
      }
    },
    confirmArea(res) {
      console.log(res);
      this.editMessage[4].text = res;
      this.selectCity = res;
      this.cancelArea();
    },
    cancelArea() {
      this.showArea = false;
    },

    //身份列表
    getIdentityList() {
      api_account.getIdentityList().then((res) => {
        if (res.success) {
          this.authData = res.data.list.reduce((res1, val) => {
            let temp = val.identityList.filter(d => d.select);
            if (temp?.length) {
              res1[val.contestTypeName] = temp.map(d => ({
                ...d,
                label: d.identityName,
                value: d.identityId
              }));
            }
            return res1;
          }, {});
        }
      });
    },

    //请求用户信息
    getUserInfo() {
      api_account.getUserInfo({}).then((res) => {
        if (res.success) {
          this.res = res;
          const {userInfo, userRefereeContestHistory} = res.data;
          // 执裁经历
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
          // 编辑状态 3.5可编辑
          this.canEdit = userInfo.status === 3 || userInfo.status === 5;
          this.selectCity = userInfo.city || "";
          userInfo.refereeNumber = userInfo.refereeNumber ? "REF" + userInfo.refereeNumber : userInfo.refereeNumber;

          this.userInfo = userInfo;
          for (let i = 0; i < this.message.length; i++) {
            const element = this.message[i];
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
          //深拷贝
          this.editMessage = JSON.parse(JSON.stringify(this.message));
          this.getIdentityList();
        }
      });
    },
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
    height: 24px;
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #111111;
    line-height: 24px;
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

    ::v-deep .el-checkbox-group {
      display: flex;
      justify-content: center;
    }
  }

  .message-big {
    border-bottom: 1px dashed #E5E8ED;
    margin-top: 20px;
    font-size: 14px;
    color: #666666;

    >p {
      display: flex;
      align-content: center;
      justify-content: space-between;

      span {
        display: flex;
        align-items: center;

        i {
          margin-left: 4px;
          font-size: 10px;
        }
      }
    }
  }

  .auth-container {
    margin-bottom: 20px;
    display: flex;

    .auth-title {
      flex: none;
      padding-right: 10px;
      width: 60px;
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
      flex: auto;
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
    }
  }
}

.mobile-container {
  display: flex;
  flex-direction: column;
  background: #ffffff;

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

  .mobile-footer {
    display: flex;
    padding: 16px 20px;
    height: 76px;
    background: #ffffff;
    box-shadow: 0px -2px 14px 0px rgba(68, 68, 68, 0.11);
    border-radius: 1px;
    box-sizing: border-box;

    .button {
      flex: 1;
      width: 100%;
      height: 100%;

      &:first-of-type {
        margin-right: 20px;
      }
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

.mobile-label,
::v-deep .van-cell {
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

.chooseIdentityList {
  padding-top: 20px;
}

.dialogText {
  text-align: center;
}

.warnText {
  color: #ff0000;
  font-size: 14px;
  text-align: center;
  padding-top: 5px;
}

.warnTextH5 {
  color: #ff0000;
  font-size: 14px;
}
</style>
