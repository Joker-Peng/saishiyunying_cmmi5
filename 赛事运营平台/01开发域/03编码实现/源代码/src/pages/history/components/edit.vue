<template>
  <dialogBox :popup="valueHere" top="100px" :title="title" width="478px" @cancelOrConfirm="handleOpenPopup">
    <div>
      <div class="form">
        <div class="form-item">
          <span>年份：</span>
          <el-input
            v-model="formData.year"
            placeholder="请输入年份"
            maxlength="4"
            size="small"
            style="width: 265px"
          ></el-input>
        </div>
        <div class="form-item">
          <span>赛事类型：</span>
          <el-input
            v-model="formData.type"
            placeholder="请输入赛事类型"
            size="small"
            style="width: 265px"
          ></el-input>
        </div>
        <div class="form-item">
          <span>赛事名称：</span>
          <el-input
            v-model="formData.name"
            placeholder="请输入赛事名称"
            size="small"
            style="width: 265px"
          ></el-input>
        </div>
      </div>
    </div>
    <!-- 新增赛程二次弹框 -->
    <dialogBox
      :popup="popup"
      @cancelOrConfirm="handelClosePopup"
    >
      <div class="dialogBox-content">{{confirmTips}}</div>
    </dialogBox>
  </dialogBox>
</template>
  
  <script>
import dialogBox from "@/components/accountManage/dialog.vue";
export default {
  components: { dialogBox },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    typeOptions: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      valueHere: false,
      popup: false
    };
  },
  computed: {
    tableData() {
      let salaryIdSelected = this.formData.salary;
      let salarySelected = this.salaryOptions.find(d => d.id == salaryIdSelected);
      console.log(salarySelected)
      return salarySelected?.salaryBos || [];
    },
    confirmTips() {
      return this.title == "历史赛事新增" ? "确定是否提交新增赛事?" : "确定是否修改此赛事?";
    }
  },
  watch: {
    value(nowVal) {
      this.valueHere = nowVal;
    },
    valueHere(nowVal) {
      this.$emit("input", nowVal);
    },
  },
  methods: {
    handleOpenPopup(type) {
      if(type == "cancel") {
        this.valueHere = false;
      } else if(this.checkData()){
        this.popup = true;
      }
    },
    handelClosePopup(type) {
      this.popup = false;
      if(type == "confirm") {
        this.$emit("confirm");
      }
    },
    // 校验
    checkData() {
      if(!this.formData.year) {
        this.$message.warning("请输入年份")
        return false
      } 
      if(Number(this.formData.year) != this.formData.year || this.formData.year?.length != 4) {
        this.$message.warning("请输入正确的年份")
        return false
      }
      if(!this.formData.type) {
        this.$message.warning("请输入赛事类型")
        return false
      }
      if(!this.formData.name) {
        this.$message.warning("请输入赛事名称")
        return false
      }
      return true
    }
    
  }
};
</script>
  
  <style lang="scss" scoped>
.green {
  color: #00b400;
}
.red {
  color: #ff005c;
}
.form {
  margin: 20px;
  display: flex;
  flex-direction: column;
  width: 478px;
  &-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    &:last-of-type {
      margin-bottom: 0;
    }
    span {
      width: 90px;
    }
    input {
      width: 290px
    }
  }
}
.dialogBox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
}
</style>