<template>
    <div class="player-container">
        <div class="player-header">
            <img :src="value.BigAvatar" alt="" @click="$emit('seeImage', value.BigAvatar)">
            <div class="player-header-right">
                <p class="player-name">{{value.NameCn}}<span class="player-team">{{value.TeamDes}}</span></p>
                <p class="player-gamename">昵称：{{value.GameName}}</p>
                <p class="player-position">位置：{{value.PlayerPos}}</p>
                <p class="player-account">比赛服账号：{{value.AcctMatch}}</p>
            </div>
        </div>
        <div class="player-main">
            <div class="player-main-item">
                <p><img src="@/assets/player/icon_idcard.png" alt="">选手性质</p>
                <span>{{value.Nature|getPlayerNature}}</span>
            </div>
            <div class="player-main-item">
                <p><img src="@/assets/player/icon_country.png" alt="">国家/地区</p>
                <span>{{value.Country}}</span>
            </div>
            <div class="player-main-item">
                <p><img src="@/assets/player/icon_keyboard.png" alt="">键盘型号</p>
                <span>
                    <span>{{value.KbType}}</span>
                    <span v-if="value.KbDriver" class="driver">驱动</span>
                </span>
            </div>
            <div class="player-main-item">
                <p><img src="@/assets/player/icon_mouse.png" alt="">鼠标型号</p>
                <span>
                    <span>{{value.MouseType}}</span>
                    <span v-if="value.MouseDriver" class="driver">驱动</span></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            default: () => ({})
        }
    },
    filters: {
        getPlayerNature(status) {
            let temp = ["-", "内援", "外援", "本土"];
            return temp[status || 0]
        }
    },
}
</script>

<style lang="scss" scoped>
.player {
    &-container {
        flex: none;
        margin-bottom: 10px;
        margin-right: 10px;
        padding: 20px;
        width: 393px;
        height: 276px;
        background: #FFFFFF;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.05);
        border-radius: 10px;
        box-sizing: border-box;
    }
    &-header {
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 1px dashed #e5e5e5;
        img {
            margin-right: 20px;
            height: 90px;
            width: 90px;
            border-radius: 50%;
        }
    }
    &-name {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        line-height: 21px;
    }
    &-team {
        display: flex;
        align-items: center;
        &:before {
            content: " ";
            margin-left: 10px;
            margin-right: 10px;
            width: 1px;
            height: 13px;
            background: #E5E5E5;
        }
    }
    &-gamename, &-position {
        margin-bottom: 6px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #666666;
        line-height: 16px;
    }
    &-account {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #999999;
        line-height: 16px;
    }
    &-main {
        padding-top: 16px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #999999;
        line-height: 19px;
        &-item {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &:last-of-type {
                margin-bottom: 0;
            }
            p {
                display: flex;
                align-items: center;
                flex: none;
            }
            >span {
                display: flex;
                width: 0;
                flex: auto;
                justify-content: flex-end;
                align-items: center;
                color: #333333;
                .driver {
                    flex: none;
                    margin-left: 10px;
                    color: #1D81EE;
                    width: max-content;
                }
                span:first-child {
                    padding-left: 20px;
                    width: 0;
                    flex: auto;
                    overflow: hidden;
                    text-overflow:ellipsis; 
                    white-space: nowrap;
                    text-align: right;
                }
            }
        }
        img {
            margin-right: 6px;
            height: 14px;
            width: 14px;
        }
    }
}
</style>