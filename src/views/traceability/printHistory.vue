<template>
	<div>
		<el-form :model="queryFormData" label-position="left" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="工单">
						<el-select v-model="queryFormData.WorkOrderNO" clearable style="width: 100%" @change="workOrderChange">
							<el-option v-if="workOrderData.length>0"
												 v-for="item in workOrderData"
												 :key="item.WorkOrderNO" :label="item.WorkOrderNO" :value="item.WorkOrderNO">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="线别">
						<el-select v-model="queryFormData.Line" clearable style="width: 100%">
							<el-option v-if="lineSelectData.length>0"
												 v-for="item in lineSelectData"
												 :key="item.PrinterName" :label="item.PrinterName" :value="item.PrinterName">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="等级">
						<el-select v-model="queryFormData.Grade" clearable style="width: 100%">
							<el-option v-if="gradeData.length>0"
												 v-for="item in gradeData"
												 :key="item.Value" :label="item.Description" :value="item.Value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="开始时间">
						<el-date-picker v-model="queryFormData.BeginTime" type="datetime" :clearable="false" style="width: 100%">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="结束时间">
						<el-date-picker v-model="queryFormData.EndTime" type="datetime" :clearable="false" style="width: 100%">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="标签号">
						<el-input v-model="queryFormData.PackCode" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<common-table :data="getPackScanHistoryData" :columns="packScanHistoryColumns"
									:pagination="true" v-loading="this.$asyncComputed.getPackScanHistoryData.updating">
			<el-table-column slot="columnR" prop="ManOperatorFlag" label="打印类型">
				<template slot-scope="scope">
					{{scope.row.ManOperatorFlag|displayFilter([{ "Description": "自动打印", "Value": 0 }, { "Description": "手动打印", "Value": 1 }, { "Description": "离线打印", "Value": 2 }],"Value","Description")}}
				</template>
			</el-table-column>
			<el-table-column slot="columnR" prop="Flag" label="状态">
				<template slot-scope="scope">
					{{scope.row.Flag|displayFilter( [{ "Description": "打印完成", "Value": 1 }, { "Description": "打印未完成", "Value": -2 }, { "Description": "打印失效", "Value": -3 }, { "Description": "批次隔离", "Value": -5 }],"Value","Description")}}
				</template>
			</el-table-column>
		</common-table>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	export default {
		name: "printHistory",
		components: {CommonTable},
		data(){
			return {
				workOrderData:[],
				lineData:[],
				lineSelectData:[],
				gradeData: [{ "Type": "Grade", "Value": "A", "Description": "A" }, { "Type": "Grade", "Value": "B", "Description": "B" }, { "Type": "Grade", "Value": "C", "Description": "C" }, { "Type": "Grade", "Value": "O", "Description": "O" }, { "Type": "Grade", "Value": "S", "Description": "S" }, { "Type": "Grade", "Value": "B+", "Description": "B+" }, { "Type": "Grade", "Value": "EL不良", "Description": "EL不良" }, { "Type": "Grade", "Value": "外观不良", "Description": "外观不良" }, { "Type": "Grade", "Value": "EL+外观全检", "Description": "EL+外观全检" }, { "Type": "Grade", "Value": "90BinEL不良", "Description": "90BinEL不良" }, { "Type": "Grade", "Value": "---", "Description": "---" }],
				queryFormData:{BeginTime:new Date(),EndTime:new Date()},
				packScanHistoryColumns:[{prop:"PackCode",label:"标签号"},{prop:"WorkOrderNO",label:"工单号"},
					{prop:"ProductName",label:"成品料号"},{prop:"Bin",label:"Bin"},
					{prop:"Eta",label:"转换效率"},{prop:"Pmpp",label:"功率"},
					{prop:"EtaBot",label:"背面效率"},{prop:"Color",label:"膜色"},
					{prop:"Grade",label:"等级"},{prop:"Class",label:"档位"},
					{prop:"Operator",label:"操作人"},{prop:"Line",label:"线别"},
					{prop:"Schedules",label:"Bin盒号"},{prop:"RecordTime",label:"记录时间",type:"datetime"},
					{prop:"Total",label:"数量"},{prop:"LineFlowNo",label:"线流水码"},
					{prop:"ReWorkTotal",label:"返工数量"},{prop:"PrinterReadTimes",label:"打印次数"},],
			}
		},
		asyncComputed:{
			async getPackScanHistoryData(){
					let fd = new FormData();
					fd.set('flag', 'getPackScanHistoryList');
					fd.set('workOrderNo',this.queryFormData.WorkOrderNO===undefined?'':this.queryFormData.WorkOrderNO);
					fd.set('line',this.queryFormData.Line===undefined?'':this.queryFormData.Line);
					fd.set('grade',this.queryFormData.Grade===undefined?'':this.queryFormData.Grade);
			  	fd.set('packCode',this.queryFormData.PackCode===undefined?'':this.queryFormData.PackCode);
					fd.set('beginTime',this.common.datetimeFormat(this.queryFormData.BeginTime));
					fd.set('endTime',this.common.datetimeFormat(this.queryFormData.EndTime));
					let data= (await this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd)).data;
					if(data){return data;}
					return [];
			},
		},
		created(){
			this.getShiftInfo();
			this.getWorkOrderData();
			this.getLineData();
		},
		methods:{
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
				this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
					this.$set(this.queryFormData,'BeginTime',res.data.ShiftBegTime);
					this.$set(this.queryFormData,'EndTime',res.data.ShiftEndTime);
				})
			},
			getWorkOrderData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkOrderListByArea');
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					this.workOrderData=res.data.reverse();
				})
			},
			getLineData(){
				let fd = new FormData();
				fd.set('flag', 'getPrinterNameList');
				this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
					this.lineData=res.data;
					this.lineSelectData=res.data;
				})
			},
			workOrderChange(val){
				let lineId = null;
				let select = this.workOrderData.find((item)=>{return item.WorkOrderNO===val;});
				if (select) { lineId = select.InputMachine; }
				if (lineId) {
					let lineSource = this.lineData.filter(function (item) {
						if (item.LineIds.indexOf(lineId)!= -1) {
							return item;
						}
					});
					this.lineSelectData=lineSource;
					if(!lineSource.find((item)=>{return item.PrinterName === this.queryFormData.Line;})){
						this.$set(this.queryFormData,'Line',null);
					}
				} else {
					this.lineSelectData=this.lineData;
				}
			},
		},
	}
</script>

<style scoped>

</style>