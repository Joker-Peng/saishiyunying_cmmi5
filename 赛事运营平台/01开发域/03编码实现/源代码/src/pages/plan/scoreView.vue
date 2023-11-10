<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">
        <div class="title-left">
          <div class="chunk">
            <el-select
              placeholder="请选择赛事"
              disabled
              v-model="filterData.contestTypeId"
              style="width: 224px"
            >
              <el-option
                v-for="item in contestTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <span>查看评分（{{ $route.query.refereeName }}）</span>
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
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </div>
          <div class="chunk" @click="handleReset">
            <el-image
              :src="require('@/assets/accountManage/reset.png')"
            ></el-image>
          </div>
        </div>
        <div class="chunk-wrap" v-if="$store.getters.permission.some(d => d.permissionTypeId == 1)">
          <el-button
            @click="handleAdd"
            class="chunk-button"
            style="background: #20BD20; color: #ffffff"
            >新增评分</el-button
            >
            <el-button
            @click="handleExport"
            class="chunk-button"
            style="background: #00afff; color: #ffffff"
            >导出</el-button
          >
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
          <div class="chunk">
            <div class="chunk-text">评分类型：</div>
            <el-select
              filterable
              placeholder="请选择评分类型"
              v-model="filterData.judgeType"
              style="width: 224px"
              clearable
            >
              <el-option
                v-for="item in judgeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="500"
      :row-style="{ color: '#333333', 'font-size': '14px' }"
      :header-cell-style="{
        'background-color': 'transparent',
        'font-weight': 'bold',
        color: '#333333',
      }"
    >
      <el-table-column
        align="center"
        prop="judgeDate"
        label="时间"
        width="auto"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="judgeType"
        label="评分类型"
        width="auto"
      >
        <template slot-scope="scope">
          <span>{{ getJudgeName(scope.row.judgeType) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="position" label="位置" width="auto">
        <template slot-scope="scope">
          <span>{{ getPositionName(scope.row.position) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="scoreType"
        label="加减分"
        width="auto"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.scoreType ? "加分" : "减分" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分值" align="center">
        <template slot-scope="scope">
          <span :class="scope.row.scoreType ? 'green' : 'red'">{{
            (scope.row.scoreType ? "+" : "-") + scope.row.score
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="评分详情"
        prop="content"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="200px" v-if="$store.getters.permission.some(d => d.permissionTypeId == 1)">
        <template slot-scope="scope">
          <div class="table-edit">
            <button @click="handleEdit(scope.row)">
              <img src="@/assets/salary/icon_edit.png" alt />
              编辑
            </button>
            <button class="delete" @click="handleDelete(scope.row)">
              <img src="@/assets/salary/icon_delete.png" alt />
              删除
            </button>
          </div>
        </template>
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
        ></el-pagination>
      </div>
    </div>
    <dialogBox :popup.sync="dialog.value" @cancelOrConfirm="handleCloseDeleteDialog">
      <span class="dialogBox-content">确定要删除该其他评分吗？</span>
    </dialogBox>
    <editScore v-model="editScore.value" v-bind="editScore" :contestTypeOptions="contestTypeOptions"></editScore>
  </div>
</template>
<script>
import * as api_account from "@/api/account";
import dialogBox from "@/components/accountManage/dialog.vue";
import editScore from "./components/editScore.vue"
export default {
  name: "scoreView",
  components: {
    dialogBox, editScore
  },
  data() {
    return {
      filterData: {
        contestTypeId: parseInt(this.$route.query.contestTypeId), //赛事
        refereeId: this.$route.query.refereeId,
        position: "",
        contestName: "", //赛事名称
        beginDate: this.$moment().add(-1, "month").toDate(), //开始时间
        endDate: new Date(), //结束时间
        judgeType: "",
      },
      page: {
        count: 0,
        pageSize: 10,
        pageIndex: 1,
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
      contestTypeOptions: [],
      contestNameOptions: [],
      judgeTypeOptions: [
        { label: "赛事评分", value: "1" },
        { label: "其他评分", value: "2" },
      ],
      tableData: [],
      dialog: {
        value: false,
        cacheSelected: {}
      },
      editScore: {
        value: false,
        title: `(${this.$route.query.refereeName})其他评分`,
        filterData: {
          contestTypeId: parseInt(this.$route.query.contestTypeId),
          refereeId: parseInt(this.$route.query.refereeId),
          scoreLogId: "",
          scoreType: "",
          score: "",
          content: ""
        },
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
    },
    "editScore.value"(nowVal) {
      !nowVal && this.loadData()
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
  },
  methods: {
    getJudgeName(value) {
      let temp = this.judgeTypeOptions.find((d) => d.value == value);
      return temp?.label || "-";
    },
    getPositionName(value) {
      let temp = this.$dictionary.position.find((d) => d.value == value);
      return temp?.label || "-";
    },
    loadData() {
      api_account
        .getRefereeScoreList({
          ...this.filterData,
          beginDate: this.$moment(this.filterData.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
          page: this.page.pageIndex,
          pageNum: this.page.pageSize,
        })
        .then((res) => {
          if (res.success) {
            this.page.count = res.data.count;
            this.tableData = res.data.rows;
          }
        });
    },
    loadContestType() {
      api_account.getContestType({}).then((res) => {
        console.log("类型:" + res);
        if (res.success) {
          this.contestTypeOptions = res.data.map((item) => ({
            value: item.contestTypeId,
            label: item.contestTypeName,
            isSelect: item.isSelect,
          }));
          if (!this.filterData.contestTypeId) {
            let selectedIndex = this.contestTypeOptions.findIndex(
              (d) => d.isSelect
            );
            this.filterData.contestTypeId =
              this.contestTypeOptions[selectedIndex]?.value || "";
          } else {
            this.loadData();
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
          contestTypeId: this.filterData.contestTypeId,
        })
        .then((res) => {
          this.contestNameOptions = res.data.map((item) => ({
            contestId: item.contestId,
            contestName: item.name,
          }));
        });
    },
    handleReset() {
      this.filterData.contestName = "";
      this.filterData.position = "";
      this.filterData.judgeType = ""
      this.filterData.beginDate = this.$moment().add(-1, "month").toDate();
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
    handleEdit(item) {
      this.editScore.filterData.scoreLogId = item.id;
      this.editScore.filterData.scoreType = item.scoreType;
      this.editScore.filterData.score = item.score;
      this.editScore.filterData.content = item.content;
      this.editScore.value = true;
    },
    handleAdd() {
      this.editScore.filterData.scoreLogId = "";
      this.editScore.filterData.scoreType = "";
      this.editScore.filterData.score = 0;
      this.editScore.filterData.content = "";
      this.editScore.value = true;
    },
    handleDelete(item) {
      this.dialog.cacheSelected = item;
      this.dialog.value = true;
    },
    handleCancel() {
      this.$router.go(-1);
    },
    handleCloseDeleteDialog(type) {
      if(type == "confirm") {
        api_account.deleteRefereeOtherScore({
          userId: this.$store.getters.userInfo.id,
          scoreLogId: this.dialog.cacheSelected.id
        }).then(res => {
          if(res.success) {
            this.$message.success("删除成功")
            this.loadData()
          }

        })
      }
    },
    handleExport() {
      api_account
        .getRefereeScoreList({
          ...this.filterData,
          beginDate: this.$moment(this.filterData.beginDate).format(
            "YYYY-MM-DD"
          ),
          endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
          page: this.page.pageIndex,
          pageNum: this.page.pageSize,
          isExport: 1
        })
        .then((res) => {
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../Excel/Export2Excel");
            const tHeader = [
              "时间",
              "评分类型",
              "位置",
              "加减分",
              "分值",
              "评分详情",
            ]; // 上面设置Excel的表格第一行的标题
            const data = res.data.rows.reduce((res, val) => {
              // 添加年月日星期
              res.push([
                val.judgeDate,
                this.getJudgeName(val.judgeType), 
                this.getPositionName(val.position),
                val.scoreType ? "加分" : "减分",
                (val.scoreType ? "+" : "-") + val.score,
                val.content
              ])
              return res;
            }, [])
            console.log(data)
            let fileName = `查看评分（${this.$route.query.refereeName}）`;
            export_json_to_excel(tHeader, data, fileName); //最后一个是表名字
          });
        })
      },
  },
};
</script>
      <style scoped lang="scss">
.green {
  color: #00b400;
}
.red {
  color: #ff005c;
}
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
.table-edit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    margin-right: 10px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    height: 32px;
    border: 1px solid #1d81ee;
    color: #1d81ee;
    background-color: transparent;
    border-radius: 4px;
    cursor: pointer;
    img {
      margin-right: 10px;
      width: 14px;
      height: 14px;
    }
    &.delete {
      color: #ff005c;
      border-color: #ff005c;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>