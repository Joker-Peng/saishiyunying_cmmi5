<template>
  <el-row type="flex" justify="space-between">
    <div class="project-info" @click="menuShow" style="cursor: pointer">
      <span class="more">
        <i class="el-icon-menu" style="color: #333"></i>
        <!-- <div ref="searchPannel" class="more-container">
          <div class="more-container-content">
            <module @navgation="navgation" />
          </div>
        </div> -->
      </span>
    </div>
    <el-col class="user-info">
      <!-- <screenfull /> -->
      <img src="@/assets/menu/img-ckkb.png" height="17" alt="" @click="linkToCkkb">
      <div class="line"></div>
      <img src="@/assets/menu/img-qsy.png" height="14" alt="" @click="linkToQsy">
      <div class="line"></div>
      <img src="@/assets/menu/img-pentaq.png" height="20" alt="" @click="linkToPentaQ">
      <div class="line"></div>
      <div v-if="this.$store.getters.unRead == 0" class="child" @click="goMessage"></div>
      <van-badge v-else :content="this.$store.getters.unRead" max="99">
        <div class="child" @click="goMessage"></div>
      </van-badge>
      <div class="line"></div>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="user-info-center">
          <span>{{ this.$store.getters.userInfo.name }}</span>
          <i
            class="el-icon-arrow-down el-icon--right"
            style="margin-right: 15px; color: #1d81ee"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item icon="el-icon-s-custom" command="">个人中心</el-dropdown-item> -->
          <el-dropdown-item icon="el-icon-switch-button" command="logout"
            >退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import logo from "./logo";
import module from "./module";
import screenfull from "./screenfull";

export default {
  name: "HeaderCom",
  components: { logo, module, screenfull },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userInfo", "micros", "qsyLoginUrl"]),
  },
  created() {
  
  },
  methods: {
    // ...mapMutations(["LOGOUT"]),
    logout() {
      this.$confirm("确认要退出登录吗？").then(() => {
        this.$store.commit("LOGOUT")
      })
    },

    handleCommand(command) {
      if (!command) return;
      this[command]();
    },
    handleMicroCommand(command) {
      this.$router.push({ path: `/${command}` });
    },
    navgation() {
      this.$refs.searchPannel.style.display = "none";
      setTimeout(() => {
        this.$refs.searchPannel.style.display = "block";
      }, 0);
    },
    menuShow() {
      this.$emit("menuBox");
    },
    goMessage(){
      this.$router.push('/messageNotify')
    },
    linkToCkkb() {
      window.open("https://tj2020-dm-dev.tjstats.com/...ch_reopen_panel")
    },
    linkToPentaQ() {
      window.open("http://lol.pentaq.com/")
    },
    linkToQsy() {
      window.open(this.qsyLoginUrl)
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import url("../../styles/base/variables.less");
.project-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  width: 150px;
  height: 100%;
}
.el-row {
  height: 100%;
}
.user-info {
  flex: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 1000px;
  cursor: pointer;
  text-align: right;
  padding-right: 20px;
  color: #fff;
}
.user-info-center {
  color: #333;
}
.more {
  padding: 0 15px;
  position: relative;
  &:hover {
    .more-container {
      visibility: visible;
      opacity: 1;
      height: 66vh;
      width: calc(100vw - 240px);
    }
    .more-container-content {
      visibility: visible;
      opacity: 1;
    }
  }
  &-container {
    left: 0;
    height: 0;
    top: 33px;
    padding: 15px;
    color: #fff;
    position: absolute;
    visibility: hidden;
    transition: all 0.3s;
    width: calc(100vw - 240px);
    background: @headerBgColor;
    border: 1px solid @mainBorderColor;
    border-top: none;
    &-content {
      transition: opacity 0.3s 0.3s;
      width: 100%;
      opacity: 0;
      visibility: hidden;
    }
  }
}

.line {
  height: 20px;
  width: 1px;
  background-color: #cccccc;
  margin: 0 30px;
}

.child {
  color: #333;
  width: 20px;
  height: 20px;
  background-image: url("../../assets/message/unRead.png");
  background-position: center center;
  /* 背景图不平铺 */
  background-repeat: no-repeat;
  /* 让背景图基于容器大小伸缩 */
  background-size: cover;
  position: relative;
  cursor: pointer;
}

.messageNumber {
  position: absolute;
  top: -50%;
  right: -50%;
  background-color: #f70000;
}
</style>
