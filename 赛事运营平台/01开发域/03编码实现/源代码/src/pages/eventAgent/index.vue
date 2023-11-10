<template>
  <div class="boxWrap">
    <div class="box">
      <div class="boxflex">
        <div class="title" style="border: none">赛程管理</div>
        <div class="back" @click="onBack">
          <div class="backlogo"></div>
          <div>返回</div>
        </div>
      </div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div>公开：</div>
            <el-switch :width="52" class="switch" v-model="open" :data-attr="switchState" @change="switchChange">
            </el-switch>
          </div>
          <div class="chunk">
            <div class="chunk-text">赛程日期：</div>
            <el-date-picker v-model="time1" type="daterange" range-separator="~" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false" />
          </div>
          <div class="chunk">
            <el-button class="chunk-button" @click="synPopShow">同步赛程</el-button>
          </div>
        </div>
        <div class="chunk-wrap">
          <button class="chunk-button import" @click="dialogImport = true">
            <img src="@/assets/common/icon_import.png" alt="">导入赛程
          </button>
          <button class="chunk-button message" @click="dialogLetterData.value = true">
            <img src="@/assets/eventAgent/icon_message.png" alt="">短信通知
          </button>
          <button class="chunk-button add" @click="addEvent">
            <img src="@/assets/eventManage/add.png" alt="">
            <i icon="el-icon-circle-plus-outline"></i>新增
          </button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <timeTable v-model="tableData" @editContest="edit" @deleteContest="deleteItem"></timeTable>
    <div v-if="count" class="page">
      <div>共{{ count }}个，每页{{ limit }}条数据</div>
      <div>
        <el-pagination background hide-on-single-page @current-change="handleCurrentChange" layout="prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
    </div>
    <!-- 数据格式发生错误 -->
    <dialogBox :popup.sync="popup" :type="dialogType" @cancelOrConfirm="cancelOrConfirm">
      <div class="dialogBox-content">{{ dialogMessage }}</div>
    </dialogBox>

    <!-- 同步二次弹框 -->
    <dialogBox :popup.sync="synPop" :type="synType" :title="synTitle" @cancelOrConfirm="synChange">
      <div class="dialogBox-content">是否进行同步赛程？</div>
    </dialogBox>



    <!-- 二次弹框 -->
    <dialogBox :popup.sync="tipShow" :title="tipTitle" :type="tipDialogType" @cancelOrConfirm="tipChange">
      <div class="dialogBox-content">{{ tipMessage }}</div>
    </dialogBox>
    <!-- 新增赛程 -->
    <dialogBox :popup="dialogAdd" :title="dialogTitle" :type="dialogType" width="40%" top="10vh"
      @cancelOrConfirm='cancelOrConfirm'>
      <div class="dialogBox-center" v-if="dialogAdd">
        <div class="dialogBox-contentList">
          <span>日期：</span>
          <el-date-picker v-model="add.date" type="date" placeholder="选择日期" :clearable="false">
          </el-date-picker>
        </div>
        <div class="dialogBox-contentList">
          <span>时间：</span>
          <el-time-select v-model="add.time" :picker-options="timeOptions" placeholder="选择时间">
          </el-time-select>
        </div>
        <div class="dialogBox-contentList">
          <span>星期：</span>
          <el-input v-model="add.week" disabled placeholder="-" size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <span>赛事阶段：</span>
          <el-input v-model="add.gameStage" placeholder="-" size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <span>赛事进度：</span>
          <el-input v-model="add.weekNum" placeholder="-" size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <span>队伍一：</span>
          <el-input v-model="add.team1" placeholder="-" size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <span>队伍二：</span>
          <el-input v-model="add.team2" placeholder="-" size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <span>城市：</span>
          <el-select v-model="add.city" size="small" placeholder="请选择城市">
            <el-option v-for="item in cityList" :key="item.city" :label="item.city" :value="item.city">
            </el-option>
          </el-select>
          <!-- <area-select
            :level="1"
            type="text"
            placeholder="请选择地区"
            v-model="add.city"
            :data="pcaa"
          ></area-select> -->
        </div>
        <div class="dialogBox-contentList">
          <span>BO：</span>
          <el-input v-model="add.bo" placeholder="请输入BO数" size="small"></el-input>
        </div>
      </div>
    </dialogBox>
    <!-- 导入赛程 -->
    <dialogBox :popup="dialogImport" title="赛程导入" width="40%" top="10vh" :limit="1" @cancelOrConfirm="closeSubmit">
      <div v-if="dialogImport" class="dialogBox-content" style="width: 80%">
        <el-input placeholder="请输入内容" v-model="fileName" disabled>
          <template slot="append">
            <el-upload ref="import" class="upload-demo" v-bind="uploadData">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </template>
        </el-input>
      </div>
    </dialogBox>
    <!-- 短信通知 -->
    <dialogBox :popup="dialogLetterData.value" title="短信通知" top="10vh" width="600px" @cancelOrConfirm="closeLetterDialog">
      <div style="padding: 20px 20px 0 20px;">
        <div class="chunk" style="padding: 0;">
          <div class="chunk-text">赛程日期：</div>
          <el-date-picker v-model="time2" type="daterange" range-separator="~" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="loadLetterData" :clearable="false" />
        </div>
        <el-table :data="dialogLetterData.tableData" height="400">
          <el-table-column prop="dateTime" label="日期" align="center">
          </el-table-column>
          <el-table-column prop="name" label="队伍" align="center">
            <template slot-scope="scope">
              <span style="color: #333333; font-weight: bold; font-size: 16px">{{ scope.row.teamA }}</span>
              <span style="color: #999999; margin: 0 10px; font-size: 12px;">v.s</span>
              <span style="color: #333333; font-weight: bold; font-size: 16px">{{ scope.row.teamB }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </dialogBox>
  </div>
</template>
<script>
import dialogBox from "../../components/eventManage/dialog.vue";
import timeTable from "../../components/timeTable/index.vue";
import * as api_account from "../../api/account";
import {area} from "@/utils/area-data";
export default {
  name: "eventAgent",
  components: {
    dialogBox,
    timeTable
  },
  data() {
    return {
      pcaa: area,
      open: true,
      switchState: "On",
      time1: [],
      tipShow: false,
      tipDialogType: "",
      tipMessage: "",
      tipTitle: "温馨提示！",
      count: 0,
      limit: 10,
      currPage: 1,
      contestTypeId: '',
      contestId: '',
      listDemo: [],
      canEditFlag: 1,//能否编辑裁判
      tableData: [],
      popup: false, //数据格式错误提示弹窗
      dialogType: "", //弹窗类型
      dialogMessage: "", //弹窗内容
      dialogAdd: false, //新增弹窗
      dialogTitle: "", //新增弹窗标题
      add: {
        date: "2022-02-02",
        time: "11:45",
        week: "1",
        weekNum: "2",
        team1: "",
        team2: "",
        city: [],
        bo: "",
        gameStage: "",
      },
      timeOptions: {
        start: "07:00",
        step: "00:15",
        end: "23:30",
      },
      contestScheduleId: "",
      isPublish: 0,//1公开，0不公开
      currPermission: false,
      synPop: false,
      synType: "syn",
      synTitle: "提示",
      dialogImport: false,
      // contestTypeId:""
      fileName: "",
      cityList: [],
      addCity: "",
      time2: [],
      dialogLetterData: {
        // 短信通知弹窗数据
        value: false, // 弹窗状态
        tableData: [], // 列表数据
      }
    };
  },
  computed: {
    uploadData() {
      return {
        action: process.env.VUE_APP_API_BASE_URL + "/file/upload",
        headers: {
          authorization: this.$store.getters.authorization
        },
        data: {
          userId: this.$store.getters.userInfo.id,
          contestId: this.contestId
        },
        name: "file",
        multiple: false,
        "show-file-list": false,
        "auto-upload": false,
        accept: ".xlsx",
        "on-change": res => {
          this.fileName = res.name;
        },
        "on-success": this.uploadSuccess,
        "on-error": err => {
          console.log("上传失败", err);
        }
      };
    }
  },
  mounted() {
    this.currPermission = this.$route.query.currPermission;
    this.contestTypeId = parseInt(this.$route.query.contestTypeId);
    this.contestId = parseInt(this.$route.query.contestId);
    this.isPublish = this.$route.query.publish;
    this.open = this.isPublish == 1 ? true : false;
    this.getScheduleList();
    this.getCityList();
  },
  watch: {
    dialogImport(nowVal) {
      if (!nowVal) {
        this.fileName = "";
      }
    },
    "dialogLetterData.value"(nowVal) {
      if (nowVal) {
        this.time2 = this.time1;
        this.loadLetterData();
      }
    },
    "add.bo"() {
      this.add.bo = this.add.bo.replace(/\D/g, "");
    }
  },
  methods: {
    //获取城市列表
    getCityList() {
      api_account.cityList().then(res => {
        console.log("城市列表:" + res);
        if (res.success) {
          this.cityList = res.data.list;

        }
      });
    },
    uploadSuccess(res) {
      if (res.success) {
        this.$message.success("上传成功");
        this.dialogImport = false;
        this.getScheduleList();
      } else {
        this.$message.error(res.errMsg);
      }
    },
    onBack() {
      this.$router.push({
        path: "/event",
        query: {
          saveEvent: this.$route.query.saveEvent,
          saveEventname: this.$route.query.saveEventname,
          saveState: this.$route.query.saveState,
        },
      });
    },
    synPopShow() {
      if (!this.time1.length) {
        console.log("时间");
        this.$notify.info({
          title: '消息',
          message: '请先选择时间！'
        });
        return;
      }
      this.synPop = true;
    },
    synChange(e) {
      if (e == "confirm") {
        this.synSchedule();
      }
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currPage = val;
      this.getScheduleList();
    },
    switchChange(e) {

      e ? this.switchState = "On" : this.switchState = "Off";
      console.log("状态:" + e);
      this.isPublish = e ? 1 : 0;
      this.tipMessage = "确认" + (e ? "公开" : "不公开") + "赛程？";
      this.dialogType = "publish";
      this.tipShow = true;
    },
    //弹窗确认
    cancelOrConfirm(e) {
      if (e == "confirm") {
        // 进行参数校验
        for (let key in this.add) {
          if (key == "week") {
            continue;
          }
          if (key == "city" && !this.add[key].length || !this.add[key]) {
            this.$message({
              message: '请检查表单是否填写完整？',
              type: 'warning'
            });
            return;
          }
        }
        // 校验通过二次弹窗
        if (this.dialogType == "editMatch") {
          this.tipMessage = "确认修改赛程？";
        } else {
          this.tipMessage = "确认新增赛程？";
        }
        this.$confirm(this.tipMessage)
          .then(() => {
            this.tipChange("confirm");
            this.dialogAdd = false;
          });
      } else {
        this.dialogAdd = false;
      }
    },
    tipChange(e) {
      if (e == "confirm") {
        if (this.dialogType == "editMatch") {
          this.editContest();
        } else if (this.dialogType == "addMatch") {
          this.addContest();
        } else {
          this.openContest();
        }
      } else {
        if (this.dialogType == "publish") {
          this.open = this.open ? false : true;
          this.isPublish = this.isPublish == 1 ? 0 : 1;
          this.switchState = this.isPublish == 1 ? "Off" : "On";
        }
      }
      this.tipShow = false;
    },
    resetAdd() {
      for (let key in this.add) {
        this.add[key] = "";
      }
      this.add.city = [];
    },
    //新增弹窗
    addEvent() {
      if (!this.currPermission) {
        return;
      }
      this.resetAdd();
      this.dialogType = "addMatch";
      this.dialogTitle = "新增赛程";
      this.dialogAdd = true;
    },
    edit(item, dayData) {
      if (!this.currPermission) {
        return;
      }
      this.contestScheduleId = item.contestScheduleId;
      this.add.date = dayData.gameDate;
      this.add.time = item.gameTime;
      this.add.week = dayData.dayOfWeekText;
      this.add.weekNum = item.weekOfMonth;
      this.add.team1 = item.teamA;
      this.add.team2 = item.teamB;
      this.add.city = item.city;
      this.add.bo = item.bo;
      this.add.gameStage = item.gameStage;
      // this.add.city.push(item.province,item.city);
      this.dialogType = "editMatch";
      this.dialogTitle = "编辑赛程";
      this.dialogAdd = true;
    },

    //删除赛程
    deleteItem(item) {
      debugger;
      console.log('====================================');
      console.log(item);
      console.log('====================================');
      this.$confirm("确认删除赛程？").then(() => {
        api_account.deleteContestSchedule({
          contestScheduleId: item.contestScheduleId
        }).then(res => {
          if (res.success) {
            this.$message({
              message: "删除赛程成功",
              type: "success",
            });
            this.getScheduleList();
          }
        });
      }).catch(() => {

      });
    },
    closeLetterDialog(type) {
      if (type == "cancel") {
        this.dialogLetterData.value = false;
      } else {
        if (!this.time2.length) {
          this.$message.error("请输入起止时间");
          return;
        }
        // 走发短信接口
        api_account.scheduleBatchSendSms({
          contestTypeId: this.contestTypeId,
          contestId: this.contestId,
          gameDateStart: this.time2[0],
          gameDateEnd: this.time2[1],
        }).then(res => {
          if (res.success) {
            this.dialogLetterData.value = false;
            this.$message.success("发送成功");
          }
        });
      }
    },
    loadLetterData() {
      console.log(this.time2);
      api_account.getSearchSchedule({
        page: 1,
        pageNum: 100,
        contestTypeId: this.contestTypeId,
        contestId: this.contestId,
        isPublish: this.isPublish,
        gameDateEnd: this.time2 && this.time2[1] || '',
        gameDateStart: this.time2 && this.time2[0] || "",
      }).then((res) => {
        console.log("返回结果:" + res);
        if (!res.success) {
          return;
        }
        this.dialogLetterData.tableData = res.data.rows.reduce((res, val) => {
          val.contest.forEach(d => {
            d.dateTime = `${val.gameDate} ${d.gameTime}`;
          });
          res.push(...val.contest);
          return res;
        }, []);
      });
    },
    getScheduleList() {
      api_account.getSearchSchedule({
        page: this.currPage,
        pageNum: this.limit,
        contestTypeId: this.contestTypeId,
        contestId: this.contestId,
        gameDateStart: this.time1 && this.time1[0] || "",
        gameDateEnd: this.time1 && this.time1[1] || "",
        isPublish: this.isPublish,
      }).then((res) => {
        console.log("返回结果:" + res);
        if (!res.success) {
          return;
        }

        this.count = res.data.count;
        this.canEditFlag = res.data.canEditFlag;
        const temp = ["", "MAINREFEREE", "ONREFEREE", "OFFREFEREE", "assistantMainReferee", "assistantMainReferee"];
        const position = this.getPositonByContest();
        this.tableData = res.data.rows.map(item => ({
          ...item,
          dayOfWeekText: this.getWeekByNum(item.dayOfWeek),
          contest: item.contest.map(item1 => ({
            ...item1,
            referee: position.map(d => ({
              ...d,
              ...item1.refereeSchedule[temp[d.value]]
            }))
          })),
        }));
      });
    },
    getPositonByContest() {
      // lpl(1): 主裁判， 场上裁判， 场下裁判
      // ldl(2): 主裁判， 场上裁判， 场下裁判, 场下裁判 Leader, 助理主裁判
      // WRL(3): 主裁判， 场上裁判， 场下裁判, 助理裁判
      // val(4): 主裁判， 场上裁判， 场下裁判
      let auth = {
        1: [1, 2, 3],
        2: [1, 2, 3, 4, 5],
        3: [1, 2, 3, 5],
        4: [1, 2, 3]
      };
      let positionValueList = auth[this.contestTypeId];
      return this.$dictionary.position.filter(d => positionValueList.some(d1 => d1 == d.value));
    },
    getWeekByNum(data) {
      if (data == 1) {
        return "星期一";
      } else if (data == 2) {
        return "星期二";
      } else if (data == 3) {
        return "星期三";
      } else if (data == 4) {
        return "星期四";
      } else if (data == 5) {
        return "星期五";
      } else if (data == 6) {
        return "星期六";
      } else if (data == 0) {
        return "星期日";
      }
    },
    addContest() {
      api_account
        .createMatchBySchedule({
          contestTypeId: this.contestTypeId,
          contestId: this.contestId,
          gameDate: this.$moment(this.add.date).format("yyyy-MM-DD"),
          gameTime: this.add.time,
          gameStage: this.add.gameStage,
          weekOfMonth: this.add.weekNum,
          // dayOfWeek:this.add.week,
          teamA: this.add.team1,
          teamB: this.add.team2,
          // province:this.add.city[0],
          city: this.add.city,
          bo: this.add.bo
        })
        .then((res) => {
          console.log("返回结果:" + res);
          if (res.success) {
            this.$message({
              message: "新增赛程成功",
              type: "success",
            });
            this.getScheduleList();
          }

        });
    },
    editContest() {
      api_account
        .updateSchedule({
          contestScheduleId: this.contestScheduleId,
          // contestId:this.contestId,
          gameDate: this.$moment(this.add.date).format("yyyy-MM-DD"),
          gameTime: this.add.time,
          gameStage: this.add.gameStage,
          weekOfMonth: this.add.weekNum,
          // dayOfWeek:this.add.week,
          teamA: this.add.team1,
          teamB: this.add.team2,
          // province:this.add.city[0],
          city: this.add.city,
          bo: this.add.bo
        })
        .then((res) => {
          console.log("返回结果:" + res);
          if (res.success) {
            this.$message({
              message: "赛程修改成功",
              type: "success",
            });
            this.getScheduleList();
          }

        });
    },
    openContest() {
      api_account.openContest({
        contestId: this.contestId,
        isPublish: this.isPublish,
      }).then((res) => {
        console.log("返回结果:" + res);
      });
    },
    //同步赛程
    synSchedule() {
      api_account.scheduleSync({
        contestId: this.contestId,
        startDate: this.time1[0],
        finishDate: this.time1[1],
      }).then((res) => {
        console.log("返回结果:" + res);
        if (res.success) {
          this.getScheduleList();
        }
      });
    },
    closeSubmit(e) {
      if (e == "confirm") {
        this.$refs.import.submit();
      } else {
        this.dialogImport = false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.dialogBox-contentList /deep/ .el-input,
.dialogBox-contentList /deep/ .el-select {
  height: 40px;
  width: 224px;
  display: flex;
  align-items: center;
}

.dialogBox-contentList /deep/ .area-select {
  margin-left: 0px;
}

.dialogBox-contentList span {
  flex: none;
  width: 120px;
}

.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.detail {
  padding: 9px 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.area-select-wrap {
  cursor: not-allowed !important;
  border-color: #e4e7ed !important;
  color: #c0c4cc !important;
}

.dialogBox-center {
  border-bottom: 1px solid #dde1e6;
  padding: 20px;
}

.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
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

.chunk-button {
  padding: 0 10px;
  margin-left: 10px;
  min-width: 90px;
  height: 40px;
  font-size: 16px;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;

  img {
    margin-top: 2px;
    margin-right: 5px;
    height: 14px;
    width: 14px;
  }

  &.import {
    background: #00AFFF;
  }

  &.message {
    background: #44D7B6;
  }

  &.add {
    background: #20BD20;
  }
}

.boxflex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
  border-bottom: 1px solid #dde1e6;
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
  color: #1d81ee;
  font-size: 14px;
  cursor: pointer;
}

.detail /deep/.el-switch::after {
  content: attr(data-attr);
  color: #ffffff;
  position: absolute;
  font-size: 12px;
  right: 20px;
}

.chunk-wrap /deep/ .el-button--primary {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chunk /deep/ .el-button {
  width: 90px;
  background: #1d81ee;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page {
  display: flex;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #999999;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
}
</style>
