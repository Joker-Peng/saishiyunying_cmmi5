<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 10px; flex: none;">
      <div class="title flex-jsb">
        <div class="flex-ac">
          <div class="chunk">
            <el-select
              placeholder="请选择赛事"
              v-model="event"
              @change="changeMatch"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <span>人员排班</span>
        </div>
        <div class="flex-ac">
          <!-- 日/自定义 -->
          <div class="switch">
            <span v-for="type in typeOptions" :key="type.value" :class="{active: type.value == filterData.type}" @click="filterData.type = type.value">{{type.label}}</span>
          </div>
          <!-- 时间选择 -->
          <div class="chunk-wrap flex-ac" style="margin-left: 20px; margin-top: 0">
            <div class="chunk-text" style="color: #333333; font-size: 14px; font-weight: 400">排班时间：</div>
            <el-date-picker
              v-show="filterData.type == 'custom'"
              v-model="filterData.date"
              type="daterange"
              append-to-body
              range-separator="至"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-date-picker
              v-show="filterData.type == 'day'"
              v-model="filterData.date"
              type="date"
              append-to-body
              range-separator="至"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      </div>
    </div>
    <div  style="flex: auto; overflow: auto">
      <div class="box" style="margin: 0;">
        <section class="fixed">
          <!-- 按日选择 -->
          <template v-if="filterData.type == 'day'">
            <div class="detail-title">
              <div class="dateText">时间</div>
              <div v-for="item in dateList[0].contestSchedule">
                <span class="detail-titletext">{{ item.gameTime }}</span>
              </div>
            </div>
            <div class="detail-match">
              <div class="detail-matchtitle">赛程</div>
              <div v-for="v in dateList[0].contestSchedule" class="detail-matchtext">
                <p>{{v.teamA + " vs " + v.teamB}}</p><p>{{"(" + v.city + ")"}}</p>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- --------------------------日期-------------------------------- -->
            <div class="detail-title">
              <div class="dateText">日期</div>
              <div v-for="item in dateList">
                <span class="detail-titletext">{{ item.date }}</span>
                <span style="color: #999999; font-size: 14px">{{ item.week }}</span>
              </div>
            </div>
            <!-- --------------------------赛程-------------------------------- -->
            <div class="detail-match">
              <div class="detail-matchtitle">赛程</div>
              <div v-for="item in dateList">
                <div v-if="item.contestSchedule">
                  <div v-for="v in item.contestSchedule" class="detail-matchtext">
                    <p>{{v.teamA + " vs " + v.teamB}}{{"(" + v.city + ")"}}</p>
                  </div>
                </div>
                <div v-else class="detail-matchtext">-</div>
              </div>
            </div>
          </template>
        </section>
        <!-- --------------------------裁判排班---------------------------- -->
        <div>
          <div class="detail-judge" v-for="item in judgement">
            <div class="detail-judgename">{{ item.name }}</div>
            <div
              v-for="(item1, item1index) in item.dateWorkSchedule"
              @click="synPopShow(item1, item.name, item.userId)"
            >
              <div v-if="item1.list" style="width: 98%">
                <div v-for="item2 in item1.list" class="detail-judgecontext">
                  <!-- 有排班信息 -->
                  <div
                    v-if="item2.status == 3 && item2.changeType == 0"
                    class="detail-judgetext detail-judge1 overflow-hidden"
                    @click="pbInfoShow(item2, item.name)"
                    :title="item2.contestSchedule.gameTime+'-'+item2.contestSchedule.teamA+' vs '+item2.contestSchedule.teamB"
                  >
                    <div class="detail-judgeimg judgeimg1"></div>
                    <template v-if="filterData.type == 'day'">
                      <span>
                        {{item2.side ? refereePositionList.find(d => d.value == item2.side).label : ""}}
                      </span>
                      <span>
                        {{item2.position ? $dictionary.position.find(d => d.value == item2.position).label : ""}}
                      </span>
                    </template>
                    <template v-else>
                      <span>{{ item2.contestSchedule.gameTime }}</span>
                      <span>-</span>
                      <span>{{ item2.contestSchedule.teamA }}</span>
                      <span style="transform: scale(0.8)">VS</span>
                      <span style="margin-right: 6px">{{
                        item2.contestSchedule.teamB
                      }}</span>
                    </template>
                  </div>
                  <div
                    v-if="
                      item2.status == 3 &&
                      item2.changeType != 0 &&
                      item2.changeStatus == 0
                    "
                    class="detail-judgetext detail-judge1 overflow-hidden"
                    :title="item2.contestSchedule.gameTime+'-'+item2.contestSchedule.teamA+' vs '+item2.contestSchedule.teamB"
                  >
                    <div class="detail-judgeimg judgeimg1"></div>
                    <template v-if="filterData.type == 'day'">
                      <span>
                        {{item2.side ? refereePositionList.find(d => d.value == item2.side).label : ""}}
                      </span>
                      <span>
                        {{item2.position ? $dictionary.position.find(d => d.value == item2.position).label : ""}}
                      </span>
                    </template>
                    <template v-else>
                      <span>{{ item2.contestSchedule.gameTime }}</span>
                      <span>-</span>
                      <span>{{ item2.contestSchedule.teamA }}</span>
                      <span style="transform: scale(0.8)">VS</span>
                      <span style="margin-right: 6px">{{
                        item2.contestSchedule.teamB
                      }}</span>
                    </template>
                  </div>
                  <!-- 申请排班通过 -->
                  <div
                    v-else-if="item2.status == 1"
                    class="detail-judgetext detail-judge0 overflow-hidden"
                    @click="arrangeWork(item2, item.name, item.userId, item, item1index)"
                    style="cursor: pointer"
                    :title="item2.applyWorkRemark"
                  >
                    <div class="detail-judgeimg judgeimg0"></div>
                    <span>{{ item2.applyWorkRemark }}</span>
                  </div>
                  <!-- 申请换班 -->
                  <div
                    v-else-if="
                      item2.status == 3 &&
                      item2.changeType == 1 &&
                      item2.changeStatus == 1
                    "
                    class="detail-judgetext detail-judge2 overflow-hidden"
                    @click="transWork(item2.userWorkScheduleId)"
                    style="cursor: pointer"
                    :title="item2.contestSchedule.gameTime+'-换班申请'"
                  >
                    <div class="detail-judgeimg judgeimg2"></div>
                    <span>{{ item2.contestSchedule.gameTime }}-换班申请</span>
                    <!-- <span>-</span>
                    <span>{{item2.session.TXT}}</span> -->
                  </div>
                  <!-- 调班申请 -->
                  <div
                    v-else-if="
                      item2.status == 3 &&
                      item2.changeType == 2 &&
                      item2.changeStatus == 1
                    "
                    class="detail-judgetext detail-judge3 overflow-hidden"
                    @click="changeWork(item2.userWorkScheduleId)"
                    style="cursor: pointer"
                    :title="item2.contestSchedule.gameTime+'-调班申请'"
                  >
                    <div class="detail-judgeimg judgeimg3"></div>
                    <!-- <span>{{ item2.applyDate }}</span>
                    <span>-</span> -->
                    <span>{{ item2.contestSchedule.gameTime }}-调班申请</span>
                  </div>
                  <!-- 申请排班，待审核 -->
                  <div
                    v-else-if="item2.status == 0"
                    class="detail-judgetext detail-judge4 overflow-hidden"
                    @click="partTime(item2, item.name)"
                    style="cursor: pointer"
                    :title="item2.applyWorkRemark+'待审核'"
                  >
                    <div class="detail-judgeimg judgeimg4"></div>
                    <span>{{ item2.applyWorkRemark }}待审核</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 是否进行排班 -->
    <dialogBox
      :popup.sync="synPop"
      :type="synType"
      :title="synTitle"
      @cancelOrConfirm="synChange"
    >
      <div class="dialogBox-content">是否新增排班？</div>
    </dialogBox>
   

    <!-- 排班弹窗 -->
    <dialogBox
      :popup.sync="scheduleWork"
      :title="dialogTitle"
      top="30vh"
      width="30%"
      :dialogType="dialogType"
      @cancelOrConfirm="cancelOrConfirm"
    >
      <div class="dialogBox-center">
        <div class="dialogBox-contentList">
          <div class="contentListLeft">姓名：</div>
          <el-input
            class="contentListRight"
            v-model="scheduleWorkData.name"
            :disabled="true"
            placeholder="请输入内容"
            size="small"
          ></el-input>
        </div>
        <div class="dialogBox-contentList">
          <div class="contentListLeft">赛程：</div>
          <el-select
            class="contentListRight"
            v-model="scheduleWorkDataMatch"
            placeholder="请输入内容"
            suffix-icon="el-icon-date"
            size="small"
            @change="changeArrangeList"
            :disabled="filterData.type == 'day'"
          >
            <el-option
              v-for="item in scheduleWorkData.match"
              :key="item.contestName"
              :label="item.contestName"
              :value="item.contestScheduleId"
            >
            </el-option>
          </el-select>
        </div>
        <div class="dialogBox-contentList">
          <div class="contentListLeft">位置：</div>
          <el-select
            class="contentListRight"
            v-model="selectRefereeId"
            placeholder="请输入内容"
            suffix-icon="el-icon-date"
            size="small"
            @change="refereeChange"
          >
            <el-option
              v-for="item in refereeTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="dialogBox-contentList">
          <div class="contentListLeft"></div>
          <el-select
            class="contentListRight"
            v-model="selectRefereePosition"
            placeholder="请输入内容"
            suffix-icon="el-icon-date"
            size="small"
          >
            <el-option
              v-for="item in refereePositionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </dialogBox>

     <!-- 排班信息展示弹窗 -->
    <dialogBox
      :popup.sync="pbShowDialog"
      :title="pbShowTitle"
      top="30vh"
      width="30%"
      :dialogType="dialogType"
      @cancelOrConfirm="pbShowChange"
    >
      <div class="dialogBox-center">
        <div class="dialogBox-contentList">
          <div class="contentListLeft">姓名：</div>
          <el-input
            class="contentListRight"
            v-model="pbShowData.name"
            :disabled="true"
            placeholder="请输入内容"
            size="small"
          ></el-input>
        </div>
        <div class="dialogBox-contentList">
          <div class="contentListLeft">赛程：</div>
          <el-select
            class="contentListRight"
            v-model="pbShowData.team"
            placeholder="请输入内容"
            suffix-icon="el-icon-date"
            size="small"
            :disabled="true"
            
          >
            
          
          </el-select>
        </div>
        <div class="dialogBox-contentList">
          <div class="contentListLeft">位置：</div>
          <el-select
            class="contentListRight"
            v-model="pbShowData.refereeName"
            placeholder="请输入内容"
            suffix-icon="el-icon-date"
            :disabled="true"
            size="small"
          >
          
          </el-select>
        </div>
        <div class="dialogBox-contentList">
          <div class="contentListLeft"></div>
          <el-select
            class="contentListRight"
            v-model="pbShowData.position"
            placeholder="请输入内容"
            suffix-icon="el-icon-date"
            :disabled="true"
            size="small"
          >
            <el-option
              v-for="item in refereePositionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </dialogBox>
    <!-- 换班弹窗 -->
    <dialogBox
      :popup.sync="transWorkBox"
      :title="dialogTitle"
      top="30vh"
      width="30%"
      :dialogType="dialogType"
      :bottom="false"
    >
      <div class="center2-out">
        <div class="center2-wrap">
          <div class="center2">
            <div>换班人：</div>
            <div>{{ transData.nameA }}</div>
          </div>
          <div class="center2">
            <div>位置：</div>
            <div>
              <span>{{ transData.workA }}</span>
            </div>
          </div>
          <div class="center2">
            <div>日期：</div>
            <div>{{ transData.dateA }}</div>
          </div>
          <div class="center2">
            <div>赛程：</div>
            <div>{{ transData.matchA }}</div>
          </div>
          <div class="center2">
            <div>被换班人：</div>
            <div>{{ transData.nameB }}</div>
          </div>
          <div class="center2">
            <div>位置：</div>
            <div>
              <span>{{ transData.workB }}</span>
            </div>
          </div>
          <div class="center2">
            <div>日期：</div>
            <div>{{ transData.dateB }}</div>
          </div>
          <div class="center2">
            <div>赛程：</div>
            <div>{{ transData.matchB }}</div>
          </div>
        </div>
      </div>
      <footer>
        <div class="dialogFooter">
          <el-button
            style="background: #f70000; color: #ffffff"
            @click="hbPopShow(4)"
            >拒 绝</el-button
          >
          <el-button type="primary" @click="hbPopShow(3)">同 意</el-button>
        </div>
      </footer>
    </dialogBox>
    <!-- 调班弹窗 -->
    <dialogBox
      :popup.sync="changeWorkBox"
      :title="dialogTitle"
      top="30vh"
      width="30%"
      :dialogType="dialogType"
      :bottom="false"
    >
      <div class="center2-out">
        <div class="center2-wrap">
          <div class="center2">
            <div>调班人：</div>
            <div>{{ transData.nameA }}</div>
          </div>
          <div class="center2">
            <div>位置：</div>
            <div>
              <span>{{ transData.workA }}</span>
            </div>
          </div>
          <div class="center2">
            <div>日期：</div>
            <div>{{ transData.dateA }}</div>
          </div>
          <div class="center2">
            <div>赛程：</div>
            <div>{{ transData.matchA }}</div>
          </div>
          <div class="center2">
            <div>被调班人：</div>
            <div>{{ transData.nameB }}</div>
          </div>
        </div>
      </div>
      <footer>
        <div class="dialogFooter">
          <el-button
            style="background: #f70000; color: #ffffff"
            @click="tbPopShow(4)"
            >拒 绝</el-button
          >
          <el-button type="primary" @click="tbPopShow(3)">同 意</el-button>
        </div>
      </footer>
    </dialogBox>
    <!-- 排班审核 -->
    <dialogBox
      :popup.sync="partWorkBox"
      :title="dialogTitle"
      @cancelOrConfirm="cancelOrConfirm"
      top="30vh"
      width="30%"
      :dialogType="dialogType"
      :bottom="false"
    >
      <div class="center2-out">
        <div class="center2-wrap">
          <div class="center2">
            <div>提交人：</div>
            <div>{{ applyData.name }}</div>
          </div>
          <div class="center2">
            <div>排班日期：</div>
            <div>
              <span>{{ applyData.time }}</span>
            </div>
          </div>
          <div class="center2">
            <div>备注：</div>
            <div>{{ applyData.remark }}</div>
          </div>
        </div>
      </div>
      <footer>
        <div class="dialogFooter">
          <el-button
            style="background: #f70000; color: #ffffff"
            @click="submitPbShow1(2)"
            >拒 绝</el-button
          >
          <el-button type="primary" @click="submitPbShow1(1)"
            >同 意</el-button
          >
        </div>
      </footer>
    </dialogBox>
     <!-- 是否进行排班二次确认 -->
    <dialogBox
      :popup.sync="pbShow"
      :type="synType"
      :title="synTitle"
      @cancelOrConfirm="pbChange"
    >
      <div class="dialogBox-content">是否提交排班？</div>
    </dialogBox>

    <!-- 是否进行换班二次确认 -->
    <dialogBox
      :popup.sync="hbShow"
      :type="synType"
      :title="synTitle"
      @cancelOrConfirm="hbChange"
    >
      <div class="dialogBox-content">{{ hbMessage }}</div>
    </dialogBox>

    <!-- 是否进行调班二次确认 -->
    <dialogBox
      :popup.sync="tbShow"
      :type="synType"
      :title="synTitle"
      @cancelOrConfirm="tbChange"
    >
      <div class="dialogBox-content">{{ tbMessage }}</div>
    </dialogBox>

    <!-- 是否同意此排班二次确认 -->
    <dialogBox
      :popup.sync="submitPbShow"
      :type="synType"
      :title="synTitle"
      @cancelOrConfirm="submitTbChange"
    >
      <div class="dialogBox-content">{{submitPbTip}}</div>
    </dialogBox>
  </div>
</template>
<script>
import dialogBox from "@/components/dialogMySchedule/index.vue";
import * as api_account from "@/api/account";
export default {
  name: "privateSchedule",
  components: {
    dialogBox,
  },
  data() {
    return {
      filterData: {
        type: "custom",
        date: [], // 按日的当前天 如2023-07-27
      },
      typeOptions: [
        {label: "DAY", value: "day"},
        {label: "自定义", value: "custom"}
      ],
      datalist: "",
      isEdit: false,
      scheduleWork: false, //排班弹窗
      dialogTitle: "", //弹窗标题
      dialogType: "", //弹窗类型
      applyData: [],
      options: [],
      scheduleWorkData: {}, //排班提交数据
      scheduleWorkDataMatch: "",
      scheduleData: {
        name: "里希夏",
        team1: "BDJ",
        team2: "JD",
        work: "主裁判",
        match: "16:00\xa0BDJ\xa0vs\xa0JD",
        time: "16:00",
      }, //排班数据
      transWorkBox: false, //换班弹窗
      changeWorkBox: false, //调班弹窗
      partWorkBox: false, //排班审核
      transData: {
        nameA: "裁判1",
        workA: "主裁判",
        dateA: "2022-04-14",
        matchA: "16:00\xa0BDJ\xa0vs\xa0JD",
        nameB: "裁判1",
        workB: "主裁判",
        dateB: "2022-04-14",
        matchB: "16:00\xa0BDJ\xa0vs\xa0JD",
      },
      event: "",
      judgement: [],
      dateList: [],
      scheduleMatchList: [],
      refereeId: "",
      refereeTypeList: [],
      refereePositionList: [
        {label: "A边", value: 1},
        {label: "B边", value: 2}
      ],
      selectRefereeId: "",
      selectRefereePosition: "",
      refereeIdArr: [],
      appointDate: "",
      weekNum: 0,
      messageType: "",
      messageId: "",
      synPop: false,
      synType: "syn",
      synTitle: "提示",
      synData: "",
      synName: "",
      synId: "",
      pbShow: false,
      hbShow: false,
      tbShow: false,
      hbMessage: "",
      tbMessage: "",
      hbValue: "",
      tbValue: "",
      pbShowDialog:false,
      pbShowTitle:"排班信息",
      pbShowData:{},
      selectMatchNum:0,
      addRefereeName:"",
      perNum:100,//用来计算第一个有权限的
      submitPbShow:false,
      submitPbState:'',
      submitPbTip:"",
      hasGetContestType: false
    };
  },
  watch: {
    "filterData.type"(val) {
      if(val == "custom") {
        this.filterData.date = [this.filterData.date, this.$moment(this.filterData.date).add(7, "days")]
      } else {
        this.filterData.date = this.filterData.date[0]
      }
    },
    "filterData.date"(val) {
      // 更新dataStr，并重新请求接口
      const dateSelect = [];
      if(this.filterData.type == "custom") {
        const startDate = this.$moment(val[0]).format("YYYY-MM-DD");
        const endDate = this.$moment(val[1]).format("YYYY-MM-DD");
        let addDays = 0;
        let lastPushDate = "";
        while(lastPushDate != endDate) { //防止出现未知问题无法跳出循环
          lastPushDate = this.$moment(val[0]).add(addDays, "days").format("YYYY-MM-DD");
          dateSelect.push(lastPushDate);
          addDays++;
        }
      } else {
        dateSelect.push(this.$moment(val).format("YYYY-MM-DD"));
      }
      this.datalist = dateSelect.join(",")
      if(this.hasGetContestType) {
        this.getApplyScheduleAuth();
      } else {
        this.hasGetContestType = true;
        this.getContestType();
      }
    },
    "scheduleWork"(nowVal, oldVal) {
      nowVal && (this.selectRefereeId = "");
    }
  },
  mounted() {
    this.messageType = this.$route.query.messageType;
    this.messageId = this.$route.query.messageId;
    this.filterData.date = [new Date(), this.$moment().add(7, "days")];
  },
  methods: {
    pbShowChange(e){},
    pbInfoShow(data,name){
      // this.isEdit = false;
      // if(!this.isEdit){
      //   return;
      // }
      this.pbShowData.name = name;
      this.pbShowData.team = data.contestSchedule.teamA+" vs "+data.contestSchedule.teamB; 
      this.pbShowData.refereeName = this.getNameById(data.position);
      this.pbShowData.position = data.side
      this.synPop = false;
      this.pbShowDialog = true;
    },
    hbPopShow(i) {
      this.transWorkBox = true;
      this.hbShow = true;
      this.hbValue = i;
      if (i == 3) {
        this.hbMessage = "确定同意此次换班申请？";
      } else {
        this.hbMessage = "确定拒绝此次换班申请？";
      }
    },
    hbChange(e) {
      if (e == "confirm") {
        this.exchangeScheduleAuth(this.hbValue);
      } else {
      }
    },
    tbPopShow(i) {
      this.tbShow = true;

      this.tbValue = i;
      if (i == 3) {
        this.tbMessage = "确定同意此次调班申请？";
      } else {
        this.tbMessage = "确定拒绝此次调班申请？";
      }
    },
    tbChange(e) {
      if (e == "confirm") {
        this.adjustScheduleAuth(this.tbValue);
      } else {
      }
    },

    synPopShow(data, name, id) {
      if(this.pbShowDialog){
        return;
      }
      if (this.weekNum < 0) {
        return;
      }
      this.dateList.forEach((item) => {
        if (data.date == item.date) {
          
          (this.scheduleWorkData.match = []),
            item.contestSchedule.forEach((item1) => {
              this.scheduleWorkData.match.push({
                contestScheduleId: item1.contestScheduleId,
                contestName:
                  item1.gameTime + "  " + item1.teamA + " vs " + item1.teamB,
              });
            });
        }
      });
      this.selectMatchNum = this.scheduleWorkData.match.length;
      this.scheduleWorkData.match = [];
      if (data.list.length < this.selectMatchNum && data.list.length > 0) {
        if (
          (data.list[0].status == 3 && data.list[0].changeType == 0) ||
          (data.list[0].status == 3 &&
            data.list[0].changeType != 0 &&
            data.list[0].changeStatus == 0)
        ) {
          this.synPop = true;
          this.synData = data;
          this.synName = name;
          this.synId = id;
          // this.
        }
      }

    },
    synChange(e) {
      console.log("长度:" + e)
      if (e == "confirm") {
        this.arrangeWork(this.synData, this.synName, this.synId);
      }
    },
    pbPopShow() {
      if (!this.scheduleWorkDataMatch || !this.selectRefereeId || !this.selectRefereePosition) {
        this.$notify.info({
          title: "消息",
          message: "请先选择赛程及位置！",
        });
        this.scheduleWork = true;
        return;
      }
      this.pbShow = true;
    },
    pbChange(e) {
      console.log("e" + e);
      if (e == "confirm") {
        this.refereeIdArr = [];
        this.refereeIdArr.push(this.refereeId);
        // this.scheduleAddReferee();
        this.submitPb();
      }else{
        this.scheduleWork = true;
      }
    },
    submitPb(){
      api_account
        .addRefereeOne({
          contestScheduleId: this.scheduleWorkDataMatch,
          positionId: this.selectRefereeId,
          refereeId:this.refereeId,
          side: this.selectRefereePosition
        })
        .then((res) => {
          console.log("返回结果:" + res);
          if (res.success) {
            this.scheduleWork = false;
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.getApplyScheduleAuth();
          }
        });
    },
    refereeChange() {
      console.log("重新选择:" + this.selectRefereeId);
      // this.refereeTypeList(item=>{
      //   if(this.selectRefereeId = item.id){
      //      this.addRefereeName = item.name;
      //   }
      // })
    },
    changeArrangeList() {
      console.log("重新选择:" + this.scheduleWorkDataMatch);
      this.selectRefereeId = "";
      // 为0或空,则没有赛程,不请求
      if(!this.scheduleWorkDataMatch) return;
      this.canJudgePosition(this.scheduleWorkDataMatch, this.refereeId);
    },
    arrangeWork(data, name, id, item, index) {
      
      if (!this.isEdit) {
        return;
      }
      if (this.weekNum < 0) {
        return;
      }
      // 冻结
      if(item && item.refereeStatus===2) {
        return;
      }
      // 日期内没有赛事
      if(index!==undefined && item && item.dateWorkSchedule) {
        if(this.dateList.some(sm=>sm.date===item.dateWorkSchedule[index].date && sm.contestSchedule.length===0)) {
          return false;
        }
      }
      this.scheduleWorkData.name = name;
      this.scheduleWorkDataMatch = "";
      this.selectRefereeId = "";
      this.selectRefereePosition = "";
      this.dateList.forEach((item) => {
        if (data.date == item.date||data.applyDate == item.date) {
          
          (this.scheduleWorkData.match = []),
            item.contestSchedule.forEach((item1) => {
              this.scheduleWorkData.match.push({
                contestScheduleId: item1.contestScheduleId,
                contestName:
                  item1.gameTime + "  " + item1.teamA + " vs " + item1.teamB,
              });
            });
        }
      });
      // 如果是日,取默认值
      if(this.filterData.type == "day" && this.scheduleWorkData.match.length>0) {
        this.scheduleWorkDataMatch = this.scheduleWorkData.match[index].contestScheduleId;
      }
      this.refereeId = id;
      this.dialogTitle = "排班";
      this.dialogType = "arrange";
      // 获取日的位置,日禁用了赛程选择,弹窗前主动触发
      this.changeArrangeList();
      // 排班弹窗显示
      this.$nextTick(()=>{
        this.scheduleWork = true;
      })

      // console.log("排班:"+this.scheduleMatchList.length);
      // this.scheduleWorkData.match = this.scheduleMatchList;
    },
    changeWork(v) {
      console.log("换班");
      if (!this.isEdit) {
        return;
      }
      this.adjustScheduleDetail(v);
    },
    transWork(data) {
      console.log("换班");
      if (!this.isEdit) {
        return;
      }
      this.getExchangeScheduleDetail(data);
    },
    partTime(data, name) {
      if (!this.isEdit) {
        return;
      }
      
      (this.applyData.name = name),
        (this.applyData.time = data.applyDate),
        (this.applyData.id = data.userWorkScheduleId),
        (this.applyData.remark = data.applyWorkRemark),
        (this.dialogTitle = "排班审核"),
        (this.dialogType = "part"),
        (this.partWorkBox = true);
    },
    cancelOrConfirm(e) {
      console.log("返回结果:" + e);
      if (e == "cancel") {
        return;
      }
      if (this.dialogType == "arrange") {
        this.scheduleWork = true;
        this.pbPopShow();
        
      }
    },
    changeMatch() {
      
      this.options.forEach((item) => {
        if (this.event == item.value) {
          
          this.isEdit = item.isSelect;
        }
      });
      this.getApplyScheduleAuth();
    },
    getContestType() {
      this.perNum=100;
      api_account.getContestType({}).then((res) => {
        if (res.success) {
          this.options = [];
          res.data.forEach((item, index) => {
            this.options.push({
              value: item.contestTypeId,
              label: item.contestTypeName,
              isSelect: item.isSelect,
            });
          });
          for(var l=0;l<this.options.length;l++){
            if(this.options[l].isSelect){
              if(!this.event) {
              this.event = this.options[l].value;
              }
              this.getApplyScheduleAuth();
              this.isEdit = this.options[l].isSelect;
              break;
            }
          }
        }
      });
    },
    getApplyScheduleAuth() {
      api_account
        .getCalendarInfo({
          contestTypeId: this.event,
          dateStr: this.datalist,
        })
        .then((res) => {
          // console.log("返回结果:" + res);
          if (res.success) {
            this.dateList = [];
            // this.dateList = res.data.dateSchedule;
            res.data.dateSchedule.forEach((item) => {
              item.week = this.getWeekByNum(item.dayOfWeek);
              this.dateList.push(item);
            });
            this.judgement = res.data.judgeList;
            if(this.filterData.type == "day") {
              this.judgement = res.data.judgeList.map(d => {
                const ddate = d.dateWorkSchedule[0].date||'';
                const DList = d.dateWorkSchedule[0].list || [];
                // 重构数据
                let list = []
                // 若只有一个
                if(DList.length===1) {
                  // 并且id为0或id并不存在dateList任意一个
                  if(DList[0].contestScheduleId===0) {
                    // 填充多份,
                    list = Array.from({length: this.dateList[0].contestSchedule.length}, function(m,i) { return DList[0]; })
                  }else{
                    // 查询的是day所以取0
                    // 如果id为dataList的一个,则找出对应位置,其余填充空
                    const findIndex = this.dateList[0].contestSchedule.findIndex(sm=>sm.contestScheduleId===DList[0].contestScheduleId)
                    if(findIndex!==-1) {
                      // 找到了
                      list = Array.from({length: this.dateList[0].contestSchedule.length}, function(m,i) { 
                        if(i===findIndex) {
                          return DList[0];
                        }else{
                          return {index: i, contestScheduleId: 0, userId: d.userId, status: 1, applyDate: ddate};
                        }
                      })
                    }else{
                      // 未找到
                      list = Array.from({length: this.dateList[0].contestSchedule.length}, function(m,i) { 
                        return {index: i, contestScheduleId: 0, userId: d.userId, status: 1, applyDate: ddate}; 
                      }) 
                    }
                  }
                }else if(DList.length>1) {
                  // 多个,找出每个对应dateList的,按位置对应,其余填充空
                  // 多个不存在contestScheduleId=0的情况,
                  list = this.dateList[0].contestSchedule.map((mp,mpindex)=>{
                    const dlistIdMatch_dateListId = DList.find(fd=>fd.contestScheduleId===mp.contestScheduleId)
                    if(dlistIdMatch_dateListId) {
                      return dlistIdMatch_dateListId
                    }else{
                      return {index: mpindex, contestScheduleId: 0, userId: d.userId, status: 1, applyDate: ddate};
                    }
                  })
                }

                d.dateWorkSchedule = this.dateList[0].contestSchedule.map((d1,d1index) => {
                  return {
                    ...d.dateWorkSchedule[0],
                    list: list.filter((d2,d2index) => d2.contestScheduleId == d1.contestScheduleId||(d2.contestScheduleId===0&&d2index===d1index)) || []
                  }
                })
                return d
              });
              console.log('day-judgement',JSON.parse(JSON.stringify(this.judgement)))
            }
          }
          if (this.messageType == 201) {
            // this.transWork(this.messageId);
          } else if (this.messageType == 400) {
            // this.applyData.id = this.messageId;
            // this.dialogTitle = "排班审核";
            // this.dialogType = "part";
            // this.partWorkBox = true;
          }
        });
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
    //申请换班详情
    getExchangeScheduleDetail(v) {
      if (!this.isEdit) {
        return;
      }
      api_account
        .exchangeScheduleDetail({
          userWorkScheduleId: v, //人员排班id
        })
        .then((res) => {
          console.log("返回结果:" + res);
          if (res.success) {
            this.transData.nameA = res.data.apply.user.name;
            this.transData.workA = this.getNameById(res.data.apply.position);
            this.transData.userWorkScheduleId =
              res.data.apply.userWorkScheduleId;
            this.transData.dateA = res.data.apply.applyDate;
            this.transData.matchA =
              res.data.apply.contestSchedule.teamA +
              "vs" +
              res.data.apply.contestSchedule.teamB;
            this.transData.nameB = res.data.offeree.user.name;
            this.transData.workB = this.getNameById(res.data.offeree.position);
            this.transData.dateB = res.data.offeree.applyDate;
            this.transData.matchB =
              res.data.offeree.contestSchedule.teamA +
              "vs" +
              res.data.offeree.contestSchedule.teamB;

            this.dialogTitle = "换班申请";
            this.dialogType = "trans";
            this.transWorkBox = true;
          }
        });
    },
    //换班审核
    exchangeScheduleAuth(status) {
      api_account
        .exchangeScheduleAuth({
          userWorkScheduleId: this.transData.userWorkScheduleId, //人员排班id
          status: status, //审核结果：3同意 4拒绝
        })
        .then((res) => {
          console.log("返回结果:" + res);
          this.transWorkBox = false;
          if (res.success) {
            this.$message({
              message: '换班审核成功',
              type: 'success'
            });
            this.getApplyScheduleAuth();
          }
        });
    },
    //申请调班详情
    adjustScheduleDetail(v) {
      if (!this.isEdit) {
        return;
      }
      api_account
        .adjustScheduleDetail({
          userWorkScheduleId: v, //人员排班id
        })
        .then((res) => {
          console.log("返回结果:" + res);
          if (res.success) {
            this.transData.nameA = res.data.apply.user.name;
            this.transData.workA = this.getNameById(res.data.apply.position);
            this.transData.userWorkScheduleId =
              res.data.apply.userWorkScheduleId;
            this.transData.dateA = res.data.apply.applyDate;
            this.transData.matchA =
              res.data.apply.contestSchedule.teamA +
              "vs" +
              res.data.apply.contestSchedule.teamB;
            this.transData.nameB = res.data.offeree.name;

            this.dialogTitle = "调班申请";
            this.dialogType = "change";
            this.changeWorkBox = true;
          }
        });
    },
    //调班审核
    adjustScheduleAuth(status) {
      api_account
        .adjustScheduleAuth({
          userWorkScheduleId: this.transData.userWorkScheduleId, //人员排班id
          status: status, //审核结果：3同意 4拒绝
        })
        .then((res) => {
          console.log("返回结果:" + res);
          this.changeWorkBox = false;
          if (res.success) {
            this.$message({
              message: '调班审核成功',
              type: 'success'
            });
            this.getApplyScheduleAuth();
          }
        });
    },
    submitPbShow1(e){
      if(e==1){
        this.submitPbTip= "确定同意此排班申请？"
      }else{
        this.submitPbTip= "确定拒绝此排班申请？"
      }
      this.partWorkBox  = true;
      this.submitPbShow = true;
      this.submitPbState = e;
    },

    submitTbChange(e){
      if(e=="confirm"){
        this.applyScheduleAuth(this.submitPbState);
      }
    },

    //审核排班
    applyScheduleAuth(s) {
      // this.partWorkBox = false;
      api_account
        .applyScheduleAuth({
          userWorkScheduleId: this.applyData.id,
          status: s,
        })
        .then((res) => {
          console.log("返回结果:" + res);
          this.partWorkBox = false;
          if(res.success){
            this.$message({
              message: '排班审核成功',
              type: 'success'
            });
            this.getApplyScheduleAuth();
          }
          
        });
    },
    //获取赛程下裁判身份
    canJudgePosition(v, id) {
      api_account
        .canJudgePosition({
          contestScheduleId: v||0,
          refereeId: id,
        })
        .then((res) => {
          console.log("返回结果:" + res);
          if (res.success) {
            this.refereeTypeList = [];
            res.data.position.forEach((item) => {
              this.refereeTypeList.push({
                id: item,
                name: this.getNameById(item),
              });
            });
          }
        });
    },
    getNameById(data) {
      return this.$dictionary.position.find(d => d.value == data)?.label || ""
    },
    // 修改赛程教练
    scheduleAddReferee() {
      api_account
        .scheduleAddReferee({
          contestScheduleId: this.scheduleWorkDataMatch,
          positionId: this.selectRefereeId,
          userIds: this.refereeIdArr,
        })
        .then((res) => {
          console.log("返回结果:" + res);
          if (res.success) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.getApplyScheduleAuth();
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.overflow-hidden {
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  span {
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
}
.box {
  width: fit-content;
  min-width: 100%;
}
.boxWrap {
  display: flex;
  flex-direction: column;
  height: 0;
  flex: auto;
}
.flex-ac {
  display: flex;
  align-items: center;
}
.flex-jsb {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fixed {
  position: sticky;
  top: 0;
  z-index: 2;
}
.detail {
  padding: 9px 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
.chunk-button {
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1d81ee !important;
  color: #ffffff;
}
.switch {
  display: flex;
  align-items: center;
  height: 40px;
  width: auto;
  border: 1px solid rgba(0, 0, 0, .15);
  border-radius: 4px;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    width: auto;
    height: 100%;
    min-width: 64px;
    color: #333333;
    font-size: 14px;
    cursor: pointer;
    &.active {
      color: #ffffff;
      background: #1D81EE;
    }
  }
}
.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
.detail-title {
  height: 77px;
  background: #f6f7fb;
  display: flex;
  
  font-family: MicrosoftYaHei;
  color: #333333;
  border-top: 1px solid #dde1e6;
  border-bottom: 1px solid #dde1e6;
  /* width:100vw; */
  /* position: fixed; */
  /* border-bottom: 1px solid #DDE1E6; */
}
.detail-title div {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  flex-shrink: 0;
  width: 250px;
  border-right: 1px solid #dde1e6;
}
.detail-title div:last-child {
  border: none;
}
.detail-titletext {
  color: #333333;
  font-family: Helvetica-Bold, Helvetica;
  font-weight: bold;
  font-size: 14px;
}
.detail-match {
  display: flex;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  border-bottom: 1px solid #dde1e6;
  background-color: #fff;
}
.detail-match > div {
  flex-grow: 1;
  flex-shrink: 0;
  width: 250px;
  min-height: 85px;
  background-image: url(/competition_operation/img/line.0b4fec82.png);
  padding: 20px 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  border-right: 1px solid #dde1e6;
}
.detail-match > div:last-child {
  border: none;
}

.detail-matchtitle {
  position: sticky;
  left: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-matchtext {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  font-family: Helvetica-Bold, Helvetica;
  font-weight: bold;
  padding: 3px;
}
.detail-judge {
  border-bottom: 1px solid #dde1e6;
  display: flex;
  min-height: 90px;
}
.detail-judge > div {
  flex-grow: 1;
  flex-shrink: 0;
  width: 250px;
  border-right: 1px solid #dde1e6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-judge > div:last-child {
  border: none;
}
.detail-judgecontext > div {
  min-height: 28px;
}
.detail-judgename {
  position: sticky;
  left: 0;
  background: #ffffff;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  z-index: 1;
}
.detail-judgetext {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-family: Helvetica;
  padding-left: 3px;
  margin-top: 3px;
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
.detail-judge2 {
  background: rgba(253, 229, 208, 0.28);
  color: #ff7e00;
}
.detail-judge3 {
  background: rgba(251, 236, 255, 0.8);
  color: #c23de8;
}
.detail-judge4 {
  background: rgba(255, 0, 92, 0.1);
  color: #ff005c;
}
.detail-judgeimg {
  flex: none;
  width: 14px;
  height: 12px;
}
.judgeimg0 {
  background: url("~@/assets/privateSchedule/blue.png");
}
.judgeimg1 {
  background: url("~@/assets/privateSchedule/green.png");
}
.judgeimg2 {
  background: url("~@/assets/privateSchedule/orange.png");
}
.judgeimg3 {
  background: url("~@/assets/privateSchedule/purple.png");
}
.judgeimg4 {
  background: url("~@/assets/privateSchedule/red.png");
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
.dialogBox-contentList .contentListLeft {
  width: 50px;
}

.dialogBox-contentList .contentListRight {
  width: calc(100% - 60px);
}
.dialogFooter {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.dateText {
  position: sticky;
  left: 0;
  background: #f6f7fb;
  font-size: 16px;
}

.topDate{
  font-size: 24px;
font-family: Helvetica-Bold, Helvetica;
font-weight: bold;
color: #333333;
line-height: 40px;
margin:0 30px;
}
</style>

