<template>
  <div class="boxWrap" style="position: relative;" id="pdfDom">
    <div class="title affix">
      <div>裁判报告
        <div class="time">
          <div class="item">
            <i class="el-icon-time"></i>
            比赛时间：{{ $route.query.gameDate }} {{ $route.query.dayOfWeekText }}
          </div>
          <div class="item">
            <img src="@/assets/common/icon_rili.png" alt="">
            赛事阶段：{{ $route.query.gameStage || '--' }}
          </div>
          <div class="item">
            <img src="@/assets/common/icon_time.png" alt="">
            赛事进度：{{ $route.query.weekOfMonth || '--' }}
          </div>
          <div class="item">
            <i class="el-icon-location-information"></i>
            城市：{{ $route.query.city || '--' }}
          </div>
        </div>
      </div>
      <div class="btn" v-show="!isPDF">
        <div class="item" @click="onBtn(1)">
          <img src="@/assets/common/icon_tongbu.png" alt="">同步
        </div>
        <div class="item" @click="onBtn(2)">
          <img src="@/assets/common/icon_daochu.png" alt="">导出
        </div>
        <div class="item" @click="$router.go(-1)">
          <img src="@/assets/eventAgent/back.png" alt="">返回
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="team">
        <div style="color: #FE4A56;">TEAM A:</div>
        <div v-show="isPDF" style="text-align: center;">{{ params.teamA }}</div>
        <el-select v-model="params.teamA" placeholder="请选择" @change="changeTeam" v-show="!isPDF">
          <el-option v-for="item in teamList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="fraction">
        <div>A得分：</div>
        <div v-show="isPDF" style="text-align: center;">{{ params.scoreA }}</div>
        <el-input-number v-model="params.scoreA" :controls="false" @blur="onSave" v-show="!isPDF" />
      </div>
      <img src="@/assets/common/Vs.png" alt="" style="margin-bottom:10px">
      <div class="fraction">
        <div>B得分：</div>
        <div v-show="isPDF" style="text-align: center;">{{ params.scoreB }}</div>
        <el-input-number v-model="params.scoreB" :controls="false" @blur="onSave" v-show="!isPDF" />
      </div>
      <div class="team">
        <div style="color: #1D81EE;">TEAM B:</div>
        <div v-show="isPDF" style="text-align: center;">{{ params.teamB }}</div>
        <el-select v-model="params.teamB" disabled v-show="!isPDF">
          <el-option v-for="item in teamList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
    </div>
    <div class="con_box">
      <div class="top_box">
        <div class="lin_title">MAP SELECTION</div>
        <div> BP流程：
          <span v-show="isPDF" style="font-weight: bold;">
            {{ params.bpProcess === 1 ? 'BO3' : params.bpProcess === 2 ? 'BO5' : params.bpProcess === 3 ? '总决赛BO5' : '' }}
          </span>
          <el-select v-model="params.bpProcess" placeholder="请选择" @change="changeBo" v-show="!isPDF">
            <el-option label="BO3" :value="1" />
            <el-option label="BO5" :value="2" />
            <el-option label="总决赛BO5" :value="3" />
          </el-select>
        </div>
      </div>
      <div class="table">
        <div class="th">
          <div class="col">TEAM SELECT</div>
          <div class="col">Action</div>
          <div class="col">Selection</div>
        </div>
        <div v-for="(m, i) in mapSelection" :key="i" class="td">
          <div class="col"> 
            <template v-if="params.bpProcess != 3 || i > 1">{{ m.teamSelect }}</template>
            <template v-else>
              <div style="padding:0 15px">
                <el-select v-model="m.teamSelect" :disabled="i == 1" @change="changeTeamSelect" size="small">
                  <el-option v-for="item in teamList" :key="item" :label="item" :value="item" />
                </el-select>
              </div>
            </template>
          </div>
          <div class="col">{{ m.action }}</div>
          <div class="col" v-show="isPDF" style="background: #fff;">{{ m.selection }}</div>
          <div class="col" v-show="!isPDF" >
            <el-select v-model="m.selection" placeholder="请选择" v-if="m.action.includes('Side')" size="small"
              @change="onSave">
              <el-option label="Attack" value="Attack" />
              <el-option label="Defense" value="Defense" />
            </el-select>
            <el-select v-model="m.selection" placeholder="请选择" v-else size="small" @change="() => changeMap(i)"
              :disabled="i === mapSelection.length - 2">
              <el-option :label="n.all" :value="n.all" v-for="n in mapList" :key="n.nameEn"
                :disabled="mapSelection.slice(0, i).find(y => y.selection === n.all) ? true : false" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="map_box">
        <div class="th">MAP POOL</div>
        <div v-for="(m, i) in mapList" :key="i" :class="m.status !== null ? 'td Ban' : 'td'">
          <div>{{ m.nameEn }}</div>
          <div>{{ m.nameCn }}</div>
        </div>
      </div>
    </div>
    <SessionTable v-for="(m, i) in list" :data="params" :match="m" :key="i" :typeList="typeList" @dlt="onDlt"
      :isPDF="isPDF" />
    <div class="addBtn" @click="onAdd" v-if="!isPDF"
      v-show="(params.bpProcess === 1 && list.length !== 3) || (params.bpProcess !== 1 && list.length !== 5)">
      <i class="el-icon-circle-plus-outline"></i> &nbsp;新增比赛
    </div>
  </div>
</template>
<script>
import SessionTable from "./SessionTable.vue";
import * as Api from "@/api/reportApi";

export default {
  name: "eventReport",
  components: {SessionTable},
  data() {
    return {
      params: {},
      mapSelection: [],
      mapList: [],
      list: [],
      // isPDF: true,
      isPDF: false,
      // 数据
      BO3List: [],
      BO5List: [],
      BO5sList: [],
      teamList: [],
      typeList: [],
    };
  },
  computed: {},
  created() {
    Api.refereeReportConfig().then(res => {
      const {BO3, BO5, BO5Final} = res.data || {};
      let arr3 = [];
      for (const m in BO3.mapSelection.action) {
        arr3.push(BO3.mapSelection.action[m]);
      }
      this.BO3List = arr3;
      let arr5 = [];
      for (const m in BO5.mapSelection.action) {
        arr5.push(BO5.mapSelection.action[m]);
      }
      this.BO5List = arr5;
      let arr5s = [];
      for (const m in BO5Final.mapSelection.action) {
        arr5s.push(BO5.mapSelection.action[m]);
      }
      this.BO5sList = arr5s;
    });
    Api.IssueTypes().then(res => {
      this.typeList = res.data.rows || [];
    });
    this.getInfo();
  },
  methods: {
    changeTeam(val) {
      const value = this.teamList.find(m => m !== val);
      this.params.teamA = val;
      this.params.teamB = value;
      this.changeBo();
    },
    changeMap(index) {
      console.log(index);
      this.mapSelection.forEach((m, i) => {
        if (i > index && !m.action.includes('Side')) {m.selection = '';}
      });
      const filter = this.mapSelection.filter(m => !m.action.includes('Side'));
      this.mapList.forEach((m, i) => {
        const find = filter.find(n => n.selection === m.all);
        m.status = find ? find.action.includes('Ban') ? 0 : 1 : null;
      });
      if (this.mapSelection[index].action === filter[filter.length - 2].action) {
        const a1 = this.mapList.filter(m => m.status === null);
        if (a1.length === 1) {
          this.mapSelection[this.mapSelection.length - 2].selection = a1[0].all;
        }
      }
      this.onSave();
    },
    changeBo(type) {
      const {bpProcess, teamA, teamB} = this.params;
      let arr = [];
      (bpProcess === 1 ? this.BO3List : bpProcess === 2 ? this.BO5List : this.BO5sList).forEach((m, i) => {
        const teamSelect = bpProcess === 1 ?
          i === 8 ? 'Decider Map' : [1, 3, 4, 7].some(n => n === i) ? teamB : teamA :
          bpProcess === 2 ?
            i === 10 ? 'Decider Map' : [0, 2, 5, 6, 9].some(n => n === i) ? teamA : teamB :
            i === 10 ? 'Decider Map' : [3, 4, 7, 8, 11].some(n => n === i) ? teamB : teamA;
        arr.push({teamSelect, action: m, selection: ''});
      });
      this.mapSelection = arr;
      this.mapList = this.mapList.map(m => {return {...m, status: null};});
      if (type !== 'noSave') {
        this.onSave();
      }
    },
    changeTeamSelect(v) {
      this.mapSelection[1].teamSelect = v;
      this.onSave();
    },
    // 保存
    onSave() {
      Api.reportSave({...this.params, mapSelection: this.mapSelection}).then(res => {
        this.getInfo();
      });
    },
    onAdd() {
      Api.mapMatchAdd({refereeReportId: this.params.refereeReportId}).then((res) => {
        this.getInfo();
      });
    },
    onDlt({refereeReportMapMatchId}) {
      this.$confirm(`确认删除？`, '温馨提示', {center: true, type: 'warning'}).then(() => {
        Api.mapMatchDelete({refereeReportId: this.params.refereeReportId, refereeReportMapMatchId}).then((res) => {
          this.getInfo();
        });
      });
    },
    // 获取数据
    getInfo() {
      Api.refereeReportInfo({contestScheduleId: this.$route.query.id}).then((res) => {
        const {teamA, teamB, scoreA, scoreB, bpProcess, refereeReportId} = res.data?.main || {};
        const {mapSelection, mapPoolSnapshot, mapPool} = res.data?.main || {};
        this.params = {teamA, teamB, scoreA, scoreB, bpProcess, refereeReportId};
        this.list = res.data?.match || [];
        this.mapList = mapPoolSnapshot.map(m => {
          m.all = `${m.nameEn} ${m.nameCn}`;
          const find = mapPool.find(n => n.nameEn === m.all);
          return {...m, status: find ? find.status : null};
        });
        if (mapSelection.length) {
          this.mapSelection = mapSelection;
        } else {
          this.changeBo('noSave');
        }
        this.teamList = [teamA, teamB];
      });
    },
    onBtn(type) {
      this.$confirm(`确认${type === 1 ? '同步' : '导出'}？`, '温馨提示', {center: true, type: 'warning'}).then(() => {
        if (type === 1) {
          Api.syncReport({refereeReportId: this.params.refereeReportId}).then(res => {
            res.success ? this.getInfo() : '';
          });
        } else {
          this.isPDF = true;
          this.$nextTick(() => this.getPdf(`${this.$route.query.gameDate} ${this.params.teamA} VS ${this.params.teamB}-裁判报告`));
          this.$nextTick(() => this.isPDF = false);
        }
      });

    },
  },
};
</script>
<style scoped lang="scss">
.affix {
  align-items: start;
  background: #fff;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  z-index: 9;

  .item {
    font-size: 14px;
    font-weight: 400;

    img {
      width: 13px;
      vertical-align: middle;
      margin-right: 2px;
    }
  }

  .time {
    display: flex;
    margin-top: 15px;

    .item {
      color: #666666;
      margin-right: 20px;
      padding-right: 20px;
      border-right: #DDE1E6 1px solid;

      &:last-child {
        border-right: none
      }

      i {
        margin-right: 2px;
      }
    }
  }

  .btn {
    display: flex;

    .item {
      color: #126BEE;
      margin-left: 20px;
      padding-left: 20px;
      border-left: #DDE1E6 1px solid;
      cursor: pointer;

      &:first-child {
        border-left: none
      }
    }
  }
}

.detail {
  background: #fff;
  padding: 10px 0 20px;
  display: flex;
  align-items: end;
  justify-content: center;
  font-size: 14px;
  line-height: 30px;
  font-weight: bold;

  .team {
    font-family: HelveticaNeue-Bold, HelveticaNeue;
  }

  .fraction {
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #666666;
    margin: 0 20px;

    .el-input-number {
      width: 80px;
      text-align: left;
      font-weight: bold;
      color: #333333;
    }
  }
}

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
    margin-bottom: 20px;
  }

  .table {
    width: 70%;
    display: inline-block;
    line-height: 36px;
    text-align: center;

    .th,
    .td {
      border: 1px solid #DDE1E6;
      width: 100%;

      .col {
        width: 40%;
        border-left: 1px solid #DDE1E6;
        box-sizing: border-box;
        display: inline-block;
        background: #666666;
        font-weight: bold;
        color: #FFFFFF;

        &:first-child {
          width: 20%;
          border-left: none;
        }
      }
    }

    .td {
      border-top: none;

      .col {
        background: #F6F7FB;
        color: #333333;

        &:last-child {
          background: #FFFFFF;
          font-weight: 400;
        }
      }
    }
  }

  .map_box {
    margin-left: 10px;
    width: calc(30% - 10px);
    display: inline-block;
    vertical-align: top;
    line-height: 36px;
    font-size: 14px;
    text-align: center;

    .th {
      border: 1px solid #666666;
      background: #666666;
      font-weight: bold;
      font-family: HelveticaNeue-Bold, HelveticaNeue;
      font-weight: bold;
      color: #FFFFFF;
    }

    .td {
      border: 1px solid #DDE1E6;
      border-top: none;
      color: #333333;

      div {
        width: 50%;
        display: inline-block;
        box-sizing: border-box;


        &:first-child {
          border-right: 1px solid #DDE1E6;
        }
      }
    }

    .Ban div {
      text-decoration: line-through;
      color: #979797;
    }
  }


}

.addBtn {
  margin-top: 10px;
  text-align: center;
  border: 1px dashed #20BD20;
  line-height: 46px;
  font-size: 14px;
  color: #20BD20;
  border-radius: 10px;
  cursor: pointer;
}
</style>

