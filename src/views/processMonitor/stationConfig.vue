<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="机器组" name="machineGroup">
				<div>
					<el-row :gutter="20">
						<el-col :span="6">
							<enterprise-to-workcell-tree ref="tree" @nodeClick="getMachineGroupWorkCellData">
							</enterprise-to-workcell-tree>
						</el-col>
						<el-col :span="18">
							<common-table :data="machineGroupTableData" :columns="machineGroupColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="machineGroupUpdate({})" @update="machineGroupUpdate" @delete="machineGroupDelete"
														:show.sync="machineGroupEditVisible" @dialogClose="machineGroupEditCancel">
								<el-table-column type="expand" slot="expand">
									<template slot-scope="scope">
										<common-table :data="scope.row.AutoMachineGroups" :columns="processMachineRelationColumns"
																	:pagination="true"
																	:allow-adding="true" :allow-deleting="true"
																	@add="processMachineRelationAdd(scope.row.MachineGroupID,scope.row.MachineGroupName)" @delete="processMachineRelationDelete"
																	:show.sync="processMachineRelationEditVisible">
											<el-table-column type="expand" slot="expand">
												<template slot-scope="scope">
													<el-tabs v-model="machineGroupTabName">
														<el-tab-pane label="自动化（上料）" name="autoMachineIn">
															<common-table :data="filterByProcessStep(scope.row.AutoMachineList,0)"
																						:columns="machineColumns"
																						:allow-adding="true" :allow-updating="true" :allow-deleting="true"
																						@add="machineRelationAdd(scope.row.MachineID,0,scope.row.MachineGroupID)" @update="machineRelationUpdate" @delete="machineRelationDelete"
																						:show.sync="machineRelationEditVisible">
																<div slot="dialog">
																	<el-form :model="machineRelationFormData" label-position="left" label-width="100px" style="width: 95%">
																		<el-form-item label="设备">
																			<el-select v-model="machineRelationFormData.AutoMachineID" style="width: 100%">
																				<el-option v-if="selectMachineList.length>0"
																									 v-for="item in selectMachineList"
																									 :key="item.MachineID"
																									 :label="item.MachineName"
																									 :value="item.MachineID">
																				</el-option>
																			</el-select>
																		</el-form-item>
																		<el-form-item>
																			<el-button @click="machineRelationEditSave">保存</el-button>
																			<el-button @click="machineRelationEditCancel">取消</el-button>
																		</el-form-item>
																	</el-form>
																</div>
															</common-table>
														</el-tab-pane>
														<el-tab-pane label="自动化（下料）" name="autoMachineOut">
															<common-table :data="filterByProcessStep(scope.row.AutoMachineList,1)"
																						:columns="machineColumns"
																						:allow-adding="true" :allow-updating="true" :allow-deleting="true"
																						@add="machineRelationAdd(scope.row.MachineID,1,scope.row.MachineGroupID)" @update="machineRelationUpdate" @delete="machineRelationDelete"
																						:show.sync="machineRelationEditVisible">
																<div slot="dialog">
																	<el-form :model="machineRelationFormData" label-position="left" label-width="100px" style="width: 95%">
																		<el-form-item label="设备">
																			<el-select v-model="machineRelationFormData.AutoMachineID" style="width: 100%">
																				<el-option v-if="selectMachineList.length>0"
																									 v-for="item in selectMachineList"
																									 :key="item.MachineID"
																									 :label="item.MachineName"
																									 :value="item.MachineID">
																				</el-option>
																			</el-select>
																		</el-form-item>
																		<el-form-item>
																			<el-button @click="machineRelationEditSave">保存</el-button>
																			<el-button @click="machineRelationEditCancel">取消</el-button>
																		</el-form-item>
																	</el-form>
																</div>
															</common-table>
														</el-tab-pane>
														<el-tab-pane label="测试设备" name="testMachine">
															<common-table :data="filterByProcessStep(scope.row.AutoMachineList,-1)"
																						:columns="machineColumns"
																						:allow-adding="true" :allow-updating="true" :allow-deleting="true"
																						@add="machineRelationAdd(scope.row.MachineID,-1,scope.row.MachineGroupID)" @update="machineRelationUpdate" @delete="machineRelationDelete"
																						:show.sync="machineRelationEditVisible">
																<div slot="dialog">
																	<el-form :model="machineRelationFormData" label-position="left" label-width="100px" style="width: 95%">
																		<el-form-item label="设备">
																			<el-select v-model="machineRelationFormData.AutoMachineID" style="width: 100%">
																				<el-option v-if="selectMachineList.length>0"
																									 v-for="item in selectMachineList"
																									 :key="item.MachineID"
																									 :label="item.MachineName"
																									 :value="item.MachineID">
																				</el-option>
																			</el-select>
																		</el-form-item>
																		<el-form-item>
																			<el-button @click="machineRelationEditSave">保存</el-button>
																			<el-button @click="machineRelationEditCancel">取消</el-button>
																		</el-form-item>
																	</el-form>
																</div>
															</common-table>
														</el-tab-pane>
													</el-tabs>
												</template>
											</el-table-column>
											<div slot="dialog">
												<el-form :model="processMachineRelationFormData" label-position="left" label-width="100px" style="width: 95%">
													<el-form-item label="机器组名称">
														<el-input v-model="processMachineRelationFormData.MachineGroupName" :disabled="true"></el-input>
													</el-form-item>
													<el-form-item label="工艺机器">
														<el-select v-model="processMachineRelationFormData.ProcessMachineList" multiple style="width: 100%">
															<el-option v-if="processMachineList.length>0"
																	v-for="item in processMachineList"
																	:key="item.WorkMachineID"
																	:label="item.MachineName"
																	:value="item.WorkMachineID">
															</el-option>
														</el-select>
													</el-form-item>
													<el-form-item>
														<el-button @click="processMachineRelationEditSave">保存</el-button>
														<el-button @click="processMachineRelationEditCancel">取消</el-button>
													</el-form-item>
												</el-form>
											</div>
										</common-table>
									</template>
								</el-table-column>
								<div slot="dialog">
									<el-form :model="machineGroupFormData" ref="machineGroupForm" :rules="machineGroupFormRules"
													 label-position="left" label-width="100px" style="width: 95%">
										<el-form-item label="机器组名称" prop="MachineGroupName">
											<el-input v-model="machineGroupFormData.MachineGroupName"></el-input>
										</el-form-item>
										<el-form-item label="机器组编码" prop="MachineGroupCode">
											<el-input v-model="machineGroupFormData.MachineGroupCode"></el-input>
										</el-form-item>
										<el-form-item label="机器组序号" prop="MachineGroupIndex">
											<el-input-number  v-model="machineGroupFormData.MachineGroupIndex" style="width:100%"></el-input-number>
										</el-form-item>
										<el-form-item label="轨道" prop="LaneID">
											<el-input-number  v-model="machineGroupFormData.LaneID" style="width:100%"></el-input-number>
										</el-form-item>
										<el-form-item>
											<el-button @click="machineGroupEditSave">保存</el-button>
											<el-button @click="machineGroupEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="印刷线" name="lineCell">
				<div>
					<el-button icon="el-icon-plus" size="small" style="float: right" @click="productLineCellGroupAdd"></el-button>
					<common-table :data="getProductLineCellData" :columns="lineCellGroupColumns"
												:pagination="true"
												:allow-updating="true" :allow-deleting="true"
												@update="productLineCellGroupUpdate" @delete="productLineCellGroupDelete"
												:show.sync="lineCellGroupEditVisible" @dialogClose="productLineCellGroupEditCancel">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.MachineGroupList" :columns="lineCellColumns"
															:pagination="true"
															:allow-adding="true" :allow-updating="true" :allow-deleting="true"
															@add="productLineCellAdd(scope.row.LineCellName,scope.row.LineCellCode,scope.row.LaneID)"
															@update="productLineCellUpdate" @delete="productLineCellDelete"
															:show.sync="lineCellEditVisible" @dialogClose="productLineCellEditCancel">
									<el-table-column slot="columnL" prop="WorkGroupID" label="机器组名称">
										<template slot-scope="scope">
											{{scope.row.WorkGroupID|displayFilter(machineGroupList,"MachineGroupID","MachineGroupName")}}
										</template>
									</el-table-column>
									<div slot="dialog" >
										<el-form :model="lineCellFormData" ref="lineCellForm" :rules="lineCellFormRules"
														 label-position="left" label-width="100px" style="width: 95%">
											<el-form-item label="机器组名称" prop="WorkGroupID">
												<el-select v-model="lineCellFormData.WorkGroupID" filterable style="width: 100%">
													<el-option v-if="machineGroupLaneList.length>0"
																		 v-for="item in machineGroupLaneList"
																		 :key="item.MachineGroupID" :label="item.MachineGroupName" :value="item.MachineGroupID">
													</el-option>
												</el-select>
											</el-form-item>
											<el-form-item label="排序" prop="IndexNum">
												<el-input-number v-model="lineCellFormData.IndexNum" style="width: 100%"></el-input-number>
											</el-form-item>
											<el-form-item>
												<el-button @click="productLineCellEditSave">保存</el-button>
												<el-button @click="productLineCellEditCancel">取消</el-button>
											</el-form-item>
										</el-form>
									</div>
								</common-table>
							</template>
						</el-table-column>
						<div slot="dialog" >
							<el-form :model="lineCellGroupFormData" ref="lineCellGroupEditForm" :rules="lineCellGroupEditFormRules"
											 label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="名称" prop="LineCellName">
									<el-input v-model="lineCellGroupFormData.LineCellName">	</el-input>
								</el-form-item>
								<el-form-item label="编码" prop="LineCellCode">
									<el-input v-model="lineCellGroupFormData.LineCellCode"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="productLineCellGroupEditSave">保存</el-button>
									<el-button @click="productLineCellGroupEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
					<el-dialog :visible.sync="lineCellGroupAddVisible"  :before-close="productLineCellGroupAddCancel" append-to-body>
						<el-form :model="lineCellGroupFormData" ref="lineCellGroupAddForm" :rules="lineCellGroupAddFormRules"
										 label-position="left" label-width="100px" style="width: 95%">
							<el-form-item label="名称" prop="LineCellName">
								<el-input v-model="lineCellGroupFormData.LineCellName">	</el-input>
							</el-form-item>
							<el-form-item label="编码" prop="LineCellCode">
								<el-input v-model="lineCellGroupFormData.LineCellCode"></el-input>
							</el-form-item>
							<el-form-item label="机器组" prop="WorkGroupID">
								<el-select v-model="lineCellGroupFormData.WorkGroupID" filterable @change="machineGroupChange" style="width: 100%">
									<el-option v-if="machineGroupList.length>0"
														 v-for="item in machineGroupList"
														 :key="item.MachineGroupID" :label="item.MachineGroupName" :value="item.MachineGroupID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="轨道号" prop="LaneID">
								<el-input v-model="lineCellGroupFormData.LaneID" disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="排序" prop="IndexNum">
								<el-input-number v-model="lineCellGroupFormData.IndexNum" style="width: 100%"></el-input-number>
							</el-form-item>
							<el-form-item>
								<el-button @click="productLineCellGroupAddSave">保存</el-button>
								<el-button @click="productLineCellGroupAddCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import EnterpriseToWorkcellTree from "../common/commonComponent/enterpriseToWorkcellTree";
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";
	export default {
		name: "stationConfig",
		components: {CommonTable, EnterpriseToWorkcellTree},
		filters:{
			displayFilter,
		},
		data(){
			return {
				tabName:"machineGroup",
				machineGroupTableData:[],
				machineGroupColumns:[{prop:"MachineGroupName",label:"机器组名称"},{prop:"MachineGroupCode",label:"机器组编码"},
					{prop:"MachineGroupIndex",label:"机器组序号"},{prop:"LaneID",label:"轨道"}],
				machineGroupEditVisible:false,
				machineGroupFormData:{},
				machineGroupFormRules:{
					MachineGroupName:[{required: true, message: '请输入机器组名称', trigger: 'blur'},],
					MachineGroupCode:[{required: true, message: '请输入机器组编码', trigger: 'blur'},],
					MachineGroupIndex:[{required: true, message: '请输入机器组序号', trigger: 'change'},],
					LaneID:[{required: true, message: '请输入轨道', trigger: 'change'},],
				},
				processMachineRelationColumns:[{prop:"MachineName",label:"设备名称"}],
				processMachineRelationEditVisible:false,
				processMachineRelationFormData:{},
				machineGroupTabName:"autoMachineIn",
				machineColumns:[{prop:"AutoMachineName",label:"设备名称"},{prop:"LaneID",label:"轨道"}],
				machineRelationEditVisible:false,
				machineRelationFormData:{},

				machineList:[],
				processMachineList:[],
				autoMachineList:[],
				testMachineList:[],
				selectMachineList:[],

				machineGroupList:[],
				machineGroupLaneList:[],
				lineCellGroupColumns:[{prop:"LineCellName",label:"名称"},{prop:"LineCellCode",label:"编码"},
					{prop:"LaneID",label:"轨道号"}],
				lineCellGroupAddVisible:false,
				lineCellGroupEditVisible:false,
				lineCellGroupFormData:{},
				lineCellColumns:[{prop:"LaneID",label:"轨道号"},{prop:"IndexNum",label:"排序"}],
				lineCellEditVisible:false,
				lineCellFormData:{},
				lineCellGroupAddFormRules:{
					LineCellName:[{required: true, message: '请输入名称', trigger: 'blur'},],
					LineCellCode:[{required: true, message: '请输入编码', trigger: 'blur'},],
					WorkGroupID:[{required: true, message: '请选择机器组', trigger: 'change'},],
					LaneID:[{required: true, message: '请选择机器组', trigger: 'blur'},],
					IndexNum:[{required: true, message: '请输入排序', trigger: 'change'},],
				},
				lineCellGroupEditFormRules:{
					LineCellName:[{required: true, message: '请输入名称', trigger: 'blur'},],
					LineCellCode:[{required: true, message: '请输入编码', trigger: 'blur'},],
				},
				lineCellFormRules:{
					WorkGroupID:[{required: true, message: '请选择机器组', trigger: 'change'},],
					IndexNum:[{required: true, message: '请输入排序', trigger: 'change'},],
				},
			}
		},
		asyncComputed:{
			async getProductLineCellData(){
				let fd = new FormData();
				fd.set('flag', 'getProductLineCellList');
				return (await this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd)).data;
			},
		},
		created(){
			this.getMachineData();
			this.getMachineGroupData();
		},
		methods:{
			getMachineGroupData(){
				let fd = new FormData();
				fd.set('flag', 'getMachineGroupList');
				this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
					this.machineGroupList=res.data;
				});
			},
			getMachineGroupWorkCellData(){
				let workCellId=this.$refs.tree.currentNode.ID;
				if (workCellId){
					let fd = new FormData();
					fd.set('flag', 'getMachineGroupByWorkcell');
					fd.set('workCellId',workCellId);
					this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
						this.machineGroupTableData=res.data.RtnData;
					});

					this.processMachineList=this.machineList.filter((item)=>{ return item.MachineTypeID === 1 && item.WorkCellID===workCellId;});
					this.autoMachineList=this.machineList.filter((item)=>{ return item.MachineTypeID === 0 && item.WorkCellID===workCellId;});
					this.testMachineList=this.machineList.filter((item)=>{ return item.MachineTypeID === 2 && item.WorkCellID===workCellId;});

				} else {
					this.machineGroupTableData=[];
				}
			},

			machineGroupUpdate(row){
				this.machineGroupFormData=row;
				this.machineGroupEditVisible=true;
				this.machineGroupFormData.WorkCellID=this.$refs.tree.currentNode.ID;
			},
			machineGroupEditSave(){
				this.$refs['machineGroupForm'].validate((valid) => {
					if (valid) {
						if (this.machineGroupFormData.WorkCellID) {
							let fd = new FormData();
							fd.set('flag', 'addOrUpdateMachineGroup');
							fd.set('machineGroupInfo',JSON.stringify(this.machineGroupFormData));
							this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
								if (res.data.Result){
									this.machineGroupEditCancel();
									this.getMachineGroupWorkCellData();
									this.getMachineGroupData();
									this.$message({
										type: 'success',
										message: '操作成功！'
									});

								}else {
									this.$message({
										type: 'error',
										message: res.data.Message,
										showClose: true,
									});
								}
							})
						}
						else {
							this.$message({
								type: 'warning',
								message: "请选择具体工艺段！",
							});
						}
					} else {
						return false;
					}
				});

			},
			machineGroupEditCancel(){
				this.machineGroupEditVisible=false;
				this.machineGroupFormData = {};
				this.$refs['machineGroupForm'].resetFields();
			},
			machineGroupDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteMachineGroup');
					fd.set('machineGroupId',row.MachineGroupID);
					this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getMachineGroupWorkCellData();
							this.getMachineGroupData();
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

			processMachineRelationAdd(machineGroupID,machineGroupName){
				this.processMachineRelationFormData={MachineGroupID:machineGroupID,MachineGroupName:machineGroupName};
				this.processMachineRelationEditVisible=true;
			},
			processMachineRelationEditSave(){
				if (this.processMachineRelationFormData.MachineGroupID) {
					let fd = new FormData();
					fd.set('flag', 'addGroupProcessMachine');
					fd.set('machineGroupId',this.processMachineRelationFormData.MachineGroupID);
					fd.set('processMachineList',JSON.stringify(this.processMachineRelationFormData.ProcessMachineList));
					this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
						if (res.data.Result){
							this.processMachineRelationEditCancel();
							this.getMachineGroupWorkCellData();
							this.$message({
								type: 'success',
								message: '新增成功！'
							});

						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				}
				else {
					this.$message({
						type: 'warning',
						message: "请选择具体机器组！",
					});
				}
			},
			processMachineRelationEditCancel(){
				this.processMachineRelationEditVisible=false;
				this.processMachineRelationFormData={};
			},
			processMachineRelationDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteAutoMachineGroupProcessMachine');
					fd.set('workMachineId',row.WorkMachineID);
					this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getMachineGroupWorkCellData();
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

			filterByProcessStep(source,processStep){
				return source.filter((item)=>{if (item.ProcessStep===processStep){return item;} });
			},
			getMachineData(){
					let fd = new FormData();
					fd.set('flag', 'getAllMachine');
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						 this.machineList=res.data;
					});
			},

			machineRelationAdd(pMachineID,processStep,machineGroupID){
				this.machineRelationEditVisible=true;
				if (processStep===0||processStep===1){
					this.selectMachineList=this.autoMachineList;
				} else if (processStep===-1){
					this.selectMachineList=this.testMachineList;
				}
				this.machineRelationFormData={MachineGroupID:machineGroupID,MachineID:pMachineID,ProcessStep:processStep};
			},
			machineRelationUpdate(row){
				if (row.ProcessStep===0||row.ProcessStep===1){
					this.selectMachineList=this.autoMachineList;
				} else if (row.ProcessStep===-1){
					this.selectMachineList=this.testMachineList;
				}
				this.machineRelationFormData=row;
				this.machineRelationEditVisible=true;
			},
			machineRelationEditSave(){
				if (this.machineRelationFormData.AutoGroupID) {
						let fd = new FormData();
						fd.set('flag', 'updateAutoMachineGroup');
				  	fd.set('Data',JSON.stringify(this.machineRelationFormData));
				  	fd.set('machineId',this.machineRelationFormData.ProcessMachineID);
				  	fd.set('ioInfo',this.machineRelationFormData.ProcessStep);
						this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
							if (res.data.Result){
								this.machineRelationEditCancel();
								this.getMachineGroupWorkCellData();
								this.$message({
									type: 'success',
									message: '修改成功！'
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
						let fd = new FormData();
						fd.set('flag', 'addAutoMachineGroup');
						fd.set('Data',JSON.stringify(this.machineRelationFormData));
						fd.set('machineId',this.machineRelationFormData.MachineID);
						fd.set('ioInfo',this.machineRelationFormData.ProcessStep);
						fd.set('machineGroupId',this.machineRelationFormData.MachineGroupID);
						this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
							if (res.data.Result){
								this.machineRelationEditCancel();
								this.getMachineGroupWorkCellData();
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
					}
			},
			machineRelationEditCancel(){
				this.machineRelationFormData={};
				this.machineRelationEditVisible=false;
			},
			machineRelationDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteAutoMachineGroup');
					fd.set('autoMachineGroupId',row.AutoGroupID);
					this.$axios.post('/mes/Service/AutoMachineGroupService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getMachineGroupWorkCellData();
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

			productLineCellGroupAdd(){
				this.lineCellGroupAddVisible=true;
			},
			machineGroupChange(val){
				let machineGroup = this.machineGroupList.find((item)=>{return item.MachineGroupID===val;});
				if (machineGroup){
					this.lineCellGroupFormData.LaneID = machineGroup.LaneID;
				}
			},
			productLineCellGroupAddSave(){
				this.$refs['lineCellGroupAddForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'addProductLineCell');
						fd.set('addInfo',JSON.stringify(this.lineCellGroupFormData));
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.productLineCellGroupAddCancel();
								this.$asyncComputed.getProductLineCellData.update();
								this.$message({
									type: 'success',
									message: '修改成功！'
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
			productLineCellGroupAddCancel(){
				this.lineCellGroupAddVisible=false;
				this.lineCellGroupFormData={};
				this.$refs['lineCellGroupAddForm'].resetFields();
			},
			productLineCellGroupUpdate(row){
				this.lineCellGroupEditVisible=true;
				this.lineCellGroupFormData=row;
				this.lineCellGroupFormData.OldCode=row.LineCellCode;
			},
			productLineCellGroupEditSave(){
				this.$refs['lineCellGroupEditForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'modifyProductLineCellNameCode');
						fd.set('oldCode',this.lineCellGroupFormData.OldCode);
						fd.set('name',this.lineCellGroupFormData.LineCellName);
						fd.set('code',this.lineCellGroupFormData.LineCellCode);
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.productLineCellGroupEditCancel();
								this.$asyncComputed.getProductLineCellData.update();
								this.$message({
									type: 'success',
									message: '修改成功！'
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
			productLineCellGroupEditCancel(){
				this.lineCellGroupEditVisible=false;
				this.lineCellGroupFormData={};
				this.$refs['lineCellGroupEditForm'].resetFields();
			},
			productLineCellGroupDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'delectProductLineCellList');
					fd.set('name',row.LineCellName);
					fd.set('code',row.LineCellCode);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data==='success'){
							this.$asyncComputed.getProductLineCellData.update();
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

			productLineCellAdd(name,code,laneID){
				this.lineCellEditVisible=true;
				this.lineCellFormData={LineCellName: name,LineCellCode:code};
				this.machineGroupLaneList= this.machineGroupList.filter((item)=>{return item.LaneID===laneID;});
			},
			productLineCellUpdate(row){
				this.lineCellEditVisible=true;
				this.lineCellFormData=row;
				this.machineGroupLaneList= this.machineGroupList.filter((item)=>{return item.LaneID===row.LaneID;});
			},
			productLineCellEditSave(){
				this.$refs['lineCellForm'].validate((valid) => {
					if (valid) {
						if (this.lineCellFormData.ProductLineCellID) {
							let fd = new FormData();
							fd.set('flag', 'modifyProductLineCell');
							fd.set('modifyInfo',JSON.stringify(this.lineCellFormData));
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data==="success"){
									this.productLineCellEditCancel();
									this.$asyncComputed.getProductLineCellData.update();
									this.$message({
										type: 'success',
										message: '修改成功！'
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
							let fd = new FormData();
							fd.set('flag', 'addProductLineCell');
							fd.set('addInfo',JSON.stringify(this.lineCellFormData));
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data==='success'){
									this.productLineCellEditCancel();
									this.$asyncComputed.getProductLineCellData.update();
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
						}
					} else {
						return false;
					}
				});
			},
			productLineCellEditCancel(){
				this.lineCellEditVisible=false;
				this.lineCellFormData={};
				this.$refs['lineCellForm'].resetFields();
			},
			productLineCellDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'delectProductLineCell');
					fd.set('id',row.ProductLineCellID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data==='success'){
							this.$asyncComputed.getProductLineCellData.update();
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
		},
	}
</script>

<style scoped>
</style>