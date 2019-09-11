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
			path: 'borrowOrMoveMachine',
			name: '借机移机',
			component: () => import('../../views/configuration/borrowOrMoveMachine')
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
		{
			path: 'printLimit',
			name: '打印卡控',
			component: () => import('../../views/configuration/printLimit')
		},
		{
			path: 'sequenceConfig',
			name: '号码生成',
			component: () => import('../../views/configuration/sequenceConfig')
		},
		{
			path: 'systemConfig',
			name: '系统参数',
			component: () => import('../../views/configuration/systemConfig')
		},

	]
};

export default configuration;
