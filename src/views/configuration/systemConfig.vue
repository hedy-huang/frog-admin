<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="工艺段参数" name="cellParameter">
				<div>
					<el-row :gutter="20">
						<el-col :span="8">
							<enterprise-to-workcell-tree ref="cellTree" @nodeClick="getWorkCellParameterData"></enterprise-to-workcell-tree>
						</el-col>
						<el-col :span="16">
							<common-table :data="cellParameterData" :columns="parameterColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="cellParameterAdd" @update="cellParameterUpdate" @delete="cellParameterDelete"
														:show.sync="cellParameterEditVisible">
								<div slot="dialog">
									<el-form :model="cellParameterFormData" label-position="left" label-width="100px" style="width: 95%">
										<el-form-item label="参数">
											<el-input v-model="cellParameterFormData.Parameter"></el-input>
										</el-form-item>
										<el-form-item label="参数值">
											<el-input v-model="cellParameterFormData.ParameterValue"></el-input>
										</el-form-item>
										<el-form-item label="参数类型">
											<el-input v-model="cellParameterFormData.ParameterKind"></el-input>
										</el-form-item>
										<el-form-item label="描述">
											<el-input v-model="cellParameterFormData.Desc"></el-input>
										</el-form-item>
										<el-form-item>
											<el-button @click="cellParameterEditSave">保存</el-button>
											<el-button @click="cellParameterEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="机器参数" name="machineParameter">
				<div>
					<el-row :gutter="20">
						<el-col :span="8">
							<enterprise-to-workmachine-tree ref="machineTree" @nodeClick="getWorkMachineParameterData"></enterprise-to-workmachine-tree>
						</el-col>
						<el-col :span="16">
							<common-table :data="machineParameterData" :columns="parameterColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="machineParameterAdd" @update="machineParameterUpdate" @delete="machineParameterDelete"
														:show.sync="machineParameterEditVisible">
								<div slot="dialog">
									<el-form :model="machineParameterFormData" label-position="left" label-width="100px" style="width: 95%">
										<el-form-item label="参数">
											<el-input v-model="machineParameterFormData.Parameter"></el-input>
										</el-form-item>
										<el-form-item label="参数值">
											<el-input v-model="machineParameterFormData.ParameterValue"></el-input>
										</el-form-item>
										<el-form-item label="参数类型">
											<el-input v-model="machineParameterFormData.ParameterKind"></el-input>
										</el-form-item>
										<el-form-item label="描述">
											<el-input v-model="machineParameterFormData.Desc"></el-input>
										</el-form-item>
										<el-form-item>
											<el-button @click="machineParameterEditSave">保存</el-button>
											<el-button @click="machineParameterEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="管道参数" name="tubeParameter">
				<div>
					<el-row :gutter="20">
						<el-col :span="8">
							<enterprise-to-worktube-tree ref="tubeTree" @nodeClick="getWorkTubeParameterData"></enterprise-to-worktube-tree>
						</el-col>
						<el-col :span="16">
							<common-table :data="tubeParameterData" :columns="tubeParameterColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="tubeParameterAdd" @update="tubeParameterUpdate" @delete="tubeParameterDelete"
														:show.sync="tubeParameterEditVisible">
								<div slot="dialog">
									<el-form :model="tubeParameterFormData" label-position="left" label-width="100px" style="width: 95%">
										<el-form-item label="参数">
											<el-input v-model="tubeParameterFormData.Parameter"></el-input>
										</el-form-item>
										<el-form-item label="参数值">
											<el-input v-model="tubeParameterFormData.ParameterValue"></el-input>
										</el-form-item>
										<el-form-item label="描述">
											<el-input v-model="tubeParameterFormData.Desc"></el-input>
										</el-form-item>
										<el-form-item>
											<el-button @click="tubeParameterEditSave">保存</el-button>
											<el-button @click="tubeParameterEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import EnterpriseToWorkcellTree from "../common/commonComponent/enterpriseToWorkcellTree";
	import EnterpriseToWorkmachineTree from "../common/commonComponent/enterpriseToWorkmachineTree";
	import CommonTable from "../common/commonComponent/commonTable";
	import EnterpriseToWorktubeTree from "../common/commonComponent/enterpriseToWorktubeTree";
	export default {
		name: "systemConfig",
		components: {EnterpriseToWorktubeTree, CommonTable, EnterpriseToWorkmachineTree, EnterpriseToWorkcellTree},
		data(){
			return {
				tabName:"cellParameter",
				parameterColumns:[{prop:"Parameter",label:"参数"},{prop:"ParameterValue",label:"参数值"},
					{prop:"ParameterKind",label:"参数类型"},{prop:"Desc",label:"描述"}],
				cellParameterData:[],
				cellParameterEditVisible:false,
				cellParameterFormData:{},
				machineParameterData:[],
				machineParameterEditVisible:false,
				machineParameterFormData:{},
				tubeParameterColumns:[{prop:"Parameter",label:"参数"},{prop:"ParameterValue",label:"参数值"},
					{prop:"Desc",label:"描述"}],
				tubeParameterData:[],
				tubeParameterEditVisible:false,
				tubeParameterFormData:{},
			}
		},
		methods:{
			getWorkCellParameterData(){
				let node = this.$refs.cellTree.currentNode;
				if (node.Type===4) {
					let fd = new FormData();
					fd.set('flag', 'getAllWorkCellPara');
					fd.set('workCellId',node.ID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.cellParameterData=res.data;
					});
				}else {
					this.cellParameterData=[];
				}
			},
			cellParameterAdd(){
				this.cellParameterFormData={};
				this.cellParameterEditVisible=true;
				let node = this.$refs.cellTree.currentNode;
				if (node && node.Type===4){
					this.cellParameterFormData.WorkCellID= node.ID;
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体工艺段！'
					});
				}
			},
			cellParameterUpdate(row){
				this.cellParameterFormData=row;
				this.cellParameterEditVisible=true;
			},
			cellParameterEditSave(){
				if (this.cellParameterFormData.ParameterID) {
					let fd = new FormData();
					fd.set('flag', 'WorkCellParaEdit');
					fd.set('workCellPara',JSON.stringify(this.cellParameterFormData));
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.cellParameterEditCancel();
							this.getWorkCellParameterData();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				}else {
					if (this.cellParameterFormData.WorkCellID) {
						let fd = new FormData();
						fd.set('flag', 'WorkCellParaInsert');
						fd.set('workCellPara',JSON.stringify(this.cellParameterFormData));
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data.Result){
								this.cellParameterEditCancel();
								this.getWorkCellParameterData();
								this.$message({
									type: 'success',
									message: '添加成功！'
								});
							}else {
								this.$message({
									type: 'error',
									message: res.data.Message,
									showClose: true,
								});
							}
						})
					}else {
						this.cellParameterEditCancel();
						this.$message({
							type: 'warning',
							message: '请选择具体工艺段！'
						});
					}
				}
			},
			cellParameterEditCancel(){
				this.cellParameterFormData={};
				this.cellParameterEditVisible=false;
			},
			cellParameterDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'WorkCellParaDel');
					fd.set('ParameterID',row.ParameterID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getWorkCellParameterData();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				});
			},

			getWorkMachineParameterData(){
				let node = this.$refs.machineTree.currentNode;
				if (node.Type===5) {
					let fd = new FormData();
					fd.set('flag', 'getMachineParaByWorkMachineId');
					fd.set('WorkMachineID',node.id);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.machineParameterData=res.data;
					});
				}else {
					this.machineParameterData=[];
				}
			},
			machineParameterAdd(){
				this.machineParameterFormData={};
				this.machineParameterEditVisible=true;
				let node = this.$refs.machineTree.currentNode;
				if (node && node.Type===5){
					this.machineParameterFormData.WorkMachineID= node.ID;
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体机器！'
					});
				}
			},
			machineParameterUpdate(row){
				this.machineParameterFormData=row;
				this.machineParameterEditVisible=true;
			},
			machineParameterEditSave(){
				if (this.machineParameterFormData.ParameterID) {
					let fd = new FormData();
					fd.set('flag', 'MachineParaEdit');
					fd.set('ParameterID',this.machineParameterFormData.ParameterID);
					fd.set('Parameter',this.machineParameterFormData.Parameter);
					fd.set('ParameterValue',this.machineParameterFormData.ParameterValue);
					fd.set('ParameterKind',this.machineParameterFormData.ParameterKind);
					fd.set('Desc',this.machineParameterFormData.Desc);
					fd.set('WorkMachineID',this.machineParameterFormData.WorkMachineID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.machineParameterEditCancel();
							this.getWorkMachineParameterData();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				}else {
					if (this.machineParameterFormData.WorkMachineID) {
						let fd = new FormData();
						fd.set('flag', 'MachineParaInsert');
						fd.set('Parameter',this.machineParameterFormData.Parameter);
						fd.set('ParameterValue',this.machineParameterFormData.ParameterValue);
						fd.set('ParameterKind',this.machineParameterFormData.ParameterKind);
						fd.set('Desc',this.machineParameterFormData.Desc);
						fd.set('WorkMachineID',this.machineParameterFormData.WorkMachineID);
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data.Result){
								this.machineParameterEditCancel();
								this.getWorkMachineParameterData();
								this.$message({
									type: 'success',
									message: '添加成功！'
								});
							}else {
								this.$message({
									type: 'error',
									message: res.data.Message,
									showClose: true,
								});
							}
						})
					}else {
						this.machineParameterEditCancel();
						this.$message({
							type: 'warning',
							message: '请选择具体机器！'
						});
					}
				}
			},
			machineParameterEditCancel(){
				this.machineParameterFormData={};
				this.machineParameterEditVisible=false;
			},
			machineParameterDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'MachineParaDel');
					fd.set('ParameterID',row.ParameterID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getWorkMachineParameterData();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				});
			},

			getWorkTubeParameterData(){
				let node = this.$refs.tubeTree.currentNode;
				if (node.Type===6) {
					let fd = new FormData();
					fd.set('flag', 'getTubeParaByTubeId');
					fd.set('WorkTubeID',node.id);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.tubeParameterData=res.data;
					});
				}else {
					this.tubeParameterData=[];
				}
			},
			tubeParameterAdd(){
				this.tubeParameterFormData={};
				this.tubeParameterEditVisible=true;
				let node = this.$refs.tubeTree.currentNode;
				if (node && node.Type===6){
					this.tubeParameterFormData.TubeID= node.ID;
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体管道！'
					});
				}
			},
			tubeParameterUpdate(row){
				this.tubeParameterFormData=row;
				this.tubeParameterEditVisible=true;
			},
			tubeParameterEditSave(){
				if (this.tubeParameterFormData.ParameterID) {
					let fd = new FormData();
					fd.set('flag', 'EditTubePara');
					fd.set('ParameterID',this.tubeParameterFormData.ParameterID);
					fd.set('Parameter',this.tubeParameterFormData.Parameter);
					fd.set('ParameterValue',this.tubeParameterFormData.ParameterValue);
					fd.set('Desc',this.tubeParameterFormData.Desc);
					fd.set('WorkTubeID',this.tubeParameterFormData.TubeID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.tubeParameterEditCancel();
							this.getWorkTubeParameterData();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				}else {
					if (this.tubeParameterFormData.TubeID) {
						let fd = new FormData();
						fd.set('flag', 'TubeParaInsert');
						fd.set('Parameter',this.tubeParameterFormData.Parameter);
						fd.set('ParameterValue',this.tubeParameterFormData.ParameterValue);
						fd.set('Desc',this.tubeParameterFormData.Desc);
						fd.set('WorkTubeID',this.tubeParameterFormData.TubeID);
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data.Result){
								this.tubeParameterEditCancel();
								this.getWorkTubeParameterData();
								this.$message({
									type: 'success',
									message: '添加成功！'
								});
							}else {
								this.$message({
									type: 'error',
									message: res.data.Message,
									showClose: true,
								});
							}
						})
					}else {
						this.tubeParameterEditCancel();
						this.$message({
							type: 'warning',
							message: '请选择具体管道！'
						});
					}
				}
			},
			tubeParameterEditCancel(){
				this.tubeParameterFormData={};
				this.tubeParameterEditVisible=false;
			},
			tubeParameterDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'TubeParaDel');
					fd.set('ParameterID',row.ParameterID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getWorkTubeParameterData();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				});
			},
		},
	}
</script>

<style scoped>

</style>