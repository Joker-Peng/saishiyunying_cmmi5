<template>
  <div class="boxWrap" v-if="!isMobile()">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">裁判名单</div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div class="chunk-text">姓名：</div>
            <el-input placeholder="请输入姓名" v-model="filterData.refereeName"></el-input>
          </div>
          <div class="chunk">
            <div class="chunk-text">裁判编码：</div>
            <el-input placeholder="请输入裁判编码" v-model="filterData.refereeNumber"></el-input>
          </div>
          <div class="chunk">
            <div>所属赛事：</div>
            <el-select
              placeholder="请选择赛事"
              multiple
              v-model="filterData.contestTypeId"
            >
              <el-option
                v-for="item in $dictionary.contestType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
        <div class="chunk-wrap">
          <div class="chunk">
            <div>身份：</div>
            <el-select placeholder="请选择身份" multiple v-model="filterData.position">
              <el-option
                v-for="item in $dictionary.position"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div v-if="hasPermission" class="chunk">
            <div style="padding-left: 2em">状态：</div>
            <el-select
              placeholder="请选择状态"
              v-model="filterData.refereeStatus"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    
    <div class="main">
      <nodata v-if="list.length == 0"></nodata>
      <template  v-for="referee in list">
        <refereeView v-if="!hasPermission" class="referee-view" :value="referee" :key="referee.id"></refereeView>
        <refereeEdit class="referee-edit" v-else :value="referee" :key="referee.id" @change="loadData"></refereeEdit>
      </template>
    </div>

    <div v-if="page.count" class="page">
      <div>
        共{{ Math.ceil(page.count / page.pageNum) }}页，每页{{ page.pageNum }}条数据
      </div>
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="page.pageNum"
          :total="page.count"
          :current-page.sync="page.page"
        >
        </el-pagination>
      </div>
    </div>
  </div>
  <div v-else>
    <img @click="handleOpenFilter" class="mobile-filter" src="@/assets/player/icon_mobile_filter.png" alt="">
    <van-list
      @load="loadMore"
      offset="0"
      v-model="loading"
      :finished="loadFinished"
      finished-text="没有更多了"
      >
        <van-pull-refresh v-model="loading" @refresh="handleSearch">
          <refereeView class="referee-mobile" v-for="referee in list" :value="referee" :key="referee.id"></refereeView>
        </van-pull-refresh>
    </van-list>
    <FilterComp v-model="showFilter" :filterData="filterData" :statusOptions="statusOptions" @search="handleSearch">
    </FilterComp>
  </div>
</template>
<script>
import dialogBox from "../../components/accountManage/dialog.vue";
import FilterComp from "./components/filter.vue"
import nodata from "@/components/nodata"
import * as api_account from "../../api/account";
import RefereeView from "./components/refereeView.vue"
import RefereeEdit from './components/refereeEdit.vue';
export default {
  name: "accountManage",
  components: {
    dialogBox, RefereeView, nodata, FilterComp, RefereeEdit
  },
  created() {
    this.loadData();
  },

  data() {
    return {
      showFilter: false,
      filterData: {
        refereeName: "", //裁判姓名
        refereeName: "", //裁判编号
        contestTypeId: [], //所属赛事
        position: [], //身份
        refereeStatus: "", //状态
      },
      page: {
        pageNum: 10,
        page: 1,
        count: 0
      },
      statusOptions: [
        {label: "全部", value: ""},
        ...this.$dictionary.refereeStatus
      ], //状态列表
      list: [],
      loading: false,
    };
  },
  watch: {
    "page.page"() {
      this.loadData()
    }
  },
  computed: {
    loadFinished() {
        return this.page.page * this.page.pageNum >= this.page.count
    },
    // 是否有管理元权限
    hasPermission() {
      return this.$route.meta.permission != "readonly"
    }
  },
  methods: {
    loadMore() {
      if(!this.loadFinished) {
          this.page.page++;
      }
    },
    //获取账号列表
    loadData() {
      let params = {
        ...this.filterData,
        page: this.page.page,
        pageNum: this.page.pageNum,
        contestTypeId: this.filterData.contestTypeId.join(","),
        position: this.filterData.position.join(",")
      }
      this.loading = true
      api_account.getRefereeListV3(params).then((res) => {
        this.loading = false;
        res.data.list.rows.forEach(d => {
          d.refereeNumber && (d.refereeNumber = "REF" + d.refereeNumber);
        })
        if (res.success) {
          if(this.isMobile()) {
            this.list = [...this.list, ...res.data.list.rows]
          } else {
            this.list = res.data.list.rows;
          }
          this.page.count = res.data.list.count;
        }
      });
    },
    //点击查询按钮
    handleSearch() {
      if(this.page.page == 1) {
        this.list = [];
        this.loadData()
      } else {
        this.page.page = 1;
      }
    },
    handleReset() {
      this.filterData = {
        refereeName: "", //裁判姓名
        refereeName: "", //裁判编号
        contestTypeId: [], //所属赛事
        position: [], //身份
        refereeStatus: "", //状态
      }
      this.handleSearch();
    },
    handleOpenFilter() {
      this.showFilter = true
    },


    //账号封禁
    accountForbidden() {
      api_account
        .accountForbidden({
          accountId: this.currentPerson.userId,
        })
        .then((res) => {
          if (res.success) {
            //封禁成功
            this.$message.success("封禁成功");
            this.currentPerson = {};
            this.currentPersonDetail = {};
            this.identSelect = [];
            this.permissionSelect = [];
            this.getAccountlist();
          }
        });
    },

    //账号审核 不通过/封禁
    accountAuthUnpass() {
      api_account
        .accountAuth({
          accountId: this.currentPerson.userId,
          status: 0,
        })
        .then((res) => {
          if (res.success) {
            this.currentPerson = {};
            this.currentPersonDetail = {};
            this.identSelect = [];
            this.permissionSelect = [];
            this.getAccountlist();
          }
        });
    },

  },
};
</script>
<style scoped lang="less">
.main {
  display: flex;
  flex-wrap: wrap;
  .referee-view {
    flex: auto;
    margin-right: 10px;
    margin-bottom: 10px;
    width: 595px;
    box-sizing: border-box;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }
  .referee-mobile {
    width: calc(100vw - 30px);
    margin: 15px;
  }
}
.mobile-filter {
  position: fixed;
  top: 13px;
  right: 16px;
  height: 20px;
  width: 20px;
  z-index: 2;
}
.detail-list-left {
  flex: 4;
}
.dialogBox-contentList /deep/ .area-select {
  background: #f5f7fa !important;
  cursor: not-allowed !important;
  border-color: #e4e7ed !important;
  color: #c0c4cc !important;
  margin-left: 0px;
}
.dialogBox-center {
  border-bottom: 1px solid #dde1e6;
  padding: 18px;
}
.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
.dialogBox-contentList {
  width: 80%;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #666666;
  padding-bottom: 10px;
}

.dialogBox-contentList span {
  width: 100px;
}

.dialogBox-checkname {
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
  margin-right: 62px;
  padding-left: 10px;
}
.dialogBox-check {
  display: flex;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #666666;
}
.dialogBox-checkout .el-checkbox {
  margin-bottom: 15px;
}
.dialogBox-checkout .el-checkbox:nth-child(2),
.dialogBox-checkout .el-checkbox:nth-child(3),
.dialogBox-checkout .el-checkbox:nth-child(11),
.dialogBox-checkout .el-checkbox:nth-child(12) {
  margin-left: 2px;
}
.dialogBox-checkout .el-checkbox:nth-child(8) {
  margin-left: -1px;
}
.limitCheck {
  margin-right: 10px !important;
  margin-bottom: 15px !important;
}
.limitmr .el-checkbox-group:nth-child(1) .limitCheck:nth-child(2) {
  margin-left: 13px !important;
}
.limitmr .el-checkbox-group:nth-child(1) .limitCheck:nth-child(3) {
  margin-left: 14px !important;
}
.limitmr .el-checkbox-group:nth-child(1) .limitCheck:nth-child(4) {
  margin-left: 15px !important;
}
.dialogBox-checkout {
  display: flex;
}
.dialogBox-checkout /deep/ .el-checkbox {
  margin-bottom: 15px;
}
.detail-time {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 500;
  color: #999999;
}
.detail {
  padding: 20px;
  padding-top: 9px;
}
.detail-list {
  padding: 20px;
  display: flex;
}
.detail-list-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #666666;
  font-size: 14px;
  margin-bottom: 16px;
}
.detail-split {
  height: 104px;
  border-right: 1px solid #e7e7e7;
  margin: auto 20px;
}

.detail-list-logo {
  display: flex;
  font-family: MicrosoftYaHei;
  flex-shrink: 0;
  margin-right: 10px;
}
.detail-list-logo /deep/ .el-image__inner {
  width: auto !important;
  height: auto !important;
}
.detail-list-text {
  font-family: Helvetica;
}
.detail-list-tip {
  margin-left: 7px;
}
.detail-list-idot {
  width: 4px;
  height: 4px;
  margin-right: 7px;
}
.detail-list-center {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
}
.chunk-text {
  min-width: 42px;
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
  min-width: 42px;
}
.el-input {
  height: 40px;
  width: 224px;
  display: flex;
  align-items: center;
}
.el-select {
  width: 224px;
}
.detail-list-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.detail-list-handle {
  width: 79px;
  height: 32px;
  border-radius: 2px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.detail-list-handle div {
  margin-left: 5px;
}

.page {
  display: flex;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #999999;
  align-items: center;
  justify-content: space-between;
}
.identityList {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 14px;
  margin-left: 10px;
}

.contestTypeName {
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
  width: 74px;
}
.dialogBox-checkout /deep/ .el-checkbox__label {
  margin-left: 2px;
  padding-left: 0px;
}
.dialogBox-checkout /deep/ .el-checkbox {
  margin-right: 0;
  margin-bottom: 0;
  width: 120px;
}
.dialogBox-checkout /deep/ .el-checkbox:nth-child(3) {
  margin-right: 0;
  width: 90px;
}
.chunk /deep/ .el-select__tags {
  flex-wrap: nowrap;
  overflow: hidden;
}
.referee-edit {
  margin: 10px 0;
  width: 100%;
}
</style>
