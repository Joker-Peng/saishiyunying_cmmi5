<template>
  <div class="boxWrap">
    <div class="box" style="margin-bottom: 20px">
      <div class="title">
        <div class="title-left">
          <div class="chunk">
            <el-select
              placeholder="请选择赛事"
              v-model="filterData.contestTypeId"
              style="width: 224px"
            >
              <el-option
                v-for="item in contestTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <span v-if="isRouterPersonalSalary">我的薪资</span>
          <span v-else>查看薪资（{{ refereeName }}）</span>
        </div>
        <div class="title-left">
          <p class="pay-total">总薪资: <span>￥{{salaryCount || 0}}</span></p>
          <span class="back" @click="handleCancel" v-if="!isRouterPersonalSalary">
            <img src="@/assets/announcement/icon_back.png" alt />
            返回
          </span>
        </div>
      </div>

      <div class="detail">
        <div class="chunk-wrap">
          <div class="chunk">
            <div class="chunk-text">日期：</div>
            <el-date-picker
              v-model="filterData.beginDate"
              type="date"
              placeholder="请选择日期"
              :picker-options="dateRule[0]"
              :clearable="false"
              style="width: 150px"
            ></el-date-picker>
            <div style="margin: 0 4px">~</div>
            <el-date-picker
              v-model="filterData.endDate"
              type="date"
              placeholder="请选择日期"
              :picker-options="dateRule[1]"
              :clearable="false"
              style="width: 150px"
            ></el-date-picker>
          </div>
          <div class="chunk">
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </div>
          <div class="chunk" @click="handleReset">
            <el-image
              :src="require('@/assets/accountManage/reset.png')"
            ></el-image>
          </div>
        </div>
        <div class="chunk-wrap">
          <el-button
            class="chunk-button"
            style="background: #00afff; color: #ffffff"
             @click="handleExport"
            >导出</el-button
          >
          <el-button
            v-if="!isRouterPersonalSalary && isAdmin"
            class="chunk-button"
            style="background: #20bd20; color: #ffffff"
            @click="handleOpenCustomSalary"
            >新增自定义薪资</el-button
          >
        </div>
      </div>
    </div>

    <div class="box-cont">
      <div class="box-cont-left">
        <!-- 赛事薪资栏 -->
        <div class="box" style="margin-bottom: 20px">
          <div class="box-search-label">
            <p>赛事薪资：</p>
            <h1>￥{{contestSalaryTotal || 0}}</h1>
          </div>
          <div class="box-search-el">
            <el-select
              placeholder="请选择赛事名称"
              v-model="filterData.contestName"
              style="width: 224px; margin-right: 10px"
              @change="contestNameChange"
              clearable
            >
              <el-option
                v-for="item in contestNameOptions"
                :key="item.contestId"
                :label="item.contestName"
                :value="item.contestName"
              ></el-option>
            </el-select>
            <el-input placeholder="请输入赛事阶段" v-model="filterData.gameStage" style="width: 224px" @change="contestStageChange"></el-input>
          </div>
        </div>

        <!-- 赛事薪资列表 -->
        <div class="table-wrap">
          <el-table
            :data="raceSalaryList"
            style="width: 100%"
            height="500"
            :row-style="{ color: '#333333', 'font-size': '14px' }"
            :header-cell-style="{
              'background-color': 'transparent',
              'font-weight': 'bold',
              color: '#333333',
            }"
          >
            <el-table-column
              align="center"
              prop="date"
              label="时间"
              width="auto"
              min-width="100px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="match"
              label="赛事"
              width="auto"
              min-width="100px"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="team">
                  <span>{{scope.row.match}}</span>
                  <span class="team-stage">{{scope.row.gameStage}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="team"
              label="队伍"
              width="auto"
              min-width="120px"
            >
              <template slot-scope="scope">
                <el-tooltip content="点击队伍查看选手" placement="top" effect="light">
                  <div class="team">
                  <span @click="handleClickTeam(scope.row.team1, scope.row.contestTypeId)">{{ scope.row.team1 }}</span>
                  <span class="team-vs">v.s</span>
                  <span @click="handleClickTeam(scope.row.team2, scope.row.contestTypeId)">{{ scope.row.team2 }}</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="city"
              label="城市"
              width="auto"
              min-width="80px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="part"
              label="位置"
              width="auto"
              min-width="110px"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="operate-view operate-view-colm">
                  <span class="upP">{{scope.row.partPosition}}</span>
                  <span class="downP">{{scope.row.partSide}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="price"
              label="赛事薪资"
              width="auto"
              min-width="100px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="status"
              label="结算状态"
              min-width="80px"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="operate-view">
                  <span :class="{'salary-status': true, 'salary-status-success': scope.row.status}">{{scope.row.status ? "已结算" : "未结算"}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="operate"
              label="操作"
              min-width="80px"
            >
              <template slot-scope="scope">
                <div class="team">
                  <el-button type="text" @click="handleViewGrade(scope.row)"><i class="el-icon-view" style="margin-right: 5px"></i>评分</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div v-if="pageA.count" class="page">
            <!-- <div>共{{ pageA.count }}个，每页{{ pageA.pageSize }}条数据</div> -->
            <div>
              <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleACurrentChange"
                :total="pageA.count"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>

      <div class="box-cont-right">
        <!-- 自定义薪资栏 -->
        <div class="box" style="margin-bottom: 20px">
          <div class="box-search-label">
            <p>自定义薪资：</p>
            <h1>￥{{definedSalaryTotal || 0}}</h1>
          </div>
          <div class="box-search-el">
            <el-input
              placeholder="请输入薪资事件名称"
              style="width: 224px"
              v-model="filterData.payName"
              @change="payNameChange"
            ></el-input>
          </div>
        </div>

        <!-- 自定义薪资列表 -->
        <div class="table-wrap">
          <el-table
            :data="customSalaryList"
            style="width: 100%"
            height="500"
            :row-style="{ color: '#333333', 'font-size': '14px' }"
            :header-cell-style="{
              'background-color': 'transparent',
              'font-weight': 'bold',
              color: '#333333',
            }"
          >
            <el-table-column
              align="center"
              prop="payName"
              label="薪资事件名称"
              min-width="120px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="payDate"
              label="时间"
              min-width="120px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="amount"
              label="金额"
              min-width="80px"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="operate"
              label="操作"
              width="auto"
              fixed="right"
              v-if="!isRouterPersonalSalary && isAdmin"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleCustomSalaryDelete(scope.row)"
                  type="text"
                  size="small"
                  ><i class="el-icon-delete" style="margin-right: 5px"></i>删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div v-if="pageB.count" class="page">
            <!-- <div>共{{ pageB.count }}个，每页{{ pageB.pageSize }}条数据</div> -->
            <div>
              <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleBCurrentChange"
                :total="pageB.count"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 薪资自定义金额弹窗 -->
    <el-dialog
      title="新增自定义薪资"
      :visible.sync="customeSalaryAdd"
      width="480px"
      center
      custom-class="customClass"
      :close-on-click-modal="false"
      @close="dialogClose"
      class="salary-form-custom"
    >
      <div class="dialogBody">
        <el-form
          label-position="left"
          label-width="120px"
          :model="formCustomeSalaryAdd"
        >
          <el-form-item label="赛事类型：">
            <el-select
              placeholder="请选择赛事"
              disabled
              v-model="filterData.contestTypeId"
              style="width: 100%"
            >
              <el-option
                v-for="item in contestTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="薪资事件名称：">
            <el-input v-model="formCustomeSalaryAdd.payName" placeholder="请输入薪资事件名称" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="金额：" prop="amount">
            <el-input class="salary-amount" v-model.number="formCustomeSalaryAdd.amount" placeholder="请输入金额" @change="amountChange" style="width: 100%"></el-input>
            <!-- <el-input-number class="salary-amount" v-model="formCustomeSalaryAdd.amount" :controls="false" :min="0" :max="9999999999" style="width: 100%"></el-input-number> -->
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker
              v-model="formCustomeSalaryAdd.payDate"
              type="date"
              placeholder="请选择日期"
              :clearable="false"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCustomeSalaryCancel">取 消</el-button>
        <el-button type="primary" @click="handleCustomeSalaryAdd"
          :disabled="customeSalaryAddDisabled"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 自定义薪资删除弹窗 -->
    <el-dialog
      title="删除自定义薪资"
      :visible.sync="customeSalaryVisible"
      width="480px"
      center
      custom-class="customClass"
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <div class="dialogBody">
        <el-form
          label-position="left"
          label-width="110px"
          :model="formCustomeSalary"
          class="salary-form"
        >
          <el-form-item label="薪资事件名称：">
            <p>{{currRow.payName}}</p>
          </el-form-item>
          <el-form-item label="赛事类型：">
            <p>{{contestTypeIdName}}</p>
          </el-form-item>
          <el-form-item label="金额：">
            <p>￥{{currRow.amount || 0}}</p>
          </el-form-item>
          <el-form-item label="时间：">
            <p>{{currRow.payDate}}</p>
          </el-form-item>
          <el-form-item label="删除原因：">
            <el-input
              type="textarea"
              v-model="formCustomeSalary.deleteReason"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="customeSalaryVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDeleteConfirm"
          :disabled="customeSalaryConfirmDisabled"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查看评分 -->
    <detailDialog v-bind="dialog"  v-model="dialog.value"></detailDialog>
    
    <!-- 取消确认 -->
    <dialogBox :popup.sync="dialogBoxVisible" @cancelOrConfirm="handleCloseConfirmDialog">
      <span class="dialogBox-content">{{dialogBoxContent}}</span>
    </dialogBox>
  </div>
</template>
<script>
import dialogBox from "@/components/accountManage/dialog.vue";
import detailDialog from "@/components/dialogSalary/index.vue";
import * as api_account from "@/api/account";

export default {
  name: 'salaryView',
  components: {
    detailDialog,
    dialogBox
  },
  data() {
    const contestTypeId = this.$route.query.contestTypeId?parseInt(this.$route.query.contestTypeId):null;
    return {
      filterData: {
        contestTypeId: contestTypeId, //赛事
        contestName: '', //赛事名称
        beginDate: this.$moment().add(-1, 'month').toDate(), //开始时间
        endDate: new Date(), //结束时间
        gameStage: '', // 赛事阶段
        payName: '', // 薪资事件名称
      },
      contestTypeOptions: [],//赛事类型
      contestNameOptions: [],//赛事名称
      pageA: {
        count: 0,
        pageSize: 10,
        pageIndex: 1
      },
      pageB: {
        count: 0,
        pageSize: 10,
        pageIndex: 1
      },
      dateRule: [
        {
          disabledDate: (time) =>
            this.filterData.endDate &&
            time.valueOf() > this.filterData.endDate.valueOf(),
        },
        {
          disabledDate: (time) =>
            time.valueOf() < this.filterData.beginDate.valueOf(),
        },
      ],
      // 赛事薪资
      contestSalaryTotal: 0,
      // 自定义薪资
      definedSalaryTotal: 0,
      // 赛事薪资列表
      raceSalaryList: [],
      // 自定义薪资
      customSalaryList: [],
      // 薪资自定义金额弹窗
      customeSalaryAdd: false,
      formCustomeSalaryAdd: {
        contestTypeId: contestTypeId, //赛事
        payName: '',
        amount: null,
        payDate: null,
      },
      // 自定义薪资删除弹窗
      customeSalaryVisible: false,
      formCustomeSalary: {
        deleteReason: '',
      },
      currRow: {},
      dialog: {
        value: false,
        formData: {}
      },
      dialogBoxVisible: false,
      dialogBoxContent: '取消之后对于已作出的修改不会保存',
      routerPath: '',
      salaryRowsForExports: [], // 导出数据
    }
  },
  computed: {
    contestTypeIdName() {
      return this.contestTypeOptions.find(f=>f.value===this.filterData.contestTypeId)?.label
    },
    customeSalaryConfirmDisabled() {
      if(this.formCustomeSalary.deleteReason) {
        return false;
      }else{
        return true;
      }
    },
    customeSalaryAddDisabled() {
      if(this.formCustomeSalaryAdd.payName && this.formCustomeSalaryAdd.payDate && +this.formCustomeSalaryAdd.amount>0) {
        return false;
      }else{
        return true;
      }
    },
    // 是否为我的薪资页面
    isRouterPersonalSalary() {
      return this.routerPath==='/personal/salary'
    },
    refereeId() {
      if(this.isRouterPersonalSalary) {
        return +this.$store.getters.userInfo.id
      }else{
        return +this.$route.query.refereeId
      }
    },
    refereeName() {
      if(this.isRouterPersonalSalary) {
        return this.$store.getters.userInfo.name
      }else{
        return this.$route.query.refereeName
      }
    },
    isAdmin() {
      const list = this.$store.getters.permission||[];
      if(list.some(d=>d.permissionTypeId===1)) {
        return true;
      }else{
        return false;
      }
    },
    // 总薪资
    salaryCount() {
      return this.contestSalaryTotal + this.definedSalaryTotal
    },
  },
  watch: {
    "filterData.contestTypeId"() {
      this.filterData.contestName = "";
      this.loadcontestName();

      this.handleSearch();
    },
    "pageA.pageIndex"() {
      this.loadRaceData()
    },
    "pageB.pageIndex"() {
      this.loadCustomData()
    },
  },
  created() {
    // 判断是我的薪资还是排班统计下我的薪资
    this.routerPath = this.$route.path;
    if(this.isRouterPersonalSalary) {

    }else{
      if(this.$route.query.beginDate) {
        this.filterData.beginDate = this.$route.query.beginDate;
      }
      if(this.$route.query.endDate) {
        this.filterData.endDate = this.$route.query.endDate;
      }
    }

    this.loadContestType();
  },
  mounted() {
    
  },
  methods: {
    handleCancel() {
      this.$router.go(-1)
    },
    handleReset() {
      // this.filterData.contestTypeId = this.$route.query.contestTypeId?parseInt(this.$route.query.contestTypeId):null;
      this.filterData.contestName = ''
      this.filterData.gameStage = ''
      this.filterData.payName = ''
      this.filterData.beginDate = this.$moment().add(-1, 'month').toDate()
      this.filterData.endDate = new Date()
      this.pageA.pageIndex = 1
      this.pageB.pageIndex = 1
      
      this.loadRaceData();
      this.loadCustomData();
    },
    handleACurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageA.pageIndex = val;
      this.loadRaceData();
    },
    handleBCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageB.pageIndex = val;
      this.loadCustomData();
    },
    handleSearch() {
      this.pageA.pageIndex = 1
      this.pageB.pageIndex = 1

      this.loadRaceData();
      this.loadCustomData();
    },
    // 选择赛事名称change
    contestStageChange() {
      this.pageA.pageIndex = 1
      this.loadRaceData();
    },
    // 输入赛事阶段change
    contestNameChange() {
      this.pageA.pageIndex = 1
      this.loadRaceData();
    },
    // 自定义薪资change
    payNameChange() {
      this.pageB.pageIndex = 1
      this.loadCustomData();
    },
    handleCustomSalaryDelete(row) {
      this.currRow = row||{}
      this.customeSalaryVisible = true
    },
    loadContestType() {
      api_account.getContestType({}).then(res => {
        console.log("类型:" + res);
        if (res.success) {
          this.contestTypeOptions = res.data.map(item => ({
            value: item.contestTypeId,
            label: item.contestTypeName,
            isSelect: item.isSelect
          }));
          if(!this.$route.query.contestTypeId) {
            let selectedIndex = this.contestTypeOptions.findIndex(
              d => d.isSelect
            );
            if(selectedIndex===-1) {
              this.filterData.contestTypeId =
                this.contestTypeOptions[0]?.value || "";
            }else{
              this.filterData.contestTypeId =
                this.contestTypeOptions[selectedIndex]?.value || "";
            }

          }
          
          // 初始化的时候
          this.loadRaceData();
          this.loadCustomData()
          this.loadcontestName();
        }
      });
    },
    loadcontestName() {
      api_account.getContestList({
        page: 1,
        pageNum: 100,
        isPublish: -1,
        contestTypeId: this.filterData.contestTypeId,
      }).then((res) => {
        this.contestNameOptions = res.data.map(item => ({
            contestId: item.contestId,
            contestName: item.name
        }))
      });
    },
    // 自定义薪资
    loadCustomData() {
      api_account.userDefinedPayList({
        userId: this.$store.getters.userInfo.id,
        contestTypeId: this.filterData.contestTypeId,
        refereeId: this.refereeId,
        payName: this.filterData.payName,
        beginDate: this.$moment(this.filterData.beginDate).format("YYYY-MM-DD"),
        endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
        page: this.pageB.pageIndex,
        pageNum: this.pageB.pageSize
      })
      .then(res => {
        if (res.success) {
          const reslist = res.data.list||{}
          this.pageB.count = reslist.count;
          this.customSalaryList = reslist.rows||[];
          this.definedSalaryTotal = res.data.definedSalaryTotal||0;
        }
      })
    },
    // 赛事薪资
    loadRaceData() {
      api_account.getMySalary({
        contestTypeId: this.filterData.contestTypeId,
        contestName: this.filterData.contestName,
        gameStage: this.filterData.gameStage,
        beginDate: this.$moment(this.filterData.beginDate).format("YYYY-MM-DD"),
        endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
        page: this.pageA.pageIndex,
        pageNum: this.pageA.pageSize,
        refereeId: this.refereeId,
      }).then(res => {
        if(res.success) {
          this.pageA.count = res.data.count;
          this.contestSalaryTotal = res.data.contestSalaryTotal||0;
          let sideList = ["", "A边", "B边"];
          this.raceSalaryList = [];
          this.salaryRowsForExports = res.data.rows||[];
          res.data.rows.forEach((d,dindex) => {

            d.schedule.forEach((d1, d1index) => {
              const partPosition = this.$dictionary.position.find(d2 => d2.value == d1.position)?.label || ""
              this.raceSalaryList.push({
                ...d1,
                date: d.gameDate,
                week: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][d.dayOfWeek],
                "time": d1.gameTime,
                "match": d1.contestName,
                "team1": d1.teamA,
                "team2": d1.teamB,
                "id": d1.userWorkScheduleId,
                "city": d1.city,
                price: d1.payAmount,
                status: d1.isPay,
                part: `${sideList[d1.side]}：${partPosition}`,
                partSide: `${sideList[d1.side]}`,
                partPosition: partPosition,
                weekOfMonth: d.weekOfMonth,
                contestTypeId: this.filterData.contestTypeId
              })
            })
          })
        }
      })
    },
    handleExport() {
      this.handleExportRace();
      this.handleExportCustom();
    },
    handleExportRace() {
      let sideList = ["", "A边", "B边"];
      // api_account.getMySalary({
      //   contestTypeId: this.filterData.contestTypeId,
      //   contestName: this.filterData.contestName,
      //   gameStage: this.filterData.gameStage,
      //   beginDate: this.$moment(this.filterData.beginDate).format("YYYY-MM-DD"),
      //   endDate: this.$moment(this.filterData.endDate).format("YYYY-MM-DD"),
      //   page: this.pageA.pageIndex,
      //   pageNum: this.pageA.pageSize,
      //   refereeId: this.refereeId,
      //   isExport: 1
      // }).then(res => {
        
        // 数据为空不导
        if(this.salaryRowsForExports && this.salaryRowsForExports.length>0) {
          require.ensure([], () => {
            const { export_json_to_excel } = require("@/Excel/Export2Excel");
            const tHeader = [
              "时间",
              "赛事",
              "队伍",
              "城市",
              "位置",
              "赛事薪资",
              "结算状态",
            ]; // 上面设置Excel的表格第一行的标题
            const data = this.salaryRowsForExports.reduce((res, val) => {
              // 添加年月日星期
              // res.push([val.gameDate + " " + ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][val.dayOfWeek],"","","","","",""])
              res.push(...val.schedule.map(d => [
                `${val.gameDate} ${["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][val.dayOfWeek]} ${d.gameTime}`, 
                `${d.contestName} ${d.gameStage}`, 
                `${d.teamA} vs ${d.teamB}`, 
                d.city, 
                `${sideList[d.side]}：${this.$dictionary.position.find(d2 => d2.value == d.position)?.label || ""}`,
                d.payAmount,
                d.isPay ? "已结算" : "未结算"
              ]))
              return res;
            }, [])
            
            let fileName = 
            (this.contestTypeIdName?(this.contestTypeIdName+'-'):'')+
            (this.filterData.beginDate?(this.$moment(this.filterData.beginDate).format("YYYY-MM-DD")+'-'):'')+
            (this.filterData.endDate?(this.$moment(this.filterData.endDate).format("YYYY-MM-DD")+'-'):'')+
            (this.refereeName?(this.refereeName+'-'):'')+
            (this.filterData.contestName?(this.filterData.contestName+'-'):'')+
            (this.filterData.gameStage?(this.filterData.gameStage+'-'):'')+
            "的赛事薪资";
            export_json_to_excel(tHeader, data, fileName); //最后一个是表名字
          });
        }

      // })
    },
    handleExportCustom() {
      // 数据为空则不导
      if(this.customSalaryList && this.customSalaryList.length>0) {
        require.ensure([], () => {
          const { export_json_to_excel } = require("@/Excel/Export2Excel");
          const tHeader = [
            "薪资事件名称",
            "时间",
            "金额",
          ]; // 上面设置Excel的表格第一行的标题
          const data = this.customSalaryList.reduce((res, val) => {
            res.push([val.payName, val.payDate, val.amount]);
            return res;
          }, [])
          console.log(data)
          let fileName = 
            (this.contestTypeIdName?(this.contestTypeIdName+'-'):'')+
            (this.filterData.beginDate?(this.$moment(this.filterData.beginDate).format("YYYY-MM-DD")+'-'):'')+
            (this.filterData.endDate?(this.$moment(this.filterData.endDate).format("YYYY-MM-DD")+'-'):'')+
            (this.refereeName?(this.refereeName+'-'):'')+
            (this.filterData.payName?(this.filterData.payName+'-'):'')+
            "的自定义薪资";
          export_json_to_excel(tHeader, data, fileName); //最后一个是表名字
        });
      }

    },
    // 自定义薪资弹窗
    handleOpenCustomSalary() {
      this.customeSalaryAdd = true;
    },
    // 确认薪资 弹窗取消
    handleCustomeSalaryCancel() {
      this.dialogBoxVisible = true;
    },
    // 确认薪资 薪资自定义薪资
    handleCustomeSalaryAdd() {
      if(!this.customeSalaryAddDisabled && this.formCustomeSalaryAdd.payName && this.formCustomeSalaryAdd.payDate) {
        this.$nextTick(()=>{
          const params = {
            ...this.formCustomeSalaryAdd,
            payDate: this.$moment(this.formCustomeSalaryAdd.payDate).format("YYYY-MM-DD"),
            userId: this.$store.getters.userInfo.id,
            refereeId: this.refereeId,
            contestTypeId: +this.filterData.contestTypeId,
          }
          api_account.userDefinedPayAdd(params).then(res=>{
            if(res.success){
              this.$message({
                message: "新增自定义薪资成功",
                type: "success",
              });
              this.payNameChange();
              this.contestNameChange();
              this.customeSalaryAdd = false;
            }
          })
        })
      }
    },
    // 删除原因确认
    handleDeleteConfirm() {
      if(!this.customeSalaryConfirmDisabled && this.formCustomeSalary.deleteReason) {
        this.$nextTick(()=>{
          const params = {
            userId: this.$store.getters.userInfo.id,
            id: this.currRow.id,
            deleteReason: this.formCustomeSalary.deleteReason
          }
          api_account.userDefinedPayDelete(params).then(res=>{
            if(res.success){
              this.$message({
                message: "删除自定义薪资成功",
                type: "success",
              });
              this.payNameChange();
              this.contestNameChange();
              this.customeSalaryVisible = false;
            }
          })
        })
      }
    },
    // 弹窗关闭
    dialogClose() {
      this.formCustomeSalaryAdd.payName = '';
      this.formCustomeSalaryAdd.amount = null;
      this.formCustomeSalaryAdd.payDate = null;

      this.formCustomeSalary.deleteReason = '';
      this.currRow = {};
    },
    // 查看评分
    handleViewGrade(item) {
      this.dialog.formData = item;
      this.dialog.value = true;
    },
    // 查看队伍
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
    handleCloseConfirmDialog(type) {
      console.log({type})
      if(type == "confirm") {
        this.dialogBoxVisible = false;
        this.customeSalaryAdd = false;
      }else{
        this.dialogBoxVisible = false;
      }
    },
    amountChange(e) {
      console.log({amountChange: e})
      if(!Boolean(+e>0)) {
        this.formCustomeSalaryAdd.amount = null;
      }
    },
  },
}
</script>
<style scoped lang="scss">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  &-left {
    display: flex;
    align-items: center;
  }
  .back {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #1d81ee;
    font-weight: 400;
    cursor: pointer;
    img {
      margin-right: 6px;
      width: 16px;
      height: 13px;
    }
  }
}
.page {
  display: flex;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #999999;
  padding: 20px;
  align-items: center;
  /* justify-content: space-between; */
  justify-content: flex-end;
}
.detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 20px 0 0;
  &:last-of-type {
    padding-bottom: 20px;
  }
}
.chunk {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  padding-left: 20px;
  margin-right: 10px;
  &-wrap {
    display: flex;
    margin-top: 10px;
  }
  &-text {
    min-width: 70px;
  }
  &-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.pay-total {
  font-size: 20px;
  color: #333;
  margin-right: 20px;

  span {
    color: #f70000;
    font-size: 24px;
  }
}
.box-cont {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  width: 100%;
  justify-items: start;
  align-items: flex-start;

  &-left {
    display: flex;
    margin-right: 20px;
    width: calc(70% - 20px);
    flex-direction: column;
    justify-items: start;
    align-items: flex-start;

    .box {
      display: flex;
      flex: 1;
      box-sizing: border-box;
      flex-wrap: wrap;
      width: 100%;
    }
  }
  &-right {
    display: flex;
    width: 30%;
    flex-direction: column;
    justify-items: start;
    align-items: flex-start;

    .box {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      box-sizing: border-box;
      width: 100%;
    }
  }

  .box {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    padding: 30px 20px;
    align-items: center;
  }
  .box-search-label {
    display: flex;
    flex-direction: column;
    /* margin-right: 45px; */
    margin-right: 0;

    p {
      font-size: 14px;
      color: #666;
    }
    h1 {
      font-size: 28px;
      color: #333;
    }
  }
  .box-search-el {
    display: flex;
  }
  .table-wrap {
    background-color: #fff;
    border-radius: 10px;
    /* display: flex; */
    /* flex-direction: column;
    flex: 1; */
    width: 100%;
  }
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
.operate-view{
  display: flex;
  justify-content: center;

  &-colm{
    flex-direction: column;
  }
  .upP{
    font-weight: bold;
  }
  .downP{
    font-size: 12px;
    color: rgb(51, 51, 51);
  }
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
    cursor: text!important;;
  }
  &-stage{
    margin-top: 5px;
    font-weight: normal;
  }
}
.salary-form{
  .el-form-item {
    margin-bottom: 0;
  }
}
.salary-form-custom{
  .el-form-item {
    margin-bottom: 10px;
  }
}
.chunk-text{
  min-width: 50px;
}
</style>
<style lang="scss">
.customClass {
  .el-dialog__title {
    font-weight: bold;
    color: #111;
  }
  .dialogBody{
    border-top: 1px solid #DDE1E6;
    padding: 22px 28px 10px;
  }
  .el-dialog__footer{
    padding-top: 0!important;
  }
}
.salary-amount{
  .el-input{
    .el-input__inner{
      text-align: left;
    }
  }
}
</style>
