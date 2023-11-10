<template>
  <div v-if="isMobile()" style="background-color: #f5f8fb">
    <!-- 类型筛选 -->
    <div class="mobile-filter">
      <p @click="() => (selecting = !selecting)">公告类型<i :class="selecting ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" ></i></p>
      <div v-show="selecting">
        <div :class="{active: type.value == filterData.type}" v-for="type in typeOptions" :key="type.value" @click="handleSelectType(type.value)">{{type.label}}</div>
      </div>
    </div>
    <div class="mobile-list">
      <!-- 蒙尘 -->
      <div v-show="selecting" class="gray" @click="() => (selecting = !selecting)"></div>
      <van-list
        @load="loadMore"
        offset="0"
        v-model="loading"
        :finished="loadFinished"
        finished-text=""
      >
        <van-pull-refresh v-model="loading" @refresh="handleSearch">
          <div class="nodata" v-if="!announcement.length">
            <img src="@/assets/eventManage/nodata.png" alt="" />
            <p>暂无列表信息</p>
          </div>
          <template v-else>
            <message v-for="item in announcement" :key="item.id" v-bind="item" :isMobile="isMobile()" @actionMessage="handlePreview"></message>
          </template>
          </van-pull-refresh>
      </van-list>
    </div>
  </div>
  <div v-else>
    <div class="page-container">
      <div class="title">
        公告管理
        <el-select
          v-if="$route.meta.permission == 'readonly'"
          clearable
          placeholder="请选择公告类型"
          v-model="filterData.type"
          style="width: 191px; color: #999"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <template v-if="$route.meta.permission != 'readonly'">
        <div class="detail">
          <div class="chunk-wrap">
            <div class="chunk">
              <div style="width: 5em; text-align:right">标题：</div>
              <el-input placeholder="请输入标题" v-model="filterData.title" style="width: 224px"></el-input>
            </div>
            <div class="chunk">
              <div>创建人：</div>
              <el-input placeholder="请输入创建人" v-model="filterData.createdBy" style="width: 224px"></el-input>
            </div>
    
            <div class="chunk">
              <div>发布状态：</div>
              <el-select
                clearable
                placeholder="请选择发布状态"
                v-model="filterData.status"
                style="width: 160px"
              >
                <el-option
                  v-for="item in statusList"
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
          <div class="chunk-wrap" @click="handleClickAdd">
            <el-button
              icon="el-icon-circle-plus-outline"
              type="success"
              class="chunk-button"
              >新增</el-button
            >
          </div>
        </div>
        <div class="detail">
          <div class="chunk-wrap">
            <div class="chunk">
              <div style="width: 5em; text-align:right">公告类型：</div>
              <el-select
                clearable
                placeholder="请选择公告类型"
                v-model="filterData.type"
                style="width: 224px"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="nodata" v-if="!announcement.length">
            <img src="@/assets/eventManage/nodata.png" alt="" />
            <p>暂无列表信息</p>
          </div>
          <template v-else>
            <message v-for="item in announcement" :key="item.id" v-bind="item" :isMobile="isMobile()" @actionMessage="handlePreview"></message>
          </template>
        </div>
        <div v-if="page.count && announcement.length" class="page" style="padding-bottom: 10px">
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
      </template>
    </div>
    <div class="box" v-if="$route.meta.permission != 'readonly'">
        <el-table
          ref="singleTable"
          :data="announcement"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" align="center" width="100">
          </el-table-column>
          <el-table-column
            align="center"
            property="title"
            label="标题"
            width="auto"
            min-width="25%"
          >
          </el-table-column>
          <el-table-column
            align="center"
            property="createdBy"
            label="创建人"
            width="auto"
            min-width="15%"
          >
          </el-table-column>
          <el-table-column
            align="center"
            property="typeStr"
            label="公告类型"
            width="auto"
            min-width="15%"
          >
          </el-table-column>
          <el-table-column
            align="center"
            property="createdAt"
            label="创建时间"
            width="auto"
            min-width="15%"
          >
            <template slot-scope="scope">
              {{$moment(scope.row.createdAt).format("YYYY-MM-DD HH:mm")}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            property="createdAt"
            label="发布状态"
            width="auto"
            min-width="25%"
          >
            <template slot-scope="scope">
              <div class="status" @click="handleChangeStatus(scope.row)">
                <img v-if="scope.row.status" src="@/assets/announcement/icon_status_on.png" alt="">
                <img v-else src="@/assets/announcement/icon_status_off.png" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="280"
          >
            <template slot-scope="scope">
              <div class="handle">
                <span class="handle-view" @click="handlePreview(scope.row)">预览</span>
                <span class="handle-edit" @click="handleEdit(scope.row)">编辑</span>
                <span class="handle-delete" @click="handleDelete(scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="page.count" class="page page-padding">
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
      <!-- 发布 -->
    <release v-model="releaseDialog.value" v-bind="releaseDialog" @confirm="handleRelease"></release>
  </div>
</template>
<script>
import pagination from "@/components/pagination";
import * as api_account from "@/api/account";
import dialogBox from "@/components/accountManage/dialog.vue";
import release from "./components/release.vue"
import Message from "./components/message.vue"
import { Picker, Button, Icon } from "vant";
export default {
  components: { pagination, dialogBox, release, Message, Picker, Button, Icon },
  data() {
    return {
      filterData: {
        title: "",
        createdBy: "",
        status: "-1",
        type: 0
      },
      statusList: [
        {
          value: "0",
          label: "未发布",
        },
        {
          value: "1",
          label: "已发布",
        },
        {
          value: "-1",
          label: "全部"
        }
      ], //发布状态
      // 公告类型1日常公告 2处罚公告 3比赛公告
      typeOptions: [
        {label: "全部", value: 0},
        {label: "日常公告", value: 1},
        {label: "处罚公告", value: 2},
        {label: "比赛公告", value: 3},
      ],
      page: {
        pageSize: 10,
        pageIndex: 1,
        count: 0
      },
      loading: false,
      announcement: [],
      releaseDialog: {
        value: false,
        announcementId: ""
      },
      selecting: false, //移动端正在选择公告类型
    };
  },
  computed: {
    loadFinished() {
      return this.page.pageIndex * this.page.pageSize >= this.page.count
    }
  },
  watch: {
    "page.pageIndex"() {
        this.loadData();
    },
    "filterData.type"() {
      // 如果非管理员或者是移动端，没有搜索按钮，切换公告类型自动搜索
      if(this.$route.meta.permission != 'readonly' && !this.isMobile()) {
        return
      }
      this.handleSearch();
    }
  },
  created() {
    this.loadData();
  },

  methods: {
    loadMore() {
      this.loadFinished || this.page.pageIndex++;
    },
    loadData() {
      this.loading = true;
      if(this.page.pageIndex == 1) {
        this.announcement = []
      }
      let api = api_account.getAnnouncementListView;
      let params = {
        page: this.page.pageIndex,
        pageNum: this.page.pageSize
      }
      if(this.$route.meta.permission != 'readonly') {
        params = {...this.filterData, ...params}
        api = api_account.getAnnouncementList
      }
      api(params).then(res => {
        this.loading = false;
        if(res.success) {
          this.page.count = res.data?.list?.count || 0;
          // 如果有数据
          if(res.data?.list?.rows?.length) {
            const list = res.data.list.rows;
            list.forEach(d => {
              d.createdAt = d.createdAt || new Date(d.publishedAt),
              d.typeStr = this.typeOptions.find(d1 => d1.value == d.type)?.label || "";
            })
            if(this.isMobile()) {
              this.announcement = [ ...this.announcement, ...list]
            } else {
              this.announcement = list
            }
          }
        }
      })
    },
    handleSelectType(value) {
      this.filterData.type = value;
    },
    handleSearch() {
      if(this.page.pageIndex == 1) {
        this.loadData()
      } else {
        this.page.pageIndex = 1;
      }
    },
    handleReset() {
      this.filterData = {
        title: "",
        createdBy: "",
        status: "-1",
        type: 0
      }
      this.page.pageIndex = 1;
    },
    handleRefresh() {
      if(this.page.pageIndex != 1) {
        this.page.pageIndex = 1;
      } else {
        this.loadData();
      }
    },
    handleChangeStatus(row) {
      // 取消发布
      if(row.status) {
        this.handleRelease({
          announcementId: row.id,
          status: 0,
          smsNotify: 0
        })
      } else {
        // 打开弹窗确认发布
        this.releaseDialog.announcementId = row.id;
        this.releaseDialog.value = true
      }
    },
    handleRelease(params) {
      api_account.releaseAnnouncement(params).then(res => {
        if(res.success) {
          this.$message.success("修改成功");
          // 前端修改发布状态
          let selectedItem = this.announcement.find(d => d.id == params.announcementId);
          selectedItem && (selectedItem.status = params.status)
        }
      })
    },
    handlePreview(row) {
      let query = {};
      this.$route.meta.permission != 'readonly' && (query.userId = this.$store.getters.userInfo.id);
      let href = this.$router.resolve({path:`/announcement/view/${row.id}`, query: query}).href;
      window.open(href)    },
    handleClickAdd() {
      this.$router.push(`/noticeList/edit/0`)
    },
    handleEdit(row) {
      this.$router.push(`/noticeList/edit/${row.id}`)
    },
    handleDelete(row) {
      this.$confirm("确认删除该公告吗？").then(() => {
        api_account.deleteAnnouncement({
          announcementId: row.id
        }).then(res => {
          if (res.success) {
            this.$message({
              message: "删除公告成功",
              type: "success",
            });
            this.loadData();
          }
        })
      }).catch(() => {});
    }
  },
};
</script>

<style scoped lang="scss">
.page-container {
  padding-bottom: 0;
}
.mt-20 {
  margin-top: -20px;
}
.title {
  position: relative;
  right: 20px;
  bottom: 20px;
  padding: 20px;
  width: 100%;
  border-bottom: 1px solid #eef2f7;
  margin-bottom: -20px;
  ::v-deep input {
    color: #999999
  }
}
.page {
  padding-top: 10px;
  display: flex;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #999999;
  align-items: center;
  justify-content: space-between;
  &-padding {
    padding: 20px 20px 20px 40px 
  }
}
.detail {
  padding: 10px 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:last-of-type {
    padding-bottom: 20px;
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
  padding-right: 20px;
}

.buttonH5 {
  height: 44px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
}
.searchButtonH5 {
  width: 50px;
  height:30px;
  background-color: #1D81EE;
  color: white;
  font-size: 15px;
  text-align: center;
  line-height: 30px;
  border-radius: 3px;
  margin-right: 10px;
}
.resetButton{
  width: 30px;
  height:30px;
  background-image: url("~@/assets/accountManage/reset.png") !important;
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
  margin-right: 17px;
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
.handle {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 19px;
  span:last-of-type {
    margin-right: 0!important;
  }
  &-view {
    display: flex;
    align-items: center;
    margin-right: 40px;
    cursor: pointer;
    &:before {
      content: " ";
      display: block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
      background-image: url(~@/assets/announcement/icon_see_off.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    &:hover {
      color: #1D81EE;
      &:before {
        background-image: url(~@/assets/announcement/icon_see_on.png);
      }
    }
  }
  &-edit {
    display: flex;
    align-items: center;
    margin-right: 40px;
    cursor: pointer;
    &:before {
      content: " ";
      display: block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
      background-image: url(~@/assets/announcement/icon_edit_off.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    &:hover {
      color: #1D81EE;
      &:before {
        background-image: url(~@/assets/announcement/icon_edit_on.png);
      }
    }
  }
  &-delete {
    display: flex;
    align-items: center;
    margin-right: 40px;
    cursor: pointer;
    &:before {
      content: " ";
      display: block;
      margin-right: 5px;
      width: 14px;
      height: 14px;
      background-image: url(~@/assets/announcement/icon_delete_off.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    &:hover {
      color: #1D81EE;
      &:before {
        background-image: url(~@/assets/announcement/icon_delete_on.png);
      }
    }
  }
}
.nodata {
  height: 400px;
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
.mobile-filter {
  position: relative;
  flex: none;
  p {
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 36px;
    color: #666666;
    font-size: 12px;
  }
  > div {
    position: absolute;
    top: 36px;
    left: 0;
    right: 0;
    padding: 0 20px;
    background: #ffffff;
    z-index: 9;
    div {
      border-bottom: 1px solid #ECEEF4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      color: #333333;
      font-size: 14px;
      &:last-of-type {
        border-bottom: 0;
      }
      &.active {
        color: #1D81EE;
        &::after {
          content:" ";
          display: block;
          height: 20px;
          width: 20px;
          background-image: url(~@/assets/announcement/icon_checked.png);
          background-size: contain;
        }
      }
    }
  }
}
.mobile-list  {
  position: relative;
  height: 0;
  flex: auto;
  overflow: auto;
  .gray {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 5;
  }
}
</style>
