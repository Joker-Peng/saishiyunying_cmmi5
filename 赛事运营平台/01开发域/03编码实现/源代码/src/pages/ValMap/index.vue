<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">VAL地图管理仓库</div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div>地图名称：</div>
            <el-input placeholder="请输入地图名称" v-model="search.nameEn" style="width: 224px"></el-input>
          </div>
          <div class="chunk">
            <div>状态：</div>
            <el-select v-model="search.status" placeholder="请选择状态">
              <el-option label="全部" value="-1"> </el-option>
              <el-option label="未启用" value="0"> </el-option>
              <el-option label="已启用" value="1"> </el-option>
            </el-select>
          </div>
          <div class="chunk">
            <el-button type="primary" @click="getList">查询</el-button>
          </div>
          <div class="chunk" @click="handleReset">
            <el-image :src="require('@/assets/accountManage/reset.png')"></el-image>
          </div>
        </div>
        <div class="chunk-wrap" @click="handleAdd({status: 0})">
          <el-button icon="el-icon-circle-plus-outline" type="success" class="chunk-button">新增</el-button>
        </div>
      </div>
    </div>
    <div class="box" style="padding-top: 10px;">
      <div class="tip" v-show="list.filter(m => m.status).length !== 7"> 地图必须启用7张，请合理的选择地图 </div>
      <el-table :data="list" highlight-current-row style="width: 100%">
        <el-table-column label="序号" type="index" width="85" align="center" />
        <el-table-column label="地图名称" prop="nameEn" align="center" />
        <el-table-column label="中文名称" prop="nameCn" align="center" />
        <el-table-column label="状态" align="center">
          <template v-slot="{row}">
            <div class="status" @click="onStatus(row)">
              <img v-if="row.status" src="@/assets/announcement/icon_status_on.png" alt="">
              <img v-else src="@/assets/announcement/icon_status_off.png" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template v-slot="{row}">
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
    <el-dialog center :title="`${params.id ? '编辑' : '新增'}地图`" :visible.sync="dialogVisible" width="30%">
      <div class="con">
        <div class="item">地图名称：<el-input placeholder="请输入地图名称" v-model="params.nameEn" /></div>
        <div class="item">中文名称：<el-input placeholder="请输入中文名称" v-model="params.nameCn" /></div>
        <div class="item">地图状态：
          <div class="status" style="margin: 0;" @click="params.status = params.status === 1 ? 0 : 1">
            <img v-if="params.status" src="@/assets/announcement/icon_status_on.png" alt="">
            <img v-else src="@/assets/announcement/icon_status_off.png" alt="">
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {mapsList, mapsUpt} from "@/api/reportApi";

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
    getList() {
      mapsList({paging: 0, ...this.search}).then((res) => {
        this.list = res.data?.rows || [];
      });
    },
    onStatus(row) {
      const length = this.list.filter(m => m.status).length;
      this.$confirm(`确认${row.status ? '禁用' : '启用'}地图${row.nameEn}？`, '温馨提示', {center: true, type: 'warning'})
        .then(() => {
          if (!row.status && length > 6) {
            this.$confirm(`地图最多启用7张，请先禁用其地图在启用本地图`, '温馨提示', {center: true, type: 'error'});
          } else {
            mapsUpt({
              ...row, status: row.status ? 0 : 1
            }, 'edit').then(res => {
              if (res.success) {
                this.$message.success(`地图仓库${row.status ? '禁用' : '启用'}成功`);
                this.getList();
              }
            });
          }
        });
    },
    onSave() {
      const length = this.list.filter(m => m.status).length;
      // if (length > 6 && !this.params.id) {
      //   const config = {center: true, type: 'warning'};
      //   this.$confirm(`地图最多启用7张，请先禁用其地图再新增本地图`, '温馨提示', config)
      //     .then(() => {}).catch(() => {});
      // }
      mapsUpt(this.params, this.params.id ? 'edit' : 'add').then(res => {
        this.dialogVisible = false;
        if (res.success) {
          this.$message.success(`地图仓库${this.params.id ? '编辑' : '新增'}成功`);
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
    handleDelete({id, nameEn, nameCn}) {
      const config = {center: true, type: 'warning'};
      this.$confirm(`确认删除地图 ${nameEn}（${nameCn}）吗？`, '温馨提示', config).then(() => {
        mapsUpt({id}, "delete").then(res => {
          res.success ? this.$message.success("地图仓库删除成功") : this.$message.error(res.data);
          this.getList();
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
.box {
  position: relative;

  .tip {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    color: #fff;
    text-align: center;
    background-color: red;
    opacity: .6;
    font-size: 16px;
    line-height: 36px;
    z-index: 9;
  }
}

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

.status {
  margin: 0 auto;
  width: 52px;
  height: 22px;
  cursor: pointer;

  img {
    width: inherit;
    height: inherit;
  }
}
</style>
