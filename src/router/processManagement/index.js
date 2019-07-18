const processManagement = {
	path: '/processManagement',
	name: '工艺管理',
	component: () => import('../../views/processMonitor'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'stallInfoConfig',
			name: '分档配置',
			component: () => import('../../views/processMonitor/stallInfoConfig')
		},
	]
};

export default processManagement;
