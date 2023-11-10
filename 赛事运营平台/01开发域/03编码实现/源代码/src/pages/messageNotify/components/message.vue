<template>
  <div v-if="isMobile()" class="mobile">
    <div class="message-container">
      <img
        v-if="isRead == 0 ? true : false"
        src="@/assets/message/msg_new.png"
      />
      <img v-else src="@/assets/message/msg.png" />
      <section class="message-main">
        <p class="message-title">{{ message }}</p>
        <p class="message-date">{{ timeStr }}</p>
      </section>
    </div>
    <section class="message-button-box">
      <slot>
        <Button
          v-for="(item, index) in button"
          :key="index"
          v-bind="item"
          @clickAction="clickAction"
        ></Button>
      </slot>
    </section>
  </div>
  <div v-else class="message-container">
    <img v-if="isRead == 0 ? true : false" src="@/assets/message/msg_new.png" />
    <img v-else src="@/assets/message/msg.png" />
    <section class="message-main">
      <p class="message-title">{{ message }}</p>
      <p class="message-date">{{ timeStr }}</p>
    </section>
    <section class="message-button-box">
      <slot>
        <Button
          v-for="(item, index) in button"
          :key="index"
          v-bind="item"
          @clickAction="clickAction"
        ></Button>
      </slot>
    </section>
  </div>
</template>

<script>
import Button from "./button.vue";
export default {
  components: { Button },
  props: {
    messageId: {
      type: Number,
      default: 0,
    },

    type: {
      type: Number,
      default: 0,
    },
    isRead: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      default: "",
    },

    date: {
      type: [Date, String],
      default: () => new Date(),
    },
    // 对象数组 type + value
    button: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    timeStr() {
      return "时间：" + this.$moment(this.date).format("YYYY-MM-DD");
    },
  },

  methods: {
    clickAction(e) {
      this.$emit("actionMessage", e, this.messageId, this.type);
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
</style>
