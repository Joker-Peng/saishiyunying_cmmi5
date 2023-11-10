<template>
  <van-popup
    position="bottom"
    style="height: 70%"
    v-model="show"
    :close-on-click-overlay="false"
  >
    <div class="filter-container">
      <p class="header">选手查询</p>
      <section class="main">
        <slot></slot>
        <div class="search-item">
          <p>姓名</p>
          <el-input v-model="filterData.refereeName" placeholder="请输入比赛昵称">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="search-item">
          <p>裁判编码</p>
          <el-input v-model="filterData.refereeNumber" placeholder="请输入俱乐部"
            ><i slot="prefix" class="el-input__icon el-icon-search"></i
          ></el-input>
        </div>
        <div class="search-item">
          <p>状态</p>
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
        <div class="search-item">
          <p>所属赛事</p>
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
        <div class="search-item">
          <p>身份</p>
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
      </section>
      <section class="footer">
        <button class="cancel" @click="handleClose">取消</button>
        <button class="confirm" @click="handleSearch">查询</button>
      </section>
    </div>
  </van-popup>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    filterData: {
      type: Object,
      default: () => ({}),
    },
    statusOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    value: {
      handler(nowVal) {
        this.show = nowVal;
      },
    },
  },
  methods: {
    handleSearch() {
      this.$emit("search");
      this.$emit("input", false);
    },
    handleClose() {
      this.$emit("input", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    padding: 0;
    display: block;
    flex: none;
    width: 100%;
    height: 65px;
    box-shadow: inset 0px -1px 0px 0px #eeeeee;
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    text-align: center;
    line-height: 65px;
    text-align: center;
  }
  .main {
    padding: 20px;
    width: 100%;
    height: 0;
    flex: auto;
    overflow: auto;
    box-sizing: border-box;
    .search-item, ::v-deep .search-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      &:last-of-type {
        margin-bottom: 0;
      }
      p {
        margin-bottom: 16px;
        height: 21px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 21px;
      }
    }
  }
  .footer {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 76px;
    background: #ffffff;
    box-shadow: 0px -2px 14px 0px rgba(68, 68, 68, 0.11);
    border-radius: 1px;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      background-color: transparent;
      box-sizing: border-box;
      border-radius: 4px;
      font-size: 16px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      &.cancel {
        width: 101px;
        height: 44px;
        border: 1px solid #cbcbcb;
        color: #333333;
      }
      &.confirm {
        width: 214px;
        height: 44px;
        background: #1d81ee;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
</style>