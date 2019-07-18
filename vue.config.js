const resolve = dir => require('path').join(__dirname, dir);

module.exports = {
	transpileDependencies: [
		'vue-echarts',
		'resize-detector'
	],
	publicPath: process.env.NODE_ENV === 'production'
		? '/frog-admin/'
		: '/',
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
	},

	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:8002',
				changeOrigin: true,
				pathRewrite: {
					'^/api': '',
				}
			}
		},
		port: 9999,

	},
	runtimeCompiler: true
};
