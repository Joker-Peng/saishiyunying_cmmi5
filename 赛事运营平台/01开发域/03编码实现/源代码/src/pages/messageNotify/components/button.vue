<template>
    <div :class="classList" @click="clickAction">
        <img v-if="type.includes('check_gray')" src="@/assets/message/check_gray.png" alt="">
        <img v-else-if="type.includes('edit_gray')" src="@/assets/message/edit_gray.png" alt="">
        <img v-else-if="type.includes('view_gray')" src="@/assets/message/view_gray.png" alt="">
        <img v-else-if="type.includes('pass_green')" src="@/assets/message/pass_green.png" alt="">
        <img v-else-if="type.includes('close_red')" src="@/assets/message/close_red.png" alt="">
        {{value}}
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: "view_gray"
        },
        value: {
            type: String,
            default: ""
        }
    },
    computed: {
        classList() {
            let res = "button ";
            if(this.type.includes("gray")) {
                res += "gray";
            } else if(this.type.includes("green")) {
                res += "green";
            } else if(this.type.includes("red")) {
                res += "red";
            }
            return res;
        }
    },
    methods:{
        clickAction(){
            this.$emit('clickAction', this.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    width: 79px;
    height: 32px;
    border: 1px solid #D9D9D9;
    color: #D9D9D9;
    font-size: 14px;
    border-radius: 4px;  
    cursor: pointer;
    &:hover {
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
    }
    &.red {
        border: 1px solid #FF005C;
        color: #FF005C
    }
    &.green {
        border: 1px solid #00B400;
        color: #00B400;
    }
    &.gray {
        border: 1px solid #D9D9D9;
        color: #666666;
    }
    img {
        margin-right: 10px;
        width: 14px;
        height: 14px;
    }

}
</style>