const baseSetting = {
	path: '/baseSetting',
	name: '基础设置',
	component: () => import('../../views/operateView'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'undesirableReason',
			name: '不良原因',
			component: () => import('../../views/operateView/undesirableReason')
		},
	]
};

export default baseSetting;
