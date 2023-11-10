<template>
  <div v-if="isMobile()">
    <img @click="showFilter = true" class="mobile-filter" src="@/assets/common/icon_mobile_filter.png" alt="">
    <van-list @load="loadData" offset="0" v-model="tableLoading" :finished="loadFinished" finished-text="没有更多了">
      <van-pull-refresh v-model="tableLoading" @refresh="handleSearch">
        <eventList v-model="tableData" :contestAuth="false" :refereeAuth="true"></eventList>
      </van-pull-refresh>
    </van-list>
    <FilterComp v-model="showFilter" @search="handleSearch">
      <div class="search-item">
        <p>赛事类型</p>
        <el-select placeholder="请选择赛事" v-model="event" @change="changeMatchType">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search-item">
        <p>赛事名称</p>
        <el-select filterable placeholder="请选择赛事名称" v-model="eventname" @change="selectMatch" clearable>
          <el-option v-for="item in matchList" :key="item.contestId" :label="item.contestName" :value="item.contestId">
          </el-option>
        </el-select>
      </div>
      <div class="search-item">
        <p>赛程日期</p>
        <el-date-picker v-model="time" type="daterange" range-separator="~" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false" />
      </div>
    </FilterComp>
  </div>
  <div v-else class="boxWrap">
    <div class="box" style="margin-bottom: 20px; position: sticky; top: 0">
      <div class="title">
        <div>
          <div class="chunk" style="display: inline-block;">
            <el-select placeholder="请选择赛事" v-model="event" style="width: 224px" @change="changeMatchType">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          赛事排班
        </div>
        <el-button type="primary" @click="handleExport" v-show="event === 1 || event === 2">导出</el-button>
      </div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div class="chunk-text">赛事名称：</div>
            <div class="chunk">
              <el-select filterable placeholder="请选择赛事名称" v-model="eventname" style="width: 224px" @change="selectMatch"
                clearable>
                <el-option v-for="item in matchList" :key="item.contestId" :label="item.contestName"
                  :value="item.contestId">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="chunk">
            <div class="chunk-text">赛程日期：</div>
            <el-date-picker v-model="time" type="daterange" range-separator="~" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false" />
          </div>
          <div class="chunk">
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div>
      <van-list v-model="tableLoading" finished-text="没有更多了" :finished="loadFinished" @load="loadData">
        <eventList v-model="tableData" :contestAuth="false" :refereeAuth="true" @clickPortItem="portItem"
          @clickReferee="handleClickReferee" @viewContest="handleViewSchedule"></eventList>
      </van-list>
    </div>
    <!-- 编辑评分 -->
    <EditScore v-model="editScoreData.value" v-bind="editScoreData"></EditScore>
    <!-- 查看操作记录 -->
    <ViewSchedule v-model="viewScheduleData.value" v-bind="viewScheduleData"></ViewSchedule>
    <!-- 编辑赛事二次弹窗 -->
    <dialogBox :popup.sync="editShow" :title="editDialogTitle" @cancelOrConfirm="editSubmitChange">
      <div class="dialogBox-content">确认是否提交？</div>
    </dialogBox>
    <!-- 编辑赛事（裁判选择） -->
    <dialogBox :popup.sync="judgeSelect" :title="dialogTitle" :type="dialogType" width="600" top="10vh"
      @cancelOrConfirm="editContestChange">
      <div class="dialogBox-center" v-if="judgeSelect">
        <div class="dialogBox-contentList">
          <span>赛事：</span>
          <el-input v-model="dialogData.match" type="text" placeholder="-" :disabled="true">
          </el-input>
        </div>
        <div class="dialogBox-contentList">
          <span>日期：</span>
          <el-date-picker v-model="dialogData.date" type="date" placeholder="选择日期" :disabled="true" :clearable="false">
          </el-date-picker>
        </div>
        <div class="dialogBox-contentList">
          <span>时间：</span>
          <el-time-select v-model="dialogData.time" :picker-options="timeOptions" placeholder="选择时间" :disabled="true">
          </el-time-select>
        </div>
        <div class="dialogBox-contentList">
          <span>队伍一：</span>
          <el-input v-model="dialogData.team1" placeholder="-" size="small" :disabled="true"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <span>队伍二：</span>
          <el-input v-model="dialogData.team2" placeholder="-" size="small" :disabled="true"></el-input>
        </div>
        <div class="dialogBox-contentList" style="width: 80%">
          <span>比赛城市：</span>
          <el-select v-model="dialogData.city" :disabled="true" placeholder="请选择城市">
            <el-option v-for="item in cityList" :key="item.city" :label="item.city" :value="item.city">
            </el-option>
          </el-select>
        </div>

        <div style="display: flex;padding-bottom: 10px;align-items: center;">
          <span style="width:120px;">裁判搜索：</span>
          <div style="width:25%">
            <el-input v-model="searchName" type="text" placeholder="请输入裁判名称" @input="searchList">
            </el-input>
          </div>
          <div style="width:40%;margin-left:5px;">
            <el-select v-model="searchCity" multiple placeholder="请选择城市" @change="searchList">
              <el-option v-for="item in cityList" :key="item.city" :label="item.city" :value="item.city">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="dialogBox-contentList">
          <span>赛事阶段</span>
          <el-input v-model="searchGameStage" type="text" placeholder="请输入赛事阶段搜索" @input="searchList">
          </el-input>
        </div>
        <div class="dialogBox-contentList">
          <span>A边{{ judgeTypeName }}：</span>
          <el-select v-model="dialogData.userIdsA" multiple collapse-tags placeholder="请选择裁判">
            <el-option v-for="item in judgeList.filter(d => !dialogData.userIdsB.includes(d.userId))" :key="item.userId"
              :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </div>
        <div class="dialogBox-contentList">
          <span>B边{{ judgeTypeName }}：</span>
          <el-select v-model="dialogData.userIdsB" multiple collapse-tags placeholder="请选择裁判">
            <el-option v-for="item in judgeList.filter(d => !dialogData.userIdsA.includes(d.userId))" :key="item.userId"
              :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </div>
      </div>
    </dialogBox>
  </div>
</template>
<script>
import dialogBox from "../../components/eventSchedule/dialog.vue";
import eventList from "../../components/timeTable/index.vue";
import EditScore from "./components/editScore.vue";
import ViewSchedule from "./components/viewSchedule.vue";
import FilterComp from "@/components/FilterComp";
import * as api_account from "../../api/account";
import {area} from "@/utils/area-data";
export default {
  name: "eventSchedule",
  components: {
    dialogBox,
    eventList,
    EditScore,
    ViewSchedule,
    FilterComp
  },
  data() {
    return {
      options: this.$dictionary.contestType,
      matchList: [],
      event: "", //赛事
      eventname: "", //赛事名称
      matchName: "",
      judgeSelect: false, //裁判选择弹窗
      dialogTitle: "", //弹窗tittle
      dialogType: "", //弹窗type
      page: {
        count: 0,
        pageSize: 10,
        pageIndex: 1
      },
      tableLoading: false,
      tableLoadingFirst: false,
      judgeList: [],
      searchCity: [],
      searchName: "",
      searchGameStage: "",
      dialogData: {
        //弹窗data
        match: "",
        date: "",
        time: "",
        team1: "",
        team2: "",
        city: [],
        userIdsA: [],
        userIdsB: []
      },
      judgesearch: "", //弹窗下拉框搜索
      pcaa: area,
      time: [this.$moment().add(-7, "d").format('YYYY-MM-DD'), this.$moment().add(14, "d").format('YYYY-MM-DD')],
      listDemo: [],
      tableData: [{}],
      timeOptions: {
        start: "07:30",
        step: "00:15",
        end: "23:30",
      },
      text1: "",
      judgeName: "",
      editShow: false,
      editDialogTitle: "提示",
      judgeArr: [],
      judgeTypeName: "",
      curNum: 100,
      cityList: [],
      searchId: "",//搜索用的赛事id
      searchPosition: "",//搜索用的位置信息
      editScoreData: {
        value: false,
        referee: {},
        formData: {}
      },
      viewScheduleData: {
        value: false
      },
      showFilter: false //移动端打开搜索条件
    };

  },
  computed: {
    loadFinished() {
      return (this.page.pageIndex - 1) * this.page.pageSize >= this.page.count;
    }
  },
  watch: {
    "editScoreData.value"(nowVal) {
      if (!nowVal) {
        this.page.pageIndex = 1;
        this.loadData();
      }
    }
  },
  mounted() {
    this.getContestType();
    this.getCityList();
  },
  methods: {
    loadData() {
      if (this.page.pageIndex == 1) {
        this.tableData = [];
        this.tableLoadingFirst = true;
      }
      this.tableLoading = true;
      api_account.getSearchSchedule({
        page: this.page.pageIndex,
        pageNum: this.page.pageSize,
        contestTypeId: this.event,
        contestId: this.eventname,
        gameDateStart: this.time[0],
        gameDateEnd: this.time[1],
        isPublish: 1,
      }).then((res) => {
        this.tableLoading = false;
        this.tableLoadingFirst = false;
        this.page.count = res.data.count;
        this.page.pageIndex++;
        if (!res.success) {
          return;
        }
        const temp = ["", "MAINREFEREE", "ONREFEREE", "OFFREFEREE", "offRefereeLeader", "assistantMainReferee"];
        const position = this.getPositonByContest();
        this.tableData = [...this.tableData, ...res.data.rows.map(item => ({
          ...item,
          dayOfWeekText: this.getWeekByNum(item.dayOfWeek),
          contest: item.contest.map(item1 => ({
            ...item1,
            referee: position.map(d => ({
              ...d,
              ...item1.refereeSchedule[temp[d.value]]
            }))
          })),
        }))];
      }, err => {
        this.tableLoading = false;
        this.tableLoadingFirst = false;
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
      let positionValueList = auth[this.event];
      return this.$dictionary.position.filter(d => positionValueList.some(d1 => d1 == d.value));
    },
    getContestType() {
      this.curNum = 100;
      api_account.getContestType({}).then((res) => {
        if (res.success) {
          this.options = res.data.map(item => ({
            value: item.contestTypeId,
            label: item.contestTypeName,
            isSelect: item.isSelect,
          }));
          this.event = this.options.filter(d => d.isSelect)[0].value;
          this.getMatchList();
          this.loadData();
        }
      });
    },
    getMatchList() {
      api_account
        .getContestList({
          page: 1,
          pageNum: this.page.pageSize,
          isPublish: -1,
          contestTypeId: this.event,
        })
        .then((res) => {
          this.matchList = res.data.map(item => ({
            contestId: item.contestId,
            contestName: item.name,
          }));
        });
    },
    //获取城市列表
    getCityList() {
      api_account.cityList().then(res => {
        console.log("城市列表:" + res);
        if (res.success) {
          res.data.list.forEach(item => {
            this.cityList.push({
              id: item.id,
              city: item.city,
            });
          });

        }
      });
    },
    handleSearch() {
      this.page.pageIndex = 1;
      this.loadData();
    },
    handleClickReferee(referee, column, dayData) {
      this.editScoreData.referee = referee;
      this.editScoreData.formData = {
        ...column,
        date: dayData.gameDate,
        time: column.gameTime
      };
      this.editScoreData.value = true;
    },
    handleViewSchedule(item) {
      this.viewScheduleData.data = item;
      this.viewScheduleData.value = true;
    },
    //修改裁判二次弹窗点击
    editSubmitChange(e) {
      if (e == "confirm") {
        console.log("点击了" + e);
        this.editReferee();
      } else {
        this.judgeSelect = true;
      };
    },
    editReferee() {
      api_account.scheduleAddReferee({
        contestScheduleId: this.dialogData.contestScheduleId,
        positionId: this.dialogData.refereeType,
        userIdsA: this.dialogData.userIdsA,
        userIdsB: this.dialogData.userIdsB
      }).then((res) => {
        if (res.success) {
          this.$message({
            message: '修改裁判成功',
            type: 'success'
          });
          this.searchCity = [];
          this.searchName = "";
          this.searchGameStage = "";
          console.log("res:" + res);
          this.judgeSelect = false;
          this.page.pageIndex = 1;
          this.loadData();
        }
      });
    },
    //修改裁判弹框监听
    editContestChange(e) {
      if (e == "confirm") {
        this.judgeSelect = true;
        this.editShow = true;
      } else {
        this.searchCity = [];
        this.searchName = "";
        this.searchGameStage = "";
      };
    },
    handleExport() { // 导出
      api_account.getSearchSchedule({
        pageNum: 9999, page: 1, isPublish: 1, TypeId: this.event, contestId: this.eventname,
        gameDateStart: this.time && this.time[0] || '', gameDateEnd: this.time && this.time[1] || '',
      }).then((res) => {
        let data = [];
        (res.data?.rows || []).forEach(m => {
          m.contest.forEach(n => data.push({...n, gameDate: m.gameDate}));
        });
        if (data.length) {
          const {export_json_to_excel} = require("../../Excel/Export2Excel");
          const LDL = [
            {h: '场下裁判Leader', v: 'offRefereeLeader.0'}, {h: '场下裁判Leader', v: 'offRefereeLeader.1'}, {h: '场下裁判Leader', v: 'offRefereeLeader.2'}, {h: '场下裁判Leader', v: 'offRefereeLeader.3'},
            {h: '助理主裁判', v: 'assistantMainReferee.0'}, {h: '助理主裁判', v: 'assistantMainReferee.1'}, {h: '助理主裁判', v: 'assistantMainReferee.2'}, {h: '助理主裁判', v: 'assistantMainReferee.3'},
          ];
          const tbl = [
            {h: '主裁判', v: 'MAINREFEREE.0'}, {h: '主裁判', v: 'MAINREFEREE.1'}, {h: '主裁判', v: 'MAINREFEREE.2'}, {h: '主裁判', v: 'MAINREFEREE.3'},
            {h: '场上裁判', v: 'ONREFEREE.0'}, {h: '场上裁判', v: 'ONREFEREE.1'}, {h: '场上裁判', v: 'ONREFEREE.2'}, {h: '场上裁判', v: 'ONREFEREE.3'},
            {h: '场下裁判', v: 'OFFREFEREE.0'}, {h: '场下裁判', v: 'OFFREFEREE.1'}, {h: '场下裁判', v: 'OFFREFEREE.2'}, {h: '场下裁判', v: 'OFFREFEREE.3'},
            ...(this.event === 2 ? LDL : [])
          ];
          const tHeader = ['比赛日期', '时间', '城市', '赛程', '赛事阶段', '赛事进程', '决胜方式', ...tbl.map(m => m.h)];
          const list = data.reduce((res, val) => {
            res.push([
              val.gameDate,
              val.gameTime,
              val.city,
              `${val.teamA} vs ${val.teamB}`,
              val.gameStage,
              val.weekOfMonth,
              `BO${val.bo}`,
              ...tbl.map(m => {
                const props = m.v.split(".");
                const obj = val.refereeSchedule[props[0]];
                const arr = [...obj.A, ...obj.B].map(n => n.name);
                return arr.length > 4 && props[1] === '3' ? arr.filter((n, i) => i > 2).join('、') : (arr[props[1]] || "");
              }),
            ]);
            return res;
          }, []);
          const fileName = `${this.event === 2 ? 'LDL' : 'LPL'}的赛事排班`;
          export_json_to_excel(tHeader, list, fileName); //最后一个是表名字
        }
      });
    },
    portItem(port, contest, dayData) {
      // debugger
      this.dialogData.contestId = contest.contestId;
      this.dialogData.match = contest.contestName;
      this.dialogData.date = dayData.gameDate;
      this.dialogData.time = contest.gameTime;
      this.dialogData.team1 = contest.teamA;
      this.dialogData.team2 = contest.teamB;
      this.dialogData.refereeType = port.value;
      this.dialogData.city = contest.city;
      this.dialogData.userIdsA = port.A.map(d => d.refereeUserId);
      this.dialogData.userIdsB = port.B.map(d => d.refereeUserId);
      this.getRefereeList(this.dialogData.refereeType, contest.contestScheduleId);
    },

    changeMatchType() {
      console.log("重新选择:", this.event);
      this.eventname = "";
      this.time = [];
      this.getMatchList();
      this.handleSearch();
    },
    selectMatch(v) {
      console.log("选择赛事:" + this.eventname);
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
    searchList() {
      this.getRefereeList(this.searchPosition, this.searchId);
    },
    getRefereeList(v, contestId) {
      this.searchId = contestId;
      this.searchPosition = v;
      api_account
        .getRefereeList({
          contestScheduleId: contestId,
          positionId: v,
          userName: this.searchName,
          gameStage: this.searchGameStage,
          city: this.searchCity,
        })
        .then((res) => {
          console.log("返回结果:" + res);
          if (res.success) {
            this.judgeList = [];
            if (res.data != "") {
              res.data.forEach((item) => {
                this.judgeList.push({
                  userId: item.userId,
                  userName: item.userName,
                });
              });
            }
          }
          this.dialogTitle = "编辑裁判信息";
          this.dialogType = "eventschedule";
          this.dialogData.contestScheduleId = contestId;
          this.judgeSelect = true;
          this.judgeTypeName = this.getTypeNameId(v);
        });
    },
    getTypeNameId(v) {
      if (v == 1) {
        return "主裁判";
      } else if (v == 2) {
        return "场上裁判";
      } else if (v == 3) {
        return "场下裁判";
      }
    },
  },
};
</script>
<style lang="css" scoped>
.detail {
  padding: 9px 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  margin-right: 10px;
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

.chunk-text {
  min-width: 70px;
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

.dialogBox-contentList {
  width: 60%;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #666666;
  padding-bottom: 10px;
}

.dialogBox-contentList span {
  width: 120px;
}

.dialogBox-contentList /deep/ .el-input {
  height: 40px;
  width: 300px;
  display: flex;
  align-items: center;
}

.dialogBox-contentList /deep/ .area-select {
  background: #f5f7fa !important;
  cursor: not-allowed !important;
  border-color: #e4e7ed !important;
  color: #c0c4cc !important;
  margin-left: 0px;
}

.dialogBox-selectSearch {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.dialogBox-selectSearch /deep/ .el-input__inner {
  background-color: #e8e8e8;
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

.searchK {
  width: 36px;
  height: 36px;
  margin-left: 5px;
  border-radius: 4px;
  border: 1px solid #D9D9D9;
}

.searchLogo {
  width: 14px;
  height: 14px;
  margin: 10px;
  background-image: url("../../assets/eventAgent/icon_search.png");
}

.mobile-filter {
  position: fixed;
  top: 13px;
  right: 16px;
  height: 20px;
  width: 20px;
  z-index: 2;
}
</style>
