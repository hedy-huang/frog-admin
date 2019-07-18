const configuration = {
	path: '/configuration',
	name: '系统设置',
	component: () => import('../../views/configuration'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'factoryConfig',
			name: '工厂设置',
			component: () => import('../../views/configuration/factoryConfig')
		},
		{
			path: 'shiftConfig2',
			name: '班次定义',
			component: () => import('../../views/configuration/shiftConfig2')
		},
		{
			path: 'userRightConfig',
			name: '用户定义',
			component: () => import('../../views/configuration/userRightConfig')
		},
		{
			path: 'production',
			name: '产品维护',
			component: () => import('../../views/configuration/production')
		},

	]
};

export default configuration;
