<template>
  <div>
    <Calendar
      ref="calendar"
      :scheduleList="scheduleList"
      @changeMonth="loadData"
      @currentDate="currentDate"
    ></Calendar>
    <div class="content-center">
      <div>{{ dayText }}</div>
      <div style="opacity: 0.5; margin-left: 5px">{{ weekText }}</div>
    </div>
    <div class="content-bottom">
      <div
        class="content-item"
        v-for="(item, index) in selectedCourse"
        :key="index"
      >
        <div class="list-container">
          <!-- 图标 -->
          <section
            class="list-img"
            :class="{
              blue: item.status == 0,
              green: item.status == 1,
              yellow: item.status == 3,
              purple: item.status == 2,
              red: item.status == 4 || item.status == 5,
            }"
          ></section>
          <!-- 内容 -->
          <section class="list-main">
            <p v-if="item.status == 0">{{ item.TXT }}</p>
            <template v-else-if="item.status == 5">
              <p>{{ item.TXT }}<span style="color:#FF005C">(待审核)</span></p>
            </template>
            <template v-else>
              <p>{{ `${item.TEAM1} vs ${item.TEAM2} ${item.contestTypeName} ${item.contestName} ${item.city} ${item.WORK}` }}</p>
              <p>时间：{{ item.TIME }}</p>
            </template>
          </section>
          <!-- 按钮 -->
          <section class="list-button" v-if="!isOldDay">
            <template v-if="item.status == 0">
              <span class="button blue" @click="handleOpenDialog('edit', item)"
                >编辑</span
              >
              <span class="button red" @click="handleEditDel(item)">删除</span>
            </template>
            <span
              v-if="item.status > 1 && item.status < 4"
              class="button"
              @click="cancelChangeAction(item)"
              >取消</span
            >
            <span
              v-if="item.status == 1"
              class="button yellow"
              @click="handleOpenDialog('exchange', item)"
              >换班</span
            >
            <span
              v-if="item.status == 1"
              class="button purple"
              @click="handleOpenDialog('change', item)"
              >调班</span
            >
          </section>
        </div>
        <p v-if="item.session">
          {{ item.session }}
          <span
            :class="{
              yellow: item.status == 3,
              purple: item.status == 2,
              red: item.status == 4,
            }"
            >{{ item.TIP }}</span
          >
        </p>
      </div>
    </div>
    <!-- 提交排班时间 -->
    <Dialog
      :visible.sync="dialogShow.add"
      title="提交可排班时间"
      @confirm="handleAddConfirm"
    >
    <div class="warning">
        <div class="tableDownload"></div>
        <div class="warningTitle">请确保您选择的可排班日期全天有空</div>
      </div>
      <div class="add">
        <!-- <p>选择排班时间：</p> -->
        <div class="add-week">
          <section :class="{'add-day': true, 'disabled': day.disabled, selected: addData.date.includes(day.date)}" v-for="day in selectedWeekList" :key="day.date" @click="handleAddSelectDate(day)">
            <span>{{day.date}}</span>
            <span>{{day.week}}</span>
            <img v-if="addData.date.includes(day.date) && !day.disabled" src="@/assets/privateScheduleMb/selected.png" alt="">
          </section>
        </div>
        <div style="margin: 17px 0 0 0;">备注:</div>
        <el-form label-position="left" label-width="92px">
          <template  v-for="day in selectedWeekList">
            <el-form-item :key="day.date" v-if="day.check" :label="day.date">
              <el-input
                type="textarea"
                v-model="day.remark"
                rows="1"
                maxlength="30"
                placeholder="请输入备注信息"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </Dialog>

    <Dialog
      :visible.sync="dialogShow.edit"
      title="编辑排班"
      @confirm="handleEditConfirm"
    >
      <div class="edit">
        <van-cell
          title="日期"
          :value="$moment(editData.date).format('YYYY-MM-DD')"
        />
        <el-form label-position="left" label-width="42px">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="editData.remark"
              rows="3"
              maxlength="30"
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
    <Dialog
      :visible.sync="dialogShow.change"
      title="调班申请"
      @confirm="handleChangeConfirm"
      @update:visible="cancelChangeConfirm"
    >
      <div>
        <van-cell title="申请人" :value="changeData.name" />
        <van-cell
          title="日期"
          :value="$moment(changeData.date).format('YYYY-MM-DD')"
        />
        <van-cell title="赛程" :value="changeData.playName" />
        <van-cell title="位置" :value="changeData.address" />
        <van-cell
          title="被调班人"
          :value="changeData.other || '请选择被调班人'"
          is-link
          @click="handleChangeOpenSelect"
        />
      </div>
      <van-popup v-model="changeData.showUserSelect" round position="bottom">
        <van-picker
          title="被调班人"
          show-toolbar
          :columns="userColumn"
          @confirm="handleChangeUserConfirm"
          @cancel="handleChangeUserCancel"
        />
      </van-popup>
    </Dialog>

    <Dialog
      class="exchange"
      :visible.sync="dialogShow.exchange"
      title="换班申请"
    >
      <div>
        <van-dropdown-menu :overlay="false">
          <van-dropdown-item
            ref="exchangeDate"
            :title="exchangeData.filter.date"
            @open="exchangeData.showDateSelect = true"
          >
          </van-dropdown-item>
          <van-dropdown-item
            v-model="exchangeData.filter.address"
            :options="jobList"
          />
        </van-dropdown-menu>

         <div style="display: flex;align-items:center;">
          <div style="width:100%">
            <van-search
            
            v-model="exchangeData.filter.search"
            placeholder="请输入姓名"
            @search="changeSearch"
          
          />
          </div>

          <!-- <div>
            <el-select placeholder="请选择城市" multiple v-model="changeCity" size="small" style="width: 160px; margin-left: 10px"
            clearable>
          <el-option v-for="item in cityList" :key="item.city" :label="item.city" :value="item.city">
          </el-option>
        </el-select>
          </div> -->
          
        </div>
        
        <section style="max-height: 50vh; overflow: auto">
          <div v-for="(i,index) in changeTable" :key="index" @click="handleExchangeConfirm(i)" class="exchange-list">
            <p class="exchange-list-name" style="display: flex;align-items:center;">
              <span style="width:50%;">{{i.team1}} vs {{i.team2}}</span>
              <span>{{i.city}}</span>
            </p>
            <p class="exchange-list-msg">比赛日期：{{i.week}}</p>
            <p class="exchange-list-footer">
              <span>姓名：{{ i.name }}</span>
              <span>位置：{{ i.location }}</span>
            </p>
            <img src="@/assets/privateScheduleMb/left.png" alt="" />
          </div>
        </section>
      </div>
      <van-calendar
        v-model="exchangeData.showDateSelect"
        type="range"
        @confirm="handleExchangeDateConfirm"
      />
    </Dialog>
  </div>
</template>

<script>
import Calendar from "@/components/calendarMb/calendar.vue";
import Dialog from "./components/dialog.vue";
import mixin from "../../mixin";
import * as api_account from "@/api/account";
export default {
  mixins: [mixin],
  data() {
    return {
      activeCourse: {},
      dialogShow: {
        add: false,
        edit: false,
        change: false,
        exchange: false,
      },
      addData: {
        date: [],
        remark: "",
      },
      editData: {
        date: "",
        remark: "",
      },
      changeData: {
        name: "",
        date: "",
        playName: "",
        address: "",
        other: "",
        showUserSelect: false,
      },
      exchangeData: {
        filter: {
          date: this.$moment().format("YYYY.MM.DD")+"~"+this.$moment().add(7,"days").format("YYYY.MM.DD"),
          search: "",
          address: "1",
        },
        showDateSelect: false,
      },
      userColumn: [],
      jobList: [
        { text: "主裁判", value: "1" },
        { text: "场上裁判", value: "2" },
        { text: "场下裁判", value: "3" },
      ],
      applyWorkRemark:"",
      changeCity:"",
      cityDate:"",
    };
  },
  components: {
    Calendar,
    Dialog,
  },
  watch: {
    selectDay(nowVal) {
      this.$nextTick(() => {
        const hereMonth = this.$moment(this.$refs.calendar.myDate).format(
          "YYYY-MM"
        );
        const selectMonth = this.$moment(nowVal).format("YYYY-MM");
        const passData = !this.selectedCourse?.length;
        const passWeek = this.selectedWeekList.some(d => !d.disabled);
        const passDate = hereMonth == selectMonth;
        
        if(passData && passWeek && passDate ) {
          this.dialogShow.add = true;
        }
      })
    },
    "dialogShow.add"(nowVal) {
      if (nowVal == true) {
        this.addData.date = [this.$moment(this.selectDay).format("YYYY-MM-DD")];
        this.selectedWeekList.forEach(item=>{
          
          if(this.addData.date.includes(item.date)){
            item.check = true;
          }
        });
      } else {
        for (let key in this.addData) {
          this.addData[key] = "";
        }
        this.addData.date = [];
      }
    },
    "dialogShow.edit"(nowVal) {
      if (nowVal) {
        this.editData.date = this.selectDay;
        this.editData.remark = this.activeCourse.TXT;
        this.editData.id = this.activeCourse.id;
      } else {
        for (let key in this.editData) {
          this.editData[key] = "";
        }
      }
    },
    "dialogShow.change"(nowVal) {
      if (nowVal) {
        this.changeData.name = "我";
        this.changeData.date = this.selectDay;
        this.changeData.playName = `${this.activeCourse.TEAM1} vs ${this.activeCourse.TEAM2}`;
        this.changeData.address = this.activeCourse.WORK;
        this.changeData.userWorkScheduleId =
          this.activeCourse.userWorkScheduleId;

        this.mixinUserApplyAdjustScheduleList({
          userWorkScheduleId: this.changeData.userWorkScheduleId,
        }).then((res) => {
          this.userColumn = [];
          res.forEach((element) => {
            this.userColumn.push(element.name);
          });
        });
      } else {
        for (let key in this.editData) {
          // this.addData[key] = "";
        }
      }
    },
    "dialogShow.exchange"(nowVal) {
      this.changeCity = "";
      this.changeSearch();
    },
    "exchangeData.showDateSelect"(nowVal) {
      if (!nowVal) {
        this.$refs.exchangeDate.toggle();
      }
    },
    "exchangeData.filter": {
      handler() {
        this.changeSearch();
      },
      deep: true
    }
    
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    getCityList(){
      this.mixinCityList();
    },
    //取消调班换班操作
    cancelChangeAction(item) {
      if (item.changeType == 1) {
        //取消换班
        // this.userApplyAdjustScheduleCancel(item);
        this.cancelAdjustDialog = true;
        this.$dialog
          .confirm({
            title: "提示",
            message: "是否取消换班?",
          })
          .then(() => {
            // on confirm
            this.userApplyExchangeScheduleCancel(item);
          })
          .catch(() => {
            // on cancel
          });
      } else {
        //取消调班
        this.cancelAdjustDialog = true;
        this.$dialog
          .confirm({
            title: "提示",
            message: "是否取消调班?",
          })
          .then(() => {
            // on confirm
            this.userApplyAdjustScheduleCancel(item);
          })
          .catch(() => {
            // on cancel
          });
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

    currentDate(e) {
      this.selectDay = e.replace(/-/g,"/");
    },
    handleOpenDialog(name, item) {
      this.dialogShow[name] = true;
      this.activeCourse = item;
    },
    handleCloseDialog(name) {
      this.dialogShow[name] = false;
      this.activeCourse = {};
    },
    handleAddSelectDate(date) {
      if(!date.disabled) {
        const dateStr = date.date;
        const index = this.addData.date.findIndex(d => d == dateStr);
        if(index == -1) {
          date.check = true;
          this.addData.date.push(date.date);
        } else {
          this.addData.date.splice(index, 1);
          date.check = false;
        }
      }
    },
    handleAddConfirm() {
      // selectedWeekList
      this.applyWorkRemark=null;
      this.selectedWeekList.forEach(item => {
          if (item.check) {
            
            if (item.remark == null||!item.remark) {
              item.remark = "";
            }
            console.log("remark:"+item.remark+"   "+item.date);
            if (this.applyWorkRemark == null) {
              this.applyWorkRemark = item.remark;
            } else {
              this.applyWorkRemark += "," + item.remark;
            }
          }
        });
        console.log(this.applyWorkRemark+"");
        this.addData.remark = this.applyWorkRemark;
      if(!this.addData.date.length ) {
        this.$message.warning("请选择数据");
        return
      }
      const length = this.hasAdd + this.addData.date.length;
      if(this.$store.getters.partTimeCoach && length < 2) {
        this.$dialog.confirm({
          title: '提示',
          message: '您提交的可排班时间少于2天，将提交管理员审核',
        }).then(() => {
          const params = {
            dateStr: this.addData.date.join(","),
            applyWorkRemark: this.addData.remark,
          };
          this.mixinAddSchedule(params).then(() => {
            this.dialogShow.add = false;
          });
        });
      } else {
        const params = {
          dateStr: this.addData.date.join(","),
          applyWorkRemark: this.addData.remark,
        };
        this.mixinAddSchedule(params).then(() => {
          this.dialogShow.add = false;
        });
      }
    },
    handleEditConfirm(params) {
      if (!params) {
        params = {
          userWorkScheduleId: this.editData.id,
          type: 0,
          applyWorkRemark: this.editData.remark,
        };
      }
      this.mixinEditSchedule(params).then(() => {
        this.dialogShow.edit = false;
      });
    },
    handleEditDel(schedule) {
      const params = {
        userWorkScheduleId: schedule.id,
        type: 1,
        applyWorkRemark: schedule.TXT,
      };
      this.$dialog
        .confirm({
          title: "提示",
          message: `确认删除${schedule.TXT}吗？`,
        })
        .then(() => {
          // on confirm
          this.handleEditConfirm(params);
        })
        .catch(() => {
          // on cancel
        });
    },
    handleChangeConfirm() {
      if(this.changeData.other==""){
        this.$message.warning("请选择被调班人员");
        return;
      }
      this.$dialog.confirm({
        title: '提示',
        message: '确认提交调班申请吗',
      }).then(() => {
         this.applyAdjustScheduleSubmit();
          console.log("change confirm", JSON.stringify(this.changeData));
          this.dialogShow.change = false;
      }, () => {
        // console.log("取消二次确认")
      });
      
    },
    cancelChangeConfirm() {
      (this.changeData = {
        name: "",
        date: "",
        playName: "",
        address: "",
        other: "",
        showUserSelect: false,
      }),
        (this.userColumn = []);
    },
    handleExchangeConfirm(data) {
      console.log("exchange confirm", JSON.stringify(this.exchangeData));
      this.$dialog.confirm({
        title: '提示',
        message: '确认提交换班申请吗',
      }).then(() => {
        this.changeSubmit();
      }, () => {
        // console.log("取消二次确认")
      });
    },
    changeSubmit() {
      console.log("请求数据:");
      this.applyExchangeScheduleSubmit({
        userWorkScheduleId: this.activeCourse.id,
        userWorkScheduleIdReplaced: this.activeCourse.userWorkScheduleId,
      }).then((res) => {
        console.log("返回结果:" + res);
        this.dialogShow.exchange = false;
      });
    },
    handleChangeUserConfirm(user, index) {
      this.changeData.other = user;
      let changeUseInfo = this.transList[index];
      this.changeData.userId = changeUseInfo.userId;
      this.handleChangeUserCancel();
    },
    handleChangeUserCancel() {
      this.changeData.showUserSelect = false;
    },
    handleChangeOpenSelect() {
      this.changeData.showUserSelect = true;
    },
    handleExchangeDateConfirm(dateArr) {
      this.exchangeData.filter.date = dateArr
        .map((d) => this.$moment(d).format("YYYY.MM.DD"))
        .join("~");
      this.exchangeData.showDateSelect = false;
    },
    changeSearch() {
      console.log("返回结果:" + this.exchangeData.filter.date);
      console.log(
        "返回结果:" +
          this.exchangeData.filter.date.split("~")[1].replaceAll(".", "-")
      );
      this.applyChangeList();
    },
    //根据筛选条件获取换班信息列表
    applyChangeList() {
      this.changeTable = [];
      // if(this.changeCity==[]||this.changeCity.length<1){
      //   this.cityDate = "";
      // }else{
      //   this.cityDate = this.changeCity.join(",");
      // }
      this.applyExchangeScheduleList({
        userWorkScheduleId: this.activeCourse.id, //人员排班id
        startDate: this.exchangeData.filter.date
          .split("~")[0]
          .replaceAll(".", "-"), //筛选开始日期
        finishDate: this.exchangeData.filter.date
          .split("~")[1]
          .replaceAll(".", "-"),
        name: this.exchangeData.filter.search,
        position: this.exchangeData.filter.address,
        // city:this.cityDate,
        page: 1,
        pageNum: 10,
      }).then((res) => {
        console.log("返回结果:" + res);
      });
    },

    //申请调班接口
    applyAdjustScheduleSubmit() {
      api_account
        .userApplyAdjustScheduleSubmit({
          userWorkScheduleId: this.changeData.userWorkScheduleId,
          offereeId: this.changeData.userId,
        })
        .then((res) => {
          if (res.success) {
            this.loadData();
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
@import "@/styles/base/global.less";
.content-center {
  .px2rem(padding,20);
  background: #f5f8fb;
  font-size: 14px;
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  font-weight: bold;
  color: #333333;
  display: flex;
  align-items: center;
}
.content-bottom {
  .px2rem(padding,20);
  background: #ffffff;
}
</style>
<style lang="scss" scoped>
.yellow {
  color: #ff7e00 !important;
}
.purple {
  color: #c23de8 !important;
}
.red {
  color: #ff005c !important;
}
.blue {
  color: #00afff !important;
}
.content-bottom {
  padding: 0 20px;
  .content-item {
    padding: 20px 0;
    border-bottom: 1px solid #f0f3f7;
  }
}
.list-container {
  display: flex;
  + p {
    margin-top: 10px;
    padding-right: 38px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    color: #111111;
    line-height: 20px;
  }
  .list-img {
    margin-right: 14px;
    height: 42px;
    width: 42px;
    &.blue {
      background-image: url("~@/assets/privateScheduleMb/blue.png");
    }
    &.green {
      background-image: url("~@/assets/privateScheduleMb/green.png");
    }
    &.purple {
      background-image: url("~@/assets/privateScheduleMb/purple.png");
    }
    &.yellow {
      background-image: url("~@/assets/privateScheduleMb/orange.png");
    }
    &.red {
      background-image: url("~@/assets/privateScheduleMb/red.png");
    }
  }
  .list-main {
    width: 0;
    flex: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      margin: 3px 0;
      height: 14px;
      font-size: 12px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      &:first-of-type {
        height: auto;
        font-size: 14px;
        font-family: Helvetica-Bold, Helvetica;
        font-weight: bold;
        color: #333333;
        line-height: 17px;
      }
    }
  }
  .list-button {
    display: flex;
    flex-direction: column;
    flex: none;
    width: 38px;
    font-size: 14px;
    color: #666666;
    .button {
      text-align: right;
    }
  }
}
.add {
  p {
    margin-bottom: 12px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
  }
  &-week {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: -10px;
  }
  &-day {
    position: relative;
    margin-bottom: 10px;
    padding: 5px 0;
    width: 97px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #cccccc;
    box-sizing: border-box;
    &.selected {
      border: 2px solid #1d81ee;
    }
    &.disabled {
      border: 1px solid #d9d9d9;
      color: #d9d9d9;
      span {
        color: #d9d9d9;
        &:first-of-type {
          color: #d9d9d9;
        }
      }
    }
    span {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999999;
      &:first-of-type {
        font-size: 14px;
        font-family: HelveticaNeue-Bold, HelveticaNeue;
        font-weight: bold;
        color: #333333;
      }
    }
    img {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 12px;
      width: 12px;
    }
  }
}
.exchange-list {
  position: relative;
  padding: 16px 0;
  border-bottom: 1px solid #eeeeee;
  color: #333333;
  font-size: 14px;
  &-name {
    margin-bottom: 13px;
    font-size: 16px;
    font-family: Helvetica-Bold, Helvetica;
    font-weight: bold;
  }
  &-msg {
    margin: 10px 0;
  }
  &-footer {
    display: flex;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    color: #999999;
    span {
      flex: 1;
    }
  }
  img {
    position: absolute;
    right: 0;
    top: 20px;
    width: 15px;
    height: 11px;
  }
}
.exchange ::v-deep .footer {
  display: none;
}
::v-deep .el-form {
  display: flex;
  flex-direction: column;
}
::v-deep .el-form-item {
  margin: 8px 0;
  .el-textarea__inner {
    background-color: #f5f8fb;
  }
}
::v-deep .van-cell {
  padding-left: 0;
  padding-right: 0;
  &::after {
    right: 0;
    left: 0;
  }
}
::v-deep .van-dropdown-item {
  left: 32px;
  right: 32px;
}
::v-deep .van-dropdown-menu__title {
  font-size: 12px;
}


.warning {

  padding: 6px 13px;
  margin-bottom: 10px;
  display: flex;
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
  padding-left:3px;
}
</style>
