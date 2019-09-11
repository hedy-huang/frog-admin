<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="网版下线验证" name="verify">
				<div>
					<el-form :model="plateOfflineFormData" ref="plateOfflineForm" :rules="plateOfflineFormRules"
									 label-position="left" label-width="100px">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="物料编码" prop="MaterialNo">
									<el-input v-model="plateOfflineFormData.MaterialNo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="物料标签" prop="MaterialTagNo">
									<el-input v-model="plateOfflineFormData.MaterialTagNo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="批次号" prop="BatchNo">
									<el-input v-model="plateOfflineFormData.BatchNo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="工号" prop="OperatorID">
									<el-input v-model="plateOfflineFormData.OperatorID"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="下线原因" prop="Reason">
									<el-select v-model="plateOfflineFormData.Reason" placeholder="请选择"
														 @change="verifyReasonSelectChange" style="width: 100%">
										<el-option v-if="reasonParentData.length>0"
															 v-for="item in reasonParentData"
															 :key="item.ErrorCodeName" :label="item.ErrorCodeName" :value="item.ErrorCodeName">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="原因描述" prop="ReasonDesc">
									<el-select v-model="plateOfflineFormData.ReasonDesc" placeholder="请选择"
														 @change="verifyReasonDescSelectChange" style="width: 100%">
										<el-option v-if="reasonDescData.length>0"
															 v-for="item in reasonDescData"
															 :key="item.ErrorCodeName" :label="item.ErrorCodeName" :value="item.ErrorCodeName">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item>
								<el-button @click="plateOfflineSubmit">提交</el-button>
							</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<span>历史记录</span>
					<el-divider></el-divider>
					<time-query-form :queryFormData="queryFormData"></time-query-form>
					<common-table :data="getPlateOfflineHistoryData" :columns="plateOfflineHistoryColumns"
												:pagination="true" v-loading="this.$asyncComputed.getPlateOfflineHistoryData.updating">
						<el-table-column slot="columnR" prop="WorkMachineID" label="机器">
							<template slot-scope="scope">
								{{scope.row.WorkMachineID|displayFilter(machineList,"WorkMachineID","MachineName")}}
							</template>
						</el-table-column>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="网版下线原因" name="reason">
				<div>
					<el-form :model="reasonFormData" ref="reasonForm" :rules="reasonFormRules"
									 label-position="left" label-width="100px">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="原因类别" prop="Reason">
								<el-select v-model="reasonFormData.Reason" filterable allow-create clearable
													 placeholder="请选择" @change="reasonValueChange" @clear="reasonValueClear"
													 style="width: 100%">
									<el-option v-if="reasonParents.length>0"
														 v-for="item in reasonParents"
														 :key="item" :label="item" :value="item">
									</el-option>
								</el-select>
							</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="类别编码" prop="ReasonCode">
									<el-input v-model="reasonFormData.ReasonCode" :disabled="reasonCodeDisabled"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="原因描述" prop="ReasonDesc">
									<el-input v-model="reasonFormData.ReasonDesc"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="描述编码" prop="DescCode">
									<el-input v-model="reasonFormData.DescCode"></el-input>
								</el-form-item>
							</el-col>
							<el-col>
								<el-form-item>
									<el-checkbox v-model="reasonFormData.IsConsume">是否计入消耗</el-checkbox>
								</el-form-item>
								<el-form-item>
									<el-button @click="addPlateOfflineReason">提交</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<el-divider></el-divider>
					<common-table :data="getPlateOfflineReasonData" :columns="reasonColumns"
												:pagination="true" row-key="ErrorCodeID"
												:allow-updating="true" :allow-deleting="true"
												@update="reasonUpdate" @delete="reasonDelete"
												:show.sync="reasonEditVisible" @dialogClose="reasonEditCancel">
						<el-table-column slot="columnR" prop="IsConsume" label="是否计入消耗">
							<template slot-scope="scope" v-if="scope.row.ParentID!=0">
								<el-checkbox :value="scope.row.IsConsume"></el-checkbox>
							</template>
						</el-table-column>
						<div slot="dialog">
							<el-form :model="reasonEditFormData" ref="reasonEditForm" :rules="reasonEditFormRules"
											 label-position="left" label-width="100px" style="width: 95%">
									<el-form-item label="原因" prop="ErrorCodeName">
										<el-input v-model="reasonEditFormData.ErrorCodeName"></el-input>
									</el-form-item>
									<el-form-item label="编码" prop="ErrorCode">
										<el-input v-model="reasonEditFormData.ErrorCode"></el-input>
									</el-form-item>
									<el-form-item label="原因分类" prop="ParentID" v-if="reasonEditFormData.ParentID!=0">
										<el-select v-model="reasonEditFormData.ParentID"style="width: 100%">
											<el-option v-if="reasonParentData.length>0"
																 v-for="item in reasonParentData"
																 :key="item.ErrorCodeID" :label="item.ErrorCodeName" :value="item.ErrorCodeID">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item v-if="reasonEditFormData.ParentID!=0">
										<el-checkbox v-model="reasonEditFormData.IsConsume">是否计入消耗</el-checkbox>
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
		</el-tabs>
	</div>
</template>

<script>
	import TimeQueryForm from "../common/commonComponent/timeQueryForm";
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";

	export default {
		name: "plateOffline",
		components:{CommonTable, TimeQueryForm},
		filters:{
			displayFilter,
		},
		data(){
			return {
				tabName:"verify",
				machineList:[],
				plateOfflineFormData: {
					MaterialNo: "", MaterialTagNo: "", BatchNo: "", OperatorID: "",
					Reason: "", ReasonDesc: "",IsConsume:false
				},
				plateOfflineFormRules:{
					MaterialNo:[{required: true, message: '请输入物料编码', trigger: 'blur'},],
					MaterialTagNo:[	{required: true, message: '请输入物料标签', trigger: 'blur'},],
					BatchNo:[	{required: true, message: '请输入批次号', trigger: 'blur'},],
					OperatorID:[	{required: true, message: '请输入工号', trigger: 'blur'},],
					Reason:[{required: true, message: '请选择下线原因', trigger: 'change'},],
					ReasonDesc:[{required: true, message: '请选择原因描述', trigger: 'change'},],
				},
				queryFormData:{
					BeginTime:new Date(),EndTime:new Date()
				},
				plateOfflineHistoryColumns:[{prop:"MaterialNo",label:"物料编码"},{prop:"MaterialTagNo",label:"物料标签"},
					{prop:"BatchNo",label:"批次号"},{prop:"WorkOrderNO",label:"工单号"},
					{prop:"OnlineTime",label:"上线时间",type:"datetime"}, {prop:"OfflineTime",label:"下线时间",type:"datetime"},
					{prop:"Reason",label:"下线原因分类"},{prop:"ReasonDesc",label:"下线原因描述"},
					{prop:"Operator",label:"工号"},{prop:"Product",label:"印刷量"}],
				reasonFormData:{
					Reason:"",ReasonCode:"",ReasonDesc:"",DescCode:"",IsConsume:true,
				},
				reasonColumns:[{prop:"ErrorCodeName",label:"原因"},{prop:"ErrorCode",label:"编码"}],
				reasonParents:[],
				reasonParentData:[],
				reasonData:[],
				reasonCodeDisabled:true,
				reasonDescData:[],
				reasonEditVisible:false,
				reasonEditFormData:{
					"ErrorCodeName":"","ErrorCode":"","ParentID":"","IsConsume":"",DefectGrade:0
				},
				reasonFormRules:{
					Reason:[{required: true, message: '请选择或输入原因分类', trigger: 'blur'},],
					ReasonCode:[{required: true, message: '请选择或输入原因编码', trigger: 'blur'},],
					ReasonDesc:[{required: true, message: '请输入原因描述', trigger: 'blur'},],
					DescCode:[{required: true, message: '请输入描述编码', trigger: 'blur'},],
				},
				reasonEditFormRules:{
					ErrorCodeName:[{required: true, message: '请输入原因', trigger: 'blur'},],
					ErrorCode:[{required: true, message: '请输入编码', trigger: 'blur'},],
					ParentID:[{required: true, message: '请选择原因分类', trigger: 'change'},],
				},
			}
		},
		asyncComputed:{
			async getPlateOfflineHistoryData(){
				let fd = new FormData();
				fd.set('flag', 'getPlateOfflineHistory');
				fd.set('beginTime',this.common.datetimeFormat(this.queryFormData.BeginTime));
				fd.set('endTime',this.common.datetimeFormat(this.queryFormData.EndTime));
				return (await this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd)).data
			},
			async getPlateOfflineReasonData(){
				let fd = new FormData();
				fd.set('flag', 'getPlateOfflineReasonList');
				this.reasonData=	(await this.$axios.post('/mes/Service/ErrorCodeService.ashx', fd)).data;
				this.reasonParentData = this.reasonData.filter(function (item) {
						if (item.ParentID == 0) {
							return item;
						}
					});
				this.reasonParents= this.reasonParentData.map(function (item) {
						return item.ErrorCodeName;
					});

				if(this.reasonData.length>0){
					return this.getReasonTree(this.reasonData);
				}else{
					return this.reasonData;
				}
			},
		},
		created(){
			this.getShiftInfo();
			this.getMachineData();
		},
		methods:{
			getMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getAllMachine');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.machineList=res.data;
				})
			},
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
				this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
					this.queryFormData.BeginTime=res.data.ShiftBegTime;
					this.queryFormData.EndTime=res.data.ShiftEndTime;
				})
			},
			getReasonTree(list) {
				let map = {};
				let val = [];
				//生成数据对象集合
				list.forEach(it => {
					map[it.ErrorCodeID] = it;
				})
				//生成结果集
				list.forEach(it => {
					const parent = map[it.ParentID];
					if (parent) {
						if (!Array.isArray(parent.children)) parent.children = [];
						parent.children.push(it);
					} else {
						val.push(it);
					}
				})
				return val;
			},

			reasonValueChange(val){
				if (val) {
					let find = this.reasonParentData.find(function (item) { return item.ErrorCodeName == val; });
					if (find) {
						this.reasonFormData.ReasonCode=find.ErrorCode;
						this.reasonCodeDisabled = true;
					} else {
						this.reasonCodeDisabled = false;
					}
				} else {
				this.reasonCodeDisabled = true;
				}
			},
			reasonValueClear(){
				this.reasonFormData.ReasonCode="";
				this.reasonCodeDisabled=true;
			},

			verifyReasonSelectChange(val) {
				if (val) {
					let find = this.reasonParentData.find(function (item) { return item.ErrorCodeName == val; });
					if (find) {
						this.reasonDescData = this.reasonData.filter(function (item) {
							if (item.ParentID == find.ErrorCodeID) {
								return item;
							}
						});
					} else {
						this.reasonDescData = [];
					}
				} else {
					this.reasonDescData = [];
				}
				this.plateOfflineFormData.ReasonDesc="";
				this.plateOfflineFormData.IsConsume=false;
			},
			verifyReasonDescSelectChange(val){
				if (val) {
					let find = this.reasonDescData.find(function (item) { return item.ErrorCodeName == val; });
					if (find) {
					this.plateOfflineFormData.IsConsume=find.IsConsume;
					} else {
						this.plateOfflineFormData.IsConsume=false;
					}
				} else {
					this.plateOfflineFormData.IsConsume=false;
				}
			},
			plateOfflineSubmit(){
				this.$refs['plateOfflineForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'plateOffline');
						fd.set('materialNo', this.plateOfflineFormData.MaterialNo);
						fd.set('materialTagNo', this.plateOfflineFormData.MaterialTagNo);
						fd.set('batchNo', this.plateOfflineFormData.BatchNo);
						fd.set('reason', this.plateOfflineFormData.Reason);
						fd.set('reasonDesc', this.plateOfflineFormData.ReasonDesc);
						fd.set('operatorID', this.plateOfflineFormData.OperatorID);
						fd.set('isConsume', this.plateOfflineFormData.IsConsume);
						this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
							if (res.data == "success") {
								this.plateOfflineFormData = {
									MaterialNo: "", MaterialTagNo: "", BatchNo: "", OperatorID: "",
									Reason: "", ReasonDesc: "",IsConsume:false
								};
								this.$refs['plateOfflineForm'].resetFields();
								this.$message({
									type: 'success',
									message: '提交成功！'
								});
							} else {
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
			addPlateOfflineReason() {
				this.$refs['reasonForm'].validate((valid) => {
					if (valid) {
						if (this.reasonFormData.ReasonCode == this.reasonFormData.DescCode) {
							this.$message({
								type: 'warning',
								message: '编码重复！'
							});
							return;
						}
						let isConsume = 0;
						if (this.reasonFormData.IsConsume == true) {
							isConsume = 1;
						}
						let fd = new FormData();
						fd.set('flag', 'addPlateOfflineReason');
						fd.set('reason', this.reasonFormData.Reason);
						fd.set('reasonCode', this.reasonFormData.ReasonCode);
						fd.set('reasonDesc', this.reasonFormData.ReasonDesc);
						fd.set('descCode', this.reasonFormData.DescCode);
						fd.set('isConsume', isConsume);
						this.$axios.post('/mes/Service/ErrorCodeService.ashx', fd).then(res => {
							if (res.data == "success") {
								this.reasonFormData = {
									Reason: "", ReasonCode: "", ReasonDesc: "", DescCode: "", IsConsume: true,
								};
								this.$asyncComputed.getPlateOfflineReasonData.update();
								this.$refs['reasonForm'].resetFields();
								this.$message({
									type: 'success',
									message: '添加成功！'
								});
							} else {
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
			reasonUpdate(row){
				this.reasonEditVisible=true;
				this.reasonEditFormData=row;
			},
			reasonEditSave(){
				this.$refs['reasonEditForm'].validate((valid) => {
					if (valid) {
						if (this.reasonEditFormData.IsConsume){
							this.reasonEditFormData.DefectGrade=1;
						} else {this.reasonEditFormData.DefectGrade=0;}
						let fd = new FormData();
						fd.set('flag', 'modifyPlateOfflineReason');
						fd.set('detailData',JSON.stringify(this.reasonEditFormData));
						this.$axios.post('/mes/Service/ErrorCodeService.ashx', fd).then(res => {
							if (res.data=='success'){
								this.reasonEditCancel();
								this.$message({
									type: 'success',
									message: '修改成功！'
								});
								this.$asyncComputed.getPlateOfflineReasonData.update();
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
				this.reasonEditFormData={
					"ErrorCodeName":"","ErrorCode":"","ParentID":"","IsConsume":"","DefectGrade":0
				};
				this.$refs['reasonEditForm'].resetFields();
			},
			reasonDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deletePlateOfflineReason');
					fd.set('detailId',row.ErrorCodeID);
					this.$axios.post('/mes/Service/ErrorCodeService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$message({
								type: 'info',
								message: '删除成功！'
							});
							this.$asyncComputed.getPlateOfflineReasonData.update();
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
		}
	}
</script>

<style scoped>
</style>