import {fetch} from '../utils/fetch';

// 地图仓库列表
export function mapsList(data) {
	return fetch({
		url: 'v3/maps/list',
		method: 'POST',
		data,
	});
}
// 地图仓库 add edit delete
export function mapsUpt(data, str) {
	return fetch({
		url: `v3/maps/${str}`,
		method: 'POST',
		data,
	});
}

// 裁判报告-同步            ------------- 裁判报告 --------------
export function syncReport(data) {
	return fetch({
		url: 'v3/refereeReport/sync',
		method: 'POST',
		data
	});
}
// 裁判报告地图选择文案配置
export function refereeReportConfig(data) {
	return fetch({
		url: 'v3/refereeReport/mapSelectionCopywritingConfig',
		method: 'POST',
		data,
	});
}
// 裁判报告详情
export function refereeReportInfo(data) {
	return fetch({
		url: 'v3/refereeReport/info',
		method: 'POST',
		data,
	});
}
// 裁判报告-主要信息保存
export function reportSave(data) {
	return fetch({
		url: 'v3/refereeReport/mainSave',
		method: 'POST',
		data,
	});
}
// 裁判报告-地图比赛新增        ------------- 地图比赛 --------------
export function mapMatchAdd(data) {
	return fetch({
		url: 'v3/refereeReport/mapMatchAdd',
		method: 'POST',
		data,
	});
}
// 裁判报告-地图比赛保存
export function mapMatchMainSave(data) {
	return fetch({
		url: 'v3/refereeReport/mapMatchMainSave',
		method: 'POST',
		data,
	});
}
// 裁判报告-地图比赛删除
export function mapMatchDelete(data) {
	return fetch({
		url: 'v3/refereeReport/mapMatchDelete',
		method: 'POST',
		data,
	});
}

// 裁判报告-地图比赛问题 新增 Add 编辑 Edit  ------------- 地图比赛问题 --------------
export function IssueUpt(data, str) {
	return fetch({
		url: `v3/refereeReport/mapMatchIssue${str}`,
		method: 'POST',
		data,
	});
}
// 裁判报告-地图比赛问题 删除
export function IssueDelete(data) {
	return fetch({
		url: 'v3/refereeReport/mapMatchIssueDelete',
		method: 'POST',
		data,
	});
}

// 问题类型列表                ------------- 问题类型 --------------
export function IssueTypes(data) {
	return fetch({
		url: 'v3/refereeReportIssueTypes/list',
		method: 'POST',
		data: {paging: 0, ...data},
	});
}
// 问题类型 add edit delete
export function IssueTypesUpt(data, str) {
	return fetch({
		url: `v3/refereeReportIssueTypes/${str}`,
		method: 'POST',
		data,
	});
}
