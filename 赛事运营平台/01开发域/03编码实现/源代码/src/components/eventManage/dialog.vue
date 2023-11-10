<template>
  <div>
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  :width="width"
  center
  :show-close="false"
  :top="top"
  :append-to-body="true">
  <div slot="title">
    <div v-if="title" class="dialogBox-header dialogBox-headerEdit" >
     {{title}}
    </div>
    <div class="dialogBox-header" v-else>
      <el-image :src="require('../../assets/eventManage/error.png')"></el-image>
      <span style="padding-left:3px">错误提醒</span>
    </div>
  </div>
  <slot></slot>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" v-throttle="confirm">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  props:{
    width:{
      type:String,
      default:"30%"
    },
    popup:{
      type:Boolean,
      default:false
    },
    type:{
      type:String,
      default:""
    },
    title:{
      type:String,
      default:""
    },
    top:{
      typeo:String,
      default:"40vh"
    }
  },
  computed:{
    dialogVisible:{
        get(){
            return this.popup
        },
        set(v){
            this.$emit('update:popup', v)
        }
    },
  },

  methods:{
    cancel(){
      this.$emit('update:popup', false)
      this.$emit('cancelOrConfirm','cancel')
    },
    confirm(){
      this.$emit('update:popup', false)
      this.$emit('cancelOrConfirm','confirm')
    }
  }
}
</script>
<style scoped>
  .dialogBox-header{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #111111;
    padding:16px;
  }
  .dialogBox-headerEdit{
    border-bottom: 1px solid #DDE1E6;
  }
  
</style>