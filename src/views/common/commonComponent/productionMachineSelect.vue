<template>
	<div class="production-machine-select">
		<el-row :gutter="20">
			<el-col :span="8">
				<el-select v-model="selectMachineID" placeholder="机器" @change="machineChange"
									 style="width: 100%;">
					<el-option v-if="machineData.length>0"
										 v-for="item in machineData"
										 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="14">
				<common-table :data="autoMachineTableData" :columns="autoMachineColumns" :show-header="false">
					<el-table-column slot="columnR" prop="ProcessStep">
						<template slot-scope="scope">
							{{scope.row.ProcessStep|displayFilter([{ "id": 0, "text": "上自动化" }, { "id": 1, "text": "下自动化" }],"id","text")}}
						</template>
					</el-table-column>
					<el-table-column slot="columnR" prop="MissionStatus">
						<template slot-scope="scope">
							{{scope.row.MissionStatus==='Create'?'任务创建': scope.row.MissionStatus==='SendSuccess'?'任务已发送':scope.row.MissionStatus==='Accepted'?'任务已接收':'' }}
						</template>
					</el-table-column>
					<el-table-column slot="columnR" prop="RobotName">
						<template slot-scope="scope">
							{{scope.row.RobotName==='WaitingRobot'?'等待机器人': scope.row.RobotName }}
						</template>
					</el-table-column>
				</common-table>

			</el-col>
			<el-col :span="2">
				<el-button-group>
					<el-button @click="borrowMachine">借机</el-button>
					<el-button @click="returnMachine">还机</el-button>
				</el-button-group>
				<el-dialog :visible.sync="borrowMachineDialogVisible" :before-close="borrowMachineCancel" append-to-body>
					<el-form :model="borrowMachineFormData" ref="borrowMachineForm" :rules="borrowMachineFormRules"
									 label-width="100px" style="width: 95%">
						<el-form-item label="机器" prop="WorkMachineID">
							<el-select v-model="borrowMachineFormData.WorkMachineID" style="width: 100%">
								<el-option v-if="areaList.length>0"
													 v-for="item in machineData"
													 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
								</el-option>
							</el-select>
						</el-form-item>
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
				<el-dialog :visible.sync="returnMachineDialogVisible" :before-close="returnMachineCancel" append-to-body>
					<el-form :model="returnMachineFormData" label-position="left" label-width="100px" style="width: 95%">
						<el-form-item label="机器">
							<el-select v-model="returnMachineFormData.WorkMachineID" style="width: 100%" @change="returnMachineChange">
								<el-option v-if="areaList.length>0"
													 v-for="item in machineData"
													 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<p>{{returnMachineFormData.BorrowInfo}}</p>
						</el-form-item>
						<el-form-item>
							<el-button @click="returnMachineSubmit">还机</el-button>
							<el-button @click="returnMachineCancel">取消</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
			</el-col>
		</el-row>
		<common-table :data="workOrderTableData" :columns="cellType==='BT'?workOrderTextureColumns:workOrderColumns">
			<el-table-column slot="columnR" prop="Flag" label="状态">
				<template slot-scope="scope">
					{{scope.row.Flag|displayFilter(machineWorkOrderStatusList,"EnumValue","Description")}}
				</template>
			</el-table-column>
			<el-table-column slot="columnR" prop="Flag">
				<template slot-scope="scope">
					<el-link
							v-if="scope.row.Flag===0||scope.row.Flag===1||scope.row.Flag===4"
							@click="linkClick(scope.row)">{{scope.row.Flag===0?"投产":scope.row.Flag===1?"暂停":scope.row.Flag===4?"恢复":""}}</el-link>
				</template>
			</el-table-column>
		</common-table>
	</div>
</template>

<script>
	import CommonTable from "./commonTable";
	import {displayFilter} from "../commonFunction/displayFilter";
	export default {
		name: "productionMachineSelect",
		components: {CommonTable},
		props:{
			cellType: {
				type: String,
				required: true,
			},
		},
		filters:{
			displayFilter,
		},
		data(){
			return{
				machineData:[],
				areaList:[],
				productLineList:[],
				lineList:[],
				machineWorkOrderStatusList:[],
				selectMachineID:null,
				autoMachineColumns:[{prop:"MachineName",label:"MachineName"}],
				autoMachineTableData:[],
				borrowMachineDialogVisible:false,
				borrowMachineFormData:{},
				borrowMachineFormRules:{
					WorkMachineID: [	{required: true, message: '请选择机器', trigger: 'change'},],
					AreaID: [	{required: true, message: '请选择车间', trigger: 'change'},],
					LineIDs: [	{required: true, message: '请选择产线', trigger: 'change'},],
					BeginTime: [{required: true, message: '请选择开始时间', trigger: 'change'},],
					EndTime: [{required: true, message: '请选择结束时间', trigger: 'change'},],
				},
				returnMachineDialogVisible:false,
				returnMachineFormData:{},
				workOrderTableData:[],
				workOrderColumns:[{prop:"SiteName",label:"厂"},{prop:"AreaName",label:"部门"},
					{prop:"WorkOrderNO",label:"工单号"},{prop:"InStationWaferNum",label:"投入数"},
					{prop:"InRobot",label:"IGV在途"},{prop:"Buffer",label:"Buffer"}],
				workOrderTextureColumns:[{prop:"SiteName",label:"厂"},{prop:"AreaName",label:"部门"},
					{prop:"WorkOrderNO",label:"工单号"},{prop:"ActualInput",label:"发料数"},{prop:"InStationWaferNum",label:"投入数"},
					{prop:"InRobot",label:"IGV在途"},{prop:"Buffer",label:"Buffer"}],
			}
		},
		created(){
			this.getMachineData();
			this.getAreaList();
			this.getProductLineList();
			this.getMachineWorkOrderStatusData();
		},
		methods:{
			getMachineData() {
				let fd = new FormData();
				fd.set('flag', 'getMachineList');
				fd.set('workCellTypeName',this.cellType);
				fd.set('machineType','1');
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				 this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					 this.machineData=res.data;
				 })
			},
			getMachineWorkOrderStatusData(){
				let fd = new FormData();
				fd.set('flag', 'getMachineWorkOrderStatusList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.machineWorkOrderStatusList=res.data;
				})
			},
			machineChange(val){
				this.getAutoMachineListByProcessMachineID();
				this.getWorkOrderProcessMachineData();
			},
			getAutoMachineListByProcessMachineID(){
				let fd = new FormData();
				fd.set('flag', 'getAutoMachineListWithLastEMJob');
				fd.set('workMachineId',this.selectMachineID);
				this.$axios.post('/mes/Service/RobotService.ashx', fd).then(res => {
					if (res.data){this.autoMachineTableData= res.data;} else {this.autoMachineTableData= [];}
				})
			},
			getWorkOrderProcessMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkOrderProcessMachineList');
				fd.set('workMachineId',this.selectMachineID);
				this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
					if (res.data){this.workOrderTableData= res.data;} else {this.workOrderTableData= [];}
				})
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
			areaSelectChange(val){
				if (val){
					this.lineList=this.productLineList.filter((item)=>{ if (item.AreaID == val){return item;}  });
				} else {this.lineList=[];}
				this.$set(this.borrowMachineFormData,'LineIDs',null);
			},
			borrowMachine() {
				this.borrowMachineDialogVisible=true;
				this.$set(this.borrowMachineFormData,'WorkMachineID',this.selectMachineID);
				this.$set(this.borrowMachineFormData,'BeginTime',new Date());
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
			returnMachineChange(val){
				if(val){
					let fd = new FormData();
					fd.set('flag', 'getBorrowMachine');
					fd.set('workMachineId',val);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.$set(this.returnMachineFormData,'BorrowInfo',res.data);
					});
				}else {
					this.$set(this.returnMachineFormData,'BorrowInfo','');
				}
			},
			returnMachine() {
				this.returnMachineDialogVisible=true;
				this.$set(this.returnMachineFormData,'WorkMachineID',this.selectMachineID);
				this.returnMachineChange(this.selectMachineID);
			},
			returnMachineSubmit(){
				if(!this.returnMachineFormData.WorkMachineID){
					this.$message({
						type: 'warning',
						message: "请选择机器!",
						showClose: true,
					});
					return;
				}
				let fd = new FormData();
				fd.set('flag', 'returnMachine');
				fd.set('workMachineId',this.returnMachineFormData.WorkMachineID);
				fd.set('user','');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					if (res.data==="success"){
						this.returnMachineCancel();
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
			},
			returnMachineCancel(){
				this.returnMachineDialogVisible=false;
				this.returnMachineFormData={};
			},
			switchWorkOrder(workOrderID) {
				 let fd = new FormData();
				 fd.set('flag', 'switchWorkOrder');
				 fd.set('workMachineId', this.selectMachineID);
				 fd.set('workOrderId', workOrderID);
				 this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					 if (res.data === "success") {
					 	this.getWorkOrderProcessMachineData();
						 this.$message({
							 type: 'success',
							 message: 'success！'
						 });
					 } else {
						 this.$message({
							 type: 'error',
							 message: res.data,
							 showClose: true,
						 });
					 }
				 })
			 },
			switchMachineWorkOrderStatus(workOrderID,status){
				let fd = new FormData();
				fd.set('flag', 'switchMachineWorkOrderStatus');
				fd.set('workMachineId', this.selectMachineID);
				fd.set('workOrderId', workOrderID);
				fd.set('status',status);
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data === "success") {
						this.getWorkOrderProcessMachineData();
						this.$message({
							type: 'success',
							message: 'success！'
						});
					} else {
						this.$message({
							type: 'error',
							message: res.data,
							showClose: true,
						});
					}
				})
			},
			linkClick(row){
				switch(row.Flag){
					case 0:
						this.$confirm('确定投产?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
						}).then(()=>{
							this.switchWorkOrder(row.WorkOrderID);
						});
						break;
					case 1:
						this.$confirm('确定暂停?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
						}).then(()=>{
							this.switchMachineWorkOrderStatus(row.WorkOrderID,4);
						});
						break;
					case 4:
						this.$confirm('确定恢复?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
						}).then(()=>{
							this.switchMachineWorkOrderStatus(row.WorkOrderID,1);
						});
						break;
				}
			},
		},
	}
</script>

<style scoped>
</style>