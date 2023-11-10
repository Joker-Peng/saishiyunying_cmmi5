
import { getMySchedule, addSchedule, editSchedule, applyExchangeScheduleSubmit, applyExchangeScheduleList } from "@/api/account";
import * as api_account from "@/api/account";
import { Notify } from "vant";
export default {
  data() {
    return {
      transData: {
        name: "王雯雯",
        date: "2022-04-12",
        team: "BLG vs JT",
        location: "主裁判",
        select: "",
        userWorkScheduleId: 0
      }, //调班数据
      transList: [],//可换班人员
      loading: false,
      selectDay: new Date(),
      selectedWeek: [], // 当前天的一周
      changeWorkId: '',
      changeTable: [],
      scheduleList:[],
      selectedWeekList: [],
      cityList:[],
    }
  },
  computed: {
    // 当前日期
    dayText() {
      return this.$moment(this.selectDay).format("MM月DD日");
    },
    weekText() {
      const weekList = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      const weekIndex = this.$moment(this.selectDay).weekday();
      return weekList[weekIndex];
    },
    selectedCourse() {
      return (
        this.scheduleList.find(
          (d) =>
            this.$moment(d.date?.replace(/-/g,"/")).format("YYYY-MM-DD") ==
            this.$moment(this.selectDay).format("YYYY-MM-DD")
        )?.list || new Array()
      );
    },
    isOldDay() {
      const now = this.$moment().add(-1, "days").toDate();
      const select = new Date(this.selectDay);
      return select < now
    },
    // 当前周最大可排班天数
    hasAdd() {
      return this.selectedWeekList.filter(d => d.hasSchedule).length
    }
  },
  created() {
    this.loadData();
  },
  watch: {
    // 修改日期若月份发生变化 拉取该月数据
    selectDay(nowVal, oldVal) {
      // 设置当前周数据
      this.setSelectedWeek(nowVal); 
      if(nowVal instanceof Date) {
        nowVal = this.$moment(nowVal).format("YYYY/MM/DD")
      }
      const newMonth = this.$moment(nowVal?.replace(/-/g,"/")).format("YYYY-MM");
      const oldMonth = this.$moment(oldVal).format("YYYY-MM");
      if (newMonth != oldMonth) {
        this.loadData(nowVal)
      }
    },
  },
  methods: {
    loadData(date) {
      const month = this.$moment(date?.replace(/-/g,"/") || this.selectDay).format("YYYY-MM");
      return new Promise((resolve, reject) => {
        this.loading = true
        //根据年月请求排班
        getMySchedule({
          month: month,
        }).then(res => {
          const scheduleList = res?.data?.monthList || [];
          const workList = ["暂未分配", "主裁判", "场上裁判", "场下裁判"];
          const sideList = ["", "(A边)", "(B边)"]
          this.scheduleList = scheduleList.filter(d => d.list?.length).map(d => ({
            date: d.date,
            list: d.list.map(listItem => {
              let status = 4;
              if (listItem.status == 1) {
                status = 0;
              } else if (listItem.status == 3 && listItem.changeType == 0) {
                status = 1;
              } else if (listItem.status == 3 && listItem.changeType == 2 && listItem.changeStatus == 1) {
                status = 4
              } else if (listItem.status == 3 && listItem.changeType == 2) {
                status = 2
              } else if (listItem.status == 3 && listItem.changeType == 1 && listItem.changeStatus == 1) {
                status = 4
              } else if (listItem.status == 3 && listItem.changeType == 1) {
                status = 3
              } else if (listItem.status == 0) {
                status = 5
              }
              return Object.assign(listItem, {
                id: listItem.userWorkScheduleId,
                status: status,
                apiStatus: listItem.status,
                applyWorkRemark: listItem.applyWorkRemark,
                TXT: listItem.applyWorkRemark,
                TEAM1: listItem.teamA || "",
                TEAM2: listItem.teamB || "",
                TIME: listItem.gameTime || "",
                WORK: workList[listItem.position || 0] + sideList[listItem.side || 0],
                TIP: ["等待被申请人同意", "被申请人同意(等待管理员审核)", "被申请人拒绝", "管理员同意", "管理员拒绝"][listItem.changeStatus],
                session: listItem.apply && `申请和${listItem.apply.offereeUserName}进行${listItem.changeType == 1 ? "换班" : "调班"}（日期：${listItem.changeType == 1 ? listItem.apply.gameDate : listItem.gameDate} ${listItem.changeType == 1 ? listItem.apply.gameTime : listItem.gameTime}，赛程：${listItem.changeType == 1 ? listItem.apply.teamA : listItem.teamA} VS ${listItem.changeType == 1 ? listItem.apply.teamB : listItem.teamB} 位置：${listItem.changeType == 1 ? workList[listItem.apply.position] : workList[listItem.position]}）`
              })
            })
          }));
          setTimeout(() => {
            this.loading = false;
          }, 1000)
          resolve(scheduleList);
        }, err => {
          this.loading = false;
          reject();
        })
      })
    },

    // 当前周
    setSelectedWeek(day) {
      const nowDay = this.$moment(day || this.selectDay);
      const weekList = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      nowDay.startOf("isoWeek");
      const res = [];
      for(let i = 0; i < 7; i++) {
        res.push({
          week: weekList[nowDay.weekday()],
          date: nowDay.format("YYYY-MM-DD"),
          value: this.$moment(nowDay).toDate(),
          // 下列字段兼容pc
          label: nowDay.format("YYYY-MM-DD"),
          disabled: this.scheduleList.some((d) => d.date == nowDay.format("YYYY-MM-DD")),
          hasSchedule: this.scheduleList.some((d) => d.date == nowDay.format("YYYY-MM-DD")),
          check: false,
        })
        nowDay.add(1, "days");
      }
      this.selectedWeekList = res;
    },

    //取消调班
    mixinUserApplyAdjustScheduleCancel(params) {
      return new Promise((resolve, reject) => {
        api_account.userApplyAdjustScheduleCancel(params).then(res => {
          if (res.success) {
            // this.loadData().then(resolve, reject);
            this.$message.success("取消调班成功")
          }
          resolve()
        }, err => {
          console.error(err);
          reject()
        })
      })
    },

    //取消换班
    mixinUserApplyExchangeScheduleCancel(params){
      return new Promise((resolve, reject) => {
        api_account.userApplyExchangeScheduleCancel(params).then(res => {
          if (res.success) {
            // this.loadData().then(resolve, reject);
            this.$message.success("取消换班成功")
          }
          resolve()
        }, err => {
          console.error(err);
          reject()
        })
      })
    },

    //获取申请调班时可选择的人员
    mixinUserApplyAdjustScheduleList(params) {
      return new Promise((resolve, reject) => {
        api_account.userApplyAdjustScheduleList(params).then(res => {
          if (res.success) {
            this.transList = res.data.list;
          }
          resolve()
        }, err => {
          console.error(err);
          reject()
        })
      })
    },
  
    //申请调班接口
    applyAdjustScheduleSubmit() {
      api_account.userApplyAdjustScheduleSubmit({
        userWorkScheduleId: this.transData.userWorkScheduleId,
        offereeId: this.transData.select
      }).then(res => {
        this.$message.success("申请调班成功")
        this.transData = {};
        this.transList = [];
        this.loadData().then(resolve, reject);
      })
    },

    //获取申请调班时可选择的人员
    mixinUserApplyAdjustScheduleList(params) {
      return new Promise((resolve, reject) => {
        api_account.userApplyAdjustScheduleList(params).then(res => {
          console.log(res);
          if (res.success) {
            this.transList = res.data.list;
          }
          resolve(this.transList)
        }, err => {
          console.error(err);
          reject()
        })
      })
    },
    mixinAddSchedule(params) {
      return new Promise((resolve, reject) => {
        if(params.dateStr) {
          console.log("add", params)
          addSchedule(params).then(res => {
            if(res.success) {
              this.$message.success("提交可排班时间成功")
              this.loadData().then(resolve, reject);
            }
          }, err => {
            console.error(err)
            reject();
          })
        } else {
          const message = "请检查表单是否填写完整？"
          this.$message({
            message: message,
            type: 'warning'
          });
          reject()
        }
      })
    },
    mixinEditSchedule(params) {
      return new Promise((resolve, reject) => {
        if(params.userWorkScheduleId) {
          console.log("edit", params)
          editSchedule(params).then(res => {
            this.loadData().then(resolve, reject);
          }, err => {
            console.error(err);
            reject()
          })
        } else {
          const message = "请检查表单是否填写完整？"
          // if(this.isMobile()) {
          //   Notify(message);
          // } else {
            this.$message({
              message: message,
              type: 'warning'
            });
          // }
          reject()
        }
      })
    },
    applyExchangeScheduleSubmit(params) {
      return new Promise((resolve, reject) => {
        applyExchangeScheduleSubmit(params).then(res => {
          this.$message.success("申请换班成功")
          this.loadData().then(resolve, reject);
        }, err => {
          console.error(err);
          reject()
        })
      })
    },
    applyExchangeScheduleList(params) {
      return new Promise((resolve, reject) => {
        applyExchangeScheduleList(params).then(res => {
          this.changeTable = [];
          if (res.success) {
            if (res.data.list.count > 0) {
              res.data.list.rows.forEach(element => {
                this.changeTable.push({
                  userWorkScheduleId: element.userWorkScheduleId,
                  date: element.gameTime,
                  team1: element.teamA,
                  team2: element.teamB,
                  city:element.city,
                  week: this.getWeekByNum(element.dayOfWeek),
                  name: element.name,
                  location: this.getNameById(element.position),
                });
              });
            }
          }
        }, err => {
          console.error(err);
          reject()
        })
      })
    },
    mixinCityList(){
      api_account.cityList().then(res => {
        
        if (res.success) {
          res.data.list.forEach(item=>{
            this.cityList.push({
              id:item.id,
              city:item.city,
            });
          });
            
        }
      })
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
    getNameById(data) {
      if (data == 1) {
        return "主裁判";
      } else if (data == 2) {
        return "场上裁判";
      } else if (data == 3) {
        return "场下裁判";
      }
    },
  }
}