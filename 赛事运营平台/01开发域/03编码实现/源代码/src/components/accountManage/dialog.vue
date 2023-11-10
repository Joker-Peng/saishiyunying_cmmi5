<template>
  <div>
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  :width="width"
  :class="{title: title}"
  center
  :show-close="showClose"
  :top="top"
  :append-to-body="true"
  @closed="dialogeClose">
  <div slot="title">
    <div v-if="title" class="dialogBox-header dialogBox-headerEdit" >
      {{title}}
    </div>
    <div class="dialogBox-header" v-else>
      <el-image :src="require('@/assets/accountManage/shape.png')"></el-image>
      <span style="padding-left:3px">温馨提示</span>
    </div>
  </div>
  <slot></slot>
  <div v-if="showFooter" slot="footer" class="dialog-footer">
    <slot name="footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" v-throttle="confirm">确 定</el-button>
    </slot>
  </div>
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
      type:String,
      default:"40vh"
    },
    permissionSelect:{
      type:Array,
      default:() => ([])
    },
    identSelect:{
      type:Array,
      default:() => ([])
    },
    city:{
      type:String,
      default:""
    },
    showClose: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
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
      if (this.title == "账号编辑") {
        if (this.permissionSelect.length == 0) {
          this.$message.error("请选择权限")
          return
        }
        if (this.identSelect.length == 0) {
          this.$message.error("请选择身份")
          return
        }
        if (!this.city) {
          this.$message.error("请选择城市")
          return
        }
      }

      if (this.title == "选择权限"){
        if (this.permissionSelect.length == 0) {
          this.$message.error("请选择权限")
          return
        }
      }

      this.$emit('update:popup', false)
      this.$emit('cancelOrConfirm','confirm')
    },
    dialogeClose(){
      if(this.type == "edit" || this.type ==  "pass"){
        this.$emit('callback',this.type)
      }
    }
  }
}
</script>
<style scoped lang="scss">
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
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title ::v-deep .el-dialog__footer {
    border-top: 1px solid #e5e8ed;
  }
</style>