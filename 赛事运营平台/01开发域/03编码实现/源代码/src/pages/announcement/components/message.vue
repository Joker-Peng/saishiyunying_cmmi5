<template>
  <div v-if="isMobile()" class="mobile">
    <div class="message-container">
      <img
        v-if="isRead == 0 ? true : false"
        src="@/assets/message/msg_new.png"
      />
      <img v-else src="@/assets/announcement/icon_message.png" />
      <section class="message-main">
        <p class="message-title">【{{typeStr}}】{{title}}</p>
        <p class="message-date">{{ timeStr }}</p>
      </section>
    </div>
    <section class="message-button-box">
      <div class="button" @click="clickAction">
        <img src="@/assets/message/view_gray.png" alt="">
        查看
      </div>
    </section>
  </div>
  <div v-else class="message-container">
    <img src="@/assets/announcement/icon_message.png" />
    <section class="message-main">
      <p class="message-title">【{{typeStr}}】{{title}}</p>
      <p class="message-date">{{ timeStr }}</p>
    </section>
    <section class="message-button-box">
      <div class="button" @click="clickAction">
        <img src="@/assets/message/view_gray.png" alt="">
        查看
      </div>
    </section>
  </div>
</template>

<script>
import Button from "./button.vue";
export default {
  components: { Button },
  props: {
    id: {
      type: Number,
      default: 0,
    },

    status: {
      type: Number,
      default: 0,
    },
    isRead: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      default: "",
    },
    typeStr: {
      type: String,
      default: "日常公告"
    },
    createdAt: {
      type: [Date, String],
      default: () => new Date(),
    }
  },
  computed: {
    timeStr() {
      return "发布时间：" + this.$moment(this.createdAt).format("YYYY-MM-DD HH:mm");
    },
  },

  methods: {
    clickAction(e) {
      this.$emit("actionMessage", {id: this.id});
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile {
  margin: 10px 0;
  padding: 0 20px;
  background-color: #ffffff !important;
  .message-container {
    padding: 16px 0 18px;
    border-bottom: 1px solid #eceef4;
    img {
      margin-right: 10px;
      height: 32px;
      width: 32px;
    }
    .message-main {
      .message-title {
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
  .message-button-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
  }
}

.message-container {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px dashed #e4e8ed;
  img {
    flex: none;
    margin-right: 20px;
    height: 48px;
    width: 48px;
  }
  .message-main {
    flex: auto;
    width: 50%;
    font-family: MicrosoftYaHei;
    .message-title {
      margin-bottom: 10px;
      font-size: 16px;
      color: #333333;
      line-height: 21px;
    }
    .message-date {
      font-size: 14px;
      color: #999999;
    }
  }
  .message-button-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: none;
  }
}
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
    border: 1px solid #D9D9D9;
    color: #666666;
    &:hover {
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
    }
    img {
        margin-right: 10px;
        width: 14px;
        height: 11px;
    }
}
</style>
