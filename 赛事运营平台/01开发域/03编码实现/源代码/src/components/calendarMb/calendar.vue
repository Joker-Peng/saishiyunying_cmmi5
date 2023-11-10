<style scoped >
@media screen and (min-width: 460px) {
  .wh_item_date:hover {
    background: #1D81EE;
    cursor: pointer;
  }
}
* {
  margin: 0;
  padding: 0;
}

.wh_container {
  max-width: 410px;
  margin: auto;
}

li {
  list-style-type: none;
}
.wh_top_changge {
  display: flex;
}

.wh_top_changge li {
  cursor: pointer;
  display: flex;
  color: #333;
  font-size: 18px;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-family: Helvetica-Bold, Helvetica;
  font-weight: bold;
  height: 47px;
}

.wh_top_changge .wh_content_li {
  cursor: auto;
  flex: 2.5;
}
.wh_content_all {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
    "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
  background-color: #ffffff;
  width: 100%;
  overflow: hidden;
  padding-bottom: 8px;
}

.wh_content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 3% 0 3%;
  width: 100%;
}

.wh_content:first-child .wh_content_item_tag,
.wh_content:first-child .wh_content_item {
  color: #ddd;
  font-size: 16px;
}

.wh_content_item,
wh_content_item_tag {
  font-size: 15px;
  width: 13.4%;
  text-align: center;
  position: relative;
  font-family: Helvetica-Bold, Helvetica;
  font-weight: bold;
  color: #333333
}
.wh_content_item {
  height: 40px;
}

.wh_top_tag {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
}
.wh_top_idot{
  width: 4px;
  height: 4px;
  border-radius: 50%;
}
.wh_item_date {
  width: 40px;
  height: 40px;
  margin: auto;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.wh_content-id{
  display: flex;
  align-items: center;
  justify-content: center;
}
.wh_content-idotwrap{
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.wh_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #333333;
  border-left: 2px solid #333333;
  transform: rotate(-45deg);
}

.wh_jiantou1:active,
.wh_jiantou2:active {
  border-color: #ddd;
}

.wh_jiantou2 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #333333;
  border-right: 2px solid #333333;
  transform: rotate(45deg);
}
.wh_content_item > .wh_isMark {
  margin: auto;
  border-radius: 100px;
  background: blue;
  z-index: 2;
}
.wh_content_item .wh_other_dayhide {
  opacity: 0.5;
}
.wh_content_item .wh_want_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_isToday {
  background: #EFF1F4;
  border-radius: 100px;
}
.wh_content_item .wh_chose_day {
  background: #1D81EE;
  border-radius: 100px;
}
</style>
<template>
  <section class="wh_container">
    <div class="wh_content_all">
      <div class="wh_top_changge">
        <li @click="PreMonth(myDate,false)">
          <div class="wh_jiantou1"></div>
        </li>
        <li class="wh_content_li">{{dateTop}}</li>
        <li @click="NextMonth(myDate,false)">
          <div class="wh_jiantou2"></div>
        </li>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="tag in textTop">
          <div class="wh_top_tag">{{tag}}</div>
        </div>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(item,index) in list" @click="clickDay(item,index)">
          <div
            class="wh_item_date"
            v-bind:class="[{ wh_isMark: item.isMark},{wh_other_dayhide:item.otherMonth!=='nowMonth'},{wh_want_dayhide:item.dayHide},{wh_isToday:item.isToday},{wh_chose_day:item.chooseDay},setClass(item)]"
          >
         <div class="wh_content-id">{{item.id}}</div>
         <div class="wh_content-idotwrap" v-if="item.list">
          <div v-for="item1 in item.list">
            <div style="background: #00AFFF;" class="wh_top_idot" v-if="item1.status==0"></div>
            <div style="background: #00B400;" class="wh_top_idot" v-else-if="item1.status==1"></div>
            <div style="background: #C33FE8;" class="wh_top_idot" v-else-if="item1.status==2"></div>
            <div style="background: #FF7E00;" class="wh_top_idot" v-else-if="item1.status==3"></div>
            <div style="background: #FF005C;" class="wh_top_idot" v-else-if="item1.status==4 || item1.status==5"></div>
           </div>
         </div>
         <div class="wh_top_idot" v-else></div>
         
        </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import timeUtil from "./calendar";
export default {
  name:"calendarMb",
  data() {
    return {
      myDate: [],
      list: [],
      historyChose: [],
      dateTop: "",
    }
  },
  props: {
    markDate: {
      type: Array,
      default: () => []
    },
    markDateMore: {
      type: Array,
      default: () => []
    },
    textTop: {
      type: Array,
      default: () => ["一", "二", "三", "四", "五", "六", "日"]
    },
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    agoDayHide: {
      type: String,
      default: `0`
    },
    futureDayHide: {
      type: String,
      default: `2554387200`
    },
    scheduleList: []
  },
  created() {
    this.intStart();
    this.myDate = new Date();
  },
  methods: {
    intStart() {
      timeUtil.sundayStart = this.sundayStart;
    },
    setClass(data) {
      let obj = {};
      obj[data.markClassName] = data.markClassName;
      return obj;
    },
    clickDay: function(item, index) {
      if (item.otherMonth === "nowMonth" && !item.dayHide) {
        // console.log(item,'0.0.0.')
        this.getList(this.myDate, item.date, true);
      }
      if (item.otherMonth !== "nowMonth") {
        item.otherMonth === "preMonth"
          ? this.PreMonth(item.date)
          : this.NextMonth(item.date);
      }
    },
    ChoseMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = new Date(date);
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    PreMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, "preMonth");
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    NextMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, "nextMonth");
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    getList(date = '', chooseDay, isChosedDay= false) {
      const markDate = this.$moment(this.markDate).format("YYYY-MM-DD");
      const markDateMore = this.markDateMore.map(d => {
        d.date = this.$moment(d.date).format("YYYY-MM-DD");
        return d; 
      })
      const monthDate = timeUtil.getMonthList(this.myDate);
      console.log('monthDate前====================================');
      console.log(monthDate);
      console.log('====================================');
      // console.log("1currentDate",chooseDay || this.historyChose[this.historyChose.length - 1] || date)
      isChosedDay && this.$emit('currentDate',chooseDay || this.historyChose[this.historyChose.length - 1] || date)
      this.dateTop = this.$moment(date).format("YYYY年MM月");
      
      monthDate.forEach(res => {
        const timeStamp = new Date(date).valueOf() / 1000;
        // 无法选中某天
        res.dayHide = timeStamp < this.agoDayHide || timeStamp > this.futureDayHide;
        const flag = !res.dayHide && res.otherMonth === "nowMonth"
        //标记选中某些天 设置class
        res.markClassName = markDateMore.find(d => d.date == res.date)?.className || "";
        res.isMark = markDate.indexOf(res.date) > -1;
        if (chooseDay === res.date && flag) {
          isChosedDay && this.$emit("choseDay", res.date);
          this.historyChose.push(res.date);
          res.chooseDay = true;
        } else if ( this.historyChose[this.historyChose.length - 1] === res.date && !chooseDay && flag ) {
          res.chooseDay = true;
        } else {
          res.chooseDay = false
        }
        // 从prop中获取list
        res.list = this.scheduleList.find(d => {
          return this.$moment(res.date.replace(/-/g,"/")).format("YYYY-MM-DD") == this.$moment(d.date).format("YYYY-MM-DD")
        })?.list || new Array()
     })
      this.list = monthDate;
    }
  },
  watch: {
    markDate: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    markDateMore: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    agoDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    futureDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    sundayStart: {
      handler(val, oldVal) {
        this.intStart();
        this.getList(this.myDate);
      },
      deep: true
    },
    scheduleList: {
      handler(){
        this.$nextTick(() => {
          this.getList(this.myDate);
        })
      },
      immediate: true
    }
  }
};
</script>