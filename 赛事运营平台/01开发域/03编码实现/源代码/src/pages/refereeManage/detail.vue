<template>
  <div v-if="isMobile()" class="mobile-container">
    <section class="mobile-header">
      <UploadHeadImg class="mobile-upload" v-model="userInfo.image" :canUpload="false"></UploadHeadImg>
      <div>
        <p class="name">{{userInfo.name}}</p>
        <div>
          <p>手机号：{{userInfo.mobile}}</p>
          <p>邮箱：{{userInfo.email}}</p>
        </div>
      </div>
    </section>
    <section class="mobile-main">
      <div>
        <van-field
          v-for="(item, index) in mobileMessage"
          :key="index"
          v-model="item.text"
          :label="item.label"
          :readonly="true"
          placeholder="--"
          input-align="right"
        />
      </div>

      <!-- 执裁经历 -->
      <div class="mobile-message-big" style="border-top: 1px solid #f0f3f7;">
        <p class="mobile-label">
          执裁经历
        </p>
        <div
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
        </p>
        <div
          v-for="authKey in Object.keys(authData)"
          :key="authKey"
          class="mobile-big-item"
        >
          <div class="mobile-big-label">{{ authKey }}</div>
          <div class="mobile-big-value">
            <span v-for="item in authData[authKey]" :key="item.label">
              {{item.label}}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="page-container">
    <section class="pb27 border-b">
      <p class="head-title">裁判详情
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
          </Message>
          <!-- 裁判状态 -->
          <div class="referee-box-status">
            <div v-if="userInfo.refereeStatus == 2" class="reason">
                <span>({{userInfo.freezeStart}}至{{userInfo.freezeEnd}})</span>
            </div>
            <el-popover
                placement="top"
                width="200"
                trigger="hover"
                :disabled="userInfo.refereeStatus != 2"
                :content="'冻结原因：'+userInfo.freezeReason">
                <span slot="reference" class="status" :class="refereeStatusClass">{{refereeStatusText}}</span>
            </el-popover>

          </div>
        </div>
      </div>
    </section>
    <section>
      <section class="message-big">
        <p>
          执裁经历：
          <template v-if="Object.keys(experienceData).length > 2">
            <span @click="experienceOpen=true" v-if="!experienceOpen" style="color: #1D81EE; cursor:pointer">展开 <i class="el-icon-arrow-down"></i></span>
            <span @click="experienceOpen=false" v-else style="color: #1D81EE; cursor: pointer">收起 <i class="el-icon-arrow-up"></i></span>
          </template>
        </p>
        <div class="message-list chooseIdentityList">
          <div
            class="auth-container"
            v-for="year in Object.keys(experienceShowData).reverse()"
            :key="year"
          >
            <span class="auth-title">{{ year }}</span>
            <span class="auth-text">{{experienceShowData[year].map(d => d.label).join("、")}}</span>
          </div>
        </div>
      </section>
      <section class="message-big">
        <p>身份：</p>
        <div class="message-list chooseIdentityList">
          <div>
            <div
              class="auth-container"
              v-for="authKey in Object.keys(authData)"
              :key="authKey"
            >
              <span class="auth-title">{{ authKey }}</span>
              <span class="auth-text">{{authData[authKey].map(d => d.label).join("、")}}</span>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>
<script>
import Message from "./components/message.vue";
import * as api_account from "@/api/account";
import UploadHeadImg from "@/components/uploadHeadImg/index.vue"
import historyInput from "@/components/historyInput"
import AuthInput from "@/components/authInput"
import { Picker } from "vant";
export default {
  components: { Message, Picker, UploadHeadImg, historyInput, AuthInput },
  data() {
    return {
      message: [
        { label: "姓名：", text: "" },
        {label: "", text: ""},
        { label: "裁判编号：", text: ""},
        { label: "手机号：", text: "", disabled: true },
        { label: "邮箱：", text: "", disabled: true },
        { label: "常驻城市：", text: "", readOnly: true },
      ],
      authData: {},
      experienceValue: [],
      experienceData: {}, //执裁经历
      userInfo: {},
      userIdentityCurrent: {}, //用户身份
      identityList: [], //系统全部身份
      experienceOpen: false, //裁判经历展开状态
    };
  },
  computed: {
    mobileMessage() {
      return [this.message[5], this.message[2]];
    },
    experienceShowData() {
      // 如果是收起状态且非编辑状态， 只展示两条数据
      if(this.experienceOpen) {
        return this.experienceData
      } else {
        // 取最近两年
        let yearArr = Object.keys(this.experienceData).sort((a,b) => b-a).slice(0, 2);
        return yearArr.reduce((res,val) => {
          res[val] = this.experienceData[val];
          return res
        }, {})
      }
    },
    refereeStatusText() {
      // 1:在职 2冻结 3离职
      return this.$dictionary.refereeStatus.find(d => d.value == this.userInfo.refereeStatus)?.label || "";
    },
    refereeStatusClass() {
      return ["", "green", "red", "gray"][this.userInfo.refereeStatus]
    }
  },
  created() {
    this.getUserInfo();
  },

  methods: {
    //请求用户信息
    getUserInfo() {
      api_account.getAccountDetail({accountId: this.$route.query.id}).then((res) => {
        if (res.success) {
          this.res = res;
          const {userInfo, userRefereeContestHistory, userIdentity} = res.data;
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

          this.userInfo = userInfo;
          for (let i = 0; i < this.message.length; i++) {
            const element = this.message[i];
            switch (i) {
              case 0:
                element.text = userInfo.name;
                break;
              case 2: 
                element.text = userInfo.refereeNumber;
                break;
              case 3:
                element.text = userInfo.mobile;
                break;
              case 4:
                element.text = userInfo.email;
                break;
              case 5:
                element.text = userInfo.province + userInfo.city;
                break;
              default:
                break;
            }
          }
          this.authData = userIdentity.reduce((res1, val) => {
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
        }
      });
    },
    onBack() {
        this.$router.go(-1);
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
  > div {
    margin-right: 10px;
    &:last-of-type {
      margin-right: 0;
    }
  }
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
.referee-box-status {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 50%;
    height: 60px;
    .status {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
    .reason {
        margin-right: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #999999;
    }
  }
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
    position: relative;
    flex: auto;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    ::v-deep .message-item {
      width: 50%;
      flex: auto;
      &:nth-of-type(5),&:nth-of-type(6) {
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
    &:last-of-type {
      border: 0;
    }
    > p {
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
  .mobile-header {
    display: flex;
    margin: 0 20px;
    padding: 20px 0;
    border-bottom: 1px solid #f0f3f7;
    font-size: 14px;
    color: #333333;
    .mobile-upload {
      margin-right: 20px;
      width: 96px;
      height: 96px;
      border-radius: 50%;
    }
    >div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      p {
        margin-bottom: 10px;
      }
      .name {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
        line-height: 30px;
      }
    }
  }
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
.chooseIdentityList {
  padding-top: 20px;
}
.dialogText {
  text-align: center;
}
.warnText{
  color:#ff0000;
  font-size: 14px;
  text-align: center;
  padding-top: 5px;
}
.warnTextH5{
  color:#ff0000;
  font-size: 14px;
}
</style>
