<template>
  <div v-if="isMobile()" class="mobile">
    <van-nav-bar
        class="header"
        :title="$route.meta.title"
        left-arrow
    >
        <img @click="$emit('handleChangeMenuStatus')" slot="left" width="20" height="14" src="@/assets/accountManage/menu_icon.png" alt="">
        <img @click="handleClickReadAll" slot="right" width="20" height="20" src="@/assets/message/read_all.png"/>
    </van-nav-bar>
    <div>
      <van-field
        v-model="selectType"
        label="类型"
        placeholder="请选择类型"
        :readonly="true"
        input-align="right"
        @click-input="handleOpen('type')"
      />

      <van-field
        v-model="selectIsRead"
        label="处理状态"
        placeholder="请选择状态"
        :readonly="true"
        input-align="right"
        @click-input="handleOpen('isRead')"
      />

      <van-field
        v-model="selectContestTypeId"
        label="所属赛事"
        placeholder="请选择所属赛事"
        :readonly="true"
        input-align="right"
        @click-input="handleOpen('contestTypeId')"
      />

      <div class="buttonH5">
        <div class="searchButtonH5" @click="searchAction">查询</div>
        <div class="resetButton" @click="cancelAllSelect"></div>
      </div>
    </div>
    <van-list
      @load="onLoad"
      offset="0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
    >
      <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
      <Message
        v-for="(messageItem, messageIndex) in messageList"
        :key="messageIndex"
        v-bind="messageItem"
        @actionMessage="actionMessage"
      ></Message>
    </van-list>
    <van-popup position="bottom" v-model="showType">
      <Picker
        title="请选择类型"
        show-toolbar
        :columns="typeListH5"
        @confirm="confirmTypeH5"
        @cancel="cancelPopup"
      />
    </van-popup>
    <van-popup position="bottom" v-model="showIsRead">
      <Picker
        title="请选择处理状态"
        show-toolbar
        :columns="isReadListH5"
        @confirm="confirmIsReadH5"
        @cancel="cancelPopup"
      />
    </van-popup>
    <van-popup position="bottom" v-model="showContestType">
      <Picker
        title="请选择所属赛事"
        show-toolbar
        :columns="competitionListH5"
        @confirm="confirmCompetitionH5"
        @cancel="cancelPopup"
      />
    </van-popup>
  </div>
  <div v-else class="page-container">
    <div class="title">
      消息通知
      <span class="title-right" @click="handleClickReadAll">
        <img src="@/assets/message/read_all.png"/>
        全部已读  
      </span>
      
    </div>
    <div class="detail">
      <div class="chunk-wrap">
        <div class="chunk">
          <div>类型：</div>
          <el-select clearable placeholder="请选择类型" v-model="selectType">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="chunk">
          <div>处理状态：</div>
          <el-select
            clearable
            placeholder="请选择处理状态"
            v-model="selectIsRead"
          >
            <el-option
              v-for="item in isReadList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="chunk">
          <div>所属赛事：</div>
          <el-select
            clearable
            placeholder="请选择赛事"
            v-model="selectContestTypeId"
          >
            <el-option
              v-for="item in competitionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="chunk">
          <el-button type="primary" @click="searchAction">查询</el-button>
        </div>
        <div class="chunk" @click="cancelAllSelect">
          <el-image
            :src="require('@/assets/accountManage/reset.png')"
          ></el-image>
        </div>
      </div>
    </div>
    <div class="mt-20">
      <Message
        v-for="(messageItem, messageIndex) in messageList"
        :key="messageIndex"
        v-bind="messageItem"
        @actionMessage="actionMessage"
      ></Message>
    </div>
    <!-- <pagination :total="total"></pagination> -->
    <div v-if="totalNumber" class="page">
      <div>
        共{{ Math.ceil(totalNumber / pageNum) }}页，每页{{ pageNum }}条数据
      </div>
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageNum"
          :total="totalNumber"
          @current-change="currentPageChange"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 二次确认 -->
    <dialogBox :popup.sync="popup" @cancelOrConfirm="cancelOrConfirm">
      <div class="dialogBox-content">{{ dialogMessage }}</div>
    </dialogBox>
  </div>
</template>
<script>
import pagination from "@/components/pagination";
import Message from "./components/message.vue";
import * as api_account from "../../api/account";
import dialogBox from "../../components/accountManage/dialog.vue";
import { Picker, Button, Icon } from "vant";
export default {
  components: { Message, pagination, dialogBox, Picker, Button, Icon },
  data() {
    return {
      selectType: "", //已选择类型
      selectIsRead: "", //已选择状态
      selectContestTypeId: "", //已选择赛事类型
      typeListH5: ["换班审核", "调班审核", "空闲排班审核", "通知类"],
      typeList: [
        {
          value: "1",
          label: "换班审核",
        },
        {
          value: "2",
          label: "调班审核",
        },
        {
          value: "3",
          label: "空闲排班审核",
        },
        {
          value: "4",
          label: "通知类",
        },
      ], //消息类型字典
      competitionListH5: this.$dictionary.contestType.map(d => d.label),
      competitionList: this.$dictionary.contestType, //所属赛事字典
      isReadListH5: ["已处理", "未处理"],
      isReadList: [
        {
          value: "1",
          label: "已处理",
        },
        {
          value: "2",
          label: "未处理",
        },
      ], //已读状态

      showType: false,
      showIsRead: false,
      showContestType: false,
      popup: false, //二次确认弹窗
      dialogMessage: "", //弹窗内容
      messageType: 0, //弹窗的消息类型
      messageId: 0, //弹窗的messageId
      actionName: "", //当前的选项
      page: 1, //当前页
      pageNum: 10, //每页数量
      totalNumber: 1000, //数据总数
      messageList: [],
      loading: false,
      finished: false,
    };
  },

  created() {
    this.getMessageList();
  },

  methods: {
    //手机端到底部触发onload
    onLoad() {
      this.page++;
      this.getMessageList();
    },

    //点击查询按钮
    searchAction() {
      this.page = 1;
      this.getMessageList();
    },

    //点击清除按钮
    cancelAllSelect() {
      this.selectType = ""; //已选择类型
      this.selectIsRead = ""; //已选择状态
      this.selectContestTypeId = ""; //已选择赛事类型
      this.page = 1;
      this.getMessageList();
    },

    //组件返回点击
    actionMessage(actionName, messageId, messageType) {
      this.userMessageRead(messageId);

      if (messageType == 102 || messageType == 103) {
        this.$router.push({ path: "/personal/personalDetail" });
      }
      if (messageType == 200 || messageType == 300) {
        this.popup = true;
        this.messageType = messageType;
        this.messageId = messageId;
        this.actionName = actionName;
        //换班申请
        if (actionName == "同意") {
          this.dialogMessage = "请确认是否同意";
        } else if (actionName == "拒绝") {
          this.dialogMessage = "请确认是否拒绝";
        }
      }
      if (messageType == 201 || messageType == 301 || messageType == 400) {
        this.$router.push({
          path: "/match/privateSchedule",
          query: { messageType: messageType, messageId: messageId },
        });
      }

      if (
        messageType == 202 ||
        messageType == 204 ||
        messageType == 302 ||
        messageType == 304 ||
        messageType == 401 ||
        messageType == 402 ||
        messageType == 500 ||
        messageType == 501 ||
        messageType == 502
      ) {
        this.$router.push({ path: "/personal/mySchedule" });
      }
    },

    //消息通知-设为已读
    userMessageRead(userMessageId) {
      api_account
        .userMessageRead({
          userMessageId: userMessageId,
        })
        .then((res) => {
          this.userMessageNoRead();
        });
    },

    //消息通知-全部已读
    handleClickReadAll() {
      api_account.userMessageReadAll({}).then((res) => {
        if(res.success) {
          this.getMessageList();
          this.userMessageNoRead();
        }
      });
    },

    userMessageNoRead() {
      api_account.userMessageNoRead().then((res) => {
        if (res.success) {
          this.$store.commit("SET_UNREAD", res.data);
        }
      });
    },

    //弹窗cancelOrConfirm
    cancelOrConfirm(e) {
      if (e == "confirm") {
        if (this.messageType == 200) {
          //换班申请
          if (this.actionName == "同意") {
            this.applyExchangeScheduleAuth(this.messageId, 1);
          } else if (this.actionName == "拒绝") {
            this.applyExchangeScheduleAuth(this.messageId, 2);
          }
        }
        if (this.messageType == 300) {
          //换班申请
          if (this.actionName == "同意") {
            this.applyAdjustScheduleAuth(this.messageId, 1);
          } else if (this.actionName == "拒绝") {
            this.applyAdjustScheduleAuth(this.messageId, 2);
          }
        }
      } else {
        this.dialogMessage = ""; //弹窗内容
        this.messageType = 0; //弹窗的消息类型
        this.messageId = 0; //弹窗的messageId
        this.actionName = ""; //当前的选项
      }
    },

    //换班审核
    applyExchangeScheduleAuth(messageId, status) {
      api_account
        .applyExchangeScheduleAuth({
          userMessageId: messageId,
          changeStatus: status,
        })
        .then((res) => {
          if (res.success) {
            this.dialogMessage = ""; //弹窗内容
            this.messageType = 0; //弹窗的消息类型
            this.messageId = 0; //弹窗的messageId
            this.actionName = ""; //当前的选项
            if (status == 1) {
              this.$message.success("同意换班成功");
            } else {
              this.$message.success("拒绝换班成功");
            }
          }
          this.getMessageList();
          this.userMessageNoRead();
        });
    },

    //调班审核
    applyAdjustScheduleAuth(messageId, status) {
      api_account
        .applyAdjustScheduleAuth({
          userMessageId: messageId,
          changeStatus: status,
        })
        .then((res) => {
          if (res.success) {
            this.dialogMessage = ""; //弹窗内容
            this.messageType = 0; //弹窗的消息类型
            this.messageId = 0; //弹窗的messageId
            this.actionName = ""; //当前的选项
            if (status == 1) {
              this.$message.success("同意调班成功");
            } else {
              this.$message.success("拒绝调班成功");
            }
          }
          this.getMessageList();
          this.userMessageNoRead();
        });
    },

    //获取信息列表
    getMessageList() {
      this.loading = true;

      var params = {};
      params.page = this.page;
      params.pageNum = this.pageNum;

    if (this.isMobile()) {
      //手机H5存的是值需要转成id
      if (this.selectType != "") {
        this.typeList.forEach(element => {
          if (element.label = this.selectType) {
            params.type = element.value;
          }
        });
      }

      if (this.selectIsRead != "") {
        this.isReadList.forEach(element => {
          if (element.label = this.selectIsRead) {
            params.isRead = element.value;
          }
        });
      }

      if (this.selectContestTypeId != "") {
        this.competitionList.forEach(element => {
          if (element.label = this.selectContestTypeId) {
            params.contestTypeId = element.value;
          }
        });
      }
    } else {
      if (this.selectType != "") {
        params.type = this.selectType;
      }
      if (this.selectIsRead != "") {
        params.isRead = this.selectIsRead;
      }
      if (this.selectContestTypeId != "") {
        params.contestTypeId = this.selectContestTypeId;
      }
    }      
      
      api_account.getUserMessage(params).then((res) => {
        this.loading = false;
        if (res.success) {
          this.totalNumber = res.data.list.count;
          if (this.isMobile()) {
            if(this.page == 1) {
              this.messageList = [];
            }
            if (res.data.list.rows.length > 0) {
              //手机加入数组
              res.data.list.rows.forEach((element) => {
                this.messageList.push(element);
              });
            } else {
              this.finished = true;
            }
          } else {
            this.messageList = res.data.list.rows.map(d => {
              d.date = new Date(d.createdAt)
              return d
            });
          }

          this.messageList.forEach((element) => {
            if (element.type == 200 || element.type == 300) {
              if (element.isRead == 1) {
                element.button = [];
              } else {
                element.button = [
                  { type: "pass_green", value: "同意" },
                  { type: "close_red", value: "拒绝" },
                ];
              }
            } else if (
              element.type == 201 ||
              element.type == 301 ||
              element.type == 400
            ) {
              element.button = [{ type: "check_gray", value: "审核" }];
            } else if (
              element.type == 102 ||
              element.type == 402 ||
              element.type == 500 ||
              element.type == 501 ||
              element.type == 502
            ) {
              element.button = [{ type: "view_gray", value: "详情" }];
            } else if (
              element.type == 103 ||
              element.type == 202 ||
              element.type == 204 ||
              element.type == 302 ||
              element.type == 304 ||
              element.type == 401
            ) {
              element.button = [{ type: "edit_gray", value: "修改" }];
            }
          });
        }
      });
    },

    //切换
    currentPageChange(e) {
      this.page = e;
      this.getMessageList();
    },

    //H5打开类型选择
    handleOpen(e) {
      if (e == "type") {
        this.showType = true;
      }
      if (e == "isRead") {
        this.showIsRead = true;
      }
      if (e == "contestTypeId") {
        this.showContestType = true;
      }
    },
    //H5选择类型
    confirmTypeH5(e) {
      console.log("====================================");
      console.log(e);
      console.log("====================================");
      this.selectType = e;
      this.cancelPopup();
    },
    //H5选择是否已读
    confirmIsReadH5(e) {
      console.log("====================================");
      console.log(e);
      console.log("====================================");
      this.selectIsRead = e;
      this.cancelPopup();
    },
    //H5选择赛事
    confirmCompetitionH5(e) {
      console.log("====================================");
      console.log(e);
      console.log("====================================");
      this.selectContestTypeId = e;
      this.cancelPopup();
    },
    //H5关闭弹窗
    cancelPopup(e) {
      this.showType = false;
      this.showIsRead = false;
      this.showContestType = false;
    },
  },
};
</script>

<style scoped lang="scss">
.mt-20 {
  margin-top: -20px;
}
.title {
  position: relative;
  right: 20px;
  bottom: 20px;
  padding: 20px;
  width: 100%;
  border-bottom: 2px solid #eef2f7;
  &-right {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    cursor: pointer;
    img {
      margin-right: 6px;
      height: 14px;
      width: 14px;
    }
  }
}
.mobile {
  background: #f5f8fb;
}
// ::v-deep .page {
//   padding-bottom: 0;
// }

.dialogBox-content {
  text-align: center;
}

.page {
  padding-top: 10px;
  display: flex;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #999999;
  align-items: center;
  justify-content: space-between;
}
.detail {
  padding-top: 9px;
  padding-bottom: 19px;
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
  padding-right: 20px;
}

.buttonH5 {
  height: 44px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
}
.searchButtonH5 {
  width: 50px;
  height:30px;
  background-color: #1D81EE;
  color: white;
  font-size: 15px;
  text-align: center;
  line-height: 30px;
  border-radius: 3px;
  margin-right: 10px;
}
.resetButton{
  width: 30px;
  height:30px;
  background-image: url("~@/assets/accountManage/reset.png") !important;
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
  margin-right: 17px;
}

</style>
