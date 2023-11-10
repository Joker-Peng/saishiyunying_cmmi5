<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">VAL问题类型管理</div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div>问题类型：</div>
            <el-input placeholder="请输入问题类型" v-model="search.type" style="width: 224px"></el-input>
          </div>
          <div class="chunk">
            <el-button type="primary" @click="getList">查询</el-button>
          </div>
          <div class="chunk" @click="handleReset">
            <el-image :src="require('@/assets/accountManage/reset.png')"></el-image>
          </div>
        </div>
        <div class="chunk-wrap" @click="handleAdd({})">
          <el-button icon="el-icon-circle-plus-outline" type="success" class="chunk-button">新增</el-button>
        </div>
      </div>
    </div>
    <div class="box">
      <el-table :data="list" highlight-current-row style="width: 100%">
        <el-table-column label="序号" type="index" width="85" align="center" />
        <el-table-column label="问题类型" prop="type" align="center" />
        <el-table-column label="操作" align="center" width="200">
          <template v-slot="{ row }">
            <div class="tableOpera">
              <div class="tableOpera-box" @click="handleAdd(row)">
                <div class="tableEdit"></div>
                <div>编辑</div>
              </div>
              <div class="tableOpera-box" @click="handleDelete(row)">
                <div class="tableDownload"></div>
                <div>删除</div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog center :title="`${params.id ? '编辑' : '新增'}问题类型`" :visible.sync="dialogVisible" width="30%">
      <div style="padding:15px 24px 0;">
        <div style="margin-bottom: 20px;">问题类型：</div>
        <el-input placeholder="请输入问题类型" v-model="params.type" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {IssueTypes, IssueTypesUpt} from "@/api/reportApi";

export default {
  name: "ValMap",
  data() {
    return {
      search: {},
      list: [],
      dialogVisible: false,
      params: {},
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    // 获取列表数据
    getList() {
      IssueTypes(this.search).then((res) => {
        this.list = res.data?.rows || [];
      });
    },
    onSave() {
      IssueTypesUpt(this.params, this.params.id ? 'edit' : 'add').then(res => {
        this.dialogVisible = false;
        if (res.success) {
          this.$message.success(`${this.params.id ? '编辑' : '新增'}成功`);
          this.getList();
        }
      });
    },
    //  点击重置按钮
    handleReset() {
      this.search = {};
    },
    // 点击新增按钮
    handleAdd(val) {
      this.dialogVisible = true;
      this.params = {...val};
    },
    // 点击删除按钮
    handleDelete({id}) {
      this.$confirm(`确认删除？`, '温馨提示', {center: true, type: 'warning'}).then(() => {
        IssueTypesUpt({id}, 'delete').then(res => {
          res.success ? this.$message.success("删除成功") : this.$message.error(res.data);
          this.getList();
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.con {
  .item {
    display: flex;
    padding: 10px 30px;
    align-items: center;

    .el-input {
      width: calc(100% - 84px);
    }
  }
}

.detail {
  padding: 9px 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.el-table {
  font-family: MicrosoftYaHei !important;
  color: #333333;
}

// .box ::v-deep .el-table thead {
//   font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
//   font-weight: bold;
//   color: #333333;
// }

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
</style>
