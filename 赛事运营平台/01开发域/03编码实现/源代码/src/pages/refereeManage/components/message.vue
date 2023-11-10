<template>
    <div class="message-item">
        <p class="label">{{label}}</p>
        <slot>
            <span class="text">{{text}}</span>
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: ""
        },
        text: {
            type: String,
            default: ""
        }
    }
}
</script>

<style lang="scss" scoped>
.message-item {
    display: flex;
    align-items: center;
    padding-right: 50px;
    border-bottom: 1px dashed #e5e8ed;
    height: 60px;
    box-sizing: border-box;
    .label {
        width: 80px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #666666;
    }
    .text {
        width: 0;
        flex: auto;
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }
}
</style>