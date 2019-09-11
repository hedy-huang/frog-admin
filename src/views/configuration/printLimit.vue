<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="原因配置" name="reasonConfig">
				<div>
					<common-table :data="getReasonData"  :show-header="false"
												:allow-adding="true" @add="reasonAdd"
												:show.sync="reasonEditVisible"
												v-loading="this.$asyncComputed.getReasonData.updating"
												@dialogClose="reasonEditCancel">
						<el-table-column slot="expand" type="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.List" :columns="reasonColumns"
															:pagination="true"
															:allow-deleting="true" @delete="reasonDelete">
								</common-table>
							</template>
						</el-table-column>
						<el-table-column slot="columnL" prop="WorkCellId">
							<template slot-scope="scope">
								工艺段：{{scope.row.WorkCellId|displayFilter(workCellList,"WorkCellID","DisplayName")}}
							</template>
						</el-table-column>
						<div slot="dialog">
							<el-form :model="reasonFormData" ref="reasonForm" :rules="reasonFormRules"
											 label-width="100px" style="width: 95%">
								<el-form-item label="工艺段" prop="workCellId">
									<el-select v-model="reasonFormData.workCellId" style="width: 100%">
										<el-option v-if="workCellList.length>0"
															 v-for="item in workCellList"
															 :key="item.WorkCellID" :label="item.DisplayName" :value="item.WorkCellID">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="原因名称" prop="CodeDesc">
									<el-input v-model="reasonFormData.CodeDesc"></el-input>
								</el-form-item>
								<el-form-item label="原因编码" prop="CodeNum">
									<el-input v-model="reasonFormData.CodeNum"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="reasonEditSave">保存</el-button>
									<el-button @click="reasonEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="打印密码修改" name="modifyPwd">
				<div>
					<el-form :model="pwdModifyFormData" ref="pwdForm" :rules="pwdModifyFormRules"
									 label-width="100px">
						<el-form-item label="机器" prop="WorkMachineID">
							<el-select v-model="pwdModifyFormData.WorkMachineID" style="width:100%">
								<el-option v-if="halmAMachineList.length>0"
													 v-for="item in halmAMachineList"
													 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="原始密码" prop="OldPwd">
							<el-input v-model="pwdModifyFormData.OldPwd"></el-input>
						</el-form-item>
						<el-form-item label="新密码" prop="NewPwd">
							<el-input v-model="pwdModifyFormData.NewPwd"></el-input>
						</el-form-item>
						<el-form-item label="确认新密码" prop="ConfirmPwd">
							<el-input v-model="pwdModifyFormData.ConfirmPwd"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button @click="printPasswordModifySave">保存</el-button>
							<el-button @click="printPasswordModifyCancel">取消</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-tab-pane>
			<el-tab-pane label="工单卡控开关" name="workOrderLimit">
				<el-row :gutter="20">
					<el-col :span="6">
				<enterprise-to-workmachine-tree :work-cell-type="15" :machine-type="2" machine-name-filter="Halm"
																				ref="machinetree" @node-click="treeNodeClick"></enterprise-to-workmachine-tree>
					</el-col>
					<el-col :span="18">
						<el-form :model="printLimitFormData" ref="printLimitForm" :rules="printLimitFormRules" label-width="100px">
							<el-form-item label="机器">
								<el-select v-model="printLimitFormData.workMachineIds" style="width: 100%"
													 :disabled="halmMachineSelectDisabled" multiple>
									<el-option v-if="limitMachineList.length>0"
														 v-for="item in limitMachineList"
														 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="工单号" prop="workOrderIds">
								<el-select v-model="printLimitFormData.workOrderIds" style="width: 100%"
													 multiple>
									<el-option v-if="workOrderAreaList.length>0"
														 v-for="item in workOrderAreaList"
														 :key="item.WorkOrderID" :label="item.WorkOrderNO" :value="item.WorkOrderID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="开关">
								<el-switch v-model="printLimitFormData.limitValue"></el-switch>
							</el-form-item>
							<el-form-item label="原因说明" prop="remark">
								<el-select v-model="printLimitFormData.remark" style="width: 100%">
									<el-option v-if="reasonCellList.length>0"
														 v-for="item in reasonCellList"
														 :key="item.CodeDesc" :label="item.CodeDesc" :value="item.CodeDesc">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button @click="workOrderLimitAddSave">保存</el-button>
								<el-button @click="workOrderLimitAddCancel">取消</el-button>
							</el-form-item>
						</el-form>
						<el-divider></el-divider>
						<common-table :data="printLimitHistoryTableData" :columns="printLimitColumns"
													:pagination="true"
													:allow-deleting="true" @delete="workOrderLimitDelete">
							<el-table-column slot="columnL" prop="WorkMachineID" label="机器">
								<template slot-scope="scope">
									{{scope.row.WorkMachineID| displayFilter(halmMachineList,"WorkMachineID","MachineName")}}
								</template>
							</el-table-column>
						</common-table>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";
	import EnterpriseToWorkmachineTree from "../common/commonComponent/enterpriseToWorkmachineTree";
	export default {
		name: "printLimit",
		components: {EnterpriseToWorkmachineTree, CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			let validateConfirmPwd = (rule, value, callback) => {
			 if (value !== this.pwdModifyFormData.NewPwd) {
					callback(new Error('两次输入密码不一致'));
				} else {
					callback();
				}
			};
			return{
				tabName:"reasonConfig",
				workCellList:[],
				halmAMachineList:[],
				halmMachineList:[],
				workOrderList:[],
				reasonList:[],
				reasonColumns:[{prop:"CodeDesc",label:"原因名称"},{prop:"CodeNum",label:"原因编码"}],
				reasonEditVisible:false,
				reasonFormData:{},
				reasonFormRules:{
					workCellId: [
						{required: true, message: '请选择工艺段', trigger: 'change'},
					],
					CodeNum: [
						{required: true, message: '请输入原因编码', trigger: 'blur'},
					],
					CodeDesc: [
						{required: true, message: '请输入原因名称', trigger: 'blur'},
					],
				},
				pwdModifyFormData:{},
				pwdModifyFormRules:{
					WorkMachineID:[
						{ required: true, message: '请选择Halm机器', trigger: 'change' }
					],
					NewPwd:[
						{ required: true, message: '请输入新密码', trigger: 'blur' }
					],
					ConfirmPwd:[
						{ required: true, message: '请输入确认新密码', trigger: 'blur' },
						{ validator: validateConfirmPwd, trigger: 'blur' }
					],
				},
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				printLimitFormData:{limitValue:true},
				printLimitHistoryTableData:[],
				printLimitColumns:[{prop:"WorkOrderNO",label:"工单号"},{prop:"LimitValue",label:"开关"},
					{prop:"Remark",label:"原因说明"},{prop:"OperatorID",label:"操作人"},
					{prop:"OccurTime",label:"操作时间",type:"datetime"}],
				halmMachineSelectDisabled:true,
				limitMachineList:[],
				workOrderAreaList:[],
				reasonCellList:[],
				printLimitFormRules: {
					workOrderIds: [
						{required: true, message: '请选择工单', trigger: 'change'}
					],
					remark: [
						{required: true, message: '请选择原因', trigger: 'change'}
					],
				},
			}
		},
		asyncComputed:{
			async getReasonData() {
				let fd = new FormData();
				fd.set('flag', 'getUndesirableReason');
				fd.set('kind','WorkOrderLimit')
				let reasonList= (await this.$axios.post('/mes/Service/SystemCodeInfoService.ashx', fd)).data;
			  this.reasonList=reasonList;
			  return this.common.groupData(reasonList,'WorkCellId');
			},
		},
		created(){
			this.getWorkCellData();
			this.getHalmAMachineData();
			this.getHalmMachineData();
			this.getWorkOrderData();
		},
		methods:{
			getWorkCellData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkCellListByWorkCellType');
				fd.set('workCellTypeId','15');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.workCellList=res.data;
				});
			},
			getHalmAMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getHalmAMachineList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.halmAMachineList=res.data;
				});
			},
			getHalmMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getHalmMachineList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.halmMachineList=res.data;
				});
			},
			getWorkOrderData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkOrderListByArea');
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					this.workOrderList=res.data;
				});
			},

			reasonAdd(){
				this.reasonFormData={CodeKind:"WorkOrderLimit"};
				this.reasonEditVisible=true;
			},
			reasonEditSave(){
				this.$refs['reasonForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'addUndesirableReason');
						fd.set('reasonData',JSON.stringify(this.reasonFormData));
						this.$axios.post('/mes/Service/SystemCodeInfoService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.reasonEditCancel();
								this.$asyncComputed.getReasonData.update();
								this.$message({
									type: 'success',
									message: '添加成功！'
								});
							}else {
								this.$message({
									type: 'error',
									message: res.data,
									showClose: true,
								});
							}
						})
					} else {
						return false;
					}
				});
			},
			reasonEditCancel(){
				this.reasonEditVisible=false;
				this.reasonFormData = {};
				this.$refs['reasonForm'].resetFields();
			},
			reasonDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteUndesirableReason');
					fd.set('codeId',row.CodeID);
					this.$axios.post('/mes/Service/SystemCodeInfoService.ashx', fd).then(res => {
						if (res.data==="success"){
							this.$asyncComputed.getReasonData.update();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data,
								showClose: true,
							});
						}
					})
				});
			},

			printPasswordModifySave(){
				this.$refs.pwdForm.validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'modifyPrintPassword');
						fd.set('workMachineId',this.pwdModifyFormData.WorkMachineID);
						fd.set('oldPwd',this.pwdModifyFormData.OldPwd === undefined?"":this.pwdModifyFormData.OldPwd);
						fd.set('newPwd',this.pwdModifyFormData.NewPwd);
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.printPasswordModifyCancel();
								this.$message({
									type: 'success',
									message: '添加成功！'
								});
							}else {
								this.$message({
									type: 'error',
									message: res.data,
									showClose: true,
								});
							}
						})

					} else {
						return false;
					}
				});
			},
			printPasswordModifyCancel(){
				this.pwdModifyFormData={};
				this.$refs.pwdForm.resetFields();
			},
			treeNodeClick(data){
				if (data && data.Type===4) {
					let machineIds = data.children.map((item)=>{return item.ID});
					this.printLimitFormData.workMachineIds=machineIds;
					this.halmMachineSelectDisabled=false;
					this.limitMachineList=this.halmMachineList.filter((item)=>{return item.WorkCellID === data.ID;});
			    this.workOrderAreaList= this.workOrderList.filter((item)=>{return item.FactoryID === data.ParentID;});
					this.reasonCellList=this.reasonList.filter((item)=>{return item.WorkCellId === data.ID;});
				}else  if (data && data.Type===5) {
					let machineIds = [data.ID];
					this.printLimitFormData.workMachineIds=machineIds;
					this.halmMachineSelectDisabled=true;
					this.limitMachineList=this.halmMachineList;
					let area= this.halmMachineList.find((item)=>{return item.WorkMachineID === data.ID;});
					if (area){
						this.workOrderAreaList= this.workOrderList.filter((item)=>{return item.FactoryID === area.AreaID;});
					}
					this.reasonCellList=this.reasonList.filter((item)=>{return item.WorkCellId === data.ParentID;});
				}else {
					this.printLimitFormData.workMachineIds=[];
					this.halmMachineSelectDisabled=true;
					this.workOrderAreaList= [];
					this.reasonCellList=[];
 				}
				this.getPrintLimitHistoryData();
			},
			getPrintLimitHistoryData(){
			  let node= this.$refs.machinetree.currentNode;
			  if (node && node.Type===5){
					let fd = new FormData();
					fd.set('flag', 'getWorkOrderLimit');
					fd.set('workMachineId',node.ID);
					fd.set('limitKind','PrintLimit');
					this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
						this.printLimitHistoryTableData=res.data;
					});
				}  else {
					this.printLimitHistoryTableData=[];
				}

			},

			workOrderLimitAddSave(){
				this.$refs['printLimitForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'addWorkOrderLimit');
						fd.set('workMachineIds',JSON.stringify(this.printLimitFormData.workMachineIds));
						fd.set('workOrderIds',JSON.stringify(this.printLimitFormData.workOrderIds));
						fd.set('limitKind','PrintLimit');
						fd.set('limitValue',this.printLimitFormData.limitValue);
						fd.set('remark',this.printLimitFormData.remark);
						fd.set('operatorId','');
						this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.workOrderLimitAddCancel();
								this.getPrintLimitHistoryData();
								this.$message({
									type: 'success',
									message: '保存成功！'
								});
							}else {
								this.$message({
									type: 'error',
									message: res.data,
									showClose: true,
								});
							}
						})
					} else {
						return false;
					}
				});
			},
			workOrderLimitAddCancel(){
				this.$set(this.printLimitFormData,'limitValue',true);
				this.$set(this.printLimitFormData,'workOrderIds',null);
				this.$set(this.printLimitFormData,'remark',null);
				this.$refs.printLimitForm.resetFields();
			},
			workOrderLimitDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteWorkOrderLimit');
					fd.set('id',row.ID);
					this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
						if (res.data==="success"){
							this.getPrintLimitHistoryData();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data,
								showClose: true,
							});
						}
					})
				});
			}
		}
	}
</script>

<style scoped>

</style>