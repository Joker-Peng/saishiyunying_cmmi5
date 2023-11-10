<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px;">
      <div class="title" >
        <div>
          我的排班
        </div>
        <div class="title-center">
          <el-button
            icon="el-icon-caret-left"
            class="chunk-button"
            @click="selectDate('prev-month')"
          ></el-button>
          <div>
            <el-dropdown>
              <span class="el-dropdown-link">
                {{i18nYear}}{{t('el.datepicker.year')}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in yearsList" @click.native="selectYear(item.value)">{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown style="margin-left: 5px;">
              <span class="el-dropdown-link">
                {{i18nMonth}}月<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in monthList" @click.native="selectMonth(item.value)">{{item.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-button
            icon="el-icon-caret-right"
            class="chunk-button"
            @click="selectDate('next-month')"
          ></el-button>
        </div>
        <div></div>
      </div>
      
    </div>
    <div class="box">
      <div class="el-calendar">
        <div
          class="el-calendar__body"
          v-if="validatedRange.length === 0"
          key="no-range">
          <date-table
            :date="date"
            :selected-day="realSelectedDay"
            :first-day-of-week="realFirstDayOfWeek"
            @pick="pickDay" />
        </div>
        <div
          v-else
          class="el-calendar__body"
          key="has-range">
          <date-table
            v-for="(range, index) in validatedRange"
            :key="index"
            :date="range[0]"
            :selected-day="realSelectedDay"
            :range="range"
            :hide-header="index !== 0"
            :first-day-of-week="realFirstDayOfWeek"
            @pick="pickDay" />
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import Locale from 'element-ui/src/mixins/locale';
import fecha from 'element-ui/src/utils/date';
import ElButton from 'element-ui/packages/button';
import ElButtonGroup from 'element-ui/packages/button-group';
import DateTable from './date-table';
import { validateRangeInOneMonth } from 'element-ui/src/utils/date-util';

const validTypes = ['prev-month', 'today', 'next-month'];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const oneDay = 86400000;

export default {
  name: 'ElCalendar',

  mixins: [Locale],

  components: {
    DateTable,
    ElButton,
    ElButtonGroup
  },
  props: {
    // value: [Date, String, Number],
    scheduleList:{
      type: Array,
      default:[]
    },
    range: {
      type: Array,
      validator(range) {
        if (Array.isArray(range)) {
          return range.length === 2 && range.every(
            item => typeof item === 'string' ||
            typeof item === 'number' ||
            item instanceof Date);
        } else {
          return true;
        }
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 1
    }
  },

  provide() {
    return {
      elCalendar: this
    };
  },

  methods: {
    //选择月
    selectMonth(e){
      this.realSelectedDay = `${this.i18nYear}-${e}-1`
    },
    //选择年
    selectYear(e){
      this.realSelectedDay = `${e}-${this.i18nMonth}-1`
    },
    //设置年列表
    initSelectYear(year){
      this.yearsList = [];
      for(let i=0;i<30;i++){
      this.yearsList.push({value:(year - i),label:(year - i)+ "年"})
        };
    },
    pickDay(day) {
      this.realSelectedDay = day;
    },

    selectDate(type) {
      if (validTypes.indexOf(type) === -1) {
        throw new Error(`invalid type ${type}`);
      }
      let day = '';
      let month;
      if (type === 'prev-month') {
        day = `${this.prevMonthDatePrefix}-01`;
        month=parseInt(this.i18nMonth)-1
        if(month>0){
          this.realSelectedDay = `${this.i18nYear}-${month}-1`
        }
      } else if (type === 'next-month') {
        day = `${this.nextMonthDatePrefix}-01`;
           month=parseInt(this.i18nMonth)+1
           if(month<=12){
             this.realSelectedDay = `${this.i18nYear}-${month}-1`
           }
      } else {
        day = this.formatedToday;
      }
      // if (day === this.formatedDate) return;
      this.pickDay(day);
    },

    toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },

    rangeValidator(date, isStart) {
      const firstDayOfWeek = this.realFirstDayOfWeek;
      const expected = isStart ? firstDayOfWeek : (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);
      const message = `${isStart ? 'start' : 'end'} of range should be ${weekDays[expected]}.`;
      if (date.getDay() !== expected) {
        console.warn('[ElementCalendar]', message, 'Invalid range will be ignored.');
        return false;
      }
      return true;
    }
  },

  computed: {
    prevMonthDatePrefix() {
      const temp = new Date(this.date.getTime());
      console.log(temp)
      temp.setDate(0);
      return fecha.format(temp, 'yyyy-MM');
    },

    curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM');
    },

    nextMonthDatePrefix() {
      const temp = new Date(this.date.getFullYear(), this.date.getMonth()+1, 1);
      return fecha.format(temp, 'yyyy-MM');
    },

    formatedDate() {
      return fecha.format(this.date, 'yyyy-MM-dd');
    },

    i18nDate() {
      const year = this.date.getFullYear();
      const month = this.date.getMonth() + 1;
      return `${year} ${this.t('el.datepicker.year')} ${this.t('el.datepicker.month' + month)}`;
    },
    i18nYear(){
      const year = this.date.getFullYear();
      return `${year}`
    },
    i18nMonth:{
      get(){
        const month = this.date.getMonth() + 1;
         return `${month}`
      },
      set(val){
      },
    },
    formatedToday() {
      return fecha.format(this.now, 'yyyy-MM-dd');
    },

    realSelectedDay: {
      get() {
        if (!this.value) return this.selectedDay;
        return this.formatedDate;
      },
      set(val) {
        this.selectedDay = val;
        const date = new Date(val);
        this.$emit('input', date);
      }
    },

    date() {
      if (!this.value) {
        // console.log('没value')
        if (this.realSelectedDay) {
          const d = this.selectedDay.split('-');
          return new Date(d[0], d[1] - 1, d[2]);
        } else if (this.validatedRange.length) {
          return this.validatedRange[0][0];
        }
        return this.now;
      } else {
        return this.toDate(this.value);
      }
    },

    // if range is valid, we get a two-digit array
    validatedRange() {
      let range = this.range;
      if (!range) return [];
      range = range.reduce((prev, val, index) => {
        const date = this.toDate(val);
        if (this.rangeValidator(date, index === 0)) {
          prev = prev.concat(date);
        }
        return prev;
      }, []);
      if (range.length === 2) {
        const [start, end] = range;
        if (start > end) {
          console.warn('[ElementCalendar]end time should be greater than start time');
          return [];
        }
        // start time and end time in one month
        if (validateRangeInOneMonth(start, end)) {
          return [
            [start, end]
          ];
        }
        const data = [];
        let startDay = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        const lastDay = this.toDate(startDay.getTime() - oneDay);
        if (!validateRangeInOneMonth(startDay, end)) {
          console.warn('[ElementCalendar]start time and end time interval must not exceed two months');
          return [];
        }
        // 第一个月的时间范围
        data.push([
          start,
          lastDay
        ]);
        // 下一月的时间范围，需要计算一下该月的第一个周起始日
        const firstDayOfWeek = this.realFirstDayOfWeek;
        const nextMontFirstDay = startDay.getDay();
        let interval = 0;
        if (nextMontFirstDay !== firstDayOfWeek) {
          if (firstDayOfWeek === 0) {
            interval = 7 - nextMontFirstDay;
          } else {
            interval = firstDayOfWeek - nextMontFirstDay;
            interval = interval > 0 ? interval : 7 + interval;
          }
        }
        startDay = this.toDate(startDay.getTime() + interval * oneDay);
        if (startDay.getDate() < end.getDate()) {
          data.push([
            startDay,
            end
          ]);
        }
        return data;
      }
      return [];
    },

    realFirstDayOfWeek() {
      if (this.firstDayOfWeek < 1 || this.firstDayOfWeek > 6) {
        return 0;
      }
      return Math.floor(this.firstDayOfWeek);
    }
  },
  created(){
    this.initSelectYear(this.nowYear);
  },
  data() {
    return {
      selectedDay: '',
      value:null,
      now: new Date(),
      nowYear:new Date().getFullYear(),//当前年
      yearList:[],//年列表
      monthList:[
        {
          value:1,
          label:"1月"
        },{
          value:2,
          label:"2月"
        },{
          value:3,
          label:"3月"
        },{
          value:4,
          label:"4月"
        },{
          value:5,
          label:"5月"
        },{
          value:6,
          label:"6月"
        },{
          value:7,
          label:"7月"
        },{
          value:8,
          label:"8月"
        },{
          value:9,
          label:"9月"
        },{
          value:10,
          label:"10月"
        },{
          value:11,
          label:"11月"
        },{
          value:12,
          label:"12月"
        }
      ]//月列表
    };
  }
};
</script>
<style lang="css" scoped>
  .title-center{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 300px;
    margin-left: -100px;
  }
  .chunk-button {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1d81ee !important;
  color: #ffffff;
  border-radius: 10px;
}
 .title /deep/ .el-dropdown{
    color: #333333;
  }
 .el-dropdown-menu{
   max-height: 200px;
   overflow: auto;
  }
.el-dropdown-menu::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
}
.el-dropdown-menu::-webkit-scrollbar:horizontal {
  height: 6px;
}
.el-dropdown-menu::-webkit-scrollbar-thumb {
      border-radius: 5px;
      width: 6px;
      background:#b4bccc;
}
.el-dropdown-menu::-webkit-scrollbar-corner,
.el-dropdown-menu::-webkit-scrollbar-track{
      background: #fff;
}
.el-dropdown-menu::-webkit-scrollbar-track-piece {
     background: #fff;
     width: 6px;
}
.el-calendar__body{
  padding: 0;
}
.current{
  padding: 0 !important;
}

</style>
