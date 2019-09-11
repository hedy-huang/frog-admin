<template>
	<div>
		<fr-table :data="enterpriseTableData" :columns="columns" alignment="center">
			<el-table-column slot="expand" type="expand">
				<template slot-scope="scope">
					<el-table :data="scope.row.Sites">
						<el-table-column v-for="c in innerColumns" :key="c" :prop="c" :label="c"/>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column prop="CreateDate">
				<template slot-scope="scope">
					{{scope.row.CreateDate | normalizeDate}}
				</template>
			</el-table-column>
		</fr-table>
		{{enterpriseTableData}}
	</div>

</template>

<script>
	import {normalizeDate} from '../commonFunction/dateFilter'

	export default {
		name: "playground",
		data() {
			return {
				innerColumns:['SiteCode','EnterpriseName'],
				columns: [
					{
						name: '名称',
						prop: 'EnterpriseName'
					},
					{
						prop: 'EnterpriseID',
						name:'编号'
					},
					{
						prop:'Desc',
						name:'描述',
					}]
			}
		},
		filters:{
			normalizeDate,
		},
		methods: {},
		asyncComputed: {
			async enterpriseTableData() {
				let fd = new FormData();
				fd.set('flag', 'allEnterprise');
				return (await this.$axios.post('/api/Service/FactoryConfigService.ashx', fd)).data;
			}
		},

	}
</script>

<style lang="scss" scoped>
	canvas {
		border: 1px solid black;
	}
</style>
