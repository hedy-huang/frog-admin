<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="操作" name="action">
				<div>
					<el-row :gutter="20">
						<el-col :span="6">
							<enterprise-to-workcell-tree ref="workcelltree" @nodeClick="getWorkMachineListByWorkCellID"></enterprise-to-workcell-tree>
						</el-col>
						<el-col :span="18">
							<common-table :data="workMachineTableData" :columns="workMachineColumns"
														:pagination="true">
								<el-table-column slot="columnR" prop="Flag" label="状态">
									<template slot-scope="scope">
										{{scope.row.Flag|displayFilter(machineFlagList,"EnumValue","Description")}}
									</template>
								</el-table-column>
								<el-table-column slot="columnR" label="移机">
									<template slot-scope="scope">
										<el-link v-if="scope.row.Flag===0" icon="el-icon-thumb" @click="moveMachineClick(scope.row)"></el-link>
									</template>
								</el-table-column>
								<el-table-column slot="columnR" label="借机">
									<template slot-scope="scope">
										<el-link v-if="scope.row.Flag===0&&scope.row.MachineTypeID===1" icon="el-icon-thumb" @click="borrowMachineClick(scope.row)">
										</el-link>
									</template>
								</el-table-column>
								<el-table-column slot="columnR" label="还机">
									<template slot-scope="scope">
										<el-link v-if="scope.row.Flag===2" icon="el-icon-thumb" @click="returnMachineClick(scope.row)"></el-link>
									</template>
								</el-table-column>
							</common-table>
							<el-dialog :visible.sync="moveMachineDialogVisible" :before-close="moveMachineCancel" append-to-body>
								<el-form :model="moveMachineFormData" ref="moveMachineForm" :rules="moveMachineFormRules"
												 label-width="100px" style="width: 95%">
									<el-form-item label="车间" prop="AreaID">
										<el-select v-model="moveMachineFormData.AreaID" style="width: 100%" @change="areaSelectChange">
											<el-option v-if="areaList.length>0"
																 v-for="item in areaList"
																 :key="item.AreaID" :label="item.DisplayName" :value="item.AreaID">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="产线" prop="LineIDs">
										<el-select v-model="moveMachineFormData.LineIDs" multiple style="width: 100%">
											<el-option v-if="lineList.length>0"
																 v-for="item in lineList"
																 :key="item.LineID" :label="item.LineName" :value="item.LineID">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item>
										<el-button @click="moveMachineSubmit">保存</el-button>
										<el-button @click="moveMachineCancel">取消</el-button>
									</el-form-item>
								</el-form>
							</el-dialog>
							<el-dialog :visible.sync="borrowMachineDialogVisible" :before-close="borrowMachineCancel" append-to-body>
								<el-form :model="borrowMachineFormData" ref="borrowMachineForm" :rules="borrowMachineFormRules"
												 label-width="100px" style="width: 95%">
									<el-form-item label="车间" prop="AreaID">
										<el-select v-model="borrowMachineFormData.AreaID" style="width: 100%" @change="areaSelectChange">
											<el-option v-if="areaList.length>0"
																 v-for="item in areaList"
																 :key="item.AreaID" :label="item.DisplayName" :value="item.AreaID">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="产线" prop="LineIDs">
										<el-select v-model="borrowMachineFormData.LineIDs" multiple style="width: 100%">
											<el-option v-if="lineList.length>0"
																 v-for="item in lineList"
																 :key="item.LineID" :label="item.LineName" :value="item.LineID">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="开始时间" prop="BeginTime">
										<el-date-picker v-model="borrowMachineFormData.BeginTime" type="datetime"
																		placeholder="借机开始时间" style="width: 100%"></el-date-picker>
									</el-form-item>
									<el-form-item label="结束时间" prop="EndTime">
										<el-date-picker v-model="borrowMachineFormData.EndTime" type="datetime"
																		placeholder="借机结束时间" style="width: 100%"></el-date-picker>
									</el-form-item>
									<el-form-item>
										<el-button @click="borrowMachineSubmit">保存</el-button>
										<el-button @click="borrowMachineCancel">取消</el-button>
									</el-form-item>
								</el-form>
							</el-dialog>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="历史记录" name="history">
				<div>
					<time-query-form :query-form-data="queryFormData"></time-query-form>
					<common-table :data="getBorrowAndMoveHistory" :columns="historyColumns"
												:pagination="true"
												v-loading="this.$asyncComputed.getBorrowAndMoveHistory.updating"></common-table>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import EnterpriseToWorkcellTree from "../common/commonComponent/enterpriseToWorkcellTree";
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";
	import TimeQueryForm from "../common/commonComponent/timeQueryForm";
	export default {
		name: "borrowOrMoveMachine",
		components: {TimeQueryForm, CommonTable, EnterpriseToWorkcellTree},
		data(){
			return {
				tabName:"action",
				machineFlagList:[],
				productLineList:[],
				workMachineTableData:[],
				workMachineColumns:[{prop:"MachineName",label:"机器名称"},{prop:"MachineCode",label:"机器编码"},
					{prop:"MachineID",label:"机器编号"}],
				areaList:[],
				lineList:[],
				moveMachineDialogVisible:false,
				moveMachineFormData:{},
				borrowMachineDialogVisible:false,
				borrowMachineFormData:{},
				moveMachineFormRules:{
					AreaID: [
						{required: true, message: '请选择车间', trigger: 'change'},
					],
					LineIDs: [
						{required: true, message: '请选择产线', trigger: 'change'},
					],
				},
				borrowMachineFormRules:{
					AreaID: [
						{required: true, message: '请选择车间', trigger: 'change'},
					],
					LineIDs: [
						{required: true, message: '请选择产线', trigger: 'change'},
					],
					BeginTime: [
						{required: true, message: '请选择开始时间', trigger: 'change'},
					],
					EndTime: [
						{required: true, message: '请选择结束时间', trigger: 'change'},
					],
				},

				queryFormData:{
					BeginTime:new Date(),EndTime:new Date()
				},
				historyColumns:[{prop:"ActionName",label:"操作"},{prop:"WorkMachineName",label:"机器"},
					{prop:"FromLineName",label:"线"},{prop:"ToLineName",label:"目标线"},
					{prop:"OccourTime",label:"操作时间",type:"datetime"},{prop:"Operator",label:"操作人"}],
			}
		},
		filters:{
			displayFilter,
		},
		created(){
			this.getMachineFlagList();
			this.getAreaList();
			this.getProductLineList();
			this.getShiftInfo();
		},
		asyncComputed:{
			async getBorrowAndMoveHistory() {
				let beginTime=this.common.datetimeFormat(this.queryFormData.BeginTime);
				let endTime=this.common.datetimeFormat(this.queryFormData.EndTime);
				if (beginTime&&endTime){
					let fd = new FormData();
					fd.set('flag', 'getBorrowAndMoveHistory');
					fd.set('beginTime',beginTime);
					fd.set('endTime',endTime);
					return (await this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd)).data;
				}
				return [];
			},
		},
		methods:{
			getMachineFlagList(){
				let fd = new FormData();
				fd.set('flag', 'getMachineFlagList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.machineFlagList=res.data;
				});
			},
			getAreaList(){
				let fd = new FormData();
				fd.set('flag', 'getAreaList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.areaList=res.data;
				});
			},
			getProductLineList(){
				let fd = new FormData();
				fd.set('flag', 'getProductLineList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.productLineList=res.data;
				});
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
			getWorkMachineListByWorkCellID(){
				let node = this.$refs.workcelltree.currentNode;
				if (node.Type===4) {
					let fd = new FormData();
					fd.set('flag', 'getWorkmachineByWorkcellIdAndType');
					fd.set('workcellId',node.id);
					fd.set('machineType', JSON.stringify([1, 2]))
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.workMachineTableData=res.data;
					});
				}else {
					this.workMachineTableData=[];
				}
			},
			areaSelectChange(val){
				if (val){
					this.lineList=this.productLineList.filter((item)=>{ if (item.AreaID == val){return item;}  });
				} else {this.lineList=[];}
				this.$set(this.borrowMachineFormData,'LineIDs',null);
			},
			moveMachineClick(row){
				this.moveMachineDialogVisible=true;
				this.moveMachineFormData.WorkMachineID=row.WorkMachineID;
			},
			moveMachineSubmit(){
				this.$refs['moveMachineForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'moveMachine');
						fd.set('workMachineId',this.moveMachineFormData.WorkMachineID);
						fd.set('areaId',this.moveMachineFormData.AreaID);
						fd.set('lineIds',JSON.stringify(this.moveMachineFormData.LineIDs));
						fd.set('user','');
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.moveMachineCancel();
								this.getWorkMachineListByWorkCellID();
								this.$message({
									type: 'success',
									message: '移机成功！'
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
			moveMachineCancel(){
				this.moveMachineDialogVisible=false;
				this.moveMachineFormData={};
				this.lineList=[];
				this.$refs['moveMachineForm'].resetFields();
			},
			borrowMachineClick(row){
				this.borrowMachineDialogVisible=true;
				this.borrowMachineFormData.WorkMachineID=row.WorkMachineID;
				this.borrowMachineFormData.BeginTime=new Date();
			},
			borrowMachineSubmit(){
				this.$refs['borrowMachineForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'borrowMachine');
						fd.set('workMachineId',this.borrowMachineFormData.WorkMachineID);
						fd.set('areaId',this.borrowMachineFormData.AreaID);
						fd.set('lineIds',JSON.stringify(this.borrowMachineFormData.LineIDs));
						fd.set('beginTime',this.common.datetimeFormat(this.borrowMachineFormData.BeginTime));
						fd.set('endTime',this.common.datetimeFormat(this.borrowMachineFormData.EndTime));
						fd.set('user','');
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.borrowMachineCancel();
								this.getWorkMachineListByWorkCellID();
								this.$message({
									type: 'success',
									message: '借机成功！'
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
			borrowMachineCancel(){
				this.borrowMachineDialogVisible=false;
				this.borrowMachineFormData={};
				this.lineList=[];
				this.$refs['borrowMachineForm'].resetFields();
			},
			returnMachineClick(row){
				let fd = new FormData();
				fd.set('flag', 'getMachineBorrowInfo');
				fd.set('workMachineId',row.WorkMachineID);
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.$msgbox(res.data +"确定还机?", '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(() => {
						let fd = new FormData();
						fd.set('flag', 'returnMachine');
						fd.set('workMachineId',row.WorkMachineID);
						fd.set('user','');
						this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.getWorkMachineListByWorkCellID();
								this.$message({
									type: 'success',
									message: '还机成功！'
								});
							}else {
								this.$message({
									type: 'error',
									message: res.data,
									showClose: true,
								});
							}
						})
					}).catch(() => {
					});
				})
			},
		}
	}
</script>

<style scoped>

</style>