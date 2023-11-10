<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">账号管理</div>
      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div class="chunk-text">姓名：</div>
            <el-input placeholder="请输入姓名" v-model="name"></el-input>
          </div>
          <div class="chunk">
            <div>所属赛事：</div>
            <el-select
              placeholder="请选择赛事"
              multiple
              v-model="selectContestTypeIdArray"
            >
              <el-option
                v-for="item in competitionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="chunk">
            <div>身份：</div>
            <el-select placeholder="请选择身份" multiple v-model="selectIdentityArray">
              <el-option
                v-for="item in identityList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="chunk">
            <el-button type="primary" @click="searchAction">查询</el-button>
          </div>
          <div class="chunk" @click="cancelAllSelect">
            <el-image
              :src="require('@/assets/accountManage/reset.png')"
            ></el-image>
          </div>
        </div>
        <div class="chunk-wrap" style="margin-top: 10px">
          <div class="chunk">
            <div>权限：</div>
            <el-select
              placeholder="请选择权限"
              multiple
              v-model="selectPermissionArray"
            >
              <el-option
                v-for="item in permissionTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="chunk" style="padding-left: 49px">
            <div>状态：</div>
            <el-select placeholder="请选择状态" clearable v-model="selectState">
              <el-option
                v-for="item in statusList"
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
    <div class="box" v-for="(item, index) in list" :key="index">
      <div class="title" style="font-size: 16px">
        <div>{{ item.name }}</div>
        <div class="detail-time">最近修改时间：{{ item.updatedAt }}</div>
      </div>
      <div class="detail-list">
        <div class="detail-list-left">
          <div class="detail-list-content">
            <div class="detail-list-logo">
              <el-image
                :src="require('../../assets/accountManage/tel.png')"
                fit="cover"
              ></el-image>
              <div class="detail-list-tip">手机</div>
            </div>
            <div class="detail-list-text">{{ item.mobile }}</div>
          </div>
          <div class="detail-list-content">
            <div class="detail-list-logo">
              <el-image
                :src="require('../../assets/accountManage/email.png')"
              ></el-image>
              <div class="detail-list-tip">邮箱</div>
            </div>
            <div>{{ item.email }}</div>
          </div>
          <div class="detail-list-content">
            <div class="detail-list-logo">
              <el-image
                :src="require('../../assets/accountManage/ident.png')"
              ></el-image>
              <div class="detail-list-tip">身份</div>
            </div>
            <div class="overflow-hidden detail-list-identity"><span :title="item.identity">{{ item.identity }}</span></div>
          </div>
          <div class="detail-list-content">
            <div class="detail-list-logo">
              <el-image
                :src="require('../../assets/accountManage/limit.png')"
              ></el-image>
              <div class="detail-list-tip">权限</div>
            </div>
            <div class="overflow-hidden detail-list-identity"><span :title="item.permission">{{ item.permission }}</span></div>
          </div>
        </div>
        <div class="detail-split"></div>
        <div class="detail-list-center">
          <div
            class="detail-list-idot"
            :style="{'background-color': getColor(item)}"
          ></div>
          <div :style="{color: getColor(item)}">
            {{getText(item)}}
          </div>
        </div>
        <div class="detail-split"></div>
        <div class="detail-list-right">
          <!-- 账号封禁 -->
          <div v-if="item.forbidden">
            <div
              class="detail-list-handle"
              style="
                border: 1px solid #126bee;
                color: #126bee;
              "
              @click="unblockEvent(item)"
            >
              <el-image
                :src="require('../../assets/accountManage/edit.png')"
              ></el-image>
              <div>解封</div>
            </div>
          </div>
          <!-- 待审核1，2 -->
          <div
            v-else-if="
              item.status === 1 || item.status === 2
            "
          >
            <div
              class="detail-list-handle"
              style="
                border: 1px solid #00b400;
                color: #00b400;
                margin-top: 10px;
              "
              @click="checkEvent(item)"
            >
              <el-image
                :src="require('../../assets/accountManage/pass.png')"
              ></el-image>
              <div>审核</div>
            </div>
          </div>
          <!-- 已通过3，5 -->
          <div v-else-if="item.status == 3 || item.status == 5">
            <div
              class="detail-list-handle"
              style="border: 1px solid #ff005c; color: #ff005c"
              @click="blockEvent(item)"
            >
              <el-image
                :src="require('../../assets/accountManage/block.png')"
              ></el-image>
              <div>封禁</div>
            </div>
            <div
              class="detail-list-handle"
              style="
                border: 1px solid #126bee;
                color: #126bee;
                margin-top: 10px;
              "
              @click="editEvent(item)"
            >
              <el-image
                :src="require('../../assets/accountManage/edit.png')"
              ></el-image>
              <div>编辑</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalNumber" class="page">
      <div>
        共{{ Math.ceil(totalNumber / pageNum) }}页，每页{{ pageNum }}条数据
      </div>
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageNum"
          :total="totalNumber"
          :current-page="page"
          @current-change="currentPageChange"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 二次确认 -->
    <dialogBox
      :popup.sync="popup"
      :type="dialogType"
      @callback="dialogeClose"
      @cancelOrConfirm="cancelOrConfirm"
    >
      <div class="dialogBox-content">{{ dialogMessage }}</div>
    </dialogBox>
    <!-- 编辑 -->
    <dialogBox
      :popup.sync="dialogEdit"
      :title="dialogTitle"
      width="600px"
      top="10vh"
      @cancelOrConfirm="editCancelOrConfirm"
      :permissionSelect="permissionSelect"
      :identSelect="identSelect"
      :city="this.currentPersonDetail.city"
    >
      <div class="dialogBox-center" v-if="dialogEdit">
        <div>
          <div class="dialogBox-contentList">
            <span>姓名：</span>
            <el-input
              v-model="currentPersonDetail.name"
              :disabled="true"
              placeholder="请输入内容"
              size="small"
            ></el-input>
          </div>
          <div class="dialogBox-contentList">
            <span>手机号：</span>
            <el-input
              v-model="currentPersonDetail.mobile"
              :disabled="true"
              placeholder="请输入内容"
              size="small"
            ></el-input>
          </div>
        </div>

        <div class="dialogBox-contentList">
          <span>常驻城市：</span>
          <!-- <area-select
            class="citySelect"
            :level="1"
            type="text"
            placeholder="请选择地区"
            v-model="currentPersonDetail.city"
            :data="pcaa"
            :disabled="dialogType === 'pass' ? true : false"
          ></area-select> -->

          <el-select
            placeholder="请选择地区"
            v-model="currentPersonDetail.city"
            class="citySelect"
            :disabled="true"
          >
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.city"
              :value="item.city"
            >
            </el-option>
          </el-select>
        </div>
        <div class="dialogBox-contentList">
          <div><span style="color: red">*</span>身份</div>
        </div>
        <div>
          <div
            class="identityList"
            v-for="(item, index) in allIdentityList"
            :key="index"
          >
            <div class="contestTypeName">{{ item.contestTypeName }}</div>
            <div>
              <div class="dialogBox-checkout">
                <el-checkbox-group v-model="identSelect">
                  <el-checkbox
                    :label="identity.identityName"
                    v-for="(identity, identityIndex) in item.identityList"
                    :key="identityIndex"
                    :disabled="dialogType === 'pass' ? true : false"
                  ></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div class="dialogBox-contentList">
          <div><span style="color: red">*</span>权限</div>
        </div>
        <div class="dialogBox-check">
          <div class="dialogBox-checkname" style="margin-right: 30px">
            <div
              v-for="item in allPermissionList"
              style="width: 60px; margin-bottom: 15px"
            >
              {{ item.permissionTypeName }}
            </div>
          </div>
          <div class="limitmr">
            <el-checkbox-group
              v-model="permissionSelect"
              v-for="(item, index) in allPermissionList"
            >
              <el-checkbox
                :label="item1.permissionName"
                v-for="item1 in item.permissionList"
                :disabled="item1.disabled"
                class="limitCheck"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </dialogBox>
    <!-- 通过 -->
  </div>
</template>
<script>
import dialogBox from "../../components/accountManage/dialog.vue";
import { area } from "@/utils/area-data";
import * as api_account from "../../api/account";
export default {
  name: "accountManage",
  components: {
    dialogBox,
  },

  created() {
    this.getAccountlist();
    this.getIdentityList();
    this.getPermissionList();
    this.getCityList();
  },

  data() {
    return {
      //查询筛选
      name: "", //姓名
      selectContestTypeIdArray: [], //当前所属赛事Id
      selectIdentityArray: "", //身份
      selectPermissionArray: [], //权限
      selectState: "", //状态
      competitionList: this.$dictionary.contestType.filter(d => d.isSuperAdmin), //所属赛事字典
      identityList: this.$dictionary.position, //身份字典
      permissionTypeList: this.$dictionary.permission, //权限字典
      statusList: [
        {
          value: "1",
          label: "待审核",
        },
        {
          value: "2",
          label: "已通过",
        },
        {
          value: "3",
          label: "未通过",
        },
        {
          value: "4",
          label: "已封禁",
        },
      ], //状态列表
      page: 1, //当前页
      pageNum: 5, //每页数量
      totalNumber: 0, //数据总数
      pcaa: area,
      currentPerson: {}, //当前操作的用户对象
      currentPersonDetail: {}, //当前操作对象详情
      list: [],
      popup: false, //二次确认弹窗
      dialogTitle: "", //弹窗标题
      dialogMessage: "", //弹窗内容
      dialogType: "", //弹窗类型
      dialogEdit: false, //编辑弹窗
      cancelConfirm: "cancel", //点击弹窗取消或确认
      allIdentityList: [], //全部的身份列表编辑用 接口源数据
      allPermissionList: [], //全部的身份列表编辑用 接口源数据
      identSelect: [],
      permissionSelect: [],
      cityList: [], //全部城市列表
    };
  },
  methods: {
    getColor(item) {
      if(item.forbidden) {
        return '#FF005C'
      }
      if(item.status === 1 || item.status === 2 || item.status === 6) {
        return '#FF7E00'
      }
      if(item.status == 3 || item.status == 5) {
        return '#00B400'
      }
      if(item.status == 4) {
        return "#FF005C" 
      }
    },
    getText(item) {
      if(item.forbidden) {
        return "已封禁"
      }
      if(item.status === 1 || item.status === 2 || item.status === 6) {
        return "待审核"
      }
      if(item.status == 3 || item.status == 5) {
        return "已通过"
      }
      if(item.status == 4) {
        return "未通过"
      }
    },
    //获取城市列表
    getCityList() {
      api_account.cityList().then((res) => {
        if (res.success) {
          this.cityList = res.data.list;
        }
      });
    },
    //身份列表
    getIdentityList() {
      api_account.getIdentityList().then((res) => {
        if (res.success) {
          this.allIdentityList = res.data.list;
        }
      });
    },

  
    //权限列表
    getPermissionList() {
      api_account.getPermissionList().then((res) => {
        if (res.success) {
          this.allPermissionList = res.data.list;
        }
      });
    },

    //当前页码改变
    currentPageChange(e) {
      this.page = e;
      this.getAccountlist();
    },
    //点击查询按钮
    searchAction() {
      this.page = 1;
      this.getAccountlist();
    },
    //获取账号列表
    getAccountlist() {
      var params = {};
      params.page = this.page;
      params.pageNum = this.pageNum;
      if (this.name !== "") {
        params.name = this.name;
      }
      if (this.selectContestTypeIdArray.length > 0) {
        params.contestTypeId = this.selectContestTypeIdArray.join(",");
      }
      if (this.selectIdentityArray.length > 0) {
        params.position = this.selectIdentityArray.join(",");
      }
      if (this.selectPermissionArray.length > 0) {
        params.permissionTypeId = this.selectPermissionArray.join(",");
      }
      if (this.selectState !== "") {
        params.status = this.selectState;
      }
      api_account.getAccountList(params).then((res) => {
        if (res.success) {
          this.list = res.data.list.rows;
          this.totalNumber = res.data.list.count;
        }
      });
    },

    //弹窗取消或确认
    cancelOrConfirm(e) {
      this.cancelConfirm = e;
      if (this.dialogType == "edit") {
        //编辑
        if (e == "confirm") {
          this.dialogEdit = false
          this.accountEdit();
        } else {
          this.dialogType = "edit";
          this.dialogTitle = "账号编辑";
          this.dialogEdit = true;
        }
      }

      if (this.dialogType == "pass") {
        //通过
        if (e == "confirm") {
          this.dialogEdit = false
          this.accountAuthPass();
        } else {
          this.dialogType = "pass";
          this.dialogTitle = "选择权限";
          this.dialogEdit = true;
        }
      }

      if (this.dialogType == "refuse") {
        if (e == "confirm") {
          //拒绝refuse
          this.accountAuthUnpass();
        }
      }

      if (this.dialogType == "block") {
        if (e == "confirm") {
          //封禁操作block
          this.accountForbidden();
        }
      }

      if (this.dialogType == "cancelEdit") {
        if (e == "cancel") {
          //取消编辑提示弹窗 点击了取消
          this.dialogType = "edit";
          this.dialogTitle = "账号编辑";
        } else {
          this.dialogEdit = false;
        }
      }

      if (this.dialogType == "cancelPass") {
        if (e == "cancel") {
          //取消通过提示弹窗 点击了取消
          this.dialogType = "pass";
          this.dialogTitle = "选择权限";
        } else {
          this.dialogEdit = false;
        }
      }
    },
    //编辑的取消或确认
    editCancelOrConfirm(e) {
      this.dialogEdit = true
      if (this.dialogType == "edit") {
        if (e == "confirm") {
          //编辑
          this.popup = true;
          this.dialogMessage = "请确认是否编辑";
        } else {
          //编辑
          this.popup = true;
          this.dialogType = "cancelEdit";
          this.dialogMessage = "本次编辑将不会保存，是否继续？";
        }
      } else if (this.dialogType == "pass") {
        if (e == "confirm") {
          //通过
          this.popup = true;
          this.dialogMessage = "请确认是否通过";
        } else {
          //通过取消
          this.popup = true;
          this.dialogType = "cancelPass";
          this.dialogMessage = "本次编辑将不会保存，是否继续？";
        }
      }
    },
    //账号审核 通过
    accountAuthPass() {
      if (this.permissionSelect.length == 0) {
        this.$message.error("请选择权限");
        return;
      }
      var submitPermissionArray = [];
      this.allPermissionList.forEach((element) => {
        element.permissionList.forEach((permission) => {
          if (this.permissionSelect.includes(permission.permissionName)) {
            submitPermissionArray.push(permission.permissionId);
          }
        });
      });
      let arrStr = submitPermissionArray.join(",");
      api_account
        .accountAuth({
          accountId: this.currentPerson.userId,
          status: 1,
          permissionId: arrStr,
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

    //账号编辑
    accountEdit() {
      if (this.identSelect.length == 0) {
        this.$message.error("请选择身份");
        return;
      }
      if (this.permissionSelect.length == 0) {
        this.$message.error("请选择权限");
        return;
      }

      var submitIdentityArray = [];
      this.allIdentityList.forEach((element) => {
        element.identityList.forEach((identity) => {
          if (this.identSelect.includes(identity.identityName)) {
            submitIdentityArray.push(identity.identityId);
          }
        });
      });
      let identityStr = submitIdentityArray.join(",");

      var submitPermissionArray = [];
      this.allPermissionList.forEach((element) => {
        element.permissionList.forEach((permission) => {
          if (this.permissionSelect.includes(permission.permissionName)) {
            submitPermissionArray.push(permission.permissionId);
          }
        });
      });
      let permissionStr = submitPermissionArray.join(",");

      api_account
        .accountEdit({
          accountId: this.currentPerson.userId,
          city: this.currentPersonDetail.city,
          identityId: identityStr,
          permissionId: permissionStr,
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

    //关闭弹窗回调
    dialogeClose(e) {
      if (e == "edit" && this.cancelConfirm == "confirm") {
        // this.accountEdit();
      } else if (e == "pass" && this.cancelConfirm == "confirm") {
        // this.accountAuthPass();
      }
    },

    //请求个人详情
    getAccountDetail() {
      api_account
        .getAccountDetail({
          accountId: this.currentPerson.userId,
        })
        .then((res) => {
          if (res.success) {
            this.currentPersonDetail = res.data.userInfo;
      
            this.identSelect = [];
            res.data.userIdentity.forEach((element) => {
              element.identityList.forEach((identity) => {
                if (identity.select === 1) {
                  this.identSelect.push(identity.identityName);
                }
              });
            });

            this.permissionSelect = [];
            res.data.userPermission.forEach((element) => {
              element.permissionList.forEach((permission) => {
                if (permission.select === 1) {
                  this.permissionSelect.push(permission.permissionName);
                }
              });
            });
          }
        });
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

    //点击拒绝
    refuseEvent(e) {
      this.currentPerson = e;
      this.dialogType = "refuse";
      this.dialogMessage = "请确认是否拒绝";
      this.popup = true;
    },
    //点击通过
    passEvent(e) {
      this.currentPerson = e;
      this.dialogType = "pass";
      this.getAccountDetail();
      this.dialogTitle = "选择权限";
      this.dialogEdit = true;
    },
    //点击编辑
    editEvent(e) {
      this.currentPerson = e;
      this.dialogType = "edit";
      this.getAccountDetail();
      this.dialogTitle = "账号编辑";
      this.dialogEdit = true;
    },
    //点击审核
    checkEvent(e) {
      this.$router.push({
        path: "/accountManage/checkDetail",
        query: {
          accountId: e.userId,
          type: "auth"
        }
      })
    },
    //点击编辑
    editEvent(e) {
      this.$router.push({
        path: "/accountManage/checkDetail",
        query: {
          accountId: e.userId,
          type: "edit"
        }
      })
    },
    //点击封禁
    blockEvent(e) {
      this.currentPerson = e;
      this.dialogType = "block";
      this.dialogMessage = "请确认是否封禁";
      this.popup = true;
    },
    // 点击解封
    unblockEvent(e) {
      this.$router.push({
        path: "/accountManage/checkDetail",
        query: {
          accountId: e.userId,
          type: "unblock"
        }
      })
    },
    //点击清除按钮
    cancelAllSelect() {
      this.name = ""; //姓名
      this.selectContestTypeIdArray = []; //当前所属赛事Id
      this.selectIdentityArray = []; //身份
      this.selectPermissionArray = []; //权限
      this.selectState = ""; //状态
      this.getAccountlist();
    },
  },
};
</script>
<style scoped lang="css">
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
.overflow-hidden {
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  display: flex;
  width: 100%;
}
.detail-list-identity{
  text-align: right;
  display: flex;
  justify-content: right;
}
.detail-list-identity span{
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  width: 40vw;
}
</style>
