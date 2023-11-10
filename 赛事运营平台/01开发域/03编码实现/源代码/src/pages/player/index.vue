<template>
  <div v-if="isMobile()">
    <img @click="handleOpenFilter" class="player-mobile-filter" src="@/assets/player/icon_mobile_filter.png" alt="">
        <van-list
        @load="loadMore"
        offset="0"
        v-model="loading"
        :finished="loadFinished"
        finished-text="没有更多了"
        >
            <van-pull-refresh v-model="loading" @refresh="handleSearch">
                <playerItem v-for="playerItem in playerList" :key="playerItem.id" :value="playerItem" class="player-mobile" @seeImage="handleSeeImage"></playerItem>
            </van-pull-refresh>
        </van-list>
        <FilterComp v-model="showFilter" :filter="filterData" @search="handleSearch">
          <div class="search-item">
            <p>{{title}}</p> 
            <el-select
              placeholder="请选择赛事"
              v-model="filterData.contestTypeId"
              :disabled="disabledContestTypeId"
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
        </FilterComp>
  </div>
  <div v-else class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title" style="justify-content: start">
        <div class="chunk">
          <el-select
            placeholder="请选择赛事"
            v-model="filterData.contestTypeId"
            :disabled="disabledContestTypeId"
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
        <div>{{title}}</div>
      </div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div class="chunk-text">比赛昵称：</div>
            <el-input placeholder="请输入比赛昵称" v-model="filterData.gameName" style="width: 224px"></el-input>
          </div>
          <div class="chunk">
            <div class="chunk-text">俱乐部：</div>
            <el-input placeholder="请输入俱乐部昵称" v-model="filterData.teamDes" style="width: 224px"></el-input>
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
      </div>
    </div>
    <div class="main">
        <template v-if="playerList.length">
          <playerItem class="play-item" v-for="playerItem in playerList" :key="playerItem.id" :value="playerItem" @seeImage="handleSeeImage"></playerItem>
        </template>
        <div class="nodata" v-else>
          <img src="@/assets/eventManage/nodata.png" alt="" />
          <p>暂无列表信息</p>
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
    <dialogBox title="查看选手头像" :popup.sync="imgDialog.value" :showFooter="false" :showClose="true" width="960px" top="100" class="dialog">
      <img class="dialog-img" :src="imgDialog.src" alt="">
    </dialogBox>
  </div>
</template>
<script>
import playerItem from "./component/player.vue"  
import dialogBox from "@/components/accountManage/dialog.vue";
import FilterComp from "./component/filter.vue"
import { ImagePreview } from 'vant';
import * as api_account from "@/api/account";
export default {
  name: "player",
  components: {
    dialogBox, playerItem, FilterComp
  },
  data() {
    return {
        disabledContestTypeId: false,
        filterData: {
            contestTypeId: "",
            gameName: "",
            teamDes: ""
        },
        showFilter: false,
        page: {
            pageSize: 12,
            pageIndex: 1,
            count: 0
        },
        contestType: [],
        playerList: [],
        imgDialog: {
          value: false,
          src: ""
        },
        loading: false
    };
  },
  computed: {
    loadFinished() {
        return this.page.pageIndex * this.page.pageSize >= this.page.count
    },
    title() {
      return  this.$route.query.teamDes ? `查看队伍选手` : "选手管理";
    }
  },
  watch: {
    "filterData.contestTypeId": {
        handler(nowVal) {
            if(this.page.pageIndex != 1) {
                this.page.pageIndex = 1;
            } else {
                this.loadData();
            }
        },
        deep: true
    },
    "page.pageIndex"() {
        this.loadData();
    }
  },
  created() {
    this.disabledContestTypeId = Boolean(this.$route.query.contestTypeId);
    this.filterData.teamDes = this.$route.query.teamDes || "";
    this.filterData.contestTypeId = parseInt(this.$route.query.contestTypeId) || "";
    this.getContestType();
  },
  methods: {
    loadMore() {
        if(!this.loadFinished) {
            this.page.pageIndex++;
        }
    },
    loadData() {
        this.loading = true;
        if(this.page.pageIndex == 1) {
            this.playerList = [];
        }
        api_account.getPlayerList({
            ...this.filterData,
            page: this.page.pageIndex,
            pageNum: this.page.pageSize
        }).then(res => {
            this.loading = false
            if(res.success) {
                this.page.count = parseInt(res.data.count || 0);
                if(this.isMobile()) {
                    this.playerList = [...this.playerList, ...res.data.list];
                } else {
                    this.playerList = res.data.list
                }
            }
        })
    },
    getContestType() {
        api_account.getContestType({}).then(res => {
            if (res.success) {
                this.contestType = res.data.map(item => ({
                    value: item.contestTypeId,
                    label: item.contestTypeName,
                    isSelect: item.isSelect
                }));
                if(!this.filterData.contestTypeId) {
                  let selectedIndex = this.contestType.findIndex(d => d.isSelect);
                  selectedIndex < 0 && (selectedIndex = 0);
                  this.filterData.contestTypeId = this.contestType[selectedIndex].value
                }
            }
        });
    },
    handleReset() {
        this.filterData.gameName = "";
        this.filterData.teamDes = "";
        this.page.pageIndex = 1;
    },
    handleSearch() {
        if(this.page.pageIndex != 1) {
            this.page.pageIndex = 1;
        } else {
            this.loadData();
        }
    },
    handleOpenFilter() {
      this.showFilter = true
    },
    handleSeeImage(img) {
        if(this.isMobile()) {
            ImagePreview([img]);
        } else {
          this.imgDialog.value = true;
          this.imgDialog.src = img;
        }
    }
  }
};
</script>
<style lang="scss" scoped>
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
.main {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .nodata {
      flex: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 0;
      height: 400px;
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
    .play-item {
      width: calc(33% - 6px);
      &:nth-of-type(3n) {
        margin-right: 0px;
      }
    }
}
.player-mobile {
    margin-right: 0;
    width: 100vw;
    border-radius: 0;
    &-filter {
        position: fixed;
        top: 13px;
        right: 16px;
        height: 20px;
        width: 20px;
        z-index: 2;
    }
}
.dialog-img {
  margin: 20px 160px;
  width: 640px;
  height: auto;
}
</style>
  