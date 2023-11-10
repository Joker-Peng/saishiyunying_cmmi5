<template>
    <div v-if="isMobile()" class="container" :style="{height: $setMobileHeightByVh()}">
        <van-popup v-model="isMenu" position="left" :style="{ width: '50%',height:$setMobileHeightByVh() }">
            <Menu :style="{height: $setMobileHeightByVh()}"></Menu>
        </van-popup>
        <router-view v-if="$route.meta.customHeader" @handleChangeMenuStatus="handleChangeMenuStatus" class="main" v-loading="$store.getters.reqNum > 0"></router-view>
        <template v-else>
            <van-nav-bar
                class="header"
                :title="$route.meta.title"
                left-arrow
            >
                <img @click="handleChangeMenuStatus" slot="left" width="20" height="14" src="@/assets/accountManage/menu_icon.png" alt="">
            </van-nav-bar>
            <router-view v-if="hasMobile" class="main" v-loading="$store.getters.reqNum > 0"></router-view>
            <div v-else class="nodata-container">
                <img src="@/assets/accountManage/nodata.png" alt="">
                <p>为了更好的查看界面内容</p>
                <p>请在PC端上打开此界面</p>
            </div>
        </template>
    </div>
	<el-container v-else class="pc">
		<el-aside v-if="isMobile() && isMenu">
			<van-popup :show="isMenu" position="left" :style="{ width: '50%',height:'100%' }">
				<Menu></Menu>
			</van-popup>
		</el-aside>
		<el-aside v-if="!isMobile() && isMenu">
			<Menu></Menu>
		</el-aside>
		<el-container class="container" :class="{'my-body-micro': microMode}">
            <el-header class="header" v-if="!microMode">
                <Header @menuBox="handleChangeMenuStatus"></Header>
            </el-header>
            <el-main class="main" v-loading="$store.getters.reqNum > 0" :style="{padding:isMobile()?'0':'0 30px 15px'}">
                <router-view/>
            </el-main>
		</el-container>
	</el-container>
	
</template>

<script>
import { mapGetters } from "vuex";
import Header from "./Header";
import Menu from "./Menu";

export default {
  name: "MainCom",
  components: { Header, Menu },
  data() {
    return {
			isMenu:true,
			pop:null
		};
    },
	created(){
        this.isMobile() && (this.isMenu = false);
    },
    watch: {
        $route() {
            if(this.isMobile()) {
                this.isMenu = false
            }
        }
    },
  computed: {
    ...mapGetters(["microMode"]),
    hasMobile() {
        return this.$route.meta.hasMobile
    }
  },
  methods: {
		handleChangeMenuStatus(){
			this.isMenu=!this.isMenu
		},
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../styles/base/layout.less";
</style>
<style lang="scss" scoped>
.container {
    display: flex;
    height: 100vh;
    width: 100vw;
    flex-direction: column;
    background-color: #f7f7f7;
    .header {
        flex: none;
    }
    .main {
        display: flex;
        flex-direction: column;
        height: 0;
        flex: auto;
        overflow: auto;
    }
}
.nodata-container {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
        margin-bottom: 10px;
        width: 203px;
        height: 129px;
    }
    p {
        height: 20px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
    }
}
::v-deep .el-aside {
    min-width: fit-content;
}
</style>
