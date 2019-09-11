<template>
	<div>
		<time-query-form :queryFormData="queryFormData"></time-query-form>
		<el-button style="float: right" slot="reference" @click="operatorClockInPop">打卡</el-button>
		<common-table :data="getOperatorClockInData" :columns="operatorClockInTableColumns"
									:pagination="true">
		</common-table>
		<el-dialog  :visible.sync="addVisible" :before-close="operatorClockInCancel" append-to-body>
			<el-form :model="operatorClockInFormData" label-position="left"  label-width="100px" style="width: 95%">
				<el-form-item label="工号">
					<el-input v-model="operatorClockInFormData.OperatorID"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="operatorClockInFormData.PassWord" show-password></el-input>
				</el-form-item>
				<el-form-item label="班次">
						<el-select v-model="operatorClockInFormData.ShiftCode" style="width: 100%">
							<el-option 	v-for="item in shiftCodeData" :key="item.ID" :label="item.Display" :value="item.ID">
							</el-option>
						</el-select>
					</el-form-item>
				<el-form-item label="班组">
						<el-select v-model="operatorClockInFormData.ClassCode" style="width: 100%">
							<el-option 	v-for="item in classCodeData" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
				<el-form-item label="自动化机器">
						<el-select v-model="operatorClockInFormData.WorkMachineID" style="width: 100%">

						</el-select>
					</el-form-item>
				<el-form-item label="行为">
						<el-select v-model="operatorClockInFormData.ActionID" style="width: 100%">

						</el-select>
					</el-form-item>
				<el-form-item>
						<el-button @click="operatorClockInSave">保存</el-button>
						<el-button @click="operatorClockInCancel">取消</el-button>
					</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import TimeQueryForm from "../common/commonComponent/timeQueryForm";
	import CommonTable from "../common/commonComponent/commonTable";
	export default {
		name: "attendanceRecord",
		components:{CommonTable, TimeQueryForm},
		data() {
			return {
				shiftCodeData:[{ "ID": "01", "Display": "白班" }, { "ID": "02", "Display": "夜班" }],
			  classCodeData:	[ "A" ,  "B",  "C" ],
				autoMachineData:[],
				clockInItemData:[],
				queryFormData: {BeginTime: new Date(),	EndTime: new Date(),},
				operatorClockInTableData:[],
				operatorClockInTableColumns:[{prop:"OperatorID",label:"工号"},{prop:"WorkMachineID",label:"自动化机器"},
					{prop:"ShiftCode",label:"班次"},{prop:"ClassCode",label:"班组"},
					{prop:"ActionName",label:"行为"},{prop:"OccurTime",label:"操作时间",type:"datetime"}],
		    addVisible:false,
				operatorClockInFormData:{},
			}
		},
		asyncComputed:{
			async getOperatorClockInData(){
				if (this.queryFormData.BeginTime && this.queryFormData.EndTime){
					let fd = new FormData();
					fd.set('flag', 'getOperatorClockInList');
					fd.set('areaId','[]');
					fd.set('operatorId','');
					fd.set('beginTime',this.common.datetimeFormat(this.queryFormData.BeginTime));
					fd.set('endTime',this.common.datetimeFormat(this.queryFormData.EndTime));
					let data= (await this.$axios.post('/mes/Service/UserService.ashx', fd)).data;
					if (data){return data;}
				}
				return [];
			},
		},
		created(){
			this.getShiftInfo();
		},
		methods: {
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
				this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
					this.queryFormData.BeginTime=res.data.ShiftBegTime;
					this.queryFormData.EndTime=res.data.ShiftEndTime;
				})
			},
			operatorClockInPop() {
				this.addVisible = true;
			},
			operatorClockInCancel() {
				this.addVisible = false;
			},
			operatorClockInSave() {
			},
		}
	}
</script>

<style scoped>

</style>