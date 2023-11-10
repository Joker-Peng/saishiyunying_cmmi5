<template>
    <div class="img-container" @mouseover="handleShowText" @mouseleave="handleHideText">
        <!-- 头像 -->
        <img class="img" :src="imgSrc" alt="" @click="handleClickUpload">
        <!-- 背景蒙层 -->
        <span v-if="showText && canUpload" class="text"  @click="handleClickUpload">{{imgText}}</span>
        <!-- 模拟点击 -->
        <input
            @change="priviewDialog"
            type="file"
            ref="file"
            v-show="false"
            name="headImg"
            accept="image/*"
        />
        <!-- pc弹窗 -->
        <dialogBox
            v-if="!isMobile()"
            :popup="dialogVisible"
            title="上传头像"
            top="10vh"
            width="650px"
            @cancelOrConfirm="handleCloseDialog"
        >
            <div class="head-dialog">
                <section>
                    <p>支持jpg、png格式的图片：</p>
                    <div style="position: relative;">
                        <img class="before-image" :src="localFileBase64" ref="image" alt="">
                    </div>
                </section>
                <section class="dialog-right">
                    <p>预览图片</p>
                    <div class="after-image"></div>
                </section>
            </div>
        </dialogBox>
        <!-- h5弹窗 -->
        <van-popup v-else v-model="dialogVisible" position="bottom" class="cropper">
            <!-- 关闭按钮 -->
            <i icon="el-icon-arrow-left" class="cropper-close" @click="handleCloseDialog('cancel')"></i>
            <div class="cropper-img">
                <img class="before-image" ref="image" :src="localFileBase64" alt="">
            </div>
            <div class="cropper-button">
                <button v-throttle="() => handleCloseDialog('confirm')">提交</button>
            </div>
      </van-popup>
    </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import dialogBox from "@/components/eventManage/dialog.vue";
import * as api_account from "../../api/account";
export default {
    components: {
        dialogBox
    },
    props: {
        // 当前头像
        value: {
            type: String,
            default: ""
        },
        // 能否上传
        canUpload: {
            type: Boolean,
            default: false
        },
        addText: {
            type: String,
            default: "添加头像"
        },
        editText: {
            type: String,
            default: "修改头像"
        }
    },
    data() {
        return {
            defaultHeadImg: require("@/assets/upload/head_default.png"),
            showText: false,
            dialogVisible: false,
            localFileBase64: "",
        }
    },
    computed: {
        imgSrc() {
            return this.value || this.defaultHeadImg
        },
        imgText() {
            return this.value ? this.editText : this.addText;
        }
    },
    methods: {
        handleShowText() {
            if(!this.isMobile()) {
                this.showText = true; 
            }
        },
        handleHideText() {
            if(!this.isMobile()) {
                this.showText = false;
            }
        },
        handleClickUpload() {
            if(this.canUpload) {
                this.$refs.file.click()
            }
        },
        handleCloseDialog(type) {
            if(type == "cancel") {
                this.myCropper.destroy();
                this.dialogVisible = false
            } else {
                // 上传
                this.uploadImg(this.getCropperFile()).then(() => {
                    this.myCropper.destroy();
                    this.dialogVisible = false;
                })
            }
        },
        priviewDialog(e) {
            const localFile = e.target.files[0];
            if(localFile) {
                // let url = URL.createObjectURL(localFile);
                let reader = new FileReader();
                reader.onload = e => {
                    this.localFileBase64 = e.target.result;
                    this.dialogVisible = true;
                    this.$nextTick(() => {
                        this.createImageObj()
                    });
                };
                reader.readAsDataURL(localFile);
            }
        },
        // 裁剪对象创建
        createImageObj() {
            this.myCropper = new Cropper(this.$refs.image, {
                viewMode: 1,
                dragMode: 'none',
                initialAspectRatio: 1,
                aspectRatio: 1,
                background: false,
                autoCropArea: 0.6,
                zoomOnWheel: false,
                outputType: "png",
                background: false,
                preview: ".after-image"
            })
        },
        uploadImg(file) {
            return new Promise((resolve, reject) => {
                var params = new FormData();
                params.append("file", file);
                params.append("userId", this.$store.getters.userInfo.id)
                api_account.uploadFile(params).then(res => {
                    if(res.success) {
                        this.$emit("input", res.data.url)
                        resolve()
                    }
                })
            })
        },
        getCropperFile() {
            const base64 = this.myCropper.getCroppedCanvas({
                imageSmoothingQuality: 'high'
            }).toDataURL('image/jpeg')
            var arr = base64.split(','); //分割为数组，分割到第一个逗号
            let mime = arr[0].match(/:(.*?);/)[1];//获取分割后的base64前缀中的类型
            let bstr = window.atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], this.$refs.file.files[0].name, { type: mime });
        }
    }
}
</script>

<style lang="scss" scoped>
.img-container {
    position: relative;
    height: 136px;
    width: 136px;
    border-radius: 50%;
    .img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        border-radius: 50%;
    }
    .text {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, .5);
        color: #ffffff;
        font-size: 14px;   
        border-radius: 50%;
        cursor: pointer;
    }
}
// pc弹窗
.head-dialog {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 25px 50px 0 50px;
  p {
    margin-bottom: 18px;
    font-size: 20px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }
  .before-image {
    width: 340px;
    max-height: 50vh;
  }
  .after-image {
    margin-top: 37px;
    height: 155px;
    width: 155px;
    border-radius: 50%;
    overflow: hidden;
  }
  .image-gray {
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(17,17,17,0.75)
  }
  .dialog-right {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
// h5弹窗
.cropper {
    height: 100vh;
    background: #000000;
    &-img {
        width: 100vw;
        height: calc(100vh - 76px);
    }
    .before-image {
        width: 100%;
        max-height: calc(100vh - 76px);
    }
    &-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 76px;
        width: 100%;
        background-color: #ffffff;
        button {
            width: calc(100% - 20px);
            height: 46px;
            background: #1D81EE;
            border-radius: 6px;
            color: #ffffff;
            font-size: 16px;
        }
    }
}
</style>