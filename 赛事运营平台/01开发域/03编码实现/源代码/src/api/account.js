import { fetch } from '../utils/fetch';

export function queryAuthInfo() {
	return fetch({
		url: '/user/login',
		method: 'POST',
	});
}

export function getUserInfo(data) {
	return fetch({
		url: '/user/userInfo',
		method: 'POST',
		data,
	});
}

//赛事列表
export function matchList(data) {
	return fetch({
		url: 'v2/contest/list',
		method: 'POST',
		data,
	});
}
// 删除赛事contest/delete
export function matchDelete(data) {
	return fetch({
		url: 'v2/contest/delete',
		method: 'POST',
		data,
	});
}

//身份列表
export function getIdentityList(data) {
	return fetch({
		url: 'identity/list',
		method: 'POST',
		data,
	});
}

//权限列表
export function getPermissionList(data) {
	return fetch({
		url: 'permission/list',
		method: 'POST',
		data,
	});
}

//赛事下赛程列表
export function scheduleList(data) {
	return fetch({
		url: '/contest/schedule/list',
		method: 'POST',
		data,
	});
}
//用户信息认证/修改
export function userAuth(data) {
	return fetch({
		url: 'user/auth',
		method: 'POST',
		data,
	});
}
//我的排班信息
export function getMySchedule(data) {
	return fetch({
		url: 'user/mySchedule',
		method: 'POST',
		data,
	});
}
//新增排班信息
export function addSchedule(data) {
	return fetch({
		url: 'user/applySchedule',
		method: 'POST',
		data,
	});
}
//修改排班信息
export function editSchedule(data) {
	return fetch({
		url: 'user/editSchedule',
		method: 'POST',
		data,
	});
}

//账号列表
export function getAccountList(data) {
	return fetch({
		url: 'account/list',
		method: 'POST',
		data,
	});
}

//账号详情
export function getAccountDetail(data) {
	return fetch({
		url: 'account/detail',
		method: 'POST',
		data,
	});
}

// 裁判管理列表
export function getRefereeListV3(data) {
	return fetch({
		url: 'v3/referee/list',
		method: 'POST',
		data,
	});
}
// 裁判状态编辑
export function refereeStatusEdit(data) {
	return fetch({
		url: 'v3/referee/statusEdit',
		method: 'POST',
		data,
	});
}

//获取可选大赛事列表
export function getContestType() {
	return new Promise((resolve, reject) => {
		fetch({
			url: '/competitionSchedule/contestTypeAll',
			method: 'POST',
		}).then(res => {
			res.data = res.data.filter(d => d.isSuperAdmin || d.isAdmin);
			res.data.forEach((d,i) => {
				d.isSelect = true
			});
			resolve(res)
		});
	}) 
}
//根据大赛事获取小赛事信息
export function getContestList(data) {
	return fetch({
		url: '/competitionSchedule/contest',
		method: 'POST',
		data,

	});
}
//根据筛选条件获取赛程排班信息
export function getSearchSchedule(data) {
	return fetch({
		url: 'v2/competitionSchedule/index',
		method: 'POST',
		data,
	});
}
//赛事新增
export function addContest(data) {
	return fetch({
		url: '/v2/contest/create',
		method: 'POST',
		data,

	});
}
//赛事编辑
export function updateContest(data) {
	return fetch({
		url: '/v2/contest/update',
		method: 'POST',
		data,

	});
}
//根据赛程id以及裁判类型获取进行排班的用户
export function getRefereeList(data) {
	return fetch({
		url: '/competitionSchedule/referee',
		method: 'POST',
		data,

	});
}
//赛事下赛程新增
export function createMatchBySchedule(data) {
	return fetch({
		url: '/v2/contest/schedule/create',
		method: 'POST',
		data,

	});
}
//人员排班-人员排班日历
export function getCalendarInfo(data) {
	return fetch({
		url: '/userSchedule/calendarInfo',
		method: 'POST',
		data,

	});
}
// 短信通知
export function scheduleBatchSendSms(data) {
	return fetch({
		url: 'v2/contest/scheduleBatchSendSms',
		method: 'POST',
		data,

	});
}

//人员排班-申请排班审核
export function applyScheduleAuth(data) {
	return fetch({
		url: '/userSchedule/applyScheduleAuth',
		method: 'POST',
		data,

	});
}
//人员排班-申请换班详情
export function exchangeScheduleDetail(data) {
	return fetch({
		url: '/userSchedule/exchangeScheduleDetail',
		method: 'POST',
		data,

	});
}
//直接修改赛程的教练---排班
export function scheduleAddReferee(data) {
	return fetch({
		url: 'v2/competitionSchedule/addReferee',
		method: 'POST',
		data,

	});
}
//裁判在某个赛程可执法的位置
export function canJudgePosition(data) {
	return fetch({
		url: '/userSchedule/canJudgePosition',
		method: 'POST',
		data,

	});
}
//人员排班-申请换班审核
export function exchangeScheduleAuth(data) {
	return fetch({
		url: '/userSchedule/exchangeScheduleAuth',
		method: 'POST',
		data,

	});
}
//人员排班-申请调班详情
export function adjustScheduleDetail(data) {
	return fetch({
		url: '/userSchedule/adjustScheduleDetail',
		method: 'POST',
		data,

	});
}
//人员排班-申请调班审核
export function adjustScheduleAuth(data) {
	return fetch({
		url: '/userSchedule/adjustScheduleAuth',
		method: 'POST',
		data,

	});
}

//账号审核
export function accountAuth(data) {
	return fetch({
		url: '/account/auth',
		method: 'POST',
		data,
	});
}

//账号编辑
export function accountEdit(data) {
	return fetch({
		url: '/account/edit',
		method: 'POST',
		data,
	});
}

//消息通知userMessage/list
export function getUserMessage(data) {
	return fetch({
		url: '/userMessage/list',
		method: 'POST',
		data,
	});
}
//消息通知-设为已读 userMessage/read
export function userMessageRead(data) {
	return fetch({
		url: '/userMessage/read',
		method: 'POST',
		data,
	});
}
//未读消息数
export function userMessageNoRead(data) {
	return fetch({
		url: '/userMessage/noRead',
		method: 'POST',
		data,
	});
}
// 消息通知一键已读
export function userMessageReadAll(data) {
	return fetch({
		url: '/userMessage/readAll',
		method: 'POST',
		data,
	});
}

//申请换班审核user/applyExchangeScheduleAuth
export function applyExchangeScheduleAuth(data) {
	return fetch({
		url: '/user/applyExchangeScheduleAuth',
		method: 'POST',
		data,
	});
}

//申请调班审核user/applyAdjustScheduleAuth
export function applyAdjustScheduleAuth(data) {
	return fetch({
		url: '/user/applyAdjustScheduleAuth',
		method: 'POST',
		data,
	});
}
//申请换班时可选择的排班列表user/applyAdjustScheduleAuth
export function applyExchangeScheduleList(data) {
	return fetch({
		url: '/user/applyExchangeScheduleList',
		method: 'POST',
		data,
	});
}


//申请调班时可选择的人员 user/applyAdjustScheduleList
export function userApplyAdjustScheduleList(data) {
	return fetch({
		url: '/user/applyAdjustScheduleList',
		method: 'POST',
		data,
	});
}
//申请换班提交
export function applyExchangeScheduleSubmit(data) {
	return fetch({
		url: '/user/applyExchangeScheduleSubmit',
		method: 'POST',
		data,
	});
}

// 申请调班提交 user/applyAdjustScheduleSubmit
export function userApplyAdjustScheduleSubmit(data) {
	return fetch({
		url: '/user/applyAdjustScheduleSubmit',
		method: 'POST',
		data,
	});
}



//账号封禁 account/forbidden
export function accountForbidden(data) {
	return fetch({
		url: '/account/forbidden',
		method: 'POST',
		data,
	});
}

//申请调班取消 user/applyAdjustScheduleCancel
export function userApplyAdjustScheduleCancel(data) {
	return fetch({
		url: '/user/applyAdjustScheduleCancel',
		method: 'POST',
		data,
	});
}

//申请换班取消 user/applyExchangeScheduleCancel
export function userApplyExchangeScheduleCancel(data) {
	return fetch({
		url: '/user/applyExchangeScheduleCancel',
		method: 'POST',
		data,
	});
}

//赛事下赛程编辑 contest/schedule/update
export function updateSchedule(data) {
	return fetch({
		url: '/v2/contest/schedule/update',
		method: 'POST',
		data,
	});
}
//将赛事公开或关闭 
export function openContest(data) {
	return fetch({
		url: '/contest/openContest',
		method: 'POST',
		data,
	});
}

//赛程同步
export function scheduleSync(data) {
	return fetch({
		url: '/v2/contest/scheduleSync',
		method: 'POST',
		data,
	});
}

//提交用户排班数据---人员排班
export function addRefereeOne(data) {
	return fetch({
		url: 'v2/competitionSchedule/addRefereeOne',
		method: 'POST',
		data,
	});
}

//删除赛程 contest/schedule/delete
export function deleteContestSchedule(data) {
	return fetch({
		url: '/contest/schedule/delete',
		method: 'POST',
		data,
	});
}

export function importContest(data) {
	return fetch({
		url: "file/upload",
		method: "POST",
		data
	})
} 

//城市列表 public/cityList
export function cityList(data) {
	return fetch({
		url: "public/cityList",
		method: "POST",
		data
	})
} 

// 我的薪资
export function getMySalary(data) {
	return fetch({
		url: "v2/user/salaryList",
		method: "POST",
		data
	})
} 
// 薪资options
export function getSalaryList(data) {
	return fetch({
		url: "v2/salary/list",
		method: "POST",
		data
	})
} 
// 薪资BO配置
export function getSalaryBOList(data) {
	return fetch({
		url: "v2/salary/boList",
		method: "POST",
		data
	})
} 
// 薪资新增
export function addSalary(data) {
	return fetch({
		url: "v2/salary/create",
		method: "POST",
		data
	})
} 
// 薪资编辑
export function editSalary(data) {
	return fetch({
		url: "v2/salary/update",
		method: "POST",
		data
	})
} 
// 薪资删除
export function deleteSalary(data) {
	return fetch({
		url: "v2/salary/delete",
		method: "POST",
		data
	})
} 

// 排班统计列表
export function getPlanList(data) {
	return fetch({
		url: "v2/scheduleStatistic/index",
		method: "POST",
		data
	})
} 
// 获取总排班量
export function getRefereeScheduleList(data) {
	return fetch({
		url: "v2/scheduleStatistic/refereeScheduleList",
		method: "POST",
		data
	})
} 

// 查看评分
export function getRefereeScoreList(data) {
	return fetch({
		url: "v2/scheduleStatistic/refereeScoreList",
		method: "POST",
		data
	})
} 
export function addRefereeOtherScore(data) {
	return fetch({
		url: "v2/scheduleStatistic/addRefereeOtherScore",
		method: "POST",
		data
	})
} 
export function editRefereeOtherScore(data) {
	return fetch({
		url: "v2/scheduleStatistic/updateRefereeOtherScore",
		method: "POST",
		data
	})
} 
export function deleteRefereeOtherScore(data) {
	return fetch({
		url: "v2/scheduleStatistic/deleteRefereeOtherScore",
		method: "POST",
		data
	})
} 

// 公告管理
// 公告列表
export function getAnnouncementList(data) {
	return fetch({
		url: "v2/announcement/list",
		method: "POST",
		data
	})
} 
// 非管理员
export function getAnnouncementListView(data) {
	return fetch({
		url: "v2/announcement/view",
		method: "POST",
		data
	})
} 
// 公告详情
export function getAnnouncementDetail(data) {
	return fetch({
		url: "v2/announcement/detail",
		method: "POST",
		data
	})
} 
// 公告新增
export function addAnnouncement(data) {
	return fetch({
		url: "v2/announcement/create",
		method: "POST",
		data
	})
} 
// 公告编辑
export function updateAnnouncement(data) {
	return fetch({
		url: "v2/announcement/update",
		method: "POST",
		data
	})
} 
// 公告删除
export function deleteAnnouncement(data) {
	return fetch({
		url: "v2/announcement/delete",
		method: "POST",
		data
	})
} 
// 公告发布
export function releaseAnnouncement(data) {
	return fetch({
		url: "v2/announcement/publish",
		method: "POST",
		data
	})
} 
// 选手列表
export function getPlayerList(data) {
	return fetch({
		url: "v2/player/playerList",
		method: "POST",
		data
	})
} 
// 评分
export function setScore(data) {
	return fetch({
		url: "v2/competitionSchedule/addRefereeMatchScore",
		method: "POST",
		data
	})
} 
// 获取评分
export function getScore(data) {
	return fetch({
		url: "v2/competitionSchedule/getRefereeMatchScore",
		method: "POST",
		data
	})
} 

// 赛程操作记录
export function operationLog(data) {
	return fetch({
		url: "v2/competitionSchedule/operationLog",
		method: "POST",
		data
	})
} 

// 历史赛事维护列表
export function contestHistoryList(data) {
	return fetch({
		url: "v3/contestHistory/list",
		method: "POST",
		data
	})
} 
// 历史赛事维护新增
export function contestHistoryAdd(data) {
	return fetch({
		url: "v3/contestHistory/add",
		method: "POST",
		data
	})
} 
// 历史赛事维护编辑
export function contestHistoryEdit(data) {
	return fetch({
		url: "v3/contestHistory/edit",
		method: "POST",
		data
	})
} 
// 历史赛事维护删除
export function contestHistoryDelete(data) {
	return fetch({
		url: "v3/contestHistory/delete",
		method: "POST",
		data
	})
} 

// 上传文件
export function uploadFile(data) {
	return fetch({
		url: "v2/public/uploadFile",
		method: "POST",
		data
	})
} 



// 自定义薪资***
// 自定义薪资列表接口
export function userDefinedPayList(data) {
	return fetch({
		url: "v3/userDefinedPay/list",
		method: "POST",
		data
	})
} 
// 自定义薪资新增
export function userDefinedPayAdd(data) {
	return fetch({
		url: "v3/userDefinedPay/add",
		method: "POST",
		data
	})
} 
// 自定义薪资删除
export function userDefinedPayDelete(data) {
	return fetch({
		url: "v3/userDefinedPay/delete",
		method: "POST",
		data
	})
} 
// ******