<template>
  <dialogBox
    :popup.sync="valueHere"
    top="100px"
    title="发布公告"
    width="800px"
    @cancelOrConfirm="handleCloseDialog"
  >
    <div class="dialogBox-center">
      <el-form class="form" :model="formData" :rules="rules" label-width="130px" label-position="left">
        <el-form-item label="是否短信通知：" prop="smsNotify">
          <el-radio-group v-model="formData.smsNotify">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布范围：" prop="auth"></el-form-item>
        <div class="auth-container" v-for="contest in rangeList" :key="contest.contestTypeId">
          <span class="auth-title">{{ contest.contestTypeName }}</span>
          <el-checkbox-group class="auth-value" v-model="auth[contest.contestTypeName]">
            <el-checkbox
              v-for="checkboxData in contest.identityList"
              :label="checkboxData.identityId"
              :key="checkboxData.identityId"
            >{{ checkboxData.identityName }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form>
    </div>
  </dialogBox>
</template>
  
  <script>
import dialogBox from "@/components/accountManage/dialog.vue";
import * as api_account from "@/api/account";
export default {
  name: "editScore",
  components: { dialogBox },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    announcementId: {
      type: [Number, String],
      default: ""
    }
  },
  data() {
    return {
      valueHere: false,
      rules: {
        smsNotify: [{ required: true }],
        auth: [{ required: true }]
      },
      formData: {
        smsNotify: 0,
        range: "",
      },
      rangeList: [],
      auth: {}
    };
  },
  watch: {
    value(nowVal) {
      this.valueHere = nowVal;
      nowVal && this.loadData();
    },
    valueHere(nowVal) {
      this.$emit("input", nowVal);
    },
    auth: {
      handler(nowV) {
        let rangeArr = Object.values(nowV).reduce((res, val) => {
          res.push(...val);
          return res;
        }, []);
        this.formData.range = rangeArr.map((d) => d + "").join(",");
      },
      deep: true,
    },
  },
  methods: {
    loadData() {
      api_account
        .getAnnouncementDetail({
          announcementId: this.announcementId,
          userId: this.$store.getters.userInfo.id
        })
        .then(res => {
          if (res.success) {
            this.rangeList = res.data.range;
            this.auth = res.data.range.reduce((res, val) => {
              res[val.contestTypeName] = val.identityList
                .filter(d => d.select)
                .map(d => d.identityId);
              return res;
            }, {});
            this.formData.smsNotify = res.data.detail.smsNotify;
          }
        });
    },
    handleCloseDialog(type) {
        if(type == "confirm") {
            this.$emit("confirm", {announcementId: this.announcementId, ...this.formData, status: 1})
        }
    }
  }
};
</script>
  
  <style lang="scss" scoped>
.auth-container {
  display: flex;
  height: 40px;
  .auth-title {
    flex: none;
    width: 6em;
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    color: #666666;
  }
  ::v-deep .el-checkbox-group {
    display: flex;
    width: 0;
    flex: auto;
    .el-checkbox {
      min-width: 120px;
      width: max-content;
      margin: 0;
    }
  }
}
</style>