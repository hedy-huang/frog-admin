const productionManagement = {
	path: '/productionManagement',
	name: '生产管理',
	component: () => import('../../views/operateView'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'workOrderInfo',
			name: '工单管理',
			component: () => import('../../views/operateView/workOrderInfo')
		},
		{
			path: 'researchWorkOrder',
			name: '研发工单切换',
			component: () => import('../../views/operateView/researchWorkOrder')
		},
		{
			path: 'workOrderBookCell',
			name: '工单报工（工艺段）',
			component: () => import('../../views/operateView/workOrderBookCell')
		},
		{
			path: 'printVerify',
			name: '浆料网版验证',
			component: () => import('../../views/operateView/printVerify')
		},
		{
			path: 'sizeBook',
			name: '浆料报工',
			component: () => import('../../views/operateView/sizeBook')
		},
		{
			path: 'plateOffline',
			name: '网版下线',
			component: () => import('../../views/operateView/plateOffline')
		},
		{
			path: 'attendanceRecord',
			name: '人员打卡',
			component: () => import('../../views/operateView/attendanceRecord')
		},
		{
			path: 'texture',
			name: '前清洗',
			component: () => import('../../views/operateView/texture')
		},
		{
			path: 'diffusion',
			name: '扩散',
			component: () => import('../../views/operateView/diffusion')
		},

	]
};

export default productionManagement;
