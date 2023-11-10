<template>
  <div class="box">
    
    <div class="box-title">
      <div v-for="item in tableTitle" :class="{'box-content-right': item.includes('操作'),'box-content-case': ['主裁判', '场上裁判', '场下裁判'].includes(item)}">{{ item }}</div>
    </div>
     <div class="box-content-top" v-if ="tableData.length<1">
        <div class="tip" >暂无数据</div>
      </div>
    <div class="box-content" v-for="item in tableData">
     
      <div class="box-content-top">
        <div class="box-content-topdate">{{ item.date }}</div>
        <div class="box-content-topweek">{{ item.week }}</div>
        <!-- <div style="margin: 10px" v-if="type != 'manage'">周：{{ item.weekNum }}</div> -->
      </div>
      <template v-if="['manage', 'schedule'].includes(type)">
        <div class="box-content-bottom" v-for="v in item.children" :style="v.errFlag==1?'background: #f5bc23;':''">
          <div >{{ v.time }}</div>
          <template v-if="type == 'schedule'">
            <div>{{v.contestName}}</div>
            <div>{{v.weekOfMonth}}</div>
          </template>
          <el-tooltip content="点击队伍查看选手" placement="top" effect="light">
            <div class="team">
              <span @click="handleClickTeam(v.team1, v.contestTypeId)">{{ v.team1 }}</span>
              <span class="team-vs">v.s</span>
              <span @click="handleClickTeam(v.team2, v.contestTypeId)">{{ v.team2 }}</span>
            </div>
          </el-tooltip>
          <div v-if="type == 'manage'">{{ v.weekOfMonth }}</div>
          <div>{{ v.city }}</div>
          <div>{{ v.bo }}</div>
          <div class="box-content-case">
            <el-tooltip :disabled="type == 'manage'" content="点击裁判进行评分" placement="top" effect="light">
              <div class="referee-container">
                <p v-for="(val, key) in v.chief" :key="key">
                  <span v-if="val && val.length" style="color: #999999">{{key}}：</span>
                  <span class="referee-list">
                    <span v-for="(person,personIndex) in val" :key="person.refereeUserId">
                      <span :class="getRefereeClass(person, v)" @click="handleClickReferee(person,v,key,'主裁判')">{{person.name}}</span>
                      <span v-if="personIndex < val.length - 1">、</span>
                    </span>
                  </span>
                </p>
              </div> 
            </el-tooltip>
            <el-tooltip :disabled="type == 'manage'" content="点击修改裁判" placement="top" effect="light">
              <i @click="editItem(v,'chief')" class="el-icon-edit-outline" v-if="item.canEditFlag==1" style="color:#409EFF"></i>
            </el-tooltip>
          </div>
          <div class="box-content-case">
            <el-tooltip :disabled="type == 'manage'" content="点击裁判进行评分" placement="top" effect="light">
              <div class="referee-container">
                <p v-for="(val, key) in v.court" :key="key">
                  <span v-if="val && val.length" style="color: #999999">{{key}}：</span>
                  <span class="referee-list">
                    <span v-for="(person,personIndex) in val" :key="person.refereeUserId">
                      <span :class="getRefereeClass(person, v)" @click="handleClickReferee(person,v,key,'场上裁判')">{{person.name}}</span>
                      <span v-if="personIndex < val.length - 1">、</span>
                    </span>
                  </span>
                </p>
              </div> 
            </el-tooltip>
            <el-tooltip :disabled="type == 'manage'" content="点击修改裁判" placement="top" effect="light">
              <i @click="editItem(v,'court')" class="el-icon-edit-outline" v-if="item.canEditFlag==1" style="color:#409EFF"></i>
            </el-tooltip>
          </div>
          <div class="box-content-case">
            <el-tooltip :disabled="type == 'manage'" content="点击裁判进行评分" placement="top" effect="light">
              <div class="referee-container">
                <p v-for="(val, key) in v.offCourt" :key="key">
                  <span v-if="val && val.length" style="color: #999999">{{key}}：</span>
                  <span class="referee-list">
                    <span v-for="(person,personIndex) in val" :key="person.refereeUserId">
                      <span :class="getRefereeClass(person, v)" @click="handleClickReferee(person,v,key,'场下裁判')">{{person.name}}</span>
                      <span v-if="personIndex < val.length - 1">、</span>
                    </span>
                  </span>
                </p>
              </div> 
            </el-tooltip>
            <el-tooltip :disabled="type == 'manage'" content="点击修改裁判" placement="top" effect="light">
              <i @click="editItem(v,'offCourt')" class="el-icon-edit-outline" v-if="item.canEditFlag==1" style="color:#409EFF"></i>
            </el-tooltip>
          </div>
          <div class="box-content-right">
            <el-button v-if="type=='schedule'" @click="handleView(v)" class="button">
              <img style="height: 10px" src="@/assets/salary/icon_eyes.png" alt="">
              查看
            </el-button>
            <el-button
              v-if="type == 'manage'"
              type="primary"
              plain
              icon="el-icon-edit-outline"
              size="small"
              @click="edit(v)"
              >编辑</el-button
            >
            <el-button
              v-if="type == 'manage'"
              type="danger"
              plain
              icon="el-icon-delete"
              size="small"
              @click="deleteItem(v)"
              >删除</el-button
            >
          </div>
        </div>
      </template>
      <!-- 薪资,查看总排班量 -->
      <div v-else class="box-content-bottom" v-for="(v,index) in item.children" :key="index" :style="v.errFlag==1?'background: #f5bc23;':''">
        <div >{{ v.time }}</div>
        <div>{{v.contestName}}</div>
        <el-tooltip content="点击队伍查看选手" placement="top" effect="light">
          <div class="team">
            <span @click="handleClickTeam(v.team1, v.contestTypeId)">{{ v.team1 }}</span>
            <span class="team-vs">v.s</span>
            <span @click="handleClickTeam(v.team2, v.contestTypeId)">{{ v.team2 }}</span>
          </div>
        </el-tooltip>
        <div>{{ v.city }}</div>
        <div>{{v.part}}</div>
        <div>{{v.price}}</div>
        <div>
          <span :class="{'salary-status': true, 'salary-status-success': v.status}">{{v.status ? "已结算" : "未结算"}}</span>
        </div>
        <div class="box-content-right">
          <el-button @click="handleView(v)" class="button">
            <img style="height: 10px" src="@/assets/salary/icon_eyes.png" alt="">
            查看评分
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    tableTitle:{
      type:Array,
      default:[]
    },
    tableData:{
      type:Array,
      default:[]
    },
    type:{
      type:String,
      default:""
    }
  },
  methods:{
    editItem(item,index){
      item.refereeType = index;
      this.$emit('portItem',item);
      // this.$emit('referee',index)
    },
    edit(item){
      this.$emit('edit',item)
    },
  //删除
    deleteItem(item){
      this.$emit('deleteItem',item)
    },
    handleView(item) {
      this.$emit("view", item)
    },
    handleClickTeam(teamName, contestTypeId) {
      let {href} = this.$router.resolve({
        path: "/player",
        query: {
          teamDes: teamName,
          contestTypeId: contestTypeId
        }
      })
      window.open(href)
    },
    getRefereeClass(refree, game) {
      let res = "black";
      let gameTime = new Date(game.date + " " + game.time);
      if(gameTime.valueOf() < new Date().valueOf()) {
        res = ["black", "orange", "green"][refree.isScore]
      }
      return res;
    },
    handleClickReferee(referee, column, key, type) {
      column.part = `${key}边${type}`
      this.$emit("clickReferee", referee, column)
    }
  }
  
}
</script>
<style  scoped lang="scss">
.err{
  color: red;
  font-size: 30px;
}
.black {
  color: #333333;
}
.orange {
  color: #FF7E00;
}
.green {
  color: #21BD20;
}
.tip{
  position: relative;
  top: 1px;
  color: #333333;
  font-size: 16px;
  width:200px;
  margin:0 auto;
  height: 20px;
  
}
  .box-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
}
.box-title > div,
.box-content-bottom > div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0;
  flex: 1;
}
.box-content-top {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  padding: 16px 20px;
  background-color: #f6f7fb;
}
.box-content-top .box-content-topdate {
  font-size: 14px;
  font-family: Helvetica;
  color: #333333;
}
.box-content-topweek {
  margin: 5px;
  padding: 0 10px;
}
.box-content-bottom, .box-title {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  position: relative;
  color: #333333;
  display: flex;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 10px;
}
.box-content-bottom::after {
  content: "";
  width: 97%;
  height: 1px;
  background-color: #dde1e6;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.box-content-bottom:last-child::after {
  display: none !important;
}
.box-content-right{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px!important;
  flex: none!important;
}
.box-content-case{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12em!important;
  flex: none!important;
}
.box-content-case span{
  margin-right: 3px;
}
.box-content-case i{
  cursor: pointer;
}

.button {
  border: 1px solid #1D81EE;
  color: #1D81EE;
}
.salary-status {
  display: flex;
  align-items: center;
  color: #FF005C;
  &:before {
    margin-right: 8px;
    content: "";
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #FF005C;
    overflow: hidden;
  }

}
.salary-status-success {
  color: #00B400;
  &:before {
    background: #00B400;
  }
}
.team {
  font-family: Helvetica-Bold, Helvetica;
  font-weight: bold;
  span {
    cursor: pointer;
  }
  &-vs {
    margin: 0 1em;
    font-size: 12px;
    color: #999999;
    cursor: text!important;;
  }
}
.referee-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start!important;
  width: 9em!important;
  justify-content: center;
  p {
    display: flex;
    align-items: center;
    .referee-list {
      width: calc(7em + 5px);
      overflow: auto;
    }
  }
}
</style>