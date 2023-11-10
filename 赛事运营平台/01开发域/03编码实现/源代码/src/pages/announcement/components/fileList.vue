<template>
  <div class="file-list">
    <div class="file" v-for="(item,index) in value" :key="item.url">
        <img :src="getIcon(item.type)" alt="">
        <p>{{item.name}}</p>
        <div v-if="item.url" class="button-container">
            <button @click="handleDelete(index)"><img src="@/assets/upload/icon_delete.png" alt=""></button>
            <button @click="handleDownload(item.url)"><img src="@/assets/upload/icon_download.png" alt=""></button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        getIcon(type) {
            //1	图片 2	word文档 3	excel文档 4	ppt文档 5	pdf文档 6	压缩文件
            let icon = "";
            switch(parseInt(type)) {
                case 1: icon = "icon_image"; break;
                case 2: icon = "icon_word"; break;
                case 3: icon = "icon_excel"; break;
                case 4: icon = "icon_ppt"; break;
                case 5: icon = "icon_pdf"; break;
                case 6: icon = "icon_zip"; break;
                default: icon = "icon_zip";
            }
            return require(`@/assets/upload/${icon}.png`)
        },
        handleDelete(index) {
            this.value.splice(index, 1);
        },
        handleDownload(url) {
            window.open(url)
        }
    }
}
</script>

<style lang="scss" scoped>
.file {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    height: 22px;
    width: 50%;
    &-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    img {
        height: 16px;
        width: auto;
    }
    >img {
        margin-right: 10px;
    }
    p {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #666666;
        width: 200px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
    .button-container {
        display: flex;
        align-items: center;
        margin-left: 20px;
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
            border: 0;
            background-color: transparent;
            height: 22px;
            width: 22px;
            cursor: pointer;
        }
    }
}
</style>