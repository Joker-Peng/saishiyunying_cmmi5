<template>
  <div class="menu-container">
    <!-- 正常的menu -->
    <template v-if="menuType == 'normal'">
      <div class="menu-title">
        赛事运营支持系统
      </div>
      <div class="menu-main">
        <el-menu
          :unique-opened="true"
          :default-openeds="openeds"
          :default-active="activeMenu"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :active-text-color="variables.menuActiveText"
          @select="handleJumpMenu"
        >
          <template v-for="(item,index) in menus">
            <template v-if="item.meta.menu && (!item.meta.hidePcMenu || isMobile())">
              <el-submenu v-if="item.children && item.children[0].meta.menu" :key="index" :index="item.path">
                <template slot="title">
                  <el-image class="mr-2" :src="bingActiveIcon(item.meta.icon)"  v-if="$route.path.includes(item.path)" style="width: 20px;height: 20px;" fit = "contain"/>
                  <el-image class="mr-2" :src="bingIcon(item.meta.icon)" alt="" srcset="" v-else  style="width: 20px;height: 20px;" fit = "contain"/>
                  <span>{{ item.meta.title }}</span>
                </template>
                <template v-for="(item,index) in item.children">
                  <el-menu-item :key="index" :index="item.path">
                    <div class="menu-idot mr-2" style="background-color: #1D81EE" v-if="$route.path == item.path"></div>
                    <div class="menu-idot mr-2" v-else></div>
                    <span slot="title">{{ item.meta.title }}</span>
                  </el-menu-item>
                </template>
              </el-submenu>
              <el-menu-item  v-else :key="index" :index="item.path">
                <el-image class="mr-2" :src="bingActiveIcon(item.meta.icon)"  v-if="$route.path == item.path" style="width: 20px;height: 20px;" fit = "contain"/>
                <el-image class="mr-2" :src="bingIcon(item.meta.icon)" alt="" srcset="" v-else style="width: 20px;height: 20px;" fit = "contain"/>
                <span slot="title">{{ item.meta.title }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </div>
    </template>
    <!-- 点击友情链接后 -->
    <template v-else-if="isMobile()">
      <div class="menu-title">
        <i class="el-icon-arrow-left menu-title-left-icon" @click="handleClickLeft"></i>
        <p>友情链接</p>
      </div>
      <div class="menu-main">
        <div class="menu-img">
          <img @click="linkToQsy" src="@/assets/menu/img-qsy.png" alt="" height="21">
        </div>
        <div class="menu-img">
          <img @click="linkToPentaQ" src="@/assets/menu/img-pentaq.png" alt="" height="33">
        </div>
        <div class="menu-img">
          <img @click="linkToCkkb" src="@/assets/menu/img-ckkb.png" alt="" height="23">
        </div>
      </div>
    </template>
    <div v-if="isMobile()" class="menu-button">
      <button @click="logout">退出登录</button>
    </div>
  </div>
	
</template>

<script>
import { mapGetters } from "vuex";
import variables from "../../styles/base/variables.less";
import { Dialog } from 'vant';

export default {
  name: "MenuCom",
  data() {
    return {
      openeds: [],
      active: "",
      menuType: "normal"
    };
  },
  computed: {
    ...mapGetters(["menus","qsyLoginUrl"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      return meta.activeMenu || path;
    },
    variables() {
      return variables;
    },
    //菜单显示列表
    menuList(){
     return this.menus.filter(item=>item.meta.menu&&item.children)
    },
  },
  created() {
    if (!this.menus.length) return;
    if (this.$route.path === "/") {
      this.active = this.menus[0].children.length
        ? this.menus[0].children[0].path
        : this.menus[0].path;
      this.$router.push({ path: this.active });
    } else {
      this.active = this.$route.path;
    }
  },
  methods:{
    bingIcon(icon) {
      icon = icon || "sjfwgl";
      return require(`@/assets/menu/${icon}.png`);
    },
    bingActiveIcon(icon) {
      icon = icon || "sjfwgl";
      return require(`@/assets/menu/${icon}-active.png`);
    },
    // 不需要跳转则不跳
    handleJumpMenu(menuRoute) {
      console.log(menuRoute)
      if(menuRoute == "/link") {
        this.menuType= "link"
      } else {
        this.$router.push(menuRoute);
      }
    },
    handleClickLeft() {
      this.menuType = "normal"
    },
    logout() {
      Dialog.confirm({
        title: '提示',
        message: '确认要退出登录吗？',
      }).then(() => {
        this.$store.commit("LOGOUT")
      }).catch(() => {
        // on cancel
      });
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

  }
};
</script>
<style lang="less">
@import "../../styles/base/variables.less";
.mr-2{
  margin-right:10px;
}
.menu-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.menu-title{
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  font-size: 15px;
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  font-weight: bold;
  color: #333333;
}
.menu-title-left-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.menu-button {
  padding: 20px;
  border-top: 1px solid #DDDDDD;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 146px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #989898;
    font-size: 14px;
    color: #999999;
    background-color: rgba(0, 0, 0, 0);
  }
}
.menu-idot{
  width: 3px;
  height: 3px;
  background-color: #666666;
}
.menu-main{
  flex: auto;
  height: 0;
  overflow: auto;
}
.menu-main > .menu-img {
  margin: 0 20px;
  padding: 20px 0;
  border-bottom: 1px solid #cccccc;
  &:last-of-type {
    border-bottom: 0;
  }
  &:first-of-type {
    margin-top: -10px;
  }
}
.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
.submenu-title-noDropdown,
.el-submenu__title {
  border: none;
  display: flex;
  align-items: center;
  &:hover {
    background-color: @menuHover !important;
    color:@menuActiveText !important;
  }
}
.el-image{
  display: flex;
  align-items: center;
}

.is-active > .el-submenu__title {
  color: @subMenuActiveText !important;
}

/* & .nest-menu .el-submenu > .el-submenu__title,*/
.el-menu .el-menu-item {
  min-width: @sideBarWidth !important;
  background-color: @subMenuBg !important;
  display: flex;
  align-items: center;
  &:hover {
    background-color: @menuHover !important;
    color:@menuActiveText !important;
  }
} 
</style>
