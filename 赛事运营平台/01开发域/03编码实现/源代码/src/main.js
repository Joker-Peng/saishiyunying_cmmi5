/* eslint-disable no-console */
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import routes from './router/routes';
import './styles/index.less';
// vant插件
import 'vant/lib/index.css';
import {
	NavBar,
	Popup,
	Badge,
	List,
	PullRefresh,
	Cell, CellGroup,
	DropdownMenu, DropdownItem,
	Search,
	Calendar,
	Overlay,
	Field,
	Area,
	Dialog,
	Checkbox,
	CheckboxGroup
} from 'vant';
Vue.use(Dialog);
Vue.use(NavBar);
Vue.use(Popup);
Vue.use(Badge);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Search);
Vue.use(Calendar);
Vue.use(Overlay);
Vue.use(Field);
Vue.use(Area);
Vue.use(Checkbox).use(CheckboxGroup);
// element插件
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
Vue.use(ElementUI);

import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage';
Vue.use(VueAreaLinkage);

import VueRouter from 'vue-router';
Vue.use(VueRouter);
import VueProto from './utils/vuePrototype';
Vue.use(VueProto);
import vueDirective from './utils/vueDirective';
Vue.use(vueDirective);
import htmlToPdf from "./utils/htmlToPdf";
Vue.use(htmlToPdf);

Vue.config.productionTip = false;



document.addEventListener('DOMContentLoaded', () => {
	const html = document.querySelector('html');
	let fontSize = window.innerWidth / 10;
	fontSize = fontSize > 50 ? 50 : fontSize;
	html.style.fontSize = fontSize + 'px';
});

let instance = null;
async function render(props = {}) {
	const {container} = props;
	await store.dispatch('init');
	const router = new VueRouter({
		base: process.env.BASE_URL,
		mode: 'hash',
		routes
	});
	router.beforeEach((to, from, next) => {
		const authLocation = new URL(location.href).searchParams.get("authorization");
		if (authLocation) {
			localStorage.setItem("authorization", authLocation);
			location.replace(location.href.split("?")[0]);
			return;
		}
		const authorization = authLocation || localStorage.getItem('authorization');
		let userInfo = store.getters.userInfo;
		if (authorization) {
			if (to.path == "/login") {
				if (userInfo.status === 0 || userInfo.status === 1 || userInfo.status === 4 || userInfo.status === 6 || userInfo.status === 7) {
					next({path: "/accountAuthentication"});
				} else {
					next({path: "/personal/personalDetail"});
				}
			} else {
				next();
			}
		} else if (to.path == "/login" || to.meta.passLogin) {
			next();
		} else {
			next({path: "/login"});
		}
	});
	window.appVue = new Vue({
		store,
		router,
		render: h => h(App)
	}).$mount(container ? container.querySelector('#app') : '#app');
}

// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) render();

export async function bootstrap() {
	console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
	console.log('[vue] props from main framework', props);
	render(props);
}
export async function unmount() {
	instance.$destroy();
	instance.$el.innerHTML = '';
	instance = null;
}
