<template>
	<div>
		<el-form :model="printVerifyFormData" ref="printVerifyForm" :rules="printVerifyFormRules"
						 label-position="left" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-col :span="8">
						<el-col :span="24">
							<el-form-item label="产线" prop="LineID">
								<el-select v-model="printVerifyFormData.LineID" @change="lineChange">
									<el-option v-if="productLineList.length>0"
														 v-for="item in productLineList"
														 :key="item.LineID" :label="item.LineName" :value="item.LineID">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="工单" prop="WorkOrderID">
								<el-select v-model="printVerifyFormData.WorkOrderID" @change="workOrderChange">
									<el-option v-if="workOrderListByLine.length>0"
														 v-for="item in workOrderListByLine"
														 :key="item.WorkOrderID" :label="item.WorkOrderNO" :value="item.WorkOrderID">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-col>
					<el-col :span="16">
						<el-form-item>
							<vBarcode :value="workOrderNO" height="50" format="CODE128"></vBarcode>
						</el-form-item>
					</el-col>
				</el-col>
				<el-col :span="8">
					<el-form-item label="机器" prop="WorkMachineID">
						<el-select v-model="printVerifyFormData.WorkMachineID">
							<el-option v-if="workMachineList.length>0"
												 v-for="item in workMachineList"
												 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="工号" prop="OperatorID">
						<el-input v-model="printVerifyFormData.OperatorID"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="批次" prop="BatchNo">
						<el-input v-model="printVerifyFormData.BatchNo"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="浆料网版" prop="MaterialNo">
						<el-input v-model="printVerifyFormData.MaterialNo" placeholder="物料编码"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="物料标签" prop="MaterialTagNo">
						<el-input v-model="printVerifyFormData.MaterialTagNo" placeholder="物料标签"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-button size="small" @click="printVerifySave">提交</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-divider></el-divider>
		<time-query-form :query-form-data="queryFormData"></time-query-form>
		<common-table :data="getPrintVerifyHistoryData" :columns="printVerifyHistoryColumns"
									:pagination="true" v-loading="this.$asyncComputed.getPrintVerifyHistoryData.updating">
			<el-table-column slot="columnL" prop="WorkMachineID" label="机器">
				<template slot-scope="scope">
					{{scope.row.WorkMachineID|displayFilter(workMachineList,"WorkMachineID","MachineName")}}
				</template>
			</el-table-column>
			<el-table-column slot="columnR" prop="VerifyResult" label="验证结果">
				<template slot-scope="scope">
					{{scope.row.VerifyResult|displayFilter([{value:true,text:"通过"},{value:false,text:"不通过"}],"value","text")}}
				</template>
			</el-table-column>
			<el-table-column slot="columnR" prop="ForceTrue" label="强制确认">
				<template slot-scope="scope">
					{{scope.row.ForceTrue|displayFilter([{value:true,text:"已确认"},{value:false,text:"未确认"}],"value","text")}}
				</template>
			</el-table-column>
			<el-table-column slot="columnR">
				<template slot-scope="scope">
					<el-link v-if="scope.row.VerifyResult === false && scope.row.ForceTrue === false" @click="forceCheck(scope.row.HistoryID)">强制通过</el-link>
				</template>
			</el-table-column>
		</common-table>
		<el-dialog :visible.sync="forceDialogVisible" :before-close="forceCheckCancel" append-to-body>
			<el-form :model="forceFormData" label-position="left" label-width="100px" style="width: 95%">
				<el-form-item label="工号">
					<el-input v-model="forceFormData.OperatorID">
					</el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="forceFormData.Password" show-password>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="forceCheckSave">保存</el-button>
					<el-button @click="forceCheckCancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import TimeQueryForm from "../common/commonComponent/timeQueryForm";
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";
	export default {
		name: "printVerify",
		components: {CommonTable, TimeQueryForm},
		filters:{
			displayFilter,
		},
		data(){
			return{
				productLineList:[],
				workOrderList:[],
				workOrderListByLine:[],
				workMachineList:[],
				printVerifyFormData:{},
				printVerifyFormRules:{
					LineID: [{required: true, message: '请选择产线', trigger: 'change'},],
					WorkOrderID: [{required: true, message: '请选择工单', trigger: 'change'},],
					WorkMachineID: [{required: true, message: '请选择机器', trigger: 'change'},],
					OperatorID:[{required: true, message: '请输入工号', trigger: 'blur'},],
					BatchNo:[{required: true, message: '请输入批次', trigger: 'blur'},],
					MaterialNo:[{required: true, message: '请输入物料编码', trigger: 'blur'},],
					MaterialTagNo:[{required: true, message: '请输入物料标签', trigger: 'blur'},],
				},
				queryFormData:{BeginTime:new Date(),EndTime:new Date()},
				printVerifyHistoryColumns:[{prop:"WorkOrderNo",label:"工单号"},{prop:"MatrialLotNumber",label:"物料编码"},
					{prop:"MarkNo",label:"物料标签"},{prop:"BatchNo",label:"批次"},
					{prop:"Operator",label:"验证人"},{prop:"OccurTime",label:"验证时间",type:"datetime"},
					{prop:"ForceOperator",label:"强制确认人员"},{prop:"ForceTime",label:"强制验证时间",type:"datetime"}],
				forceDialogVisible:false,
				forceFormData:{},
				workOrderNO:'',
			}
		},
		asyncComputed:{
			async getPrintVerifyHistoryData(){
				if (this.printVerifyFormData.LineID && this.printVerifyFormData.LineID!=undefined) {
					let fd = new FormData();
					fd.set('flag', 'getPrintVerifyHistoryList');
					fd.set('lineId',this.printVerifyFormData.LineID);
					fd.set('beginTime',this.common.datetimeFormat(this.queryFormData.BeginTime));
					fd.set('endTime',this.common.datetimeFormat(this.queryFormData.EndTime));
					return (await this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd)).data
				}
				return [];
			},
		},
		created(){
			this.getShiftInfo();
			this.getProductLineData();
			this.getWorkOrderData();
		},
		methods:{
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
				this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
					this.queryFormData.BeginTime=res.data.ShiftBegTime;
					this.queryFormData.EndTime=res.data.ShiftEndTime;
				})
			},
			getProductLineData(){
				let fd = new FormData();
				fd.set('flag', 'getProductLineList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.productLineList=res.data;
				});
			},
			getWorkOrderData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkOrderListByArea');
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					this.workOrderList=res.data;
				})
			},
			lineChange(val){
				this.$asyncComputed.getPrintVerifyHistoryData.update();
				this.workOrderListByLine=this.workOrderList.filter((item)=>{return item.InputMachine===val;});
				this.$set(this.printVerifyFormData,'WorkOrderID',null);
				this.workOrderNO='';
				this.getWorkMachineList();
			},
			workOrderChange(val){
				if (val){
					let find = this.workOrderList.find((item)=>{return item.WorkOrderID===val;});
					if (find){
						this.workOrderNO='WO'+find.WorkOrderNO;
					} else {this.workOrderNO='';}

				} else {
					this.workOrderNO='';
				}
			},
			getWorkMachineList(){
				let fd = new FormData();
				fd.set('flag', 'getWorkMachineListByLineId');
				fd.set('lineId',this.printVerifyFormData.LineID);
				fd.set('workCellTypeId',8);
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.workMachineList=res.data;
				});
			},
			printVerifySave(){
				this.$refs['printVerifyForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'submitPrintVerify');
						fd.set('materialNo', this.printVerifyFormData.MaterialNo);
						fd.set('MaterialTagNo', this.printVerifyFormData.MaterialTagNo);
						fd.set('workOrderId', this.printVerifyFormData.WorkOrderID);
						fd.set('workMachineId', this.printVerifyFormData.WorkMachineID);
						fd.set('operatorId', this.printVerifyFormData.OperatorID);
						fd.set('BatchNo', this.printVerifyFormData.BatchNo);
						this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
							if (res.data.Result) {
								this.$asyncComputed.getPrintVerifyHistoryData.update();
								this.$set(this.printVerifyFormData,'MaterialNo',null);
								this.$set(this.printVerifyFormData,'MaterialTagNo',null);
								this.$set(this.printVerifyFormData,'BatchNo',null);
								this.$refs['printVerifyForm'].resetFields();
								this.$message({
									type: 'success',
									message: '提交成功！'
								});
							} else {
								this.$message({
									type: 'error',
									message: res.data.Message,
									showClose: true,
								});
							}
						})
					} else {
						return false;
					}
				});
			},
			forceCheck(HistoryID){
				this.forceDialogVisible=true;
				this.forceFormData={HistoryID:HistoryID};
			},
			forceCheckSave(){
				let fd = new FormData();
				fd.set('flag', 'forcePrintVerifyHistory');
				fd.set('forceOperatorId', this.forceFormData.OperatorID);
				fd.set('password', this.forceFormData.Password);
				fd.set('historyId', this.forceFormData.HistoryID);
				this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
					if (res.data==='success') {
						this.forceCheckCancel();
						this.$asyncComputed.getPrintVerifyHistoryData.update();
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
			},
			forceCheckCancel(){
				this.forceDialogVisible=false;
				this.$set(this.forceFormData,'OperatorID',null);
				this.$set(this.forceFormData,'Password',null);
			},

		}
	}
</script>

<style scoped>

</style>