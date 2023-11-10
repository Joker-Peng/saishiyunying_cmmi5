<template>
	<div class="module">
		<div class="module-header">
			<div class="lately">
				<span class="title">最近访问</span>
				<span v-for="(item, index) in historySearch" :key="index" class="item" @click="navgation(item)">
					{{ item.title }}
				</span>
			</div>
			<div class="search">
				<input v-model="keyword" type="text" placeholder="输入服务名称、快速查找服务" class="search-input" @input="search" />
				<span class="search-icon"> 搜索<i class="el-icon-search" style="margin-left: 5px"></i> </span>
			</div>
		</div>
		<div class="module-content">
			<div class="module-content-item">
				<div class="module-title">基础服务</div>
				<span v-for="(item, index) in menuList" :key="index" class="module-service" @click="navgation(item)">
					{{ item.title }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'HeaderModule',
  data() {
    return {
      keyword: null,
      menuList: [],
      historySearch: []
    };
  },
  computed: {
    ...mapGetters(["micros"]),
  },
  created() {
    this.menuList = this.micros;
    localStorage.historySearch && (this.historySearch = JSON.parse(localStorage.historySearch))
  },
  methods: {
    search(e) {
      const result = this.micros.filter( t => t.title.search(e.target.value) > -1 );
      result.length && (this.menuList = result);
    },
    navgation(item){
      this.compilerHistory(item)
      this.$router.push({ path: `/${item.name}` })
      this.$emit('navgation')
    },
    compilerHistory(current){
      let history = this.historySearch
      const index = history.findIndex( t => t.name === current.name)
      const isHasPath = index > -1;
      !isHasPath && history.length < 5 && history.unshift(current)
      !isHasPath && history.length === 5 && (history = [...history.slice(1,5), ...current])
      isHasPath && history.unshift(...history.splice(index, 1))
      localStorage.historySearch = JSON.stringify(history)
    }
  }
};
</script>
<style lang="less" scoped>
.module {
  display: flex;
  flex-direction: column;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #515151;
    padding: 10px 0;
    .lately {
      .title {
        font-size: 14px;
        color: #aea8a8ed;
        margin-right: 20px;
        padding-left: 0;
      }
      .item {
        font-size: 14px;
        color: #fff;
        padding: 0 12px;
        cursor: pointer;
        &:hover {
          color: #4d88d5;
        }
      }
    }
    .search {
      display: flex;
      align-items: center;
      border: 1px solid #888;
      height: 26px;
      border-radius: 3px;
      &-input {
        transition: all 0.3s;
        padding-left: 12px;
        width: 120px;
        height: 24px;
        border: none;
        outline: none;
        background: transparent;
        color: #fff;
        &:focus {
          width: 260px;
        }
      }
      &-icon {
        cursor: pointer;
        padding: 0 8px;
        height: 100%;
        color: #888;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          background: #262f3e;
        }
      }
    }
  }
  &-content {
    display: flex;
    margin-top: 15px;
    &-item {
      display: flex;
      flex-direction: column;
      padding: 15px;
      .module-title {
        font-size: 15px;
        color: #888;
      }
      .module-service {
        margin-left: 8px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        &:hover {
          color: #4d88d5;
        }
      }
    }
  }
}
</style>
