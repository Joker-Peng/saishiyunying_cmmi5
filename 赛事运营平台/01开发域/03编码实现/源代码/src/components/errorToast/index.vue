<template>
    <div class="error-container" :class="{mobile: isMobile()}" v-if="visibleHere">
        <img class="icon-warn" src="@/assets/common/icon_warn.png" alt="">
        <img class="icon-close" @click="close" src="@/assets/common/icon_close_white.png" alt="">
        <!-- title -->
        <p class="error-title">{{title}}</p>
        <p v-for="(item,index) in formData" :key="index">
            <span>{{item.label}}：</span>
            <span>{{item.value}}</span>
        </p>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
    name: 'WorkspaceJsonIndex',
    components: {
        ...mapGetters(["errorData"])
    },
    props: {
        formData: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ""
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visibleHere: false
        }
    },
    watch: {
        visible: {
            handler(nowVal) {
                this.visibleHere = nowVal;
            },
            immediate: true
        }
    },
    mounted() {
        
    },

    methods: {
        close() {
            this.visibleHere = false;
        },
        open() {
            this.visibleHere = true;
        }
    },
};
</script>

<style lang="scss" scoped>
.error-container {
    position: fixed;
    top: 10px;
    left: 50%;
    padding: 10px 30px;
    width: 480px;
    max-width: 100vw;
    transform: translateX(-50%);
    background: rgb(255, 89, 0, .7);
    border-radius: 5px;
    color: #ffffff;
    font-size: 14px;
    line-height: 20px;
    box-sizing: border-box;
    z-index: 999;
    &.mobile {
        top: 0;
    }
    .error-title {
        font-weight: 600;
    }
    .icon-warn {
        position: absolute;
        top: 12px;
        left: 10px;
        width: 16px;
        height: 16px;
    }
    .icon-close {
        position: absolute;
        top: 12px;
        right: 10px;
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
}
</style>