<template>
    <van-popup position="bottom" v-model="visible">
        <div class="check-box-container">
            <!-- <img class="close" src="@/assets/common/icon_close.png" alt=""> -->
            <section class="check-box-header">{{title}}</section>
            <section class="check-box-main">
                <van-checkbox-group v-model="hereValue">
                    <!-- 模块 -->
                    <section class="module" v-for="moduleName in moduleList" :key="moduleName">
                        <p class="module-title">{{moduleName}}</p>
                        <div class="module-item" @click="handleClickEvent" v-for="item in options[moduleName]" :key="item.value">
                            <span class="module-itetm-left">{{item.label}}</span>
                            <van-checkbox class="module-item-right" :name="item.value" @click.stop></van-checkbox>
                        </div>
                    </section>
                </van-checkbox-group>
            </section>
            <section class="check-box-footer">
                <button @click="handleConfirm">确定</button>
            </section>
        </div>
    </van-popup>
</template>

<script>
export default {
    name: 'checkBoxPopup',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: "请选择"
        },
        // 形如 {a: {label: "haha", value:11}}
        options: {
            type: Object,
            default: () => ({})
        },
        // options中的value数组
        value: {
            type: Array,
            default: () => []
        },

    },
    computed: {
        moduleList() {
            return Object.keys(this.options)
        },
    },
    watch: {
        value(nowVal) {
            this.hereValue = [...nowVal]
        },
        visible(nowVal) {
            this.visibleHere = nowVal
        },
        visibleHere(nowVal) {
            this.$emit("update:visible", nowVal)
        }
    },
    data() {
        return {
            hereValue: [],
            visibleHere: false    
        };
    },

    mounted() {
        
    },

    methods: {
        handleConfirm() {
            this.$emit("input", this.hereValue);
            this.visibleHere = false;
        },
        handleClickEvent(e) {
            const checkBox = e.currentTarget.getElementsByClassName("module-item-right")[0]
            checkBox.click()
        }
    },
};
</script>

<style lang="less" scoped>
* {
    box-sizing: border-box;
}
.close {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 24px;
    width: 24px;
}
.check-box {
    &-container {
        position: relative;
        display: flex;
        flex-direction: column;
        padding-top: 10px;
        height: 70vh;
        width: 100%;
    }
    &-header {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        height: 45px;
        width: 100%;
        font-size: 18px;
        font-weight: 600;
        color: #333333;
    }
    &-footer {
        flex: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 76px;
        background: #FFFFFF;
        box-shadow: 0px -2px 14px 0px rgba(68,68,68,0.11);
        border-radius: 1px;
        button {
            display: block;
            width: calc(100vw - 40px);
            height: 46px;
            background: #1D81EE;
            border-radius: 2px;
            font-size: 16px;
            font-weight: 500;
            color: #FFFFFF;
        }
    }
    &-main {
        padding: 0 20px;
        height: 0;
        flex: auto;
        overflow: auto;
    }
}
.module {
    padding: 20px 0;
    border-bottom: 1px solid #f0f3f7;
    &-title {
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        line-height: 20px;
    }
    &-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        font-size: 14px;
        color: #666666;
        &-right {
            margin-left: 20px;
            flex: none;
        }
        &-left {
            width: 0;
            flex: auto;
        }
    }
}
</style>