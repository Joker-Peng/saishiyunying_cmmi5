<template>
  <div class="con_box">
    <div class="top_box">
      <div class="flex_start">
        <div class="lin_title" style="border-right: 1px solid #CCCCCC">{{ match.matchNumber }}&emsp;</div>
        <div class="map">&emsp;<img src="@/assets/common/icon_map.png">&ensp;MAP：{{ match.map }}
        </div>
      </div>
      <div class="flex_start"> Map Score&ensp;
        <span v-show="isPDF">{{ params.setScoreA }}</span>
        <el-input-number v-model="params.setScoreA" :controls="false" style="width: 85px" size="small" @blur="onSave"
          :max="99" :min="0" v-show="!isPDF" />
        <div class="dot">
          <div></div>
          <div></div>
        </div>
        <span v-show="isPDF">{{ params.setScoreB }}</span>
        <el-input-number v-model="params.setScoreB" :controls="false" style="width: 85px" size="small" @blur="onSave"
          :max="99" :min="0" v-show="!isPDF" />
      </div>
      <div class="right" v-show="isPDF"></div>
      <div class="right" v-show="!isPDF">
        <div class="dlt" v-if="params.canDelete" @click="$emit('dlt', params)">
          <i class="el-icon-delete"></i> &nbsp;删除
        </div>
        <div @click="collapse = !collapse">
          {{ collapse ? '展开' : '收起' }}
          <i class="el-icon-arrow-down" v-show="collapse"></i>
          <i class="el-icon-arrow-up" v-show="!collapse"></i>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px;" v-show="!collapse">
      <div class="table">
        <div class="th flex_between">
          <div> <img :src="require(`@/assets/common/${params.sideA === 2 ? 'shield-full' : 'shizhanxunlian'}.png`)"
              style="vertical-align: sub">&nbsp; {{ params.sideA === 2 ? 'Defense' : 'Attack' }} </div>
          <div>{{ data.teamA }}</div>
          <div style="margin-left: 50px"></div>
        </div>
        <div class="td">
          <div class="col" v-for="m in ['K', 'D', 'A', 'ID', 'Agent']" :key="m" style="background: #F6F7FB">{{ m }}
          </div>
        </div>
        <div class="td" v-for="(m, i) in listA" v-show="isPDF">
          <div class="col" v-for="n in ['kill', 'death', 'assist', 'name', 'role']"> {{ m[n] }}&nbsp; </div>
        </div>
        <div class="td" v-for="(m, i) in listA" v-show="!isPDF">
          <div class="col" v-for="n in ['kill', 'death', 'assist']" :key="n">
            <el-input-number v-model="m[n]" :controls="false" size="small" @blur="onSave" :max="99" :min="0" />
          </div>
          <div class="col" v-for="n in ['name', 'role']" :key="n">
            <el-input v-model="m[n]" size="small" @blur="onSave" />
          </div>
        </div>
        <div class="td" v-for="m in IptL" :key="m.val">
          <div class="time">{{ m.lab }}</div>
          <div class="time" v-show="isPDF">{{ params[m.val] }}</div>
          <div class="time" v-show="!isPDF">
            <el-time-picker v-model="params[m.val]" value-format="HH:mm:ss" placeholder="选择时间" size="small" v-if="m.time"
              @change="onSave" />
            <el-input v-model="params[m.val]" size="small" @blur="onSave" v-else />
          </div>
        </div>
      </div>
      <div class="table">
        <div class="th flex_between">
          <div style="margin-right: 50px"></div>
          <div>{{ data.teamB }}</div>
          <div> <img :src="require(`@/assets/common/${params.sideB === 1 ? 'shizhanxunlian' : 'shield-full'}.png`)"
              style="vertical-align: sub">&nbsp; {{ params.sideB === 1 ? 'Attack' : 'Defense' }} </div>
        </div>
        <div class="td">
          <div class="col" v-for="m in ['Agent', 'ID', 'K', 'D', 'A']" :key="m" style="background: #F6F7FB">{{ m }}
          </div>
        </div>
        <div class="td" v-for="(m, i) in listA" v-show="isPDF">
          <div class="col" v-for="n in ['role', 'name', 'kill', 'death', 'assist']" :key="n"> {{ m[n] }}&nbsp; </div>
        </div>
        <div class="td" v-for="(m, i) in listB" v-show="!isPDF">
          <div class="col" v-for="n in ['role', 'name']" :key="n">
            <el-input v-model="m[n]" size="small" @blur="onSave" />
          </div>
          <div class="col" v-for="n in ['kill', 'death', 'assist']" :key="n">
            <el-input-number v-model="m[n]" :controls="false" size="small" @blur="onSave" :max="99" :min="0" />
          </div>
        </div>
        <div class="td" v-for="m in IptR" :key="m.val">
          <div class="time">{{ m.lab }}</div>
          <div class="time" v-show="isPDF">{{ params[m.val] }}&emsp;</div>
          <div class="time" v-show="!isPDF">
            <el-time-picker v-model="params[m.val]" value-format="HH:mm:ss" placeholder="选择时间" size="small" v-if="m.time"
              @change="onSave" />
            <el-input v-model="params[m.val]" size="small" @blur="onSave" v-else />
          </div>
        </div>
        <div class="td">
          <div class="time"> &emsp;</div>
          <div class="time"> &emsp;</div>
        </div>
      </div>
    </div>
    <div class="problem" v-for="item, i in problemList" v-show="!collapse">
      <div class="flex_between col" style="width: 100%;padding: 0 20px;border-bottom: none;">
        lssues {{ i + 1 }}
        <div class="right" v-show="!isPDF">
          <div class="dlt" @click="onDlt(item, i)" v-show="i" :style="{border: 'none', padding: 0, margin: 0}">
            <i class="el-icon-delete"></i> &nbsp;删除
          </div>
          <div style="color: #20BD20;" @click="onIssueSave()" v-show="!i">
            <i class="el-icon-circle-plus-outline"></i> &nbsp;新增
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="lab">问题战队：</div>
          <div class="val" v-show="isPDF">{{ item.team }}</div>
          <div class="val" v-show="!isPDF">
            <el-radio-group v-model="item.team" @change="() => onIssueSave(item)">
              <el-radio :label="data.teamA">{{ data.teamA }}</el-radio>
              <el-radio :label="data.teamB">{{ data.teamB }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="col">
          <div class="lab">问题类型：</div>
          <div class="val" v-show="isPDF">{{ item.typeName }} </div>
          <div class="val" v-show="!isPDF">
            <el-select v-model="item.refereeReportIssueTypeId" size="small" @change="typeId(item, i)">
              <el-option v-for="m in typeList" :key="m.id" :label="m.type" :value="m.id" />
            </el-select>
          </div>
        </div>
        <div class="col">
          <div class="lab">Round：</div>
          <div class="val" v-show="isPDF">{{ item.round }}</div>
          <div class="val" v-show="!isPDF">
            <el-input-number v-model="item.round" :controls="false" size="small" @blur="onIssueSave(item)" :max="99"
              :min="0" />
          </div>
        </div>
      </div>
      <div class="col" style="width: 100%;border-top: none;">
        <div class="lab">问题描述：</div>
        <div class="val" v-show="isPDF">{{ item.description }}</div>
        <div class="val" style="padding: 2px 20px;" v-show="!isPDF">
          <el-input type="textarea" :rows="2" v-model="item.description" @blur="onIssueSave(item)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dialogBox from "@/components/accountManage/dialog.vue";
import * as Api from "@/api/reportApi";

export default {
  name: "SessionTable",
  components: {dialogBox},
  props: {
    match: {type: Object, default: {}},
    data: {type: Object, default: {}},
    typeList: {type: Array, default: []},
    isPDF: {type: Boolean, default: false},
  },
  watch: {
    match: {
      handler(newVal) {
        const val = JSON.parse(JSON.stringify(newVal));
        const {refereeReportMapMatchPlayers, refereeReportMapMatchIssues} = val || {};
        const arr1 = refereeReportMapMatchPlayers.filter(m => m.team === this.data.teamA);
        const arr2 = refereeReportMapMatchPlayers.filter(m => m.team === this.data.teamB);
        this.listA = arr1.length ? arr1 : [{}, {}, {}, {}, {}];
        this.listB = arr2.length ? arr2 : [{}, {}, {}, {}, {}];
        this.problemList = refereeReportMapMatchIssues.length ? refereeReportMapMatchIssues : [{}];
        this.problemList.forEach(m => {
          if (m.refereeReportIssueTypeId) {
            m.typeName = this.typeList.find(n => n.id === m.refereeReportIssueTypeId)?.type;
          }
        });
        this.params = {...val};
        delete this.params.refereeReportMapMatchPlayers;
        delete this.params.refereeReportMapMatchIssues;
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      collapse: false,
      params: {},
      listA: [{}, {}, {}, {}, {}],
      listB: [{}, {}, {}, {}, {}],
      problemList: [{}],
      IptL: [
        {lab: 'A Timeout 1', val: 'timeoutOneA'},
        {lab: 'A Timeout 2', val: 'timeoutTwoA'},
        {lab: 'A Overtime TO', val: 'overtimeA'},
        {lab: 'Ready', val: 'readyTime', time: true},
        {lab: '1st Half End', val: 'firstHalfEndTime', time: true},
        {lab: 'Map End Time', val: 'endTime', time: true},
      ],
      IptR: [
        {lab: 'B Timeout 1', val: 'timeoutOneB'},
        {lab: 'B Timeout 2', val: 'timeoutTwoB'},
        {lab: 'B Overtime TO', val: 'overtimeB'},
        {lab: 'Map Start Time', val: 'startTime', time: true},
        {lab: '2nd Half Start', val: 'secondHalfStartTime', time: true},
      ],
    };
  },
  methods: {
    typeId(m, i) {
      this.problemList[i].typeName = this.typeList.find(n => n.id === m.refereeReportIssueTypeId)?.type;
      this.onIssueSave(item);
    },
    onSave() {
      let obj = {};
      for (const k in this.params) {
        const find = [...this.IptL, ...this.IptR].find(m => m.val === k);
        if (find || ['refereeReportMapMatchId', 'setScoreA', 'setScoreB'].some(m => m === k)) {
          obj[k] = find ? (this.params[k] || '') : this.params[k];
        }
      }
      const arr1 = this.listA.map((m) => {
        const {kill, death, assist, name, role, team} = m;
        return {kill, death, assist, name, role, team: team || this.data.teamA};
      });
      const arr2 = this.listB.map((m) => {
        const {kill, death, assist, name, role, team} = m;
        return {kill, death, assist, name, role, team: team || this.data.teamB};
      });
      Api.mapMatchMainSave({...obj, mapMatchPlayers: [...arr1, ...arr2]});
    },
    // 问题 保存
    onIssueSave(item) {
      if (item?.mapMatchIssueId) {
        Api.IssueUpt(item, 'Edit');
      } else {
        Api.IssueUpt({refereeReportMapMatchId: this.params.refereeReportMapMatchId, ...item}, 'Add').then((res) => {
          if (this.problemList.length === 1 && item) {
            this.problemList = [{...item, ...res.data}];
          } else {
            this.problemList.push({...item, ...res.data});
          }
        });
      }
    },
    onDlt({mapMatchIssueId}, i) {
      this.$confirm(`确认删除问题？`, '温馨提示', {center: true, type: 'warning'}).then(() => {
        Api.IssueDelete({mapMatchIssueId}).then((res) => {
          if (res.success) {
            this.problemList.splice(i, 1);
          }
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.con_box {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-top: 13px;
  font-size: 14px;

  .top_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333333;

    .map {
      color: #126BEE;
      font-weight: bold;
      font-size: 18px;
      font-family: HelveticaNeue-Bold, HelveticaNeue;
    }

    .dot div {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      margin: 6px 12px;
      background: #0A1621;
    }
  }

  .right {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    line-height: 16px;

    div {
      cursor: pointer;
      color: #006DF7;
    }

    .dlt {
      cursor: pointer;
      color: red;
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #DDE1E6;
    }
  }


  .table {
    width: 50%;
    display: inline-block;
    line-height: 36px;
    text-align: center;

    .th {
      border: 1px solid #DDE1E6;
      background: #666666;
      font-weight: bold;
      font-family: HelveticaNeue-Bold, HelveticaNeue;
      font-weight: bold;
      color: #FFFFFF;
      padding: 0 20px;
    }

    .td {
      border: 1px solid #DDE1E6;
      border-top: none;
      border-right: none;
      width: 100%;
      color: #333333;

      .col {
        width: 16%;
        display: inline-block;
        box-sizing: border-box;
        border-right: 1px solid #DDE1E6;
        padding: 0 20px;

        &:nth-child(4),
        &:nth-child(5) {
          width: 26%;
        }
      }

      .time {
        width: 52%;
        display: inline-block;
        box-sizing: border-box;
        border-right: 1px solid #DDE1E6;
        text-align: center;
        padding: 0 20px;
        box-sizing: border-box;

        &:first-child {
          width: 48%;
          background: #F6F7FB;
          font-weight: bold;
        }
      }

      .el-input,
      .el-input-number--small {
        width: 100%;
      }
    }

    &:last-child .td {
      .col {
        width: 16%;

        &:nth-child(1),
        &:nth-child(2) {
          width: 26%;
        }
      }

      .time {
        width: 48%;

        &:first-child {
          width: 52%;
        }
      }
    }
  }

  .problem {
    margin-top: 10px;

    .row {
      display: flex;
      flex-wrap: nowrap;
    }

    .col {
      box-sizing: border-box;
      width: calc(100% / 3);
      border: 1px solid #DDE1E6;
      line-height: 36px;
      display: flex;
      color: #333;

      .lab {
        flex: none;
        width: 128px;
        background: #F6F7FB;
        border-right: 1px solid #DDE1E6;
        text-align: center;
      }

      .val {
        width: calc(100% - 128px);
        padding: 0 20px;

        .el-select,
        .el-input-number {
          width: 100%;
        }
      }
    }
  }
}
</style>

