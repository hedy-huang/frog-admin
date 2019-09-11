<template>
	<div class="production-page">
		<el-select v-model="selectMachineID" placeholder="机器" @change="processMachineChange">
			<el-option v-if="processMachineData.length>0"
								 v-for="item in processMachineData"
								 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
			</el-option>
		</el-select>
		<el-button @click="ioTypeChange" :type="ioTypeIn?'success':'danger'">{{ioTypeIn?"上料":"下料"}}</el-button>
		<el-select v-model="shift">
			<el-option v-if="shiftData.length>0"
								 v-for="item in shiftData"
								 :key="item.ID" :label="item.Display" :value="item.ID">
			</el-option>
		</el-select>
		<el-select v-model="shiftClass">
			<el-option v-if="shiftClassData.length>0"
								 v-for="item in shiftClassData"
								 :key="item.ID" :label="item.Display" :value="item.ID">
			</el-option>
		</el-select>
		<common-table :data="getWorkOrderDataByWorkOrderID" :columns="productionTableColumns"></common-table>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-form v-if="firstRoute&& ioTypeIn" :model="onOrOffForm" label-width="50px">
					<el-form-item label="工单号">
						<el-select v-model="onOrOffForm.WorkOrderID" style="width: 100%">
							<el-option v-if="workOrderSelectData.length>0"
												 v-for="item in workOrderSelectData"
												 :key="item.WorkOrderID" :label="item.WorkOrderNO" :value="item.WorkOrderID">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="数量">
						<el-input v-model="onOrOffForm.Num" type="number"></el-input>
					</el-form-item>
					<el-form-item label="操作工">
						<el-input v-model="onOrOffForm.OperatorID"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="firstRouteOnSubmit">投入</el-button>
					</el-form-item>
					<el-form-item label="批次号">
						<el-input v-model="onOrOffForm.BatchID" @keyup.enter.native="getBatchInfo"></el-input>
					</el-form-item>
					<el-form-item label="碎片">
						<el-input v-model="onOrOffForm.FragmentNum" disabled></el-input>
					</el-form-item>
					<el-form-item label="不良">
						<el-input v-model="onOrOffForm.BadNum" disabled></el-input>
					</el-form-item>
				</el-form>
				<el-form v-if="!(firstRoute&& ioTypeIn)" :model="onOrOffForm" label-width="50px">
					<el-form-item label="批次号">
						<el-input v-model="onOrOffForm.BatchID" @keyup.enter.native="getBatchInfo"></el-input>
					</el-form-item>
					<el-form-item label="工单号">
						<el-input v-model="onOrOffForm.WorkOrderNO" disabled style="width: 100%"></el-input>
					</el-form-item>
					<el-form-item label="数量">
						<el-input v-model="onOrOffForm.Num" disabled></el-input>
					</el-form-item>
					<el-form-item label="碎片">
						<el-input v-model="onOrOffForm.FragmentNum" disabled></el-input>
					</el-form-item>
					<el-form-item label="不良">
						<el-input v-model="onOrOffForm.BadNum" disabled></el-input>
					</el-form-item>
					<el-form-item label="操作工">
						<el-input v-model="onOrOffForm.OperatorID"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="OnOrOffSubmit">{{ioTypeIn?"投入":"产出"}}</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="16">
				<el-col :span="24">
					<el-col :span="12">
						<el-col :span="24">
							<h5>碎片</h5>
							<el-button-group style="float:right;">
								<el-button size="small" icon="el-icon-plus" @click="debrisDataAdd"></el-button>
								<el-button size="small" icon="el-icon-check" @click="debrisDataSave"></el-button>
								<el-button size="small" icon="el-icon-refresh-left" @click="debrisDataCancel"></el-button>
							</el-button-group>
							<el-table :data="debrisTableData">
								<el-table-column prop="DebrisReason" label="原因">
									<template slot-scope="scope">
										<el-select v-if="scope.row.editable" v-model="scope.row.DebrisReason">
											<el-option v-if="cellDebrisReasonData.length>0"
																 v-for="item in cellDebrisReasonData"
																 :key="item.CodeDesc" :label="item.CodeDesc" :value="item.CodeDesc">
											</el-option>
										</el-select>
										<span v-show="!scope.row.editable">{{ scope.row.DebrisReason }}</span>
									</template>
								</el-table-column>
								<el-table-column prop="DebrisNum" label="数量">
									<template slot-scope="scope">
										<el-input v-if="scope.row.editable" v-model="scope.row.DebrisNum" type="number"></el-input>
										<span v-show="!scope.row.editable">{{ scope.row.DebrisNum }}</span>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
						<el-col :span="24">
							<h5>返工</h5>
							<el-button-group style="float:right;">
								<el-button size="small" icon="el-icon-plus" @click="badnessDataAdd"></el-button>
								<el-button size="small" icon="el-icon-check" @click="badnessDataSave"></el-button>
								<el-button size="small" icon="el-icon-refresh-left" @click="badnessDataCancel"></el-button>
							</el-button-group>
							<el-table :data="badnessTableData">
								<el-table-column prop="BadnessReason" label="原因">
									<template slot-scope="scope">
										<el-select v-if="scope.row.editable" v-model="scope.row.BadnessReason">
											<el-option v-if="cellBadnessReasonData.length>0"
																 v-for="item in cellBadnessReasonData"
																 :key="item.CodeDesc" :label="item.CodeDesc" :value="item.CodeDesc">
											</el-option>
										</el-select>
									</template>
								</el-table-column>
								<el-table-column prop="BadnessNum" label="数量">
									<template slot-scope="scope">
										<el-input v-if="scope.row.editable" v-model="scope.row.BadnessNum" type="number"></el-input>
										<span v-show="!scope.row.editable">{{ scope.row.BadnessNum }}</span>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
					</el-col>
					<el-col :span="12">
						<el-col :span="24">
							<h5>数量修正</h5>
							<el-form :model="qualityCorrectForm" label-width="100px">
								<el-form-item label="数量修正">
									<el-input v-model="qualityCorrectForm.CorrectQuality" type="number"></el-input>
								</el-form-item>
								<el-form-item label="备注">
									<el-input v-model="qualityCorrectForm.Remark"></el-input>
								</el-form-item>
							</el-form>
						</el-col>
						<el-col :span="24">
							<h5>隔离、补片</h5>
								<el-button size="small" @click="patch">补片</el-button>
						</el-col>
						<el-col :span="24">
							<h5></h5>
							<el-button-group style="float: right">
								<el-button size="small" @click="qualityCorrectSave">提交</el-button>
								<el-button size="small" @click="qualityCorrectCancel">取消</el-button>
							</el-button-group>
						</el-col>
					</el-col>
				</el-col>
			</el-col>
		</el-row>
		<el-dialog :visible.sync="patchDialogVisible" append-to-body width="90%"
							 :before-close="patchDialogClose">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-col :span="16">
						<h4>补片</h4>
						<el-divider></el-divider>
						<el-form :model="patchForm" label-position="left" label-width="100px">
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="需补片的批次号">
										<el-input v-model="patchForm.BatchID" disabled></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="10">
									<el-form-item label="补片数量">
										<el-input v-model="patchForm.PatchQuality" type="number"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="24">
									<el-form-item label="选择补片批次">
										<common-table ref="patchBatchSelectTable"
																	:data="isolationTableData" :columns="isolationColumns"
																	:multiple-selection="true">
										</common-table>
									</el-form-item>
								</el-col>
								<el-col :span="24">
									<el-form-item>
										<el-button size="small" @click="patchSave">提交</el-button>
										<el-button size="small" @click="patchCancel">取消</el-button>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</el-col>
					<el-col	:span="8">
						<h4>隔离</h4>
						<el-divider></el-divider>
						<el-form :model="isolationForm" label-position="left" label-width="100px">
							<el-form-item label="批次号">
								<el-input v-model="isolationForm.BatchID"></el-input>
							</el-form-item>
							<el-form-item label="批次状态">
								<el-select v-model="isolationForm.Status">
									<el-option v-if="batchStatusData.length>0"
														 v-for="item in batchStatusData"
														 :key="item.id" :label="item.text" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button size="small" @click="batchStatusChangeSave">提交</el-button>
								<el-button size="small" @click="batchStatusChangeCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</el-col>
					<el-col :span="24">
						<h4>补片记录</h4>
						<el-divider></el-divider>
						<common-table :data="patchHistoryTableData" :columns="patchColumns"
													:pagination="true" :page-size="5">
						</common-table>
					</el-col>
				</el-col>
			</el-row>
		</el-dialog>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane name="tab1" label="工单批次信息">
				<div>
					<common-table :data="getWorkOrderAndBatchData" :columns="workOrderShiftColumns"
												v-loading="this.$asyncComputed.getWorkOrderAndBatchData.updating"
												:expand-all="true">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.BatchList" :columns="batchShiftColumns">
									<el-table-column type="expand" slot="expand">
										<template slot-scope="scope">
											<common-table :data="scope.row.ReplaceList" :columns="patchShiftColumns">
											</common-table>
										</template>
									</el-table-column>
									<el-table-column slot="columnR" prop="InOrOut" label="操作">
										<template slot-scope="scope">
											{{scope.row.InOrOut===0?"进料":"出料"}}
										</template>
									</el-table-column>
								</common-table>
							</template>
						</el-table-column>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane name="tab2" label="碎片不良历史">
				<div>
					<common-table :data="getDebrisAndBadnessHistoryData" :columns="debrisAndBadnessColumns"
												:pagination="true"
												v-loading="this.$asyncComputed.getDebrisAndBadnessHistoryData.updating">
						<el-table-column slot="columnR" prop="Type" label="异常">
							<template slot-scope="scope">
								{{scope.row.Type|displayFilter(debrisAdnBadnessTypeData,"id","text")}}
							</template>
						</el-table-column>
					</common-table>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import CommonTable from "./commonTable";
	import {displayFilter} from "../commonFunction/displayFilter";
	import * as mesApi from '@/api/mes/default'
	import C from "../About/c";
	export default {
		name: "productionPage",
		components: {C, CommonTable},
		props:{
			cellType: {
				type: String,
				required: true,
			},
			firstRoute:{
				type:Boolean,
				default:false
			}
		},
		filters:{
			displayFilter,
		},
		data(){
			return{
				processMachineData:[],
				shiftClassData:[{ "ID": 1, "Display": "A" },{ "ID": 2, "Display": "BA" },{ "ID": 3, "Display": "C" }],
				shiftData:[{ "ID": 1, "Display": "白班" }, { "ID": 2, "Display": "夜班" }],
				batchStatusData:[{id:0,text:"正常生产"},{id:1,text:"补片隔离"},{id:2,text:"补片完成"},{id:3,text:"质量隔离"}],
				debrisAdnBadnessTypeData:[{id:0,text:"碎片"},{id:1,text:"不良"}],
				selectMachineID:null,
				ioTypeIn:true,
				shift:null,
				shiftClass:null,
				productionTableColumns:[{prop:"SiteName",label:"厂"},{prop:"AreaName",label:"部"},
					{prop:"WorkOrderNO",label:"工单"},{prop:"InputNum",label:"投入数"},
					{prop:"OutputNum",label:"产出数"}, {prop:"FragmentNum",label:"碎片数"},
					{prop:"BadNum",label:"不良数"},{prop:"Status",label:"状态"}],
				workOrderSelectData:[],
				onOrOffForm:{},
				qualityCorrectForm:{},
				debrisTableData:[],
				badnessTableData:[],
				debrisReasonData:[],
				cellDebrisReasonData:[],
				badnessReasonData:[],
				cellBadnessReasonData:[],
				tabName:"tab1",
				patchDialogVisible:false,
				patchForm:{},
				isolationForm:{},
				isolationTableData:[],
				isolationColumns:[{prop:"ID",label:"批次号"},{prop:"Num",label:"剩余数量"},
					{prop:"OperatorID",label:"隔离人"},{prop:"UpdateTime",label:"隔离时间",type:"datetime"}],
				patchColumns:[{prop:"BatchIDFrom",label:"补片批次号"},{prop:"BatchIDTo",label:"被补批次号"},
					{prop:"Num",label:"补片数量"},{prop:"OperatorID",label:"操作人"},{prop:"CreateTime",label:"补片时间",type:"datetime"}],
				patchHistoryTableData:[],
				debrisAndBadnessColumns:[{prop:"WorkOrderNO",label:"工单号"},{prop:"BatchID",label:"批次号"},
					{prop:"Reason",label:"原因"}, {prop:"Num",label:"数量"},
					{prop:"OperatorID",label:"录入人"}, {prop:"CreateTime",label:"录入时间",type:"datetime"}],
				workOrderShiftColumns:[{prop:"WorkOrderNO",label:"工单号"},{prop:"InputNum",label:"总投入数量"},{prop:"OutputNum",label:"总产出数量"}],
				batchShiftColumns:[{prop:"ID",label:"批次号"},
					{prop:"Num",label:"数量"},{prop:"FragmentNum",label:"碎片"},
					{prop:"BadNum",label:"不良"},{prop:"ReplaceNum",label:"补片"},
					{prop:"OperatorID",label:"操作人"},{prop:"UpdateTime",label:"操作时间",type:"datetime"}],
				patchShiftColumns:[{prop:"BatchIDFrom",label:"补片批次"},
					{prop:"Num",label:"补片数"},{prop:"CreateTime",label:"补片时间",type:"datetime"},
					{prop:"OperatorID",label:"操作人"}],
			}
		},
		asyncComputed:{
			async getDebrisAndBadnessHistoryData(){
				if (this.selectMachineID){
					return (await mesApi.getBatchBadInfos({
						equipmentID: this.selectMachineID,
					})).BackInfo;
				}
				return [];
			},
			async getWorkOrderAndBatchData(){
				if (this.selectMachineID){
					return (await mesApi.getWOAndBatchInfos({
						equipmentID: this.selectMachineID,
					})).BackInfo;
				}
				return [];
			},
			async	getWorkOrderDataByWorkOrderID(){
				if (this.onOrOffForm.WorkOrderID){
					let  data=[];
					let result= (await mesApi.getWOInfo({
						wOId:this.onOrOffForm.WorkOrderID
					})).BackInfo;
					data.push(result);
					return data;
				}
				return [];
			},
		},
		created(){
			this.getProcessMachineData();
			this.getShiftInfo();
			this.getWorkOrderSelectData();
			this.getDebrisData();
			this.getBadnessData();
		},
		methods:{
			getProcessMachineData() {
				let fd = new FormData();
				fd.set('flag', 'getMachineList');
				fd.set('workCellTypeName',this.cellType);
				fd.set('machineType','1');
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.processMachineData=res.data;
				})
			},
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
				this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
					this.shift=res.data.ShiftID;
					let sClass= this.shiftClassData.find((item)=>{return item.Display===res.data.ClassCode;});
					if (sClass){
						this.shiftClass=sClass.ID;
					}
				})
			},
			processMachineChange(val){
				 let machine= this.processMachineData.find((item)=>{return item.WorkMachineID===val;});
				 if (machine){
				 	this.cellDebrisReasonData=this.debrisReasonData.filter((item)=>{return item.WorkCellId ===machine.WorkCellID;});
				 	this.cellBadnessReasonData=this.badnessReasonData.filter((item)=>{return item.WorkCellId ===machine.WorkCellID;});
				 }else {
				 	this.cellDebrisReasonData=[];
				 	this.cellBadnessReasonData=[];
				 }
			},
			ioTypeChange(){
				this.ioTypeIn=!this.ioTypeIn;
				this.onOrOffForm={};
				this.productionTableData=[];
			},
			getWorkOrderSelectData(){
				if (this.firstRoute){
					  mesApi.getWOInfos().then(res=>{
						this.workOrderSelectData=res.BackInfo;
					});
				}
			},

			getBatchInfo(){
				mesApi.getCurrentBatchInfo({batchId:this.onOrOffForm.BatchID}).then(res=>{
					if (res.Success) {
						let data=res.BackInfo;
						this.$set(this.onOrOffForm,'WorkOrderID',data.WOID);
						this.$set(this.onOrOffForm,'WorkOrderNO',data.WorkOrderNO);
						this.$set(this.onOrOffForm,'Num',data.Num);
						this.$set(this.onOrOffForm,'FragmentNum',data.FragmentNum);
						this.$set(this.onOrOffForm,'BadNum',data.BadNum);
						this.$set(this.qualityCorrectForm,'CorrectQuality',data.Num);
					}else {
						this.onOrOffForm={};
						this.productionTableData=[];
					}
				});
			},
			firstRouteOnSubmit(){
				if (!this.selectMachineID){
					this.$message({
						type: 'warning',
						message:"请选择机器！" ,
						showClose: true,
					});
					return;
				}
				if (!this.shift){
					this.$message({
						type: 'warning',
						message:"请选择班次！" ,
						showClose: true,
					});
					return;
				}
				if (!this.shiftClass) {
					this.$message({
						type: 'warning',
						message:"请选择班组！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.WorkOrderID) {
					this.$message({
						type: 'warning',
						message:"请选择工单！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.Num) {
					this.$message({
						type: 'warning',
						message:"请输入批次数量！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.OperatorID) {
					this.$message({
						type: 'warning',
						message:"请输入操作人！" ,
						showClose: true,
					});
					return;
				}
				mesApi.firstLoading({
					equipmentId:this.selectMachineID,
					wOID:this.onOrOffForm.WorkOrderID,
					operatorId:this.onOrOffForm.OperatorID,
					batchNum:this.onOrOffForm.Num,
					classTypeId:this.shift,
					classId:this.shiftClass
				}).then(res=>{
					if (res.Success) {
						this.$set(this.onOrOffForm,'BatchID',res.BackInfo);
						this.$asyncComputed.getWorkOrderAndBatchData.update();
						this.$asyncComputed.getWorkOrderDataByWorkOrderID.update();
					}else {
						this.$message({
							type: 'error',
							message:'提交失败！',
							showClose: true,
						});
					}
				});
			},
			OnOrOffSubmit(){
				if (!this.selectMachineID){
					this.$message({
						type: 'warning',
						message:"请选择机器！" ,
						showClose: true,
					});
					return;
				}
				if (!this.shift){
					this.$message({
						type: 'warning',
						message:"请选择班次！" ,
						showClose: true,
					});
					return;
				}
				if (!this.shiftClass) {
					this.$message({
						type: 'warning',
						message:"请选择班组！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.BatchID) {
					this.$message({
						type: 'warning',
						message:"请输入批次号！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.OperatorID) {
					this.$message({
						type: 'warning',
						message:"请输入操作人！" ,
						showClose: true,
					});
					return;
				}
				mesApi.onOrOffSubmit({
					batchId:this.onOrOffForm.BatchID,
					equipmentId:this.selectMachineID,
					wOID:this.onOrOffForm.WorkOrderID,
					operatorId:this.onOrOffForm.OperatorID,
					classTypeId:this.shift,
					classId:this.shiftClass,
					inOrOut:this.ioTypeIn?0:1
				}).then(res=>{
					if (res.Success) {
						this.$message({
							type: 'success',
							message:'提交成功！',
							showClose: true,
						});
						this.$asyncComputed.getWorkOrderAndBatchData.update();
						this.$asyncComputed.getWorkOrderDataByWorkOrderID.update();
					}else {
						this.$message({
							type: 'error',
							message:'提交失败！',
							showClose: true,
						});
					}
				});
			},


			getDebrisData(){
				let fd = new FormData();
				fd.set('flag', 'getUndesirableReason');
				fd.set('kind','Debris');
				this.$axios.post('/mes/Service/SystemCodeInfoService.ashx', fd).then(res => {
					this.debrisReasonData=res.data;
				})
			},
			getBadnessData(){
				let fd = new FormData();
				fd.set('flag', 'getUndesirableReason');
				fd.set('kind','Bad');
				this.$axios.post('/mes/Service/SystemCodeInfoService.ashx', fd).then(res => {
					this.badnessReasonData=res.data;
				})
			},
			debrisDataAdd(){
				this.debrisTableData.unshift({DebrisReason:null,DebrisNum:null,editable:true});
			},
			debrisDataSave(){
				this.debrisTableData =this.debrisTableData.map((item)=>{item.editable=false; return item;});
			},
			debrisDataCancel(){
				this.debrisTableData=this.debrisTableData.filter((item)=>{return item.editable === false;});
			},
			badnessDataAdd(){
				this.badnessTableData.unshift({BadnessReason:null,BadnessNum:null,editable:true});
			},
			badnessDataSave(){
				this.badnessTableData =this.badnessTableData.map((item)=>{item.editable=false; return item;});
			},
			badnessDataCancel(){
				this.badnessTableData=this.badnessTableData.filter((item)=>{return item.editable === false;});
			},
			qualityCorrectSave(){
				if (!this.selectMachineID) {
					this.$message({
						type: 'warning',
						message:"请选择机器！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.BatchID) {
					this.$message({
						type: 'warning',
						message:"请输入批次号！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.OperatorID) {
					this.$message({
						type: 'warning',
						message:"请输入操作人！" ,
						showClose: true,
					});
					return;
				}
				if (this.debrisTableData.length===0 && this.badnessTableData.length===0 && this.onOrOffForm.Num===this.qualityCorrectForm.CorrectQuality){
					this.$message({
						type: 'warning',
						message:"当前无可提交数据！" ,
						showClose: true,
					});
					return;
				}
				let fragmentInfos=[];
				let badInfos=[];
				if (this.debrisTableData.length>0){
					for (let i=0;i<this.debrisTableData.length;i++){
						fragmentInfos.push({BatchID:this.onOrOffForm.BatchID,EquipmentID:this.selectMachineID,
					 Type:0,Num:this.debrisTableData[i].DebrisNum,OperatorID:this.onOrOffForm.OperatorID,
					 Reason:this.debrisTableData[i].DebrisReason});
					}
				}
				if (this.badnessTableData.length>0){
					for (let i=0;i<this.badnessTableData.length;i++){
						badInfos.push({BatchID:this.onOrOffForm.BatchID,EquipmentID:this.selectMachineID,
							Type:0,Num:this.badnessTableData[i].BadnessNum,OperatorID:this.onOrOffForm.OperatorID,
							Reason:this.badnessTableData[i].BadnessReason});
					}
				}
				mesApi.repair({
					batchId:this.onOrOffForm.BatchID,
					badList:JSON.stringify(badInfos),
					fragmentList:JSON.stringify(fragmentInfos),
					num:this.qualityCorrectForm.CorrectQuality,
					reason:this.qualityCorrectForm.Remark?this.qualityCorrectForm.Remark:""
				}).then(res=>{
					if (res.Success) {
						this.qualityCorrectCancel();
						this.getBatchInfo();
						this.$asyncComputed.getDebrisAndBadnessHistoryData.update();
						this.$asyncComputed.getWorkOrderAndBatchData.update();
						this.$asyncComputed.getWorkOrderDataByWorkOrderID.update();
						this.$message({
							type: 'success',
							message:'提交成功！',
							showClose: true,
						});
					}else {
						this.$message({
							type: 'error',
							message:'提交失败！',
							showClose: true,
						});
					}
				});
				},
			qualityCorrectCancel(){
				this.$set(this.qualityCorrectForm,"Remark",null);
				this.debrisTableData=[];
				this.badnessTableData=[];
			},
			patch(){
				if (!this.selectMachineID) {
					this.$message({
						type: 'warning',
						message:"请选择机器！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.BatchID) {
					this.$message({
						type: 'warning',
						message:"请输入批次号！" ,
						showClose: true,
					});
					return;
				}
				if (!this.onOrOffForm.OperatorID) {
					this.$message({
						type: 'warning',
						message:"请输入操作人！" ,
						showClose: true,
					});
					return;
				}
					this.patchDialogVisible=true;
			  	this.patchForm.BatchID=this.onOrOffForm.BatchID;
			  	this.getIsolationBatchData();
			  	this.getPatchHistoryData();
			},
			getIsolationBatchData(){
				mesApi.getIsoLation({
					equipmentId:this.selectMachineID,
					wOID:this.onOrOffForm.WorkOrderID
				}).then(res=>{
					 this.isolationTableData=res.BackInfo;
				});
			},
			patchSave(){
				if (!this.patchForm.PatchQuality) {
					this.$message({
						type: 'warning',
						message:"请输入补片数量！" ,
						showClose: true,
					});
					return;
				}
				let fromBatchData=this.$refs.patchBatchSelectTable.multipleSelectionAll;
				if (fromBatchData.length===0){
					this.$message({
						type: 'warning',
						message:"请选择补片批次！" ,
						showClose: true,
					});
					return;
				}
				let batchFromData= fromBatchData.map((item)=>{return item.ID;});
				mesApi.batchReplace({
					batchIdFrom:JSON.stringify(batchFromData),
					batchIdTo:this.patchForm.BatchID,
					replaceNum:this.patchForm.PatchQuality,
					operatorId:this.onOrOffForm.OperatorID,
					equipmentID:this.selectMachineID,
					inOrOut:this.ioTypeIn?0:1
				}).then(res=>{
					if (res.Success) {
						this.patchCancel();
						this.getIsolationBatchData();
						this.getPatchHistoryData();
						this.$message({
							type: 'success',
							message:'提交成功！',
							showClose: true,
						});
						this.getBatchInfo();
						this.$asyncComputed.getWorkOrderAndBatchData.update();
						this.$asyncComputed.getWorkOrderDataByWorkOrderID.update();
					}else {
						this.$message({
							type: 'error',
							message:'提交失败！',
							showClose: true,
						});
					}
				});
			},
			patchCancel(){
				this.$set(this.patchForm,'PatchQuality',null);
				this.$refs.patchBatchSelectTable.clearMultipleSelection();
			},
			batchStatusChangeSave(){
				mesApi.changeBatchStatus({
					batchId:this.isolationForm.BatchID,
					equipmentId:this.selectMachineID,
					jobNum:this.onOrOffForm.WorkOrderNO,
					operatorId:this.onOrOffForm.OperatorID,
					batchStatus:this.isolationForm.Status,
					inOrOut:this.ioTypeIn?0:1
				}).then(res=>{
					if (res.Success) {
						this.batchStatusChangeCancel();
						this.$message({
							type: 'success',
							message:'提交成功！',
							showClose: true,
						});
						this.getIsolationBatchData();
					}else {
						this.$message({
							type: 'error',
							message:'提交失败！',
							showClose: true,
						});
					}
				});
			},
			batchStatusChangeCancel(){
				this.isolationForm={};
			},
			getPatchHistoryData(){
				mesApi.getReplaceInfos({
					equipmentID:this.selectMachineID
				}).then(res=>{
					this.patchHistoryTableData=res.BackInfo;
				});
			},
			patchDialogClose(){
				this.patchDialogVisible=false;
			},
		},
	}
</script>

<style scoped>

</style>