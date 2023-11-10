const { name } = require('./package');
// const CompressionPlugin = require("compression-webpack-plugin") 
module.exports = {
	publicPath: `/${process.env.BASE_URL}`,
	outputDir: `dist/${process.env.BASE_URL}`,
	runtimeCompiler: true,
	devServer: {
		// before(app, server) { 
		// 	app.get(/.*.(js|html|css)$/, (req, res, next) => { 
		// 		req.url = req.url + '.gz';
		// 		res.set('Content-Encoding', 'gzip');
		// 		next();
		// 	})
		// },
		headers: {
			'Access-Control-Allow-Origin': '*'
		},
		proxy: {
			'^/console-demo-app/api': {
				target: process.env.VUE_APP_API_PROXY_URL
			},
			'^/.*/api': {
				target: process.env.VUE_APP_API_PROXY_URL_LOCAL
			}
		}
	},
	configureWebpack: {
		output: {
			library: `${name}-[name]`,
			libraryTarget: 'umd',
			jsonpFunction: `webpackJsonp_${name}`
		}
	},
	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
			args[0].title= '腾竞赛事运营支持系统'
			return args
		})
	},
	// chainWebpack(config){
	// 	config.plugin('html').tap(args => {
	// 		args[0].title= '腾竞赛事运营支持系统'
	// 		return args
	// 	})
	// 	config.plugin('compressionPlugin').use(
	// 		new CompressionPlugin({
	// 			test: /.*.(js|html|css)$/, // 匹配文件名
	// 			filename: asset => {
	// 				return `${asset.path}.gz${asset.query}`
	// 			},
	// 			algorithm: 'gzip',
	// 			threshold: 10240, // 对超过10k的数据压缩
	// 			minRatio: 0.8,
	// 			deleteOriginalAssets: false // 不删除源文件
	// 		})
	// 	)
	// }
};
