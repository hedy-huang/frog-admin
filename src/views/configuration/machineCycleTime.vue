<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="6">
				<enterprise-to-workmachine-tree ref="machineTree" machine-type="1" @nodeClick="getMachineCycleTime"></enterprise-to-workmachine-tree>
			</el-col>
			<el-col :span="18">
				<el-form :model="cycleTimeFormData" label-width="100px">
					<el-form-item label="机器CycleTime">
						<el-input v-model="cycleTimeFormData.CycleTime" type="number"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="small" @click="machineCycleTimeSave">提交</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import EnterpriseToWorkmachineTree from "../common/commonComponent/enterpriseToWorkmachineTree";
	export default {
		name: "machineCycleTime",
		components: {EnterpriseToWorkmachineTree},
		data(){
			return {
				cycleTimeFormData:{},
			}
		},
		methods:{
			getMachineCycleTime(){
				let node = this.$refs.machineTree.currentNode;
				if (node.Type===5) {
					let fd = new FormData();
					fd.set('flag', 'getMachineCycleTime');
					fd.set('workmachineId',node.ID);
					this.$axios.post('/mes/Service/EquipmentStatus.ashx', fd).then(res => {
						if (res.data){
							this.$set(this.cycleTimeFormData,'CycleTime',res.data.ParameterValue);
						} else {
							this.cycleTimeFormData={};
						}
					});
				}else {
					this.cycleTimeFormData={};
				}
			},
			machineCycleTimeSave(){
				let node = this.$refs.machineTree.currentNode;
				if (node && node.Type===5){
					let fd = new FormData();
					fd.set('flag', 'submitMachineCycleTime');
					fd.set('workMachineId',node.ID);
					fd.set('parameterValue',this.cycleTimeFormData.CycleTime);
					this.$axios.post('/mes/Service/EquipmentStatus.ashx', fd).then(res => {
						if (res.data==='success'){
							this.getMachineCycleTime();
							this.$message({
								type: 'success',
								message: '提交成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data,
								showClose: true,
							});
						}
					})
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体工艺机器！'
					});
				}
			},
		}
	}
</script>

<style scoped>

</style>