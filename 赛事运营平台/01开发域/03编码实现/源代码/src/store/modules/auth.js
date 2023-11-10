import jwt from 'jsonwebtoken';
import routes from '../../router/routes';
// eslint-disable-next-line camelcase
import * as api_account from '../../api/account';

export const INIT = 'INIT';
export const SET_PROFILE = 'SET_PROFILE';
export const SET_PERMISSION = 'SET_PERMISSION';
export const LOGOUT = 'LOGOUT';
export const SET_COACH = 'SET_COACH';
export const SET_UNREAD = 'SET_UNREAD';
export const SET_QSYLOGINURL = 'SET_QSYLOGINURL';

const store = {
	state: {
		microMode: 0,
		micros: [
			{ name: 'auth', title: '权限管理' },
			{ name: 'referee', title: '裁判管理' }
		],
		menus: routes,
		authorization: '',
		elementCache: {},
		userInfo: { },
		permission: [],
		partTimeCoach: true,
		unRead: 0,
		qsyLoginUrl: "",
		reqNum: 0 //正在请求的接口数量
	},
	getters: {
		microMode: state => state.microMode,
		micros: state => state.micros,
		menus: state => state.menus,
		authorization: state => state.authorization,
		checkAuth: state => code => state.elementCache[code],
		userInfo: state => state.userInfo,
		permission: state => state.permission,
		partTimeCoach: state => state.partTimeCoach,
		unRead: state => state.unRead,
		qsyLoginUrl: state => state.qsyLoginUrl,
		reqNum: state => state.reqNum
	},
	mutations: {
		[INIT](state) {
			// eslint-disable-next-line no-underscore-dangle
			if (window.__POWERED_BY_QIANKUN__) state.microMode = 1;
			const authorization = window.localStorage.getItem('authorization');
			if (authorization) state.authorization = authorization;
		},
		[LOGOUT](state) {
			state.authorization = '';
			window.localStorage.removeItem('authorization');
			this.commit("reset");
			location.reload()
		},
		[SET_PROFILE](state, data) {
			state.userInfo = { ...data};
		},
		[SET_PERMISSION](state, data) {
			state.permission = [...data];
			let superAdmin = state.permission.some(d => d.permissionTypeId == 1);
			let admin = state.permission.some(d => d.permissionTypeId == 1 || d.permissionTypeId == 2);
			// 根据permission设置路由
			if(!admin) {
				for(let i = 0; i < routes.length; i++) {
					if(routes[i].meta.admin || routes[i].meta.superAdmin) {
						routes.splice(i, 1);
						i--;
					} else {
						// 判断子级
						const childrenRoutes = routes[i].children || [];
						for(let j = 0; j < childrenRoutes.length; j++) {
							// 子路由权限修改
							if(childrenRoutes[j].meta.permission == "admin" || childrenRoutes[j].meta.permission == "superAdmin") {
								childrenRoutes[j].meta.permission = "readonly";
							}
							// 子路由删除
							if(childrenRoutes[j].meta.admin || childrenRoutes[j].meta.superAdmin) {
								childrenRoutes.splice(j, 1);
								j--;
							}
						}
						if(routes[i].meta.menu && !childrenRoutes?.length) {
							routes.splice(i, 1);
							i--;
						}
					}
				}
			} else if(!superAdmin) {
				for(let i = 0; i < routes.length; i++) {
					if(routes[i].meta.superAdmin) {
						routes.splice(i, 1);
						i--;
					} else {
						// 判断子级
						const childrenRoutes = routes[i].children || [];
						for(let j = 0; j < childrenRoutes.length; j++) {
							// 子路由权限修改
							if(childrenRoutes[j].meta.permission == "superAdmin") {
								childrenRoutes[j].meta.permission = "readonly";
							}
							// 子路由删除
							if(childrenRoutes[j].meta.superAdmin) {
								childrenRoutes.splice(j, 1);
								j--;
							}
						}
						if(routes[i].meta.menu && !childrenRoutes?.length) {
							routes.splice(i, 1);
							i--;
						}
					}
				}
			} else {
				// 是超管， 根据超管类型设置路由
				let superAdminArr = state.permission.filter(d => d.permissionTypeId == 1);
				let isLPLSuperAdmin = superAdminArr.some(d => d.contestTypeId == 1);
				let isLDLSuperAdmin = superAdminArr.some(d => d.contestTypeId == 2);
				let isWRLSuperAdmin = superAdminArr.some(d => d.contestTypeId == 3);
				let isVALSuperAdmin = superAdminArr.some(d => d.contestTypeId == 4);
				let checkMetaFailed = meta => {
					let checkLPLFail = meta.superAdmin === 1 && !isLPLSuperAdmin;
					let checkLDLFail = meta.superAdmin === 2 && !isLDLSuperAdmin;
					let checkWRLFail = meta.superAdmin === 3 && !isWRLSuperAdmin;
					let checkVALFail = meta.superAdmin === 4 && !isVALSuperAdmin;
					return checkLPLFail || checkLDLFail || checkWRLFail || checkVALFail
				}
				for(let i = 0; i < routes.length; i++) {
					if(checkMetaFailed(routes[i].meta)) {
						routes.splice(i, 1);
						i--;
					} else {
						// 判断子级
						const childrenRoutes = routes[i].children || [];
						for(let j = 0; j < childrenRoutes.length; j++) {
							// 子路由删除
							if(checkMetaFailed(childrenRoutes[j].meta)) {
								childrenRoutes.splice(j, 1);
								j--;
							}
						}
						if(routes[i].meta.menu && !childrenRoutes?.length) {
							routes.splice(i, 1);
							i--;
						}
					}
				}
			}
			
		},
		[SET_COACH](state, data) {
			// 1兼职裁判 0非兼职裁判
			state.partTimeCoach = Boolean(data);
		},
		[SET_UNREAD](state, data) {
			state.unRead = data || 0;
		},
		[SET_QSYLOGINURL](state, data) {
			state.qsyLoginUrl = data;
		},
		reset(state) {
			state = {
				microMode: 0,
				micros: [
					{ name: 'auth', title: '权限管理' },
					{ name: 'referee', title: '裁判管理' }
				],
				menus: routes,
				authorization: '',
				elementCache: {},
				userInfo: { },
				permission: [],
				partTimeCoach: true,
				unRead: 0
			}
		},
		addReqNum(state, data) {
			state.reqNum+= data;
		}
	},
	actions: {
		async init({ state,dispatch, commit }) {
			commit(INIT);
			if(!location.href.includes("/announcement/view")) {
				await dispatch("login", state.authorization);
			}
		},
		async login({ state, commit }, data) {
			if(data) {
				state.authorization = data;
			}
			const defaultRoute = routes.find(d => d.path == "/");
			
			if (!state.authorization) {
				defaultRoute.redirect = "/login";
				return;
			}
			const res = await api_account.queryAuthInfo();
			console.log(res)
			if (!res.success) {
				defaultRoute.redirect = "/login"
				// 清除登录信息
				localStorage.clear();
				state.authorization = ""
				return
			}
			const {
				data: {
					userPermission,
					userInfo,
					isCOREREFEREE,
					unread,
					qsyLoginUrl
				}
				// eslint-disable-next-line camelcase
			} = res;
			// 在此处添加默认跳转
			// 1.用户首次登录/注册，用户状态是0，则只能进入首次认证页面，提交认证信息后，用户状态改为1
			// 2.若首次认证审核未通过，状态改为4，可再次提交审核，状态改为1，直至审核通过，状态改为3
			// 3.用户在通过状态下，修改认证信息提交审核，状态改为2
			// 4.若再次认证审核未通过，状态改为5，可再次提交审核，状态改为2，直至审核通过，状态改为3
			// 5.在用户状态是3的情况下，后台可能直接将用户封禁，此时前端用户只能进入首次认证页面，但并不是首次认证，修改认证信息提交审核，状态改为6
			// 6.若封禁下待审核未通过，状态改为7，可再次提交审核，状态改为6，直至审核通过，状态改为3
			if (userInfo.forbidden === 1) {
				//封禁
				defaultRoute.redirect = "/accountAuthentication"
			} else {
				if (userInfo.status === 0 || userInfo.status === 1 || userInfo.status === 4 || userInfo.status === 6 || userInfo.status === 7) {
					defaultRoute.redirect = "/accountAuthentication"
				} else {
					defaultRoute.redirect = "/personal/personalDetail"
				}
			}
			commit(SET_PROFILE, userInfo);
			commit(SET_PERMISSION, userPermission);
			commit(SET_COACH, isCOREREFEREE);
			commit(SET_UNREAD, unread);		
			commit(SET_QSYLOGINURL, qsyLoginUrl)		
		},
	}
};

export default store;
