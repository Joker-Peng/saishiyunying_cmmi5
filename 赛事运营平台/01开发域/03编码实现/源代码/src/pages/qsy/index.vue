<template>
    <iframe :src="qsyLoginUrl" class="iframe">
    </iframe>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    beforeRouteEnter(to, from, next) {
        window.open(appVue.$store?.getters?.qsyLoginUrl || "")
        next(false)
    },
    computed: {
        ...mapGetters(["qsyLoginUrl"])
    },
    mounted() {
    }
}
</script>

<style scoped>
.iframe {
    border: 0;
    width: 100%;
    height: calc(100% - 30px);
    background: #FFFFFF;
    box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 5%);
    border-radius: 10px;
}
</style>