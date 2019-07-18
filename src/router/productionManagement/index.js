const productionManagement = {
	path: '/productionManagement',
	name: 'productionManagement',
	component: () => import('../../views/operateView'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'attendanceRecord',
			name: '人员打卡',
			component: () => import('../../views/operateView/attendanceRecord')
		},
		{
			path: 'workOrderInfo',
			name: '工单管理',
			component: () => import('../../views/operateView/workOrderInfo')
		},
		{
			path: 'plateOffline',
			name: '网版下线',
			component: () => import('../../views/operateView/plateOffline')
		}
	]
};

export default productionManagement;
