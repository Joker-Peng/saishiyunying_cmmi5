<template>
  <van-overlay :show="visible" :lock-scroll="false" @click="handleClose">
      <div class="wrapper" @click.stop>
        <div class="block" >
            <!-- header -->
            <div class="header">
                {{title}}
                <span class="close" @click="handleClose">×</span>
            </div>
            <!-- main -->
            <div class="main">
                <slot></slot>
            </div>
            <!-- footer -->
            <div class="footer">
                <span class="button" @click="handleConfirm">{{confirmText}}</span>
            </div>
        </div>
      </div>
      
    </van-overlay>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        confirmText: {
            type: String,
            default: "保存"
        }
    },
    methods: {
        handleClose() {
            this.$emit("update:visible", false)
        },
        handleConfirm() {
            this.$emit("confirm");
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.block {
    margin: 0 16px;
    padding: 20px 16px;
    width: 100%;
    min-height: 120px;
    background-color: #fff;
    border-radius: 4px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #333333;
    .header {
        position: relative;
        margin-bottom: 16px;
        font-size: 18px;
        font-family: SourceHanSansCN-Bold, SourceHanSansCN;
        font-weight: bold;
        color: #333333;
        line-height: 24px;
        text-align: center;
        .close {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            background-color: #b2b2b2;
            border-radius: 50%;
        }
    }
    .main {
        overflow: auto;
        min-height: 120px;
        max-height: 70vh;
    }
    .footer {
        margin-top: 20px;
        .button {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 44px;
            background: #1D81EE;
            border-radius: 4px;
            font-size: 16px;
            font-family: SourceHanSansCN-Medium, SourceHanSansCN;
            font-weight: 500;
            color: #FFFFFF;
        }
    }
}
</style>