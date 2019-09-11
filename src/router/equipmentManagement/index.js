const equipmentManagement = {
	path: '/equipmentManagement',
	name: '设备管理',
	component: () => import('../../views/equipmentManagement'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'machineAlarm',
			name: '设备报警',
			component: () => import('../../views/equipmentManagement'),
			children: [
			]
		},
	]
};

export default equipmentManagement;
