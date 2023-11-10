<template>
    <div class="referee" :class="isMobile() ? 'mobile' : ''">
        <!-- pc详情 -->
        <button v-if="!isMobile()" @click="linkToDetail(value.refereeId)" class="referee-fixed">详情<i class="el-icon-d-arrow-right"></i></button>
        <!-- 裁判状态 -->
        <section class="status" :class="refereeStatusClass">
            {{refereeStatusText}}
        </section>
        <!-- 头部个人信息 -->
        <section class="referee-header">
            <img :src="value.image || defaultImg" alt="">
            <div class="referee-name-container">
                <p class="referee-name">{{value.name}}</p>
                <p class="referee-no">{{value.refereeNumber}}</p>
            </div>
        </section>
        <section class="referee-main">
            <div class="space-between">
                <p>
                    <img src="@/assets/accountManage/tel.png" alt="">
                    <span>手机</span>
                </p>
                <span>{{value.mobile}}</span>
            </div>
            <div class="space-between">
                <p>
                    <img src="@/assets/accountManage/email.png" alt="">
                    <span>邮箱</span>
                </p>
                <span>{{value.email}}</span>
            </div>
            <div class="space-between">
                <p>
                    <img src="@/assets/accountManage/ident.png" alt="">
                    <span>身份</span>
                </p>
                <span :title="value.identity">{{value.identity}}</span>
            </div>
            <div class="space-between" v-if="value.refereeStatus == 2">
                <p>
                    <img src="@/assets/accountManage/ident.png" alt="">
                    <span>冻结原因</span>
                </p>
                <span v-html="value.freezeReason"></span>
            </div>
        </section>
        <button v-if="isMobile()" @click="linkToDetail(value.refereeId)" class="referee-detail">详情<i class="el-icon-d-arrow-right"></i></button>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonRefereeView',
    props: {
        value: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            defaultImg: require("@/assets/upload/head_default.png")
        };
    },
    computed: {
        refereeStatusText() {
            // 1:在职 2冻结 3离职
            return this.$dictionary.refereeStatus.find(d => d.value == this.value.refereeStatus)?.label || "";
        },
        refereeStatusClass() {
            return ["", "green", "red", "gray"][this.value.refereeStatus]
        }
    },
    mounted() {
        },

    methods: {
        linkToDetail(id) {
            this.$router.push({
                path: "/refereeManage/member",
                query: {
                    id: id
                }
            })
        }    
    },
};
</script>

<style lang="scss" scoped>
.green {
  color: rgb(0, 180, 0);
  &.status:before {
    content: " ";
    display: block;
    margin-right: 6px;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    background-color: rgb(0, 180, 0);
  }
}
.red {
  color: rgb(255, 0, 92);
  &.status:before {
    content: " ";
    display: block;
    margin-right: 6px;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    background-color: rgb(255, 0, 92);
  }
}
.gray {
  color: #999999;
  &.status:before {
    content: " ";
    display: block;
    margin-right: 6px;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    background-color: #999999;
  }
}
.space-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
* {
    box-sizing: border-box;
}
.mobile {
    .referee-header {
        border-bottom: 0!important;
    }
    .referee-main {
        padding: 0!important;
    }
    .space-between {
        align-items: flex-start;
        padding: 20px 0;
        border-bottom: 1px solid #E5E5E5;
        &:last-of-type {
            border: 0;
        }
        span {
            width: 60%;
            overflow: auto!important;
            white-space: normal!important;
            word-break: break-all!important;
            text-align: right;
        }
    }
}
.referee {
    position: relative;
    padding: 0 20px;
    border-radius: 4px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.05);
    background: #FFFFFF;
    color: #666666;
    font-size: 14px;
    .referee-fixed {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 14px;
        color: #1D81EE;
        line-height: 20px;
        z-index: 2;
    }
    .status {
        position: absolute;
        top: 15px;
        right: 15px;
        height: 28px;
        display: flex;
        align-items: center;
    }
    .referee-header {
        display: flex;
        align-items: center;
        height: 88px;
        border-bottom: 1px solid #E5E5E5;
        img {
            margin-top: 2px;
            margin-right: 20px;
            height: 48px;
            width: 48px;
            border-radius: 50%;
        }
        .referee-name-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .referee-name {
                font-size: 16px;
                font-weight: 600;
                color: #333333;
                line-height: 28px;
            }
            .referee-no {
                line-height: 24px;
            }
        }
    }
    &-name {
        line-height: 28px;
    }
    .referee-main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 0;
        min-height: 138px;
        box-sizing: border-box;
        p {
            flex: none;
            margin-right: 20px;
        }
        span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        img {
            margin-top: 2px;
            height: 14px;
            width: 14px;
            object-fit: contain;
            margin-right: 6px;
        }
    }
}
.referee-detail {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #e5e5e5;
    width: calc(100vw - 30px);
    height: 50px;
    font-size: 14px;
    color: #1D81EE;
    transform: translateX(-20px);
}
</style>