import axios from 'axios';
import store from '../store';
import { Message } from 'element-ui';
import { Notify } from 'vant';
const instance = axios.create({
	baseURL: process.env.VUE_APP_API_BASE_URL,
	timeout: 15000,
	// withCredentials: false,
});
// request interceptors
instance.interceptors.request.use(
	config => {
		// set authorization if exists
		if (store.getters.authorization) config.headers.authorization = store.getters.authorization;
		const userId = store.getters.userInfo.id
		if(config.method == "post") {
			config.data = config.data || {};
			userId && (config.data.userId = userId);
		} else {
			config.params = config.params || {};
			userId && (config.params.userId = userId);
		}
		// 将空参数移除
		// for(let key in config.data) {
		// 	if(!config.data[key]){
		// 		delete config.data[key]
		// 	}
		// }
		// for(let key in config.params) {
		// 	if(!config.params[key]){
		// 		delete config.params[key]
		// 	}
		// }
		store.commit("addReqNum", 1);
		return config;
	},
	err => Promise.reject(err)
);

// response interceptor
instance.interceptors.response.use(
	({ config, data }) => {
		const { errCode, success, errMsg } = data;
		if(!success) {
			let showError = window.appVue?.$message?.error || Message.error
			if(window.screen.width < 550) {
				showError = Notify
			}
			showError(errMsg)
			const authErr = [401000000, 401000001, 400104005]
			if (authErr.includes(errCode)) {
				store.commit("LOGOUT")
				return
			}
			if(errCode == 400104006) {
				appVue.$route.path != "/accountAuthentication" && appVue.$router.replace("/accountAuthentication")	
			}
		}
		store.commit("addReqNum", -1);
		return data;
	},
	err => {
		store.commit("addReqNum", -1);
		Promise.reject(err);
	}
);

export const fetch = instance;
