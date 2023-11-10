<template>
    <dialogBox
    :popup="valueHere"
    top="100px"
    :title="title"
    width="1220px"
    @cancelOrConfirm="handleCloseDialog"
  >
    
  </dialogBox>
</template>

<script>
import * as api_account from "@/api/account";
import dialogBox from "@/components/accountManage/dialog.vue";
export default {
  components: { dialogBox },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    referee: {
      type: Object,
      default: () => ({})
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      valueHere: false,
      scoreTypeOptions: [
        {label: "减分", value: 0},
        {label: "加分", value: 1},
      ],
      tableData: [],
      editConfirm: false,
      cancelConfirm: false
    };
  },
  computed: {
    title() {
      return `(${this.referee.name})赛事评分`
    },
    formConfig() {
      return [
        { label: "赛事：", value: this.formData.contestName },
        {
          label: "队伍：",
          value: `${this.formData.teamA} VS ${this.formData.teamB}`,
        },
        { label: "赛事阶段：", value: this.formData.weekOfMonth },
        { label: "城市：", value: this.formData.city },
        {
          label: "时间：",
          value: `${this.formData.date} ${this.formData.time}`,
        },
        { label: "位置：", value: this.formData.part },
      ];
    },
  },
  watch: {
    value(nowVal) {
      this.valueHere = nowVal;
      if (nowVal) {
        this.loadData();
      }
    },
    valueHere(nowVal) {
      this.$emit("input", nowVal);
    }
  },

    methods: {
        
    },
};
</script>

<style lang="scss" scoped>

</style>