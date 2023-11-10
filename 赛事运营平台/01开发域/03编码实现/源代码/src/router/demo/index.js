const Main = () => import('../../layout/Main.vue');
const personalDetail = () => import('../../pages/personal/personalDetail/index.vue');//个人信息
const mySchedule = () => import('../../pages/personal/mySchedule/index.vue');//我的排班
// const salary = () => import("@/pages/personal/salary/index.vue"); //我的薪资
const salary = () => import("@/pages/personal/salary/salary.vue"); //我的薪资
const accountManage = () => import('../../pages/accountManage/index.vue');//账号管理
const accountCheckDetail = () => import('../../pages/accountCheckDetail/index.vue');//账号审核
const refereeManage = () => import('../../pages/refereeManage/index.vue');//裁判管理
const refereeMember = () => import('../../pages/refereeManage/detail.vue');//裁判详情
const eventManage = () => import('../../pages/eventManage/index.vue');//赛事管理
const privateSchedule = () => import('../../pages/privateSchedule/index.vue');//人员排班
const scheduleList = () => import('../../pages/scheduleList/index.vue');//排班列表
const messageNotify = () => import('../../pages/messageNotify/index.vue');//消息通知
const eventAgent = () => import('../../pages/eventAgent/index.vue');//赛程管理
const eventReport = () => import('../../pages/eventReport/index.vue');//裁判报告
const eventSchedule = () => import('../../pages/eventSchedule/index.vue');//赛事排班
const accountAuthentication = () => import('../../pages/accountAuthentication/index.vue');//信息认证
const salaryConfig = () => import("@/pages/salaryConfig");
const plan = () => import("@/pages/plan"); //排班统计
const planView = () => import("@/pages/plan/planView.vue");
const scoreView = () => import("@/pages/plan/scoreView.vue");
const salaryView = () => import("@/pages/plan/salaryView.vue");
const announcement = () => import("@/pages/announcement");
const announcementAdd = () => import("@/pages/announcement/edit.vue");
const announcementView = () => import("@/pages/announcement/view.vue");
const player = () => import("@/pages/player");
const qsy = () => import("@/pages/qsy");
const history = () => import("@/pages/history");
const ValMap = () => import("@/pages/ValMap");
const ValIssues = () => import("@/pages/ValMap/ValIssues.vue");

const demoRouter = [
	{
		path: '/personal',
		component: Main,
		// redirect: '/personal/personalDetail',
		meta: {code: 'page:demo', title: '个人中心', icon: 'personal', iconActive: 'personal-active', menu: true, activeMenu: '/personal'},
		children: [
			{
				path: '/personal/personalDetail',
				component: personalDetail,
				meta: {code: 'page:personalDetail', title: '个人信息', icon: 'el-icon-caret-right', menu: true, activeMenu: '/personal/personalDetail', hasMobile: true}
			},
			{
				path: '/personal/mySchedule',
				component: mySchedule,
				meta: {code: 'page:mySchedule', title: '我的排班', icon: 'el-icon-caret-right', menu: true, activeMenu: '/personal/mySchedule', hasMobile: true}
			},
			{
				path: '/personal/salary',
				component: salary,
				meta: {code: 'page:salary', title: '我的薪资', icon: 'el-icon-caret-right', menu: true, activeMenu: '/personal/salary', hasMobile: false}
			}
		]
	},
	{
		path: '/accountManage',
		redirect: '/accountManage',
		component: Main,
		meta: {code: 'page:accountManage', title: '账号管理', icon: 'account', iconActive: 'account-active', menu: true, activeMenu: '/accountManage', superAdmin: true},
		children: [
			{
				path: '',
				component: accountManage,
				meta: {code: 'page:accountManage', title: '账号管理', icon: 'el-icon-caret-right', menu: false}
			}, {
				path: '/accountManage/accountAuthentication',
				component: accountAuthentication,
				meta: {code: 'page:accountAuthentication', title: '账号认证', icon: 'el-icon-caret-right', menu: false}
			}, {
				path: '/accountManage/checkDetail',
				component: accountCheckDetail,
				meta: {code: 'page:checkDetail', title: '账号审核', icon: 'el-icon-caret-right', menu: false}
			}
		]
	},
	{
		path: '/refereeManage',
		redirect: '/refereeManage',
		component: Main,
		meta: {code: 'page:referee', title: '裁判名单', icon: 'account', iconActive: 'account-active', menu: true, activeMenu: '/refereeManage'},
		children: [
			{
				path: '',
				component: refereeManage,
				meta: {code: 'page:referee', title: '裁判名单', icon: 'el-icon-caret-right', menu: false, hasMobile: true, permission: "superAdmin"}
			},
			{
				path: '/refereeManage/member',
				component: refereeMember,
				meta: {code: 'page:referee', title: '裁判详情', icon: 'el-icon-caret-right', menu: false, hasMobile: true}
			},
		]
	},
	{
		path: '/event',
		component: Main,
		redirect: '/event',
		meta: {code: 'page:eventManage', title: '赛事管理', icon: 'match', iconActive: 'match-active', menu: true, activeMenu: '/event', admin: true},
		children: [
			{
				path: '',
				component: eventManage,
				meta: {code: 'page:eventManage', title: '赛事管理', icon: 'el-icon-caret-right', menu: false}
			},
			{
				path: '/event/eventAgent',
				component: eventAgent,
				meta: {code: 'page:eventAgent', title: '赛程管理', icon: 'el-icon-caret-right', menu: false}
			},
			{
				path: '/event/eventReport',
				component: eventReport,
				meta: {code: 'page:eventReport', title: '赛程管理', icon: 'el-icon-caret-right', menu: false}
			},
		]
	},
	{
		path: '/match',
		component: Main,
		redirect: '/match/eventManage',
		meta: {code: 'page:scheduleList', title: '排班管理', icon: 'work', iconActive: 'work-active', menu: true, activeMenu: '/accountManage'},
		children: [
			{
				path: '/match/eventManage',
				component: eventSchedule,
				meta: {code: 'page:eventManage', title: '赛事排班', icon: 'el-icon-caret-right', menu: true, hasMobile: true}
			},
			{
				path: '/match/privateSchedule',
				component: privateSchedule,
				meta: {code: 'page:privateSchedule', title: '人员排班', icon: 'el-icon-caret-right', menu: true}
			}
		]
	},
	{
		path: '/messageNotify',
		component: Main,
		meta: {code: 'page:messageNotify', title: '消息通知', icon: 'notify', iconActive: 'notify-active', menu: true, activeMenu: '/accountManage'},
		children: [
			{
				path: '',
				component: messageNotify,
				meta: {code: 'page:messageNotify', title: '消息通知', icon: 'el-icon-caret-right', menu: false, hasMobile: true, customHeader: true}
			}
		]
	},
	{
		path: '/plan',
		component: Main,
		meta: {code: 'page:plan', title: '排班统计', icon: 'plan', iconActive: 'plan-active', menu: true, activeMenu: '/plan'},
		children: [
			{
				path: '',
				component: plan,
				meta: {code: 'page:plan', title: '排班统计', icon: 'el-icon-caret-right', menu: false, hasMobile: false}
			},
			{
				path: 'planView',
				component: planView,
				meta: {code: 'page:planView', title: '查看总排班量', icon: 'el-icon-caret-right', menu: false, hasMobile: false}
			},
			{
				path: 'scoreView',
				component: scoreView,
				meta: {code: 'page:scoreView', title: '查看评分', icon: 'el-icon-caret-right', menu: false, hasMobile: false}
			},
			{
				path: 'salaryView',
				component: salaryView,
				meta: {code: 'page:salaryView', title: '查看薪资', icon: 'el-icon-caret-right', menu: false, hasMobile: false}
			},
		]
	},
	{
		path: '/noticeList',
		component: Main,
		meta: {code: 'page:noticeList', title: '公告管理', icon: 'announcement', iconActive: 'announcement-active', menu: true, activeMenu: '/noticeList'},
		children: [
			{
				path: '',
				component: announcement,
				meta: {code: 'page:noticeList', title: '公告管理', icon: 'el-icon-caret-right', menu: false, hasMobile: true, permission: "superAdmin"}
			},
			{
				path: "edit/:id",
				component: announcementAdd,
				meta: {code: 'page:noticeList', title: '公告管理', icon: 'el-icon-caret-right', menu: false, hasMobile: true}
			}
		]
	},
	{
		path: '/announcement/view/:id',
		component: announcementView,
		meta: {code: 'page:noticeList', title: '公告', menu: false, passLogin: true},
	},
	{
		path: '/player',
		component: Main,
		meta: {code: 'page:player', title: '选手管理', icon: 'player', iconActive: 'player-active', menu: true, activeMenu: '/player'},
		children: [
			{
				path: '',
				component: player,
				meta: {code: 'page:player', title: '选手管理', icon: 'el-icon-caret-right', menu: false, hasMobile: true}
			}
		]
	},
	{
		path: '/link',
		component: Main,
		meta: {code: 'page:qsy', title: '友情链接', icon: 'link', iconActive: 'link', menu: true, activeMenu: '/link', hidePcMenu: true},
		children: [
			{
				path: '',
				component: qsy,
				meta: {code: 'page:qsy', title: '友情链接', icon: 'el-icon-caret-right', menu: false, hasMobile: false}
			}
		]
	},
	{
		path: '/dataMaintenance',
		component: Main,
		meta: {code: 'page:demo', title: '系统配置', icon: 'personal', iconActive: 'personal-active', menu: true, activeMenu: '/personal', superAdmin: true},
		children: [
			{
				path: '/valMap',
				component: ValMap,
				meta: {code: 'page:ValMap', title: 'VAL地图仓库', icon: 'el-icon-caret-right', menu: true, activeMenu: '/valMap', superAdmin: 4}
			},
			{
				path: '/ValIssues',
				component: ValIssues,
				meta: {code: 'page:ValIssues', title: 'VAL问题管理', icon: 'el-icon-caret-right', menu: true, activeMenu: '/ValIssues', superAdmin: 4}
			},
			{
				path: '/history',
				component: history,
				meta: {code: 'page:history', title: '执裁赛事维护', icon: 'el-icon-caret-right', menu: true, activeMenu: '/history', hasMobile: false}
			},
			{
				path: '/salaryConfig',
				component: salaryConfig,
				meta: {code: 'page:salaryConfig', title: '薪资配置', icon: 'el-icon-caret-right', menu: true, activeMenu: '/salaryConfig', },
			},
		]
	},

];

export default demoRouter;