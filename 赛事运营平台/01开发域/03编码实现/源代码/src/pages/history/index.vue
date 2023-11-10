<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">执裁赛事维护</div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div>年份：</div>
            <el-input
              placeholder="请输入年份"
              v-model="filterData.year"
              style="width: 224px"
            ></el-input>
          </div>
          <div class="chunk">
            <div>赛事：</div>
            <el-input
              placeholder="请输入赛事"
              v-model="filterData.type"
              style="width: 224px"
              clearable
            ></el-input>
          </div>
          <div class="chunk">
            <div class="chunk-text">赛事名称：</div>
            <el-input
              placeholder="请输入赛事名称"
              v-model="filterData.name"
              style="width: 224px"
              clearable
            ></el-input>
          </div>
          <div class="chunk">
            <el-button type="primary" @click="loadData">查询</el-button>
          </div>
          <div class="chunk" @click="handleReset">
            <el-image
              :src="require('@/assets/accountManage/reset.png')"
            ></el-image>
          </div>
        </div>
        <div class="chunk-wrap" @click="handleAdd" v-if="currPermission">
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
        :data="tableData"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          align="center"
          property="year"
          label="年份"
          width="150px"
        >
          <template slot-scope="scope">
            <span style="padding: 40px 0">{{ scope.row.year }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          property="type"
          label="赛事类型"
          width="300px"
        >
        </el-table-column>
        <el-table-column
          align="center"
          property="name"
          label="赛事名称"
          width="auto"
          min-width="100px"
        >
        </el-table-column>
        <el-table-column
          v-if="currPermission"
          label="操作"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <div class="tableOpera">
              <div class="tableOpera-box" @click="handleEdit(scope.$index)">
                <div class="tableEdit"></div>
                <div>编辑</div>
              </div>
              <div class="tableOpera-box" @click="handleDelete(scope.$index)">
                <div class="tableDownload"></div>
                <div>删除</div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="pageCount" class="page">
        <div>共{{ pageCount }}个，每页{{ filterData.pageNum }}条数据</div>
        <div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="pageCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 编辑 -->
    <EditDialog
      v-model="dialogConfig.value"
      :typeOptions="editTypeOptions"
      :formData="dialogData"
      :title="dialogConfig.title"
      @confirm="handleDialogConfirm"
    ></EditDialog>
  </div>
  <!-- </div> -->
</template>
<script>
import EditDialog from "./components/edit.vue";
import dialogBox from "@/components/accountManage/dialog.vue";
import * as api_account from "../../api/account";

export default {
  name: "evevtManage",
  components: {
    EditDialog, dialogBox
  },
  data() {
    return {
      filterData: {
        //筛选条件
        year: this.$moment().format("YYYY"), // 年份
        type: "", // 赛事类型
        name: "", // 赛事名称
        pageNum: 10, //分页大小
        page: 1, //当前第几页
      },
      pageCount: 0, //所有数据的个数
      typeOptions: [
        { label: "全部", value: 0 },
        { label: "LOL", value: 1 },
        { label: "LOLM", value: 2 },
        { label: "VAL", value: 3 },
      ], //赛事类型列表
      tableData: [], // 列表数据
      currPermission: true,
      dialogConfig: {
        isAdd: true, // 是否为新增
        value: false, // 打开状态
        title: "历史赛事新增",
      },
      dialogData: {
        year: "",
        type: "",
        name: "",
      },
    };
  },
  computed: {
    editTypeOptions() {
      return this.typeOptions.filter((d) => d.value != 0);
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    // 获取列表数据
    loadData() {
      api_account.contestHistoryList(this.filterData).then((res) => {
        if (res.success) {
          this.pageCount = res.data.count;
          this.tableData = res.data.rows.map((d) => ({
            ...d,
            year: String(d.year),
          }));
        }
      });
    },
    //  点击重置按钮
    handleReset() {
      this.filterData.name = "";
      this.filterData.year = this.$moment().format("YYYY");
      this.filterData.type = ""
      this.loadData();
    },
    //  切换分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.filterData.page = val;
      this.loadData();
    },
    // 点击编辑按钮
    handleEdit(index) {
      const dialogData = this.tableData[index];
      this.dialogData = {
        id: dialogData.id,
        year: dialogData.year,
        type: dialogData.type || "",
        name: dialogData.name,
      };
      this.dialogConfig.isAdd = false;
      this.dialogConfig.value = true; // 打开状态
      this.dialogConfig.title = "历史赛事修改";
    },
    // 点击新增按钮
    handleAdd() {
      this.dialogData = {
        year: this.filterData.year,
        type: this.filterData.type || "",
        name: "",
      };
      this.dialogConfig.isAdd = true;
      this.dialogConfig.value = true; // 打开状态
      this.dialogConfig.title = "历史赛事新增";
    },
    // 点击删除按钮
    handleDelete(index) {
      const item = this.tableData[index];
      this.$confirm(`确认删除该条历史赛事（${item.type}-${item.name}）吗？`).then(() => {
        this.apiDeleteHistory(item.id).then(() => {
          this.loadData();
        })
      });
    },
    // 提交新增或修改赛事
    handleDialogConfirm() {
      let method = this.dialogConfig.isAdd ? this.apiAddhistory : this.apiEditHistory;
      // 添加或修改成功 关闭弹窗并刷新数据
      method().then(() => {
        this.dialogConfig.value = false;
        this.loadData();
      })
    },
    // 新增历史赛事
    apiAddhistory() {
      return new Promise((resolve, reject) => {
        api_account.contestHistoryAdd(this.dialogData)
        .then((res) => {
          if (res.success) {
            this.$message({
              message: "历史赛事新增成功",
              type: "success",
            });
            resolve()
          } else {
            reject()
          }
        });
      })
    },
    // 修改历史赛事
    apiEditHistory() {
      return new Promise((resolve, reject) => {
        api_account.contestHistoryEdit(this.dialogData)
        .then((res) => {
          if (res.success) {
            this.$message({
              message: "历史赛事修改成功",
              type: "success",
            });
            resolve()
          } else {
            reject()
          }
        });
      })
    },
    // 删除历史赛事
    apiDeleteHistory(id) {
      return new Promise((resolve, reject) => {
        api_account.contestHistoryDelete({
          id: id
        })
        .then((res) => {
          if (res.success) {
            this.$message({
              message: "历史赛事删除成功",
              type: "success",
            });
            resolve();
          }
        });
      })
    },
  },
};
</script>
<style scoped lang="scss">
.detail {
  padding: 9px 20px 20px 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-bottom: 0;
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
.dialogBox-contentList ::v-deep .el-input {
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
  flex-wrap: wrap;
}

.chunk {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  padding-left: 20px;
  margin-bottom: 20px;
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
.box ::v-deep .el-table thead {
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
}
.tableOpera {
  padding: 0 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.tableOpera-box {
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:last-of-type {
    margin-right: 0;
  }
}
.tableOpera-box:hover {
  color: #1d81ee;
}
.tableEdit {
  width: 14px;
  height: 14px;
  padding-right: 5px;
  background-image: url("../../assets/eventManage/edit.png");
}
.tableOpera-box:hover .tableEdit {
  background-image: url("../../assets/eventManage/edit_active.png");
}
.tableEditCover {
  background-image: url("../../assets/eventManage/edit_active.png") !important;
}
.tableMatch {
  width: 14px;
  height: 14px;
  padding-right: 5px;
  background-image: url("../../assets/eventManage/course.png");
}
.tableOpera-box:hover .tableMatch {
  background-image: url("../../assets/eventManage/course_active.png");
}
.tableMatchCover {
  background-image: url("../../assets/eventManage/course_active.png") !important;
}
.tableDownload {
  width: 14px;
  height: 14px;
  padding-right: 5px;
  background-image: url("~@/assets/common/icon_delete.png");
  background-size: contain;
}
.tableOpera-box:hover .tableDownload {
  background-image: url("~@/assets/common/icon_delete_active.png");
}
.tableDownloadCover {
  background-image: url("~@/assets/common/icon_delete_active.png") !important;
}
.box ::v-deep .el-pager {
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