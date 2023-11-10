import VueRouter from 'vue-router';
import routes from './routes';

const router = new VueRouter({
	base: process.env.BASE_URL,
	mode: 'hash',
	routes
});


export default router;
