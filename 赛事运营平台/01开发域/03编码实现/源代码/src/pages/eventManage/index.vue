<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">赛事管理</div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div>赛事：</div>
            <el-select
              placeholder="请选择赛事"
              v-model="event"
              style="width: 160px"
              @change="changeContestType"
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
          <div class="chunk">
            <div>公开状态：</div>
            <el-select
              placeholder="请选择公开状态"
              v-model="state"
              style="width: 160px"
              @change="changePublicType"
            >
              <el-option
                v-for="item in publicTypeList"
                :key="item.publicName"
                :label="item.publicName"
                :value="item.publicId"
              >
              </el-option>
            </el-select>
          </div>
          <div class="chunk">
            <div class="chunk-text">赛事名称：</div>
            <el-input placeholder="请输入赛事名称" v-model="eventname"></el-input>
          </div>
          <div class="chunk">
            <el-button type="primary" @click="getMatchList">查询</el-button>
          </div>
          <div class="chunk" @click="reset">
            <el-image
              :src="require('@/assets/accountManage/reset.png')"
            ></el-image>
          </div>
        </div>
        <div class="chunk-wrap" @click="addConfig" v-if="currPermission">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="success"
            class="chunk-button"
            >新增</el-button
          >
        </div>
      </div>
    </div>
    <div class="box">
      <el-table
        ref="singleTable"
        :data="eventTable"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" align="center" width="100" fixed>
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          property="name"
          label="赛事名称"
          width="auto"
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          align="center"
          property="state"
          label="公开状态"
          width="auto"
          min-width="150"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.state == 1" class="tableState">
              <div class="tableOpen" style="background: #00b400"></div>
              <div style="color: #00b400">已公开</div>
            </div>
            <div v-else class="tableState">
              <div class="tableOpen" style="background: #ff005c"></div>
              <div style="color: #ff005c">未公开</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          property="salaryName"
          label="薪资配置"
          width="auto"
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <div class="tableOpera" v-if="currPermission">
              <div class="tableOpera-box" @click="editHandler(scope.$index)">
                <div class="tableEdit"></div>
                <div>编辑</div>
              </div>
              <div class="tableOpera-box" @click="deleteHandler(scope.$index)"
              >
                <div class="tableDelete"></div>
                <div>删除</div>
              </div>
              <div class="tableOpera-box" @click="matchHandler(scope.$index)">
                <div class="tableMatch"></div>
                <div>赛程</div>
              </div>
              <div class="tableOpera-box" @click="downloadHandler(scope.$index)">
                <div class="tableDownload"></div>
                <div>下载模板</div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="count" class="page">
        <div>共{{ count }}个，每页{{ limit }}条数据</div>
        <div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="count"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 编辑 -->
    <EditDialog v-model="dialogAdd" :eventOptions="options" :salaryOptions="salaryOptions" :formData="news" :title="dialogTitle"></EditDialog>
  </div>
  <!-- </div> -->
</template>
<script>
import dialogBox from "../../components/accountManage/dialog.vue";
import EditDialog from "./components/edit.vue"
import * as api_account from "../../api/account";

export default {
  name: "evevtManage",
  components: {
    dialogBox, EditDialog
  },
  data() {
    return {
      event: "", //赛事
      eventValue: "",
      eventname: "", //赛事名称
      state: "", //公开状态
      editActive: null, //选中编辑
      matchActive: null, //选中赛程
      downLoadActive: null, //选中下载
      btnIndex: null,
      contestEdit: false,
      count: 0,
      limit: 10,
      page: 10,
      currPage: 1,
      options: [],
      salaryOptions: [],
      eventTable: [],
      dialogAdd: false, //新增赛事弹窗
      dialogTitle: "", //弹窗标题
      dialogType: "", //弹窗类型
      news: {
        event: "", //新增弹窗内容
        name: "",
        status: "",
        contestId: "",
        salary: ""
      },
      publicTypeList: [
        {
          publicName: "全部",
          publicId: -1,
        },
        {
          publicName: "不公开",
          publicId: 0,
        },
        {
          publicName: "公开",
          publicId: 1,
        },
      ],
      userPermissionList: [],
      currPermission: false,
      saveData: {
        event: "",
        eventname: "",
        state: "",
      },
    };
  },
  watch: {
    dialogAdd(nowVal) {
      !nowVal && this.getMatchList();
    },
    event() {
      this.loadSalaryOptions()
    }
  },
  mounted() {

    this.getContestType();
  },
  methods: {
    getUserInfo() {
      this.userPermissionList = [];
      api_account.getUserInfo({}).then((res) => {
        if (res.success) {
          res.data.userPermission.forEach((item) => {
            this.userPermissionList.push({
              permissionId: item.permissionId,
              contestTypeId: item.contestTypeId,
              permissionTypeId: item.permissionTypeId,
              permissionName: item.permissionName,
            });
          });

          this.getContestType();
        }
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currPage = val;
      this.getMatchList();
    },
    editHandler(index) {
      this.editActive = index;
      this.btnIndex = 0;
      this.editConfig(index);
    },
    deleteHandler(index) {
      if (!this.currPermission) {
        return;
      }
      const contest = this.eventTable[index];
      this.$confirm(`确定要删除名称为${contest.contestName}的赛事吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api_account.matchDelete({
          contestId: contest.contestId
        }).then(res => {
          if(res.success) {
            this.$message.success(`删除赛事（${contest.contestName}）成功`)
          }
          this.getMatchList();
        })
      }).catch(() => {          
      });
    },
    matchHandler(index) {
      if (!this.currPermission) {
        return;
      }
      this.matchActive = index;
      this.btnIndex = 1;
      console.log("状态:" + this.eventTable[index].state);
      this.$router.push({
        path: "/event/eventAgent",
        query: {
          contestTypeId: this.event,
          contestId: this.eventTable[index].contestId,
          currPermission: this.currPermission,
          publish: this.eventTable[index].state,
          saveEvent: this.event,
          saveEventname: this.eventname,
          saveState: this.state,
        },
      });
    },

    downloadHandler(e) {
      if (!this.currPermission) {
        return;
      }
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../Excel/Export2Excel");
        const tHeader = [
          "比赛日",
          "比赛时间",
          "赛事阶段",
          "赛事进度",
          "队伍1",
          "队伍2",
          "比赛城市",
          "BO",
          ""
        ]; // 上面设置Excel的表格第一行的标题
        const filterVal = ["date", "time", "gameStage", "week", "teamA", "teamB", "city", "BO", "remark"]; // 上面的index、nickName、name是tableData里对象的属性key值
        const list = [{
          "date":"2022/05/01",
          "time":"17:00",
          gameStage: "季后赛",
          "week":"第一阶段",
          "teamA":"JDG",
          "teamB":"EDG",
          "city":"上海",
          "BO": "112",
          "remark":"(此为数据示例，请在上传文件之前删除)"
        }]; //把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list);
        let fileName = "赛事" + this.eventTable[e].name + "_赛程导入文件模板";
        export_json_to_excel(tHeader, data, fileName); //最后一个是表名字
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    addConfig() {
      if (!this.currPermission) {
        return;
      }
      // this.news = [];
      this.dialogTitle = "新增赛事";
      this.dialogType = "addNew";
      this.dialogAdd = true;
      this.contestEdit = false;
      this.news.name = "";
      this.news.salary = "";
    },
    editConfig(data) {
      if (!this.currPermission) {
        return;
      }
      console.log("状态:" + this.eventTable[data].state);
      this.news.name = this.eventTable[data].name;
      this.news.status = this.eventTable[data].state;
      this.news.contestId = this.eventTable[data].contestId;
      this.contestEdit = true;
      this.news.event = this.event;
      this.news.salary = this.eventTable[data].salaryId
      this.dialogTitle = "编辑赛事";
      this.dialogType = "editNew";
      this.dialogAdd = true;
    },
    changeContestType() {
      this.options.forEach((item) => {
        if (item.value == this.event) {
          this.eventValue = item.label;
          this.news.event = this.event;
          this.currPermission = item.isSelect;
        }
      });
      this.getMatchList();
    },
    changeContestType2() {
      console.log("选择赛事2:" + this.news.event);
    },
    changePublicType() {
      console.log("选择公开类型:" + this.state);
    },
    getContestType() {
      api_account.getContestType({}).then((res) => {
        console.log("返回结果:" + res);

        if (res.success) {
          this.options = [];
          res.data.forEach((item) => {
            this.options.push({
              value: item.contestTypeId,
              label: item.contestTypeName,
              isSelect: item.isSelect,
            });
            if (item.isSelect && !this.currPermission) {
              this.event = item.contestTypeId;
              this.currPermission = true;
            }
          });
          const {query} = this.$route;
          this.saveData.event = query.saveEvent ? parseInt(query.saveEvent) : this.event;
          this.saveData.eventname = query.saveEventname ? query.saveEventname : "";
          this.saveData.state = query.saveState ? parseInt(query.saveState) : -1;
          this.reset();

          this.news.event = this.event;
          this.options.forEach((i) => {
            if (i.value == this.event) {
              this.eventValue = i.label;
              this.currPermission = i.isSelect;
            }
          });
          this.getMatchList();
        }
      });
    },
    loadSalaryOptions() {
      api_account.getSalaryList({
          contestTypeId: this.event,
          pageNum: 100
      }).then(res => {
          if(res.success) {
              this.salaryOptions = res.data.list.rows
          }
      })
    },
    reset() {
      this.event = this.saveData.event;
      this.eventname = this.saveData.eventname;
      this.state = this.saveData.state;
    },
    getMatchList() {
      api_account
        .matchList({
          page: this.currPage,
          pageNum: this.limit,
          isPublish: this.state,
          contestTypeId: this.event,
          contestName: this.eventname,
        })
        .then((res) => {
          if (res.success) {
            this.count = res.data.list.count;
            this.eventTable = res.data.list.rows.map(d => ({
              ...d,
              name: d.contestName,
              state: d.isPublish,
            }))
          }
        });
    },
  },
};
</script>
<style scoped lang="css">
.detail {
  padding: 9px 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
.dialogBox-center {
  border-bottom: 1px solid #dde1e6;
  padding: 20px;
}
.dialogBox-contentList /deep/ .el-input {
  height: 40px;
  width: 224px;
  display: flex;
  align-items: center;
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
}

.chunk-text {
  min-width: 70px;
}

.chunk-button {
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tableOpen {
  width: 4px;
  height: 4px;
  margin-right: 5px;
}
.tableState {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-table {
  font-family: MicrosoftYaHei !important;
  color: #333333;
}
.box /deep/ .el-table thead {
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
}
.tableOpera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
}
.tableOpera-box {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.tableOpera-box:hover {
  color: #1d81ee;
}
.tableEdit {
  width: 14px;
  height: 14px;
  padding-right: 5px;
  background-image: url("../../assets/eventManage/edit.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.tableOpera-box:hover .tableEdit {
  background-image: url("../../assets/eventManage/edit_active.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.tableDelete {
  width: 14px;
  height: 14px;
  padding-right: 5px;
  background-image: url("../../assets/announcement/icon_delete_off.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.tableOpera-box:hover .tableDelete {
  background-image: url("../../assets/announcement/icon_delete_on.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.tableMatch {
  width: 14px;
  height: 14px;
  padding-right: 5px;
  background-image: url("../../assets/eventManage/course.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.tableOpera-box:hover .tableMatch {
  background-image: url("../../assets/eventManage/course_active.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.tableDownload {
  width: 14px;
  height: 14px;
  padding-right: 5px;
  background-image: url("../../assets/eventManage/download.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.tableOpera-box:hover .tableDownload {
  background-image: url("../../assets/eventManage/download_active.png");
  background-size: contain;
  background-repeat: no-repeat;
}
.box /deep/ .el-pager {
  font-family: Helvetica;
  color: #333333;
  font-weight: normal;
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
</style>