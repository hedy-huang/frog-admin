<template>
	<div>
		<time-query-form :query-form-data="queryTimeData" :clearable="false"></time-query-form>
		<el-radio-group v-model="processStep">
			<el-radio :label="0">投入</el-radio>
			<el-radio :label="1">产出</el-radio>
		</el-radio-group>
		<common-table :data="getMachineProductionData" :columns="productionColumns"
									:pagination="true" v-loading="this.$asyncComputed.getMachineProductionData.updating">
			<el-table-column slot="columnR" prop="" label="差值(RFID产量-自动化产量)">
				<template slot-scope="scope">
					{{scope.row.RFIDProuction - scope.row.AutoMachineProuction}}
				</template>
			</el-table-column>
			<el-table-column slot="columnR" prop="" label="差值(流转产量-自动化产量)">
				<template slot-scope="scope">
					{{scope.row.LotProcessProduction - scope.row.AutoMachineProuction}}
				</template>
			</el-table-column>
		</common-table>
	</div>
</template>

<script>
	import TimeQueryForm from "../common/commonComponent/timeQueryForm";
	import CommonTable from "../common/commonComponent/commonTable";
	export default {
		name: "machineProduction",
		components: {CommonTable, TimeQueryForm},
		data(){
			return {
				queryTimeData:{BeginTime:new Date(),EndTime:new Date()},
				processStep:0,
				productionColumns:[{prop:"MachineName",label:"机器名称"},{prop:"MachineCode",label:"机器编码"},
					{prop:"LotProcessProduction",label:"流转产量"},{prop:"RFIDProuction",label:"RFID产量"},
					{prop:"AutoMachineProuction",label:"自动化机器产量"}],
			}
		},
		asyncComputed:{
			async getMachineProductionData(){
				let fd = new FormData();
				fd.set('flag', 'getMachineProduction');
				fd.set('beginTime',this.common.datetimeFormat(this.queryTimeData.BeginTime));
				fd.set('endTime',this.common.datetimeFormat(this.queryTimeData.EndTime));
				fd.set('processStep',this.processStep);
				let data= (await this.$axios.post('/mes/Service/KPIService.ashx', fd)).data;
				if(data){return data;}
				return [];
			},
		},
		created(){
			this.getShiftInfo();
		},
		methods:{
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
				this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
					this.$set(this.queryTimeData,'BeginTime',res.data.ShiftBegTime);
					this.$set(this.queryTimeData,'EndTime',res.data.ShiftEndTime);
				})
			},
		}
	}
</script>

<style scoped>

</style>