<template>
    <div class="view" :class="{mobile: isMobile()}">
        <img class="header" src="@/assets/announcement/announcement_header.png" alt="">
        <div class="main">
            <p class="main-title">{{announcement.title}}</p>
            <span class="main-time">{{this.$moment().format("YYYY-MM-DD HH:mm")}}</span>
            <div class="content" v-html="announcement.content"></div>
            <!-- 附件 -->
            <div class="mt40" v-if="announcement.attachment.length">
              <p class="attachment-title">附件：</p>
              <div class="attachment-container">
                <div class="attachment" v-for="item in announcement.attachment" :key="item.url">
                  <p>
                    <img :src="getIcon(item.type)" alt="">
                    <span>{{item.name}}</span>
                  </p>
                  <button @click="handleDownload(item.url)">
                    <img src="@/assets/upload/icon_download.png" alt=""><span>下载</span>
                  </button>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as api_account from "@/api/account";
export default {
  data() {
    return {
      announcement: {
        title: "", //标题
        content: "", //公告内容
        attachment: []
      },
    }
  },
  created() {
    console.log(this.$parent)
    this.loadData()
  },
  methods: {
    loadData() {
      api_account.getAnnouncementDetail({
        announcementId: this.$route.params.id,
        userId: this.$route.query.userId
      }).then(res => {
        if (res.success) {
          if(res.data.detail) {
            for(let key in res.data.detail) {
              this.announcement.hasOwnProperty(key) && (this.announcement[key] = res.data.detail[key])
            }
          }
          this.announcement.attachment = res.data.attachment;
        }
      });
    },
    getIcon(type) {
        //1	图片 2	word文档 3	excel文档 4	ppt文档 5	pdf文档 6	压缩文件
        let icon = "";
        switch(type) {
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
    handleDownload(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.mt40 {
  margin-top: 40px;
}
.view {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F4F5F9;
  font-size: 14px;
  .header {
    width: 100%;
    height: auto;
  }
  .main {
    display: flex;
    flex-direction: column;
    margin-top: -60px;
    padding: 60px 160px;
    width: calc(100vw - 320px);
    background-color: #fff;
    box-sizing: border-box;
    &-title {
      align-self: center;
      font-size: 30px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      line-height: 40px;
    }
    &-time {
      align-self: center;
      padding: 20px 0 30px;
      font-size: 14px;
      font-family: Helvetica;
      color: #999999;
      line-height: 17px;
    }
    .content {
      overflow: auto;
    }
  }
  &.mobile {
    .header {
      display: none;
    }
    .main {
      margin-top: 0;
      padding: 20px;
      width: 100%;
      &-title {
        align-self: start;
        font-size: 18px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #333333;
        line-height: 27px;
      }
      &-time {
        margin-bottom: 15px;
        align-self: start;
        width: 100%;
        border-bottom: 1px solid #ECEEF4;
        padding: 12px 0 16px;
        font-size: 14px;
        font-family: Gilroy-Regular, Gilroy;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
      }
      .content {
        overflow: auto;
      }
    }
    .mt40 {
      margin-top: 20px;
    }
    .attachment {
      padding: 0 16px;
      height: 50px;
      background: #F9F9F9;
      img {
        margin-right: 0;
      }
      button span {
        display: none;
      }
      p {
        font-size: 14px;
        color: #666666;
        img {
          margin-right: 10px;
          height: 25px;
        }
      }
      &-container {
        border: 0;
        border-radius: 0;
        padding: 0;
      }
      &-title {
        border-top: 1px solid #ECEEF4;
        padding-top: 20px;
        color: #333333;
        font-size: 18px;
      }
    }
  }
}
.attachment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  &:last-of-type {
    margin-bottom: 0;
  }
  &-title {
    height: 22px;
    font-size: 14px;
    color: #666666;
    line-height: 22px;
  }
  &-container {
    margin-top: 16px;
    border: 1px dashed #cccccc;
    border-radius: 5px;
    padding: 20px;
  }
  img {
    margin-right: 10px;
    height: 16px;
    width: auto;
  }
  >p {
    flex: auto;
    display: flex;
    align-items: center;
    height: 22px;
    width: 0;
    font-size: 14px;
    color: #333333;
    img {
      flex: none;
      margin-right: 16px;
    }
    span {
      width: 0;
      flex: auto;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  }
  button {
    flex: none;
    display: flex;
    align-items: center;
    border: 0;
    background-color: transparent;
    font-size: 14px;
    color: #1D81EE;
    cursor: pointer;
  }
}
</style>