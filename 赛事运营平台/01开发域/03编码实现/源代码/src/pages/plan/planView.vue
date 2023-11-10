<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">
        <div class="title-left">
            <div class="chunk">
                <el-select placeholder="请选择赛事" disabled v-model="filterData.contestTypeId" style="width: 224px">
                    <el-option
                    v-for="item in contestTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <span>查看总排班量（{{$route.query.refereeName}}）</span>
        </div>
        <span class="back" @click="handleCancel">
          <img src="@/assets/announcement/icon_back.png" alt />
          返回
        </span>
      </div>
      <div class="detail">
        <div class="chunk-wrap">
            <div class="chunk">
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
              ></el-option>
            </el-select>
          </div>
          <div class="chunk">
            <div class="chunk-text">赛程日期：</div>
            <el-date-picker
              v-model="filterData.beginDate"
              type="date"
              placeholder="请选择日期"
              :picker-options="dateRule[0]"
              :clearable="false"
            ></el-date-picker>
            <div>~</div>
            <el-date-picker
              v-model="filterData.endDate"
              type="date"
              placeholder="请选择日期"
              :picker-options="dateRule[1]"
              :clearable="false"
            ></el-date-picker>
          </div>
          <div class="chunk">
            <el-button type="primary" @click="loadData">查询</el-button>
          </div>
          <div class="chunk" @click="handleReset">
            <el-image :src="require('@/assets/accountManage/reset.png')"></el-image>
          </div>
        </div>
        <div class="chunk-wrap" @click="handleExport">
          <el-button class="chunk-button" style="background: #00AFFF; color: #ffffff">导出</el-button>
        </div>
      </div>
      <div class="detail">
        <div class="chunk-wrap">
            <div class="chunk">
            <div class="chunk-text">位置：</div>
            <el-select
              filterable
              placeholder="请选择位置"
              v-model="filterData.position"
              style="width: 224px"
              clearable
            >
              <el-option
                v-for="item in $dictionary.position"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <eventList
      :tableTitle="tableTitle"
      :tableData="tableData"
      type="salary"
      @view="handleViewGrade"
    ></eventList>
    <!-- 分页 -->
    <div v-if="page.count" class="page">
      <div>共{{ page.count }}个，每页{{ page.pageSize }}条数据</div>
      <div>
        <el-pagination background layout="prev, pager, next" :total="page.count"></el-pagination>
      </div>
    </div>
    <detailDialog v-bind="dialog" :refereeId="this.filterData.refereeId" v-model="dialog.value"></detailDialog>
  </div>
</template>
    <script>
import eventList from "@/components/eventCart/index.vue";
import detailDialog from "@/components/dialogSalary/index.vue";
import * as api_account from "@/api/account";

export default {
  name: "planView",
  components: {
    eventList,
    detailDialog
  },
  data() {
    return {
      filterData: {
        contestTypeId: parseInt(this.$route.query.contestTypeId), //赛事
        refereeId: this.$route.query.refereeId,
        position: "",
        contestName: "", //赛事名称
        beginDate: this.$moment()
          .add(-1, "month")
          .toDate(), //开始时间
        endDate: new Date() //结束时间
      },
      page: {
        count: 0,
        pageSize: 10,
        pageIndex: 1
      },
      dateRule: [
        {
          disabledDate: time =>
            this.filterData.endDate &&
            time.valueOf() > this.filterData.endDate.valueOf()
        },
        {
          disabledDate: time =>
            time.valueOf() < this.filterData.beginDate.valueOf()
        }
      ],
      contestTypeOptions: [],
      contestNameOptions: [],
      tableTitle: [
        "时间",
        "赛事",
        "队伍",
        "城市",
        "位置",
        "赛事薪资",
        "结算状态",
        "操作"
      ],
      tableData: [],
      dialog: {
        value: false,
        formData: {}
      }
    };
  },
  watch: {
    "filterData.contestTypeId"() {
      this.filterData.contestName = "";
      this.loadcontestName();
      if (this.page.pageIndex == 1) {
        this.loadData();
      } else {
        this.page.pageIndex = 1;
      }
    },
    "page.pageIndex"() {
      this.loadData();
    }
  },
  created() {
    if(this.$route.query.beginDate) {
      this.filterData.beginDate = this.$route.query.beginDate;
    }
    if(this.$route.query.endDate) {
      this.filterData.endDate = this.$route.query.endDate;
    }
  },
  mounted() {
    this.loadContestType();
    this.loadData()
  },
  methods: {
    loadData() {
      api_account.getRefereeScheduleList({
          ...this.filterData,
          beginDate: this.$moment(this.filterData.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
          page: this.page.pageIndex,
          pageNum: this.page.pageSize
        })
        .then(res => {
          if (res.success) {
            this.page.count = res.data.count;
            let weekList = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
            let sideList = ["", "A边", "B边"];
            this.tableData = res.data.rows.map(d => ({
              date: d.gameDate,
              week: weekList[d.dayOfWeek],
              children: d.schedule.map(d1 => ({
                ...d1,
                date: d.gameDate,
                time: d1.gameTime,
                match: d1.contestName,
                team1: d1.teamA,
                team2: d1.teamB,
                id: d1.userWorkScheduleId,
                price: d1.payAmount,
                status: d1.isPay,
                part: `${sideList[d1.side]}：${this.$dictionary.position.find(d2 => d2.value == d1.position)?.label || ""}}`,
                contestTypeId: this.filterData.contestTypeId
              }))
            }));
          }
        });
    },
    loadContestType() {
      api_account.getContestType({}).then(res => {
        console.log("类型:" + res);
        if (res.success) {
          this.contestTypeOptions = res.data.map(item => ({
            value: item.contestTypeId,
            label: item.contestTypeName,
            isSelect: item.isSelect
          }));
          if(!this.$route.query.contestTypeId) {
            let selectedIndex = this.contestTypeOptions.findIndex(
              d => d.isSelect
            );
            this.filterData.contestTypeId =
              this.contestTypeOptions[selectedIndex]?.value || "";
          }
        }
      });
    },
    loadcontestName() {
      api_account
        .getContestList({
          page: 1,
          pageNum: 100,
          isPublish: -1,
          contestTypeId: this.filterData.contestTypeId
        })
        .then(res => {
          this.contestNameOptions = res.data.map(item => ({
            contestId: item.contestId,
            contestName: item.name
          }));
        });
    },
    handleReset() {
      this.filterData.contestName = "";
      this.filterData.beginDate = this.$moment()
        .add(-1, "month")
        .toDate();
      this.filterData.endDate = new Date();
      this.page.pageIndex = 1;
    },
    handleSearch() {
      if (this.page.pageIndex == 1) {
        this.loadData();
      } else {
        this.page.pageIndex = 1;
      }
    },
    handleCancel() {
        this.$router.go(-1)
    },
    handleCurrentChange() {
      console.log(arguments);
    },
    handleViewGrade(item) {
      this.dialog.formData = item;
      this.dialog.value = true;
    },
    handleExport() {
        let sideList = ["", "A边", "B边"];
        api_account.getRefereeScheduleList({
          ...this.filterData,
          beginDate: this.$moment(this.filterData.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
          page: this.page.pageIndex,
          pageNum: this.page.pageSize
        }).then(res =>{
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../Excel/Export2Excel");
            const tHeader = [
              "时间",
              "赛事",
              "队伍",
              "城市",
              "位置",
              "赛事薪资",
              "结算状态",
            ]; // 上面设置Excel的表格第一行的标题
            const data = res.data.rows.reduce((res, val) => {
              // 添加年月日星期
              res.push([val.gameDate + " " + ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][val.dayOfWeek],"","","","","",""])
              res.push(...val.schedule.map(d => [
                d.gameTime, 
                d.contestName, 
                `${d.teamA} vs ${d.teamB}`, 
                d.city, 
                `${sideList[d.side]}：${this.$dictionary.position.find(d2 => d2.value == d.position)?.label || ""}`,
                d.payAmount,
                d.isPay ? "已结算" : "未结算"
              ]))
              return res;
            }, [])
            console.log(data)
            let fileName = `查看总排班量（${this.$route.query.refereeName}）`;
            export_json_to_excel(tHeader, data, fileName); //最后一个是表名字
          });
        })
      },
  }
};
</script>
    <style scoped lang="scss">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  &-left {
    display: flex;
    align-items: center;
  }
  .back {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #1d81ee;
    font-weight: 400;
    cursor: pointer;
    img {
      margin-right: 6px;
      width: 16px;
      height: 13px;
    }
  }
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
  &-button {
    width: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>