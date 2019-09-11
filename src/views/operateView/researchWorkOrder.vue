<template>
	<div>
		<el-form :model="machineSelectFormData" inline label-width="100px">
			<el-form-item label="工艺段">
				<el-select v-model="machineSelectFormData.WorkCellID" style="width: 100%" @change="workCellChange">
					<el-option v-if="workCellData.length>0"
										 v-for="item in workCellData"
										 :key="item.WorkCellID" :label="item.DisplayName" :value="item.WorkCellID">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="工艺机器">
				<el-select v-model="machineSelectFormData.WorkMachineID" filterable style="width: 100%" @change="machineChange">
					<el-option v-if="machineCellData.length>0"
										 v-for="item in machineCellData"
										 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-button size="small" style="float: right" @click="reSearchWorkOrder">切换研发工单</el-button>
		<common-table :data="getLotProcessInfoData" :columns="lotInfoColumns" ref="lotInfoTable"
									:pagination="true" :multiple-selection="true">
		</common-table>
		<el-dialog :visible.sync="reSearchDialogVisible" :before-close="reSearchWorkOrderCancel" append-to-body>
			<el-form :model="reSearchFormData"
							 label-position="left" label-width="100px" style="width: 95%">
				<el-form-item label="工单">
					<el-select v-model="reSearchFormData.WorkOrderID" style="width: 100%">
						<el-option v-if="reSearchWorkOrderData.length>0"
											 v-for="item in reSearchWorkOrderData"
											 :key="item.WorkOrderID" :label="item.WorkOrderNO" :value="item.WorkOrderID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="reSearchWorkOrderSave">保存</el-button>
					<el-button @click="reSearchWorkOrderCancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	export default {
		name: "researchWorkOrder",
		components: {CommonTable},
		data(){
			return{
				workCellData:[],
				processMachineData:[],
				machineCellData:[],
				machineSelectFormData:{},
				lotInfoColumns:[{prop:"LotNumber",label:"批次号"},{prop:"CassetteID",label:"花篮"},
					{prop:"WorkOrderNO",label:"工单号"},{prop:"Size",label:"数量"}],
				reSearchDialogVisible:false,
				reSearchWorkOrderData:[],
				reSearchFormData:{},
			}
		},
		asyncComputed:{
			async getLotProcessInfoData(){
				if (this.machineSelectFormData.WorkMachineID && this.machineSelectFormData.WorkMachineID!=undefined){
					let fd = new FormData();
					fd.set('flag', 'getLotProcessInfoListByMachine');
					fd.set('workMachineId',this.machineSelectFormData.WorkMachineID);
					let	data= (await this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd)).data;
					if (data){
						return  data;
					}
				}
				return [];
			},
		},
		created() {
			this.getWorkCellData();
			this.getProcessMachineData();
			this.getResearchWorkOrderData();
		},
		methods:{
			getWorkCellData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkCellListByWorkCellType');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.workCellData=res.data;
				});
			},
			getProcessMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getMachineList');
				fd.set('machineType',1);
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.processMachineData=res.data;
					this.machineCellData=res.data;
				});
			},
			getResearchWorkOrderData(){
				let fd = new FormData();
				fd.set('flag', 'getResearchWorkOrderList');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					this.reSearchWorkOrderData=res.data;
				});
			},
			workCellChange(val){
				this.machineCellData=this.processMachineData.filter((item)=>{return item.WorkCellID===val;});
				this.$set(this.machineSelectFormData,'WorkMachineID',null);
			},
			machineChange(val){
				let machine=this.processMachineData.find((item)=>{return item.WorkMachineID===val;});
				if (machine && machine.WorkCellID !=this.machineSelectFormData.WorkCellID){
					this.$set(this.machineSelectFormData,'WorkCellID',machine.WorkCellID);
				}
			},
			reSearchWorkOrder(){
				let selectData= this.$refs.lotInfoTable.multipleSelectionAll;
				if (selectData.length===0){
					this.$message({
						type: 'warning',
						message: '请选择要切换为研发工单的花篮！'
					});
					return;
				}
				this.reSearchDialogVisible=true;
				this.reSearchFormData.SelectData=selectData;
			},
			reSearchWorkOrderSave(){
				if (!this.reSearchFormData.WorkOrderID ||this.reSearchFormData.WorkOrderID===undefined) {
					this.$message({
						type: 'warning',
						message: '请选择工单！'
					});
					return;
				}
				let fd = new FormData();
				fd.set('flag', 'AddSwitchWorkOrderHistory');
				fd.set('lotProcessInfoData',JSON.stringify(this.reSearchFormData.SelectData));
				fd.set('workOrderId',this.reSearchFormData.WorkOrderID);
				this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.reSearchWorkOrderCancel();
						this.$asyncComputed.getLotProcessInfoData.update();
						this.$message({
							type: 'success',
							message: '切换成功！'
						});
					}else {
						this.$message({
							type: 'error',
							message: res.data,
							showClose: true,
						});
					}
				})

			},
			reSearchWorkOrderCancel(){
				this.reSearchDialogVisible=false;
				this.reSearchFormData={};
			},
		}
	}
</script>

<style scoped>

</style>