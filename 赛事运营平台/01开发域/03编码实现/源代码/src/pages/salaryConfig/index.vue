<template>
  <div class="box" style="margin-bottom: 20px">
    <div class="title" style="justify-content: space-between">
      <div class="title-left">
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
        <div>薪资配置</div>
      </div>
      <button class="title-right" @click="handleClickAdd">
        <img src="@/assets/salary/icon_add.png" alt="" />
        新增配置
      </button>
    </div>
    <!-- table -->
    <div class="table">
      <div class="table-header">
        <span>薪资名</span>
        <span>操作</span>
      </div>
      <div class="table-main">
        <template v-if="salaryList.length">
          <div v-for="item in salaryList" :key="item.id">
            <div class="table-item">
              <span class="table-left">
                <img
                  v-if="!item.open"
                  @click="item.open = !item.open"
                  src="@/assets/salary/icon_open.png"
                  alt=""
                />
                <img
                  v-else
                  @click="item.open = !item.open"
                  src="@/assets/salary/icon_close.png"
                  alt=""
                />
                {{ item.salaryName }}
              </span>
              <span class="table-edit">
                <button @click="handleEdit(item)">
                  <img src="@/assets/salary/icon_edit.png" alt="" />
                  编辑
                </button>
                <button class="delete" @click="handleDelete(item)">
                  <img src="@/assets/salary/icon_delete.png" alt="" />
                  删除
                </button>
              </span>
            </div>
            <div v-if="item.open" class="child-table">
                <div class="child-table-header">
                    <span>BO</span>
                    <span>主裁判薪资</span>
                    <span>场上裁判薪资</span>
                    <span>场下裁判薪资</span>
                    <span v-if="showLeaderReferee">场下裁判Leader薪资</span>
                    <span v-if="showAssistantReferee">助理主裁判薪资</span>
                </div>
                <div class="child-table-item" v-for="(bo, boIndex) in item.salaryBos" :key="boIndex">
                    <span>{{bo.bo}}</span>
                    <span>{{bo.mainReferee}}元/场</span>
                    <span>{{bo.onReferee}}元/场</span>
                    <span>{{bo.offReferee}}元/场</span>
                    <span v-if="showLeaderReferee">{{bo.leaderReferee}}元/场</span>
                    <span v-if="showAssistantReferee">{{bo.assistantReferee}}元/场</span>
                </div>
            </div>
          </div>
        </template>
        <div class="nodata" v-else>
          <img src="@/assets/eventManage/nodata.png" alt="" />
          <p>暂无列表信息</p>
        </div>
      </div>
    </div>
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
    <!-- 编辑 -->
    <EditDialog v-model="editDialog.value" v-bind="editDialog"></EditDialog>
    <!-- 删除确认提醒 -->
    <dialogBox :popup.sync="deleteDialog.value" @cancelOrConfirm="deleteMethod">
        <span class="edit-confirm">确定要删除该薪资配置吗？</span>
    </dialogBox>
  </div>
</template>
  <script>
import dialogBox from "@/components/accountManage/dialog.vue";
import EditDialog from "./components/edit.vue";
import * as api_account from "../../api/account";
export default {
  name: "salaryConfig",
  components: {
    dialogBox,
    EditDialog,
  },
  data() {
    return {
      filterData: {
        contestTypeId: "",
      },
      page: {
        pageSize: 10,
        pageIndex: 1,
        count: 0,
      },
      contestType: [],
      salaryList: [],
      editDialog: {
        value: false,
        title: "新增薪资配置",
        contestTypeOptions: [],
        formData: {
          contestTypeId: "",
          salaryName: "",
          salaryId: "",
          bo: [],
        },
      },
      deleteDialog: {
        value: false,
        cacheSalaryId: ""
      }
    };
  },
  watch: {
    filterData: {
      handler(nowVal) {
        if (this.page.pageIndex != 1) {
          this.page.pageIndex = 1;
        } else {
          this.loadData();
        }
        this.editDialog.formData.contestTypeId = nowVal.contestTypeId;
      },
      deep: true,
    },
    "page.pageIndex"() {
      this.loadData();
    },
    "editDialog.value"(nowVal) {
        this.loadData()
    }
  },
  created() {
    this.getContestType();
  },
  computed: {
    // 显示场下裁判leader
    showLeaderReferee() {
      return this.filterData.contestTypeId == 2
    },
    // 显示主力主裁判
    showAssistantReferee() {
      return this.filterData.contestTypeId == 2 || this.filterData.contestTypeId == 3
    }
  },
  methods: {
    loadMore() {
      if (!this.loadFinished) {
        this.page.pageIndex++;
      }
    },
    loadData() {
      if (this.page.pageIndex == 1) {
        this.playerList = [];
      }
      api_account
        .getSalaryList({
          ...this.filterData,
          page: this.page.pageIndex,
          pageNum: this.page.pageSize,
        })
        .then((res) => {
          if (res.success) {
            this.page.count = parseInt(res.data.list.count || 0);
            this.salaryList = res.data.list.rows.map((d) => ({
              ...d,
              open: false,
              salaryBos: d.salaryBos.map(d1 => ({
                ...d1,
                lock: true
              }))
            }));
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
          this.editDialog.contestTypeOptions = this.contestType;
          let selectedIndex = this.contestType.findIndex((d) => d.isSelect);
          selectedIndex < 0 && (selectedIndex = 0);
          this.filterData.contestTypeId = this.contestType[selectedIndex].value;
        }
      });
    },
    handleReset() {
      this.filterData = {
        contestTypeId: "",
      };
      this.page.pageIndex = 1;
    },
    handleRefresh() {
      if (this.page.pageIndex != 1) {
        this.page.pageIndex = 1;
      } else {
        this.loadData();
      }
    },
    handleClickAdd() {
      this.editDialog.title = "新增薪资配置";
      this.editDialog.formData.salaryName = "";
      this.editDialog.formData.salaryId = "";
      this.editDialog.formData.bo = [];
      this.editDialog.value = true;
    },
    handleEdit(item) {
        this.editDialog.title = "编辑薪资配置";
        this.editDialog.formData.salaryName = item.salaryName;
        this.editDialog.formData.salaryId = item.id;
        this.editDialog.formData.bo = item.salaryBos;
        this.editDialog.value = true;
    },
    handleDelete(item) {
        this.deleteDialog.cacheSalaryId = item.id;
        this.deleteDialog.value = true;
    },
    deleteMethod(type) {
        type == "confirm" && api_account.deleteSalary({
            salaryId: this.deleteDialog.cacheSalaryId
        }).then(res => {
            res.success && this.loadData()
        })
    }
  },
};
</script>
  
  <style scoped lang="scss">
.title {
  justify-content: space-between;
  &-left {
    display: flex;
    align-items: center;
  }
  &-right {
    padding: 0 15px;
    display: flex;
    align-items: center;
    background: #20bd20;
    border-radius: 4px;
    border: 0;
    height: 40px;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
    img {
      margin-right: 6px;
      width: 16px;
      height: 16px;
    }
  }
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
  margin-right: 10px;
}

.chunk-wrap ::v-deep .el-button--primary {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chunk ::v-deep .el-button {
  width: 90px;
  background: #1d81ee;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chunk-text {
  min-width: 70px;
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
.table {
  margin: 20px;
  width: calc(100% - 40px);
  min-height: 455px;
  font-size: 14px;
  color: #333333;
  overflow: auto;
  &-header,
  &-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    min-height: 54px;
    span {
      width: 0;
      flex: 1;
      text-align: center;
    }
  }
  &-header {
    position: sticky;
    top: 0;
    font-weight: bold;
    color: #666666;
    background-color: #fafafa;
    span {
      &:first-of-type {
        text-align: left;
        padding-left: 74px;
      }
      &:last-of-type {
        text-align: right;
        padding-right: 93px;
      }
    }
  }
  &-left {
    padding-left: 20px;
    display: flex;
    font-weight: bold;
    img {
      margin-right: 20px;
      height: 16px;
      width: 16px;
      cursor: pointer;
    }
  }
  &-edit {
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
  &-main {
    display: flex;
    flex-direction: column;
    min-height: 400px;
    .nodata {
      flex: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 0;
      img {
        margin-bottom: 20px;
        width: 90px;
        height: auto;
      }
      p {
        color: #999999;
        font-size: 14px;
      }
    }
  }
}
.child-table {
    margin: 0 auto;
    padding: 0 20px;
    width: calc(100% - 40px);
    max-height: 400px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #e8e8e8;
    &-header, &-item {
        flex: none;
        display: flex;
        align-items: center;
        width: 100%;
        height: 53px;
        color: #333333;
        font-family: Helvetica;
        border-bottom: 1px dashed #e8e8e8;
        &:last-of-type {
            border-bottom: 0;
        }
        span {
            width: 0;
            flex: 1;
            text-align: center;
        }
    }
    &-header {
        position: sticky;
        top: 0;
        color: #666666;
        font-family: MicrosoftYaHei;
    }
}
.edit-confirm {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-size: 14px;
    line-height: 24px;
    color: #333333;
  }
</style>
  