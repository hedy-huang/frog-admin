const processManagement = {
	path: '/processManagement',
	name: '工艺管理',
	component: () => import('../../views/processMonitor'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'stationConfig',
			name: '站点配置',
			component: () => import('../../views/processMonitor/stationConfig')
		},
		{
			path: 'routeConfig',
			name: '流程配置',
			component: () => import('../../views/processMonitor/routeConfig')
		},
		{
			path: 'recipeManage',
			name: '配方',
			component: () => import('../../views/processMonitor/recipeManage')
		},
		{
			path: 'stallInfoConfig',
			name: '分档配置',
			component: () => import('../../views/processMonitor/stallInfoConfig')
		},
		{
			path: 'binBoxInfoConfig',
			name: '分选机bin盒配置',
			component: () => import('../../views/processMonitor/binBoxInfoConfig')
		},
		{
			path: 'machineCycleTime',
			name: '机器CycleTime',
			component: () => import('../../views/configuration/machineCycleTime')
		},
	]
};

export default processManagement;
