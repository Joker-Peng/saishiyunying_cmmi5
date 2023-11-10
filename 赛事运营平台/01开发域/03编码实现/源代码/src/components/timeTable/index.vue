<template>
  <div v-if="isMobile()" class="timetable-mobile">
    <!-- 第一层：按时间遍历 -->
    <div class="main" v-for="dayData in value" :key="dayData.date">
      <p class="main-title">
        <span>{{ dayData.gameDate }}</span>{{ dayData.dayOfWeekText }}
      </p>
      <!-- 单日赛程遍历 -->
      <div class="game" v-for="item in dayData.contest" :key="item.contestScheduleId">
        <section class="column">
          <span class="label">{{ item.contestName }}&nbsp;&nbsp;{{ item.gameStage }}</span>
          <span class="value">赛事进程：{{ item.weekOfMonth }}</span>
        </section>
        <!-- 战队及时间、地点 -->
        <section class="column-main">
          <!-- a vs b -->
          <p class="vs">
            <span>{{ item.teamA }}</span>
            <img src="@/assets/timeTable/vs.png" alt="">
            <span>{{ item.teamB }}</span>
          </p>
          <p class="address">
            <img src="@/assets/timeTable/icon_address.png" alt="">
            <span>{{ item.city }}</span>
            <span>&nbsp;（{{ item.gameTime }}）</span>
          </p>
        </section>
        <section class="column" v-for="referee in item.referee" :key="referee.value">
          <span class="label">{{ referee.label }}</span>
          <span class="value">
            <template v-if="!referee.A.length && !referee.B.length">
              无
            </template>
            <template v-else>
              <p v-if="referee.A.length">
                A边:
                <span v-for="(refereeItem, refereeIndex) in referee.A" :key="refereeItem.id">
                  <span :class="getRefereeClass(refereeItem, dayData.gameDate, item.gameTime)">{{ refereeItem.name
                  }}</span>
                  <span v-if="refereeIndex != referee.A.length - 1">、</span>
                </span>
              </p>
              <p v-if="referee.B.length">
                B边：
                <span v-for="(refereeItem, refereeIndex) in referee.B" :key="refereeItem.id">
                  <span :class="getRefereeClass(refereeItem, dayData.gameDate, item.gameTime)">{{ refereeItem.name
                  }}</span>
                  <span v-if="refereeIndex != referee.B.length - 1">、</span>
                </span>
              </p>
            </template>
          </span>
        </section>
      </div>
    </div>
  </div>
  <div v-else class="timetable-container">
    <!-- 第一层：按时间遍历 -->
    <div class="main" v-for="dayData in value" :key="dayData.date">
      <p class="main-title">
        <span>{{ dayData.gameDate }}</span>{{ dayData.dayOfWeekText }}
      </p>
      <div class="column" v-for="item in dayData.contest" :key="item.contestScheduleId">
        <section class="column-header space-between">
          <div>
            <span class="column-name">{{ item.contestName }}</span>（BO：{{ item.bo }}）
          </div>
          <div class="column-header-right">
            <template v-if="contestAuth">
              <button class="button-del" @click="handleDeleteContest(item, dayData)">
                <img src="@/assets/timeTable/icon_delete.png" alt="">删除
              </button>
              <div class="line"></div>
              <button class="button-edit" @click="handleEditContest(item, dayData)">
                <img src="@/assets/timeTable/icon_edit.png" alt="">编辑
              </button>
              <template v-if="+$route.query.contestTypeId === 4">
                <div class="line"></div>
                <button class="button-edit" @click="onReport(item, dayData)">
                  <img src="@/assets/timeTable/icon_report.png" alt="">裁判报告
                </button>
              </template>
            </template>
            <div class="line" v-if="contestAuth && refereeAuth"></div>
            <template v-if="refereeAuth">
              <button class="button-view" @click="handleViewContest(item, dayData)">
                <img src="@/assets/timeTable/icon_time.png" alt="">操作记录
              </button>
            </template>
          </div>
        </section>
        <section class="column-main">
          <div class="module space-between">
            <!-- 时间 -->
            <span class="module-time">{{ item.gameTime }}</span>
            <!-- 阶段、进度、城市 -->
            <div class="module-detail">
              <div class="space-between">
                <span>
                  <img src="" alt="">赛事阶段：
                </span>
                <span>{{ item.gameStage || '--' }}</span>
              </div>
              <div class="space-between">
                <span>
                  <img src="" alt="">赛事进程：
                </span>
                <span>{{ item.weekOfMonth || "--" }}</span>
              </div>
              <div class="space-between">
                <span>
                  <img src="" alt="">城市：
                </span>
                <span>{{ item.city || "--" }}</span>
              </div>
            </div>
          </div>
          <div class="module module-team">
            <p class="team">
              <span class="column-name" @click="handleClickTeam(item.teamA, item.contestTypeId)">{{ item.teamA }}</span>
              <span class="module-vs">v.s</span>
              <span class="column-name" @click="handleClickTeam(item.teamB, item.contestTypeId)">{{ item.teamB }}</span>
            </p>
            <!-- <p style="color: #999">队伍</p> -->
          </div>
          <!-- 裁判列表 -->
          <div class="module module-referee" v-for="referee in item.referee" :key="referee.value">
            <!-- 标题 -->
            <p class="space-between">{{ referee.label }} <img v-if="refereeAuth"
                @click="handleClickPortItem(referee, item, dayData)" src="@/assets/timeTable/edit_gray.png" alt=""></p>
            <!-- A边 -->
            <p>
              <span class="referee-aside">A</span>
              <span v-for="(refereeItem, refereeIndex) in referee.A" :key="refereeItem.id">
                <el-popover :disabled="!refereeAuth" trigger="hover" placement="top" width="212">
                  <span slot="reference" :style="refereeAuth ? 'cursor: pointer' : ''" class="referee-item"
                    :class="getRefereeClass(refereeItem, dayData.gameDate, item.gameTime)"
                    @click="handleClickReferee(refereeItem, item, dayData, 'A边' + referee.label)">
                    {{ refereeItem.name }}
                  </span>
                  <div class="popover">
                    <span>裁判编号：REF{{ refereeItem.refereeNumber }}</span>
                    <span>点击裁判进行评分</span>
                  </div>
                </el-popover>
                <span v-if="refereeIndex != referee.A.length - 1">、</span>
              </span>
            </p>
            <!-- B边 -->
            <p>
              <span class="referee-aside">B</span>
              <span v-for="(refereeItem, refereeIndex) in referee.B" :key="refereeItem.id">
                <el-popover :disabled="!refereeAuth" trigger="hover" placement="top" width="212">
                  <span slot="reference" class="referee-item"
                    :class="getRefereeClass(refereeItem, dayData.gameDate, item.gameTime)"
                    @click="handleClickReferee(refereeItem, item, dayData, 'B边' + referee.label)">
                    {{ refereeItem.name }}
                  </span>
                  <div class="popover">
                    <span>裁判编号：REF{{ refereeItem.refereeNumber }}</span>
                    <span>点击裁判进行评分</span>
                  </div>
                </el-popover>
                <span v-if="refereeIndex != referee.B.length - 1">、</span>
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    // 数据
    value: {
      type: Array,
      default: [],
    },
    // 赛程编辑权限
    contestAuth: {
      type: Boolean,
      default: true
    },
    // 裁判编辑权限
    refereeAuth: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // dayData: 当天数据 contest：赛事数据
    onReport({contestScheduleId, gameStage, weekOfMonth, city}, {gameDate, dayOfWeekText}) {
      const query = {id: contestScheduleId, gameStage, weekOfMonth, city, gameDate, dayOfWeekText};
      this.$router.push({path: "/event/eventReport", query});
    },
    handleEditContest(contest, dayData) {
      this.$emit("editContest", contest, dayData);
    },
    handleDeleteContest(contest, dayData) {
      this.$emit("deleteContest", contest, dayData);
    },
    handleViewContest(contest, dayData) {
      this.$emit("viewContest", contest, dayData);
    },
    // referee: 当前点击的裁判
    handleClickReferee(referee, contest, dayData, part) {
      if (!this.refereeAuth) {
        return;
      }
      contest.part = part;
      this.$emit("clickReferee", referee, contest, dayData);
    },
    // port: 当前裁判类型的数据
    handleClickPortItem(port, contest, dayData) {
      this.$emit("clickPortItem", port, contest, dayData);
    },
    handleClickTeam(teamName, contestTypeId) {
      let {href} = this.$router.resolve({
        path: "/player",
        query: {
          teamDes: teamName,
          contestTypeId: contestTypeId,
        },
      });
      window.open(href);
    },
    getRefereeClass(refree, gameDate, gameTime) {
      let res = "";
      let gameStart = new Date((gameDate + " " + gameTime).replace("-", "/"));
      if (gameStart.valueOf() < new Date().valueOf()) {
        res = ["", "orange", "green"][refree.isScore];
      }
      return res;
    },
  },
};
</script>
<style  scoped lang="scss">
* {
  box-sizing: border-box;
}

.green {
  color: #21BD20
}

.orange {
  color: #FF7400
}

button {
  display: flex;
  align-items: center;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  vertical-align: center;
}

.space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timetable-container {
  color: #666666;
  font-size: 14px;

  .main {
    margin-bottom: 10px;

    &-title {
      padding-left: 20px;
      font-size: 16px;
      color: #1D81EE;
      line-height: 40px;

      span {
        margin-right: 10px;
      }
    }
  }

  .column {
    margin-bottom: 10px;
    background: #FFFFFF;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    &:last-of-type {
      margin-bottom: 0;
    }

    &-header {
      padding: 0 20px;
      border-bottom: 1px solid #E5E5E5;
      height: 50px;

      &-right {
        display: flex;
        align-items: center;
        font-size: 14px;

        .button-edit,
        .button-view {
          color: #1D81EE;
        }

        .button-del {
          color: #F70000;
        }

        .line {
          margin: 0 20px;
          width: 1px;
          height: 12px;
          background: #E5E5E5;
        }

        img {
          margin-right: 8px;
          margin-top: 2px;
          height: 14px;
          width: auto;
        }
      }
    }

    &-name {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }

    &-main {
      display: flex;
      align-items: center;
      padding: 20px 0;
      flex-wrap: nowrap;
      overflow: auto;

      .module:last-of-type {
        border-right: 0;
      }
    }
  }
}

.module {
  flex-shrink: 0;
  flex-grow: 1;
  padding: 0 20px;
  border-right: 1px solid #e5e5e5;
  height: 80px;

  &-time {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    width: 56px;
    height: 80px;
    background: #F6F7FB;
    border-radius: 5px;
    font-size: 14px;
    color: #1D81EE;
  }

  &-detail {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80px;
    width: 250px;

    img {
      display: none;
    }
  }

  &-team {
    display: flex;
    height: 80px;
    width: 192px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
      text-align: center;
      margin-bottom: 6px;

      &:last-of-type {
        margin: 0;
      }
    }
  }

  &-vs {
    font-size: 10px;
    margin: 0 10px;
    color: #999;
  }

  &-referee {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 215px;

    img {
      cursor: pointer;
    }
  }
}

.referee-aside {
  margin-right: 5px;
  font-weight: bold;
  font-size: 14px;
  color: #666666;
}

.popover {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #999999;
  line-height: 22px;
}

.team {
  font-family: Helvetica-Bold, Helvetica;
  font-weight: bold;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;

  span {
    cursor: pointer;
    display: flex;
    flex: 1;
    justify-content: center;
  }

  &-vs {
    margin: 0 1em;
    font-size: 12px;
    color: #999999;
    cursor: text !important;
    ;
  }
}

.timetable-mobile {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 20px;

  .main {
    &-title {
      text-align: center;
      line-height: 40px;
      color: #1D81EE;
    }

    .game {
      margin-bottom: 15px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    >div {
      padding: 0 15px;
      margin: 0 15px;
      background: #FFFFFF;
      box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
    }

    .column {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #E3EEF4;

      &:last-of-type {
        border: 0;
      }

      &-main {
        padding: 15px;
        width: 100%;
        height: auto;
        border-radius: 5px;
        background: #F6F7FB;

        .vs {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: #333333;

          img {
            width: 60px;
            height: auto;
          }

          span {
            width: 0;
            flex: 1;
            text-align: center;
          }
        }

        .address {
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            margin-right: 4px;
            height: 14px;
          }
        }
      }

      .label {
        margin-right: 20px;
        flex: none;
        width: auto;
        color: #333333;
        font-weight: 500;
      }

      .value {
        width: 0;
        flex: auto;
        text-align: right;

        p {
          margin-bottom: 5px;

          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>