<template>
	<div>
		<fr-table :data="enterpriseTableData">
			<el-table-column slot="expand" type="expand"/>
		</fr-table>
		{{enterpriseTableData}}
	</div>

</template>

<script>

	export default {
		name: "playground",
		data() {
			return {

			}
		},
		methods: {

		},
		asyncComputed:{
			async enterpriseTableData(){
				let fd = new FormData();
				fd.set('flag', 'allEnterprise');
				return (await this.$axios.post('/api/Service/FactoryConfigService.ashx', fd)).data;
			}
		},
		mounted() {

		},
	}
</script>

<style lang="scss" scoped>
	canvas {
		border: 1px solid black;
	}
</style>
