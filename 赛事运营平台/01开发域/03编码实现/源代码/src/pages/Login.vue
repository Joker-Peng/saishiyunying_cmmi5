<template>
	<el-row type="flex" justify="center">
		<el-col :xs="24" :sm="12" :md="8" :lg="7" :xl="6">
			<iframe :src="generateLoginUrl()" class="login-container" />
		</el-col>
	</el-row>
</template>


<script>
import * as mutations from "../store/modules/auth";

export default {
  name: "LoginCom",
  mounted() {
    this.handleAuthorization();
  },
  methods: {
    generateLoginUrl() {
      const loginUrl = new URL(process.env.VUE_APP_LOGIN_BASE_URL);
      loginUrl.searchParams.set("callback", window.location.href);
      return loginUrl.href;
    },
    handleError({ ErrorCode }) {
      let msg = "请求出错啦";
      if (ErrorCode === "400001003") msg = "请重新微信扫码";
      if (ErrorCode === "400001004") msg = "微信登录失败";
      if (ErrorCode === "400001005") msg = "账号不存在，请先注册";
      if (ErrorCode === "400000000") msg = "登录失败啦";
      this.$message.error(msg);
    },
    async handleAuthorization() {
      const url = new URL(window.location.href);
      const authorization = url.searchParams.get("authorization");
      if (!authorization) return;
      this.$store.commit(mutations.LOGIN, authorization);
      const callback = url.searchParams.get("callback");
      window.location.href = callback || process.env.BASE_URL;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.center {
  text-align: center;
}
.el-select {
  width: 120px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 1000px;
  top: 0;
  bottom: 0;
  right: 0;
  border: 0;
}
</style>
