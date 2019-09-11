const traceability = {
	path: '/traceability',
	name: '数据报表',
	component: () => import('../../views/traceability'),
	meta:{
		icon:'setting'
	},
	children: [
		{
			path: 'printHistory',
			name: '打印历史',
			component: () => import('../../views/traceability/printHistory')
		},
	]
};

export default traceability;
