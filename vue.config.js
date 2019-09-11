const resolve = dir => require('path').join(__dirname, dir);

module.exports = {
	transpileDependencies: [
		'vue-echarts',
		'resize-detector'
	],
	publicPath: process.env.NODE_ENV === 'production'
		? './'
		: './',
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
	},

	devServer: {
		proxy: {
			'/mes': {
				target: 'http://172.16.10.242:8003',
				changeOrigin: true,
				pathRewrite: {
					'^/mes': '',
				}
			},
			'/webApi': {
				target: 'http://172.16.10.242:8100',
				changeOrigin: true,
				pathRewrite: {
					'^/webApi': '',
				}
			},
		},
		port: 9999,

	},
	runtimeCompiler: true
};
