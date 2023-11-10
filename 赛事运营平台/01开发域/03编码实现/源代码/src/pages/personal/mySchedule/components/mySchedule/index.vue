<template>
  <div class="boxWrap">
    <workCalendar :scheduleList="scheduleList" @input="handleSelectDay">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div :class="{
          cellbox: true,
          cellDateBefore:
            new Date(data.day).setHours(0, 0, 0, 0) <
              new Date().setHours(0, 0, 0, 0)
              ? true
              : false,
          cellNoWork: isNoWork(data),
        }">
          <div class="cellHeader">
            <span class="cellHeader-ch">{{
                solarToLunar(date, data, scheduleList)
            }}</span>
            <div :class="{
              'cellHeader-ns': true,
              cellToday:
                new Date().setHours(0, 0, 0, 0) ==
                  new Date(data.day).setHours(0, 0, 0, 0)
                  ? true
                  : false,
            }">
              {{ data.day.substring(data.day.length - 2) }}
            </div>
          </div>
          <div class="cellContent">
            <div v-for="(item, index) in scheduleList" class="cellContent-list" :key="index">
              <div v-if="item.date == data.day" style="width: 100%">
                <div v-for="item1 in item.list">
                  <!-- 提交排班待审核 -->
                  <div v-if="item1.apiStatus == 0" class="detail-judgetext detail-judge5">
                    <div class="detail-judgeimg judgeimg5"></div>
                    <div class="detail-cell" title="提交排班待审核">提交排班待审核</div>
                  </div>
                  <!-- 申请排班通过 -->
                  <div v-else-if="item1.apiStatus == 1" class="detail-judgetext detail-judge0">
                    <div class="detail-judgeimg judgeimg0"></div>
                    <div class="detail-cell" :title="item1.applyWorkRemark">{{ item1.applyWorkRemark }}</div>
                  </div>
                  <!-- 已排班 没有换班 -->
                  <div v-else-if="item1.apiStatus == 3 && item1.changeType == 0" class="detail-judgetext detail-judge1">
                    <div class="detail-judgeimg judgeimg1"></div>
                    <div class="detail-cell" :title="item1.gameTime+ '-' + item1.contestTypeName + ' ' + item1.teamA + ' v.s ' + item1.teamB">
                      <span>{{ item1.gameTime }}</span>
                      <span>-</span>
                      <span>{{item1.contestTypeName}}</span>&nbsp;
                      <span>{{ item1.teamA }}</span>
                      <span style="transform: scale(0.8)">VS</span>
                      <span style="margin-right: 6px">{{ item1.teamB }}</span>
                    </div>
                  </div>
                  <!-- 已排班 申请换班 等待被申请人同意 -->
                  <div v-else-if="
                    item1.apiStatus == 3 &&
                    item1.changeType == 1 &&
                    item1.changeStatus == 0
                  " class="detail-judgetext detail-judge3">
                    <div class="detail-judgeimg judgeimg3"></div>
                    <div class="detail-cell" :title="item1.gameTime+'-待同意换班'">
                      <span>{{ item1.gameTime }}</span>
                      <span>-</span>
                      <span>待同意换班</span>
                    </div>
                  </div>
                  <!-- 已排班 申请换班 被申请人同意(等待管理员审核) -->
                  <div v-else-if="
                    item1.apiStatus == 3 &&
                    item1.changeType == 1 &&
                    item1.changeStatus == 1
                  " class="detail-judgetext detail-judge5">
                    <div class="detail-judgeimg judgeimg5"></div>
                    <div class="detail-cell" :title="item1.gameTime+'-换班待审核'">
                      <span>{{ item1.gameTime }}</span>
                      <span>-</span>
                      <span>换班待审核</span>
                    </div>
                  </div>
                  <!-- 已排班 申请调班 等待被申请人同意 -->
                  <div v-else-if="
                    item1.apiStatus == 3 &&
                    item1.changeType == 2 &&
                    item1.changeStatus == 0
                  " class="detail-judgetext detail-judge2">
                    <div class="detail-judgeimg judgeimg2"></div>
                    <div class="detail-cell" :title="item1.gameTime+'-待同意调班'">
                      <span>{{ item1.gameTime }}</span>
                      <span>-</span>
                      <span>待同意调班</span>
                    </div>
                  </div>
                  <!-- 已排班 申请调班 等待被申请人同意 -->
                  <div v-else-if="
                    item1.apiStatus == 3 &&
                    item1.changeType == 2 &&
                    item1.changeStatus == 1
                  " class="detail-judgetext detail-judge5">
                    <div class="detail-judgeimg judgeimg5"></div>
                    <div class="detail-cell" :title="item1.gameTime+'-调班待审核'">
                      <span>{{ item1.gameTime }}</span>
                      <span>-</span>
                      <span>调班待审核</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </workCalendar>
    <!-- 列表 -->
    <div class="box" v-if="selectedCourse">
      <div class="title" style="justify-content: start">
        <div>{{ dayText }}</div>
        <div class="weektip">{{ weekText }}</div>
      </div>
      <div class="tableHeader">
        <div v-for="(item, index) in selectHeader" :key="index">
          {{ item }}
        </div>
      </div>
      <div class="tableBody">
        <div v-for="item in selectedCourse">
          <div class="tableBody-content" v-if="
            item.status == 1 ||
            item.status == 3 ||
            item.status == 2 ||
            item.status == 4
          ">
            <div :class="['brl' + item.status, 'bg' + item.status]">
              {{ item.TIME }}
            </div>
            <div>
              <span>{{ item.TEAM1 }}</span>
              <span style="margin: 0 3px">vs</span>
              <span>{{ item.TEAM2 }}</span>
            </div>
            <div>{{item.contestTypeName}}-{{ item.contestName }}</div>
            <div >{{ item.city }}</div>
            
            <div>{{ item.WORK }}</div>
            <div style="width: 40%">
              <div v-if="item.session && item.session.length > 0">
                <span>{{ item.session }}</span>
                <span :class="'color' + item.status">{{ item.TIP }}</span>
              </div>
              <div v-else>-</div>
            </div>
            <div>
              <div v-if="isOldDay">-</div>
              <template v-else>
                <div v-if="item.status == 3 || item.status == 2" style="cursor: pointer"
                  @click="cancelChangeAction(item)">
                  取消
                </div>
                <div v-else-if="item.status == 1" style="display: flex; justify-content: space-around; flex: 1">
                  <span style="color: #ff7600; cursor: pointer" @click="changeHandle(item)"
                    :hidden="compareTime(item.applyDate)">换班</span>
                  <span style="color: #c23de8; cursor: pointer" @click="transHandle(item)"
                    :hidden="compareTime(item.applyDate)">调班</span>
                </div>
                <div v-else-if="item.status == 4">-</div>
              </template>
            </div>
          </div>
          <div class="tableBody-content" v-if="item.status == 0 || item.status == 5">
            <div :class="['brl' + item.status, 'bg' + item.status]">
              <span class="detail-cell" :title="item.TXT">{{ item.TXT }}</span>
              <span v-if="item.status == 5" class="color5">（待审核）</span>
            </div>
            <div>-</div>
            <div>-</div>
            <div>-</div>
            <div style="width: 50%">
              <span v-if="item.status == 5" class="color5">提交排班待审核</span>
            </div>
            <div>
              <div v-if="isOldDay">-</div>
              <div v-else-if="item.status == 5">-</div>
              <div v-else style="display: flex; justify-content: space-around; flex: 1">
                <span style="color: #00afff; cursor: pointer" @click="editClick(item)">编辑</span>
                <span style="color: #f70000; cursor: pointer" @click="handleEditConfirm('del', item)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗(提交排班时间) -->
    <dialogBox :popup="dialogSchedule" :title="dialogTitle" :close="false" width="30%" top="20vh"
      @cancelOrConfirm="submit2" :dialogType="dialogType">
      <div class="warning">
        <div class="tableDownload"></div>
        <div class="warningTitle">请确保您选择的可排班日期全天有空</div>
      </div>
      <div class="checkWrap">
        <div class="checkContent" :style="{
          border: item.check ? '1px solid #1D81EE' : '',
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          opacity: item.disabled ? '0.5' : '1',
        }" v-for="(item, index) in selectedWeekList" @click="checkDate(item)" :key="index">
          <span>{{ item.label }}</span>
          <span>{{ item.week }}</span>
          <div class="checkBox" v-if="item.check"></div>
        </div>
      </div>
      <div style="margin: 17px 0 0 17px;">备注:</div>
      <div v-for="item in selectedWeekList" class="remark">
        <div v-if="item.check" style="display: flex;align-items: center;">
          <div style="text-align: center;margin:0 auto;">{{ item.label }}</div>
          <el-input style="width: 300px;left:20px;" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }"
            placeholder="请输入内容" v-model="item.textarea1">
          </el-input>
        </div>
      </div>
    </dialogBox>
    <!-- 弹窗（换班） -->
    <dialogBox :popup.sync="changeWork" :title="dialogTitle" width="50%" top="20vh" :bottom="false"
      :dialogType="dialogType" @callback="changeHandle2">
      <div class="dialogHeader">
        <el-date-picker v-model="changeValue1" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
          range-separator="~" size="small" style="width: 224px" value-format="yyyy-MM-dd"
          :picker-options="pickerOptions" validate-event="true" :clearable="false">
        </el-date-picker>
        <el-input placeholder="请输入姓名" v-model="changeValue2" size="small" style="width: 160px; margin-left: 10px">
        </el-input>
        <el-select placeholder="请选择位置" v-model="changeValue3" size="small" style="width: 160px; margin-left: 10px"
          clearable>
          <el-option v-for="item in refereeList" :key="item.name" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- <el-select placeholder="请选择城市" multiple v-model="changeCity" size="small" style="width: 160px; margin-left: 10px"
          clearable>
          <el-option v-for="item in cityList" :key="item.city" :label="item.city" :value="item.city">
          </el-option>
        </el-select> -->
        <el-button type="primary" size="small" style="margin-left: 10px" @click="applyExchangeSearchList">搜索</el-button>
      </div>
      <div class="dialog-center">
        <el-table :data="changeTable" style="width: 100%" size="small" :header-row-class-name="tableRowClassName"
          @row-click="rowHandler">
          <el-table-column prop="date" label="日期" width="180" align="center">
          </el-table-column>
          <el-table-column label="赛程" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.team1 }}</span>
              <span style="margin: 0 5px">vs</span>
              <span>{{ scope.row.team2 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="city" label="城市" align="center">
          </el-table-column>
          <el-table-column prop="week" label="星期" align="center">
          </el-table-column>       
          <el-table-column prop="name" label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="location" label="位置" align="center">
          </el-table-column>
        </el-table>
      </div>
    </dialogBox>
    <!-- 弹窗（换班二次编辑） -->
    <dialogBox :popup.sync="changeWork2" :title="dialogTitle" width="30%" top="30vh" :dialogType="dialogType"
      @cancelOrConfirm="changeWorkDialog">
      <div class="center2-out">
        <div class="center2-wrap">
          <div class="center2">
            <div>姓名：</div>
            <div>{{ currentRow.name }}</div>
          </div>
          <div class="center2">
            <div>日期：</div>
            <div>{{ currentRow.date }}（{{ currentRow.week }}）</div>
          </div>
          <div class="center2">
            <div>赛程：</div>
            <div>
              <span>{{ currentRow.team1 }}</span>
              <span>vs</span>
              <span>{{ currentRow.team2 }}</span>
            </div>
          </div>
          <div class="center2">
            <div>位置：</div>
            <div>
              <span>{{ currentRow.location }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="center2-text">
        您选择了以上信息进行换班,请确认是否发起换班申请？
      </div>
    </dialogBox>
    <!-- 弹窗（调班） -->
    <dialogBox :popup.sync="transWork" :title="dialogTitle" width="30%" top="30vh"
      @cancelOrConfirm="transCancelOrConfirm">
      <div class="dialogBox-center">
        <div class="dialogBox-contentList">
          <div>申请人：</div>
          <el-input v-model="transData.name" :disabled="true" placeholder="请输入内容" size="small">
          </el-input>
        </div>
        <div class="dialogBox-contentList">
          <div>日期：</div>
          <el-input v-model="transData.date" :disabled="true" placeholder="请输入内容" suffix-icon="el-icon-date"
            size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <div>赛程：</div>
          <el-input v-model="transData.team" :disabled="true" placeholder="请输入内容" size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <div>位置：</div>
          <el-input v-model="transData.location" :disabled="true" placeholder="请输入内容" size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <div>被调班人：</div>
          <el-select class="dialogBox-contentList-select" v-model="transData.select" placeholder="请输入内容"
            suffix-icon="el-icon-date" size="small">
            <el-option v-for="item in transList" :key="item.userId" :label="item.name" :value="item.userId">
            </el-option>
          </el-select>
        </div>
      </div>
    </dialogBox>
    <!-- 编辑排班 -->
    <dialogBox :popup.sync="editWork" :title="dialogTitle" width="30%" top="30vh" @cancelOrConfirm="handleEditConfirm">
      <div class="dialogBox-center">
        <div class="dialogBox-contentList">
          <div>日期：</div>
          <el-input v-model="activeSchedule.applyDate" :disabled="true" placeholder="请输入内容" size="small"></el-input>
        </div>
        <div class="dialogBox-contentList">
          <div>备注：</div>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="textarea1">
          </el-input>
        </div>
      </div>
    </dialogBox>
    <!-- 核心兼职二次确认 -->
    <dialogBox :popup.sync="popup" :type="dialogType" @cancelOrConfirm="handleAddConfirm">
      <div class="dialogBox-content">
        您提交的可排版时间少于两天,将提交管理员审核
      </div>
    </dialogBox>
    <!-- 取消换班二次弹窗 -->
    <dialogBox :popup.sync="cancelChangeDialogBox" @cancelOrConfirm="cancelChangeDialogCancelOrConfirm">
      <div class="dialogBox-content">是否取消换班</div>
    </dialogBox>

    <!-- 取消调班二次弹窗 -->
    <dialogBox :popup.sync="cancelAdjustDialogBox" @cancelOrConfirm="cancelAdjustDialogCancelOrConfirm">
      <div class="dialogBox-content">是否取消调班</div>
    </dialogBox>
  </div>
</template>
<script>
import workCalendar from "@/components/calendar/main.vue";
import calendar from "@/utils/calendar.js";
import dialogBox from "@/components/dialogMySchedule/index.vue";
import * as api_account from "@/api/account";
import mixin from "../../mixin";
import store from "@/store";
export default {
  components: {
    workCalendar,
    dialogBox,
  },
  mixins: [mixin],
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          console.log("time====================================");
          console.log(time);
          console.log("====================================");
          return time.getTime() < Date.now();
        },
      },
      changeCity:"",//换班申请筛选城市
      activeSchedule: {},
      scheduleList: [],
      selectHeader: ["时间", "赛程", "赛事","城市","位置", "申请", "操作"], //列表header
      checkboxGroup1: [], //选中的日期
      dialogSchedule: false, //提交排班日期弹窗是否显示
      changeWork: false, //换班弹窗
      textarea1: "", //备注
      dialogTitle: "", //弹窗标题
      changeValue1: "", //换班时间
      changeValue2: "", //换班姓名
      changeValue3: "", //选择位置

      currentRow: {},
      changeWork2: false,
      isRowClick: false, //是否点击某一行时
      transWork: false, //换班弹窗
      cancelChangeDialogBox: false, //取消换班确认弹窗
      cancelAdjustDialogBox: false, //取消调班确认弹窗
      cancelChangeItem: {}, //取消换班对象
      cancelAdjustItem: {}, //取消调班对象
      editWork: false, //编辑排班弹窗
      dialogType: "", //弹窗类型
      popup: false,
      confirmCancel: "",
      refereeList: [
        {
          name: "主裁判",
          id: 1,
        },
        {
          name: "场上裁判",
          id: 2,
        },
        {
          name: "场下裁判",
          id: 3,
        },
      ],
      monthChanging: true,
      applyWorkRemark: "",
      cityDate:"",
    };
  },
  watch: {
    selectDay(nowVal, oldVal) {
      const newMonth = this.$moment(nowVal).format("YYYY-MM");
      const oldMonth = this.$moment(oldVal).format("YYYY-MM");
      if (newMonth != oldMonth) {
        this.monthChanging = true;
      }
      // 判断展开弹窗
      this.showAddDialog();
    },
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    getCityList(){
      this.mixinCityList();
    },
    //判断是否是蓝色底
    isNoWork(data) {
      if (data.type == "current-month") {
        if (new Date(data.day).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
          var hasWork = false
          for (var i = 0; i < this.scheduleList.length; i++) {
            if (data.day == this.scheduleList[i].date) {
              hasWork = true;
              break;
            }
          }
          return !hasWork;
        }
        return false;
      }
      return false;
    },

    //调班的确认还是取消
    transCancelOrConfirm(e) {
      this.transWork = true;

      if (e == "confirm") {
        if (!this.transData.select) {
          this.$message.warning("请选择被调班人员");
          return;
        }
        var transName = "";
        for (let i = 0; i < this.transList.length; i++) {
          const element = this.transList[i];
          if (element.userId == this.transData.select) {
            transName = element.name;
            break;
          }
        }
        this.$confirm("是否和" + transName + "进行调班").then(() => {
          this.transWork = false;
          //确认换班
          this.applyAdjustScheduleSubmit();
        });
      } else {
        this.$confirm("本次编辑将不会保存，是否继续？").then(() => {
          this.transWork = false;
          this.transData = {};
          this.transList = [];
        });
      }
    },

    //比较时间
    compareTime(e) {
      if (e) {
        var date = new Date(e.replace(/-/, "/"));
        let nextDate = new Date(date.getTime() + 1000 * 60 * 60 * 24);
        return nextDate < Date.now();
      }
      return true;
    },

    //取消调班换班操作
    cancelChangeAction(item) {
      if (item.changeType == 1) {
        //取消换班
        this.cancelChangeItem = item;
        this.cancelChangeDialogBox = true;
      } else {
        //取消调班
        this.cancelAdjustItem = item;
        this.cancelAdjustDialogBox = true;
      }
    },

    //取消调班确认取消方法
    cancelAdjustDialogCancelOrConfirm(e) {
      if (e == "confirm") {
        this.userApplyAdjustScheduleCancel(this.cancelAdjustItem);
      } else {
        this.cancelAdjustItem = {};
      }
    },

    //取消调班接口
    userApplyAdjustScheduleCancel(item) {
      this.mixinUserApplyAdjustScheduleCancel({
        userWorkScheduleId: item.userWorkScheduleId,
        offereeUserId: item.apply.offereeUserId,
      }).then((res) => {
        this.cancelAdjustItem = {};
        this.loadData();
      });
    },
    //取消换班确认取消方法
    cancelChangeDialogCancelOrConfirm(e) {
      if (e == "confirm") {
        this.userApplyExchangeScheduleCancel(this.cancelChangeItem);
      } else {
        this.cancelChangeItem = {};
      }
    },

    //取消换班接口
    userApplyExchangeScheduleCancel(item) {
      this.mixinUserApplyExchangeScheduleCancel({
        userWorkScheduleId: item.userWorkScheduleId,
        userWorkScheduleIdReplaced: item.apply.offereeWorkScheduleId,
      }).then((res) => {
        this.cancelChangeItem = {};
        this.loadData();
      });
    },

    //提交排版二次确认
    cancelOrConfirm(e) {
      this.confirmCancel = e;
    },
    //编辑排班
    editClick(schedule) {
      this.activeSchedule = schedule;
      this.textarea1 = schedule.TXT;
      this.dialogTitle = "编辑排班";
      this.dialogType = "edit";
      this.editWork = true;
    },
    //调班
    transHandle(item) {
      this.transData = {};
      this.transData.name = store.getters.userInfo.name;
      this.transData.date = item.gameDate;
      this.transData.team = item.teamA + " vs " + item.teamB;
      this.transData.location = item.WORK;
      this.transData.userWorkScheduleId = item.userWorkScheduleId;
      this.mixinUserApplyAdjustScheduleList({
        userWorkScheduleId: item.userWorkScheduleId,
      });
      this.dialogTitle = "调班申请";
      this.transWork = true;
    },
    //换班二次确认
    changeHandle2() {
      if (this.currentRow && this.isRowClick) {
        this.changeWork2 = true;
        this.isRowClick = false;
      }
    },
    //核心兼职二次确认
    submit2(e) {
      this.confirmCancel = e;
      const length = this.hasAdd + this.checkboxGroup1.length;
      if (
        this.confirmCancel == "confirm" &&
        this.$store.getters.partTimeCoach &&
        length < 2
      ) {
        this.dialogType = "partWork";
        this.popup = true;
      } else {
        this.handleAddConfirm(this.confirmCancel, true);
      }
    },
    handleAddConfirm(type, closeOnCancel = false) {
      if (type == "confirm") {
        this.selectedWeekList.forEach(item => {
          if (item.check) {
            if (item.textarea1 == null) {
              item.textarea1 = "";
            }
            if (this.applyWorkRemark == "") {
              this.applyWorkRemark = item.textarea1;
            } else {
              this.applyWorkRemark += "," + item.textarea1;
            }
          }
        });
        // console.log("备注信息:"+this.applyWorkRemark);
        this.textarea1 = this.applyWorkRemark;
        this.applyWorkRemark = "";
        if (!this.checkboxGroup1.length ) {
          this.$message.warning("请选择数据");
          return;
        }

        this.mixinAddSchedule({
          dateStr: this.checkboxGroup1.map((d) => d.label).join(","),
          applyWorkRemark: this.textarea1,
        }).then(() => {
          this.dialogSchedule = false;
          // 重置表单数据
          this.checkboxGroup1 = [];
          this.textarea1 = "";
        });
      } else {
        this.dialogType == "schedule";
        closeOnCancel && (this.dialogSchedule = false);
      }
    },
    handleEditConfirm(type, schedule) {
      if (type == "confirm") {
        this.mixinEditSchedule({
          userWorkScheduleId: this.activeSchedule.id,
          type: 0,
          applyWorkRemark: this.textarea1,
        });
      } else if (type == "del") {
        let timeArray = schedule.applyDate.split("-");
        let str =
          "确认删除" +
          timeArray[1] +
          "月" +
          timeArray[2] +
          "号的空闲排班记录？";
        this.$confirm(str).then(() => {
          this.mixinEditSchedule({
            userWorkScheduleId: schedule.id,
            type: 1,
            applyWorkRemark: schedule.TXT,
          });
        });
      }
      this.textarea1 = "";
    },
    //点击某一行
    rowHandler(row) {
      this.changeWork = false;
      this.dialogType = "row";
      this.dialogTitle = "温馨提示";
      this.currentRow = row;
      this.isRowClick = true;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    //点击换班
    changeHandle(data) {
      this.changeWorkId = data.userWorkScheduleId;
      this.dialogTitle = "换班申请";
      this.dialogType = "change";
      this.changeWork = true;
      this.changeCity = "";
      this.applyExchangeSearchList();
    },
    //选中或者取消选中时间
    checkDate(item) {
      if (!item.disabled) {
        item.check = !item.check;
        this.checkboxGroup1 = this.selectedWeekList.filter(
          (v) => !v.disabled && v.check
        );
      }
    },
    handleSelectDay(day) {
      this.selectDay = new Date(day);
    },
    //提交排班时间
    showAddDialog() {
      const passData = !this.selectedCourse?.length;
      const passWeek = this.selectedWeekList.some((d) => !d.disabled);
      if (this.monthChanging) {
        this.monthChanging = false;
      } else if (passData && passWeek) {
        this.dialogTitle = "提交可排班时间";
        this.dialogType = "schedule";
        this.dialogSchedule = true;
      }
    },
    // 已知开始时间和结束时间 计算出中间的所有日期
    getAllDate(start, end) {
      let dateArr = [];
      let startArr = start.split("-");
      let endArr = end.split("-");
      let db = new Date();
      db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2]);
      let de = new Date();
      de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2]);
      let unixDb = db.getTime();
      let unixDe = de.getTime();
      let stamp;
      const oneDay = 24 * 60 * 60 * 1000;
      for (stamp = unixDb; stamp <= unixDe;) {
        dateArr.push(this.$moment(parseInt(stamp)).format("YYYY-MM-DD"));
        stamp = stamp + oneDay;
      }
      return dateArr;
    },
    // 公历转农历
    solarToLunar(slotDate, slotData, scheduleList) {
      let solarDayArr = slotData.day.split("-");
      let lunarDay = calendar.solar2lunar(
        solarDayArr[0],
        solarDayArr[1],
        solarDayArr[2]
      ); /* global calendar */
      // 农历日期
      let lunarMD = lunarDay.IMonthCn + lunarDay.IDayCn;
      if (lunarMD.includes("初一")) {
        // 每月初一 显示当前月 如正月初一 显示"正月"
        lunarMD = lunarMD.substr(0, 2);
      } else {
        // 每月初一以外 不显示当前月 如正月初十 显示"初十"
        lunarMD = lunarMD.slice(2);
      }
      // 公历节日\农历节日\农历节气
      let festAndTerm = [];
      festAndTerm.push(
        lunarDay.festival == null ? "" : " " + lunarDay.festival
      );
      festAndTerm.push(
        lunarDay.lunarFestival == null ? "" : "" + lunarDay.lunarFestival
      );
      festAndTerm.push(lunarDay.Term == null ? "" : "" + lunarDay.Term);
      festAndTerm = festAndTerm.join("");
      let result = "";
      if (festAndTerm === "") {
        result = lunarMD;
      } else {
        result = festAndTerm;
      }
      return result;
    },
    applyExchangeSearchList() {
      // if(this.changeValue1==""){
      //   this.$notify.info({
      //     title: '消息',
      //     message: '请先选择时间！'
      //   });
      //   return;
      // }
      this.changeTable = [];
      // if(this.changeCity==[]||this.changeCity.length<1){
      //   this.cityDate = "";
      // }else{
      //   this.cityDate = this.changeCity.join(",");
      // }
      this.applyExchangeScheduleList({
        userWorkScheduleId: this.changeWorkId, //人员排班id
        startDate: this.changeValue1[0], //筛选开始日期
        finishDate: this.changeValue1[1],
        name: this.changeValue2,
        position: this.changeValue3,
        // city:this.cityDate,
        page: 1,
        pageNum: 10,
      }).then((res) => { });
    },

    changeWorkDialog(e) {
      if (e == "confirm") {
        this.changeSubmit();
      }
    },
    changeSubmit() {
      this.applyExchangeScheduleSubmit({
        userWorkScheduleId: this.changeWorkId,
        userWorkScheduleIdReplaced: this.currentRow.userWorkScheduleId,
      }).then((res) => { });
    },
  },
};
</script>
<style lang="css" scoped>
.cellHeader {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cellbox {
  display: flex;
  flex-direction: column;
  /* width: 100%; */
  /* height: 100%; */
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  padding: 8px;
}

.cellContent {
  flex: 1;
  padding: 7px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cellHeader-ch {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #cccccc;
}

.cellHeader-ns {
  font-size: 18px;
  font-family: Helvetica-Bold, Helvetica;
  font-weight: bold;
  color: #333333;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 15px;
}

.cellToday {
  background-color: #00afff;
  color: white;
}

.cellContent-list {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.detail-cell {
  width: 0;
  flex: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 2px;
}

.detail-judgetext {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: Helvetica;
  padding-left: 3px;
  margin-top: 3px;
  padding: 2px 0;;
  width: 100%;
}

.detail-judge1 {
  background: #e0f2e0;
  color: #00b400;
}

.detail-judgetext span {
  margin: 2px;
}

.detail-judge0 {
  background: rgba(0, 175, 255, 0.1);
  color: #00afff;
}

.detail-judge3 {
  background: rgba(253, 229, 208, 0.28);
  color: #ff7e00;
}

.detail-judge2 {
  background: rgba(251, 236, 255, 0.8);
  color: #c23de8;
}

.detail-judge4,
.detail-judge5 {
  background: rgba(255, 0, 92, 0.1);
  color: #ff005c;
}

.detail-judgeimg {
  width: 14px;
  height: 12px;
  margin:2px 0px
}

.judgeimg0 {
  background: url("~@/assets/privateSchedule/blue.png");
}

.judgeimg1 {
  background: url("~@/assets/privateSchedule/green.png");
}

.judgeimg3 {
  background: url("~@/assets/privateSchedule/orange.png");
}

.judgeimg2 {
  background: url("~@/assets/privateSchedule/purple.png");
}

.judgeimg4,
.judgeimg5 {
  background: url("~@/assets/privateSchedule/red.png");
}

.weektip {
  font-size: 20px;
  font-family: MicrosoftYaHei;
  color: rgba(102, 102, 102, 0.5);
  margin-left: 14px;
}

.selectTable {
  font-size: 14px;
  font-family: MicrosoftYaHei;
}

.el-table /deep/ .selectTableheader {
  background-color: #fafbfd !important;
  color: #999999;
}

.el-table /deep/ .el-table__cell {
  background: transparent !important;
}

.tableHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #999999;
  background: #fafbfd;
}

.tableHeader div {
  display: flex;
  justify-content: center;
}

.tableHeader div,
.tableBody-content>div {
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
}

.tableHeader div:nth-child(6) {
  width: 40%;
}

.tableBody {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}

.tableBody-content {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eef2f7;
  /* padding: 20px 0; */
  height: 50px;
}

.brl0 {
  border-left: 2px solid #00afff;
}

.brl1 {
  border-left: 2px solid #00b400;
}

.brl2 {
  border-left: 2px solid #c23de8;
}

.brl3 {
  border-left: 2px solid #ff7e00;
}

.brl4,
.brl5 {
  border-left: 2px solid #ff005c;
}

.color0 {
  color: #00afff;
}

.color1 {
  color: #00b400;
}

.color2 {
  color: #c23de8;
}

.color3 {
  color: #ff7e00;
}

.color4,
.color5 {
  color: #ff005c;
}

.bg0 {
  background: linear-gradient(270deg,
      rgba(0, 175, 255, 0) 0%,
      rgba(0, 175, 255, 0.05) 100%);
}

.bg2 {
  background: linear-gradient(270deg,
      rgba(194, 61, 232, 0) 0%,
      rgba(194, 61, 232, 0.05) 100%);
}

.bg3 {
  background: linear-gradient(270deg,
      rgba(99, 111, 247, 0) 0%,
      rgba(255, 126, 0, 0.05) 100%);
}

.bg1 {
  background: linear-gradient(270deg,
      rgba(0, 219, 0, 0) 0%,
      rgba(0, 180, 0, 0.04) 100%);
}

.bg4,
.bg5 {
  background: linear-gradient(270deg,
      rgba(194, 61, 232, 0) 0%,
      rgba(255, 0, 92, 0.05) 100%);
}

.warning {

  padding: 6px 13px;
  margin: 17px 17px 0 17px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  background: #FEF2E7;
  border-radius: 4px;
  border: 1px solid rgba(255, 126, 0, 0.25);
}

.tableDownload {
  width: 14px;
  height: 14px;
  
  background-image: url("~@/assets/privateSchedule/icon_warning.png");
}

.warningTitle {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(0, 0, 0, 0.65);
  padding-left:6px;
}


.checkWrap {
  display: flex;
  flex-wrap: wrap;
}

.checkContent {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 1px solid #d9d9d9;
  padding: 6px;
  margin: 17px 0 0 17px;
  cursor: pointer;
}

.checkBox {
  width: 16px;
  height: 16px;
  position: absolute;
  background-image: url("~@/assets/privateSchedule/check.png");
  background-size: 100% 100%;
  bottom: -1px;
  right: -1px;
}

.remark {
  display: flex;
  align-items: center;
  padding-left: 17px;
  margin-top: 10px;
}

.el-textarea /deep/ .el-textarea__inner {
  background: #f8f9fb !important;
}

.dialogHeader {
  display: flex;
  align-items: center;
  padding: 20px;
}

.el-table>>>.warning-row {
  background: #fafafa !important;
  color: #333333;
  font-size: 14px;
  font-family: MicrosoftYaHei;
}

.el-table>>>.success-row {
  font-size: 14px;
  font-family: Helvetica;
  color: #666666;
}

.dialog-bottom {
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
}

.bottom-left {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #999999;
}

.center2-out {
  display: flex;
  align-items: center;
  justify-content: center;
}

.center2-wrap {
  border: 1px solid #e8e8e8;
  width: 90%;
  margin-top: 20px;
}

.center2 {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
}

.center2-wrap div {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}

.center2-wrap div:last-child {
  border-bottom: none;
}

.center2 div {
  padding: 5px;
}

.center2 div:first-child {
  background: #fafafa;
  border-right: 1px solid #e8e8e8;
  flex: 2;
  color: #666666;
}

.center2 div:last-child {
  flex: 4;
}

.center2-text {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}

.dialog-center /deep/ .el-table__row {
  cursor: pointer;
}

.dialogBox-center {
  border-bottom: 1px solid #dde1e6;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialogBox-contentList {
  width: 60%;
  justify-content: space-between;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #666666;
  padding-bottom: 10px;
}

.dialogBox-contentList div {
  min-width: 80px;
}

.dialogBox-contentList-select {
  width: calc(100% - 80px);
}

.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.cellDateBefore {
  background-image: url("~@/assets/privateSchedule/line.png");
  background-position: center;
  background-size: 100% 100%;
  opacity: 0.5;
}

.cellNoWork {
  /* 没工作且当月蓝色底 */
  background-color: #f4f8ff;
}
</style>
