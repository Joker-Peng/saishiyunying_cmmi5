<template>
  <div class="boxWrap">
    <div class="box sticky" style="margin-bottom: 20px">
      <div class="title">
        <div style="display: flex; align-items: center">
          <div class="chunk">
            <el-select
              placeholder="请选择赛事"
              v-model="filterData.contestTypeId"
              style="width: 224px"
            >
              <el-option
                v-for="item in contestType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          排班统计
        </div>
        <div class="chunk" @click="handleExport">
          <el-button
            class="chunk-button"
            style="background: #00afff; color: #ffffff;"
            >导出</el-button
          >
        </div>
      </div>
      <div class="detail">
        <div class="chunk-wrap">
          <!-- <div class="chunk">
            <div class="chunk-text">赛事名称：</div>
            <el-select
              filterable
              placeholder="请选择赛事名称"
              v-model="filterData.contestName"
              style="width: 224px"
              clearable
            >
              <el-option
                v-for="item in contestNameOptions"
                :key="item.contestId"
                :label="item.contestName"
                :value="item.contestName"
              >
              </el-option>
            </el-select>
          </div> -->
          <div class="chunk">
            <div class="chunk-text">赛程日期：</div>
            <el-date-picker
              v-model="filterData.beginDate"
              type="date"
              placeholder="请选择日期"
              :picker-options="dateRule[0]"
              :clearable="false"
              style="width: 150px"
            >
            </el-date-picker>
            <div style="margin: 0 4px;">~</div>
            <el-date-picker
              v-model="filterData.endDate"
              type="date"
              placeholder="请选择日期"
              :picker-options="dateRule[1]"
              :clearable="false"
              style="width: 150px"
            >
            </el-date-picker>
          </div>
          <div class="chunk">
            <div class="chunk-text">裁判姓名：</div>
            <el-input
              placeholder="请输入裁判姓名"
              v-model="filterData.refereeName"
              style="width: 224px"
            ></el-input>
          </div>
          <div class="chunk">
            <div class="chunk-text">常驻城市：</div>
            <el-select
              filterable
              placeholder="请选择常驻城市"
              v-model="filterData.city"
              style="width: 224px"
              clearable
            >
              <el-option
                v-for="item in cityList"
                  :key="item"
                  :label="item"
                  :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="chunk">
            <div class="chunk-text">用户身份：</div>
            <el-select
              filterable
              placeholder="请选择用户身份"
              v-model="filterData.position"
              style="width: 224px"
              clearable
              multiple
            >
              <el-option
                v-for="item in identityList"
                :key="item.identityId"
                :label="item.identityName"
                :value="item.identityId"
              >
              </el-option>
            </el-select>
          </div>
          <div class="chunk">
            <el-button type="primary" @click="loadData">查询</el-button>
          </div>
          <!-- <div class="chunk" @click="handleRefresh">
            <el-image
              :src="require('@/assets/accountManage/reset.png')"
            ></el-image>
          </div> -->
        </div>
      </div>
      <!-- <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div class="chunk-text">裁判姓名：</div>
            <el-input
              placeholder="请输入裁判姓名"
              v-model="filterData.refereeName"
              style="width: 224px"
            ></el-input>
          </div>
        </div>
      </div> -->
    </div>
    <div class="main">
      <el-table 
        :data="planList" 
        @cell-click="handleClickCell" 
        style="width: 100%;" 
        :row-style="{color: '#333333', 'font-size': '14px'}" 
        :header-cell-style="{'background-color': 'transparent', 'font-weight': 'bold', 'color': '#333333'}"
      >
        <el-table-column
          align="center"
          prop="userName"
          label="姓名"
          width="120px"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="scheduleTotal"
          label="总排班量"
          width="120px"
          fixed="left"
          sortable
        >
          <template slot-scope="scope">
            <el-tooltip content="点击查看排班明细" placement="top" effect="light">
              <span style="cursor: pointer" class="blue">{{scope.row.scheduleTotal}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="salaryTotal"
          label="总薪资"
          width="100px"
          fixed="left"
          sortable
        >
          <template slot-scope="scope">
            <el-tooltip content="点击查看薪资明细" placement="top" effect="light">
              <span style="cursor: pointer" class="red">{{scope.row.salaryTotal | formatNumberWithCommas}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column 
          align="center" 
          prop="score" 
          label="评分" 
          width="100px"
          fixed="left"
          sortable
        >
          <template slot-scope="scope">
            <el-tooltip content="点击查看评分明细" placement="top" effect="light">
              <span style="cursor: pointer" :class="scope.row.score > 0 ? 'green' : 'red'">{{(scope.row.score > 0 ? "+" : "")+scope.row.score}}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column :label="item.label" align="center" v-for="(item, index) in lplColumnList" :key="index">
          <el-table-column
            v-for="(item2, index2) in item.children"
            :key="index2"
            align="center"
            :prop="item2.prop"
            :label="item2.label"
            width="auto"
          >
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div v-if="page.count" class="page">
        <div>共{{ page.count }}个，每页{{ page.pageSize }}条数据</div>
        <div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="page.count"
            :page-size="page.pageSize"
            :current-page.sync="page.pageIndex"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
  <script>
import dialogBox from "@/components/eventSchedule/dialog.vue";
import * as api_account from "@/api/account";
export default {
  name: "player",
  components: {
    dialogBox,
  },
  data() {
    return {
      filterData: {
        contestTypeId: "",
        contestName: "",
        refereeName: "",
        beginDate: this.$moment().add(-1, "month").toDate(),
        endDate: new Date(),
        city: "",
        position: null,
      },
      page: {
        pageSize: 10,
        pageIndex: 1,
        count: 0,
      },
      dateRule: [
        {
          disabledDate: (time) =>
            this.filterData.endDate &&
            time.valueOf() > this.filterData.endDate.valueOf(),
        },
        {
          disabledDate: (time) =>
            time.valueOf() < this.filterData.beginDate.valueOf(),
        },
      ],
      contestType: [],
      contestNameOptions: [],
      planList: [],
      cityList: [],
      allIdentityList: [], //全部的身份列表编辑用 接口源数据
      planListForExports: [], // 供给导出使用
    };
  },
  filters: {
    formatNumberWithCommas(number) {
      if(typeof number === 'number') {
        return '￥'+number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }else{
        return number;
      }
    }
  },
  computed: {
    maxHeight() {
      return window.innerHeight - 300
    },
    loadFinished() {
      return this.page.pageIndex * this.page.pageSize >= this.page.count;
    },
    zhuCaiPan() {
      return {
        label: '主裁判',
        prop: '',
        children: [
          {
            label: '排班量',
            prop: 'mainReferee.schedule'
          },
          {
            label: '薪资',
            prop: 'mainReferee.salary'
          }
        ],
      }
    },
    changShaCaiPan() {
      return {
        label: '场上裁判',
        prop: '',
        children: [
          {
            label: '排班量',
            prop: 'onReferee.schedule'
          },
          {
            label: '薪资',
            prop: 'onReferee.salary'
          }
        ]
      }
    },
    changXiaCaiPan() {
      return {
        label: '场下裁判',
        prop: '',
        children: [
          {
            label: '排班量',
            prop: 'offReferee.schedule'
          },
          {
            label: '薪资',
            prop: 'offReferee.salary'
          }
        ]
      }
    },
    changXiaCaiPanLeader() {
      return {
        label: '场下裁判 Leader',
        prop: '',
        children: [
          {
            label: '排班量',
            prop: 'offRefereeLeader.schedule'
          },
          {
            label: '薪资',
            prop: 'offRefereeLeader.salary'
          }
        ]
      }
    },
    zhuliCaiPan() {
      return {
        label: '助理主裁判',
        prop: '',
        children: [
          {
            label: '排班量',
            prop: 'assistantMainReferee.schedule'
          },
          {
            label: '薪资',
            prop: 'assistantMainReferee.salary'
          }
        ]
      }
    },
    lplColumnList() {
      const lplList = [this.zhuCaiPan, this.changShaCaiPan, this.changXiaCaiPan];
      const ldlList = [this.zhuCaiPan, this.changShaCaiPan, this.changXiaCaiPan, this.changXiaCaiPanLeader, this.zhuliCaiPan];
      const wrlList = [this.zhuCaiPan, this.changShaCaiPan, this.changXiaCaiPan, this.zhuliCaiPan];
      const valList = [this.zhuCaiPan, this.changShaCaiPan, this.changXiaCaiPan];
      switch(this.filterData.contestTypeId) {
        case 1: 
          console.log({lplList})
          return lplList;
        case 2: 
          console.log({ldlList})
          return ldlList
        case 3: 
          console.log({wrlList})
          return wrlList
        case 4: 
          console.log({valList})
          return valList
        default:
          console.log({lplList})
          return lplList
      }
    },
    contestTypeIdName() {
      return this.contestType.find(f=>f.value===this.filterData.contestTypeId)?.label
    },
    //身份字典
    identityList() {
      return (this.allIdentityList.find(fd=>fd.contestTypeId===this.filterData.contestTypeId)||{}).identityList||[]
    },
  },
  watch: {
    "filterData.contestTypeId"() {
      this.filterData.contestName = "";
      this.filterData.position = null;
      this.loadcontestName();
      if (this.page.pageIndex != 1) {
        this.page.pageIndex = 1;
      } else {
        this.loadData();
      }
    },
    "page.pageIndex"() {
      this.loadData();
    },
  },
  created() {
    console.log('plan')
    this.getContestType();
    this.getCityList();
    this.getIdentityList();
  },
  methods: {
    //获取城市列表
    getCityList() {
      api_account.cityList().then((res) => {
        if (res.success) {
          var cityArray = [];
          res.data.list.forEach((element) => {
            cityArray.push(element.city);
          });

          this.cityList = cityArray;
        }
      });
    },
    //身份列表
    getIdentityList() {
      api_account.getIdentityList().then((res) => {
        if (res.success) {
          this.allIdentityList = res.data.list;
        }
      });
    },
    loadData() {
      api_account
        .getPlanList({
          ...this.filterData,
          position: (this.filterData.position||[]).join(","),
          beginDate: this.$moment(this.filterData.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
        })
        .then((res) => {
          if (res.success) {
            this.planListForExports = res.data.statistic||[];
            this.planList = (res.data.statistic||[]).map(m=>{
              let str = m.salaryTotal;
              let num = 0;
              if(str && typeof str === 'string' && str!=='-' ) {
                num = str.split("￥")[1];
                if(num.includes(',')){
                  num = num.replace(/,/g, "");
                }
                m.salaryTotal = +num;
              }else{
                m.salaryTotal = str;
              }
              return m;
            });
          }
        });
    },
    getContestType() {
      api_account.getContestType({}).then((res) => {
        if (res.success) {
          this.contestType = res.data.map((item) => ({
            value: item.contestTypeId,
            label: item.contestTypeName,
            isSelect: item.isSelect,
          }));
          let selectedIndex = this.contestType.findIndex((d) => d.isSelect);
          selectedIndex < 0 && (selectedIndex = 0);
          this.filterData.contestTypeId = this.contestType[selectedIndex].value;
        }
      });
    },
    loadcontestName() {
      api_account
        .getContestList({
          page: 1,
          pageNum: 100,
          isPublish: -1,
          contestTypeId: this.filterData.contestTypeId,
        })
        .then((res) => {
          this.contestNameOptions = res.data.map((item) => ({
            contestId: item.contestId,
            contestName: item.name,
          }));
        });
    },
    handleRefresh() {
      if (this.page.pageIndex != 1) {
        this.page.pageIndex = 1;
      } else {
        this.loadData();
      }
    },
    handleClickCell(data, column) {
      console.log(data)
      let prop = column.property;
      const beginDate = this.$moment(this.filterData.beginDate).format("YYYY-MM-DD");
      const endDate = this.$moment(this.filterData.endDate).format("YYYY-MM-DD");
      switch(prop) {
        case "scheduleTotal":
          this.$router.push({
            path: "/plan/planView",
            query: {
              refereeId: data.userId,
              refereeName: data.userName,
              contestTypeId: this.filterData.contestTypeId,
              beginDate,
              endDate,
            }
          })
          return false;
        case "score":
          this.$router.push({
            path: "/plan/scoreView",
            query: {
              refereeId: data.userId,
              refereeName: data.userName,
              contestTypeId: this.filterData.contestTypeId,
              beginDate,
              endDate,
            }
          })
          return false;
        case "salaryTotal":
          if(data[prop]==='-'||data[prop]===undefined||data[prop]===null) {
            return false;
          }
          this.$router.push({
            path: "/plan/salaryView",
            query: {
              refereeId: data.userId,
              refereeName: data.userName,
              contestTypeId: this.filterData.contestTypeId,
              beginDate,
              endDate,
            }
          })
          return false;
      }
    },
    handleExport() {
        // api_account
        // .getPlanList({
        //   ...this.filterData,
        //   position: (this.filterData.position||[]).join(","),
        //   beginDate: this.$moment(this.filterData.beginDate).format(
        //     "YYYY-MM-DD"
        //   ),
        //   endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
        // })
        // .then((res) => {
          // 没有数据不导
          if(!this.planListForExports || this.planListForExports.length==0) {
            return false;
          }
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../Excel/Export2Excel");
            
            // console.log({lplColumnList: this.lplColumnList})
            const lplList = this.lplColumnList.reduce((total,item)=>{
              const children = item.children.map(m=>{
                return {
                  label: item.label+m.label,
                  prop: m.prop,
                };
              })
              return total.concat(children)
            }, [])
            console.log({lplList})

            // return false;
            const tHeader = [
              "姓名",
              "总排班量",
              "总薪资",
              "评分",
              ...lplList.map(m=>m.label),
              // "主裁判排班量",
              // "主裁判薪资",
              // "场上裁判排班量",
              // "场上裁判薪资",
              // "场下裁判排班量",
              // "场下裁判薪资",
            ]; // 上面设置Excel的表格第一行的标题
            const data = this.planListForExports.reduce((res, val) => {
              // 添加年月日星期
              res.push([
                val.userName,
                val.scheduleTotal, 
                `￥${val.salaryTotal}`,
                (val.score > 0 ? "+" : "")+val.score,
                ...lplList.map(m=>{
                  const props = m.prop.split(".")
                  return val[props[0]][props[1]];
                }),
                // val.mainReferee.schedule,
                // val.mainReferee.salary,
                // val.onReferee.schedule,
                // val.onReferee.salary,
                // val.offReferee.schedule,
                // val.offReferee.salary,
              ])
              return res;
            }, [])
            let fileName = 
              (this.contestTypeIdName?(this.contestTypeIdName+'-'):'')+
              (this.filterData.beginDate?(this.$moment(this.filterData.beginDate).format("YYYY-MM-DD")+'-'):'')+
              (this.filterData.endDate?(this.$moment(this.filterData.endDate).format("YYYY-MM-DD")+'-'):'')+
              (this.filterData.contestName?(this.filterData.contestName+'-'):'')+
              (this.filterData.refereeName?(this.filterData.refereeName+'-'):'')+
              "的排班统计";
            export_json_to_excel(tHeader, data, fileName); //最后一个是表名字
          });
        // })
      },
    // 手动排序  
    sortChange({ column, prop, order }) {
      console.log({ column, prop, order })
      console.log({planList: this.planList})

    },
  },
};
</script>
  <style lang="scss" scoped>
  .blue {
    color: #1D81EE
  }
  .green {
    color: #00B400;
  }
  .red {
    color: #FF005C;
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
.detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 20px 0 0;
  &:last-of-type {
    padding-bottom: 20px;
  }
}
.chunk {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  padding-left: 20px;
  margin-right: 10px;
  &-wrap {
    display: flex;
    margin-top: 10px;
  }
  &-text {
    min-width: 70px;
  }
  &-text-position{
    min-width: none;
  }
  &-button {
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.main {
  background: #FFFFFF;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.05);
  border-radius: 10px;
  overflow: hidden;
}
.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}
.chunk-wrap{
  flex-wrap: wrap;
  margin-top: 0;
  .chunk{
    margin-top: 10px;
  }
}
</style>
    