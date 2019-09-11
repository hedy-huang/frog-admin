const factoryMonitor = {
	path: '/factoryMonitor',
	name: '全厂监控',
	component: () => import('../../views/kpi'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'machineProduction',
			name: '机器产量报表',
			component: () => import('../../views/kpi/machineProduction'),
		},
	]
};

export default factoryMonitor;
