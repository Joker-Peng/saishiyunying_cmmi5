import Login from '../pages/Login';
import AccountAuthentication from '../pages/accountAuthentication/index.vue';
import demoRouter from './demo';

const routes = [
	{
		path: '/login',
		component: Login,
		meta: { title: 'login page', icon: 'el-icon-document', public: true }
	},
	{
		path: '/accountAuthentication',
		component: AccountAuthentication,
		meta: { title: '信息认证', icon: 'el-icon-document', public: true }
	},
	{ path: '/', redirect: '/personal', meta: {} },
	...demoRouter
];

export default routes;
