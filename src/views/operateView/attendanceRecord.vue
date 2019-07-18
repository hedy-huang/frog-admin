<template>
	<div>
		<el-form :inline="true" :model="queryFormData">
			<el-form-item label="开始时间">
				<el-date-picker v-model="queryFormData.BeginTime" type="datetime" placeholder="选择开始时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间">
				<el-date-picker v-model="queryFormData.EndTime" type="datetime" placeholder="选择结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button>查询</el-button>
			</el-form-item>
		</el-form>
		<el-button style="float: right" slot="reference" @click="operatorClockInPop">打卡</el-button>
		<el-table :data="operatorClockInTableData">
		</el-table>
		<el-dialog  :visible.sync="addVisible" :before-close="operatorClockInCancel">
			<el-form :model="operatorClockInFormData" label-position="left"  label-width="100px" style="width: 95%">
				<el-form-item label="工号">
					<el-input v-model="operatorClockInFormData.OperatorID"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="operatorClockInFormData.PassWord"></el-input>
				</el-form-item>
				<el-form-item label="班次">
						<el-select v-model="operatorClockInFormData.ShiftCode">
							<el-option 	v-for="item in shiftCodeData" :key="item.ID" :label="item.Display" :value="item.ID">
							</el-option>
						</el-select>
					</el-form-item>
				<el-form-item label="班组">
						<el-select v-model="operatorClockInFormData.ClassCode">
							<el-option 	v-for="item in classCodeData" :key="item.ID" :label="item.ID" :value="item.ID">
							</el-option>
						</el-select>
					</el-form-item>
				<el-form-item label="自动化机器">
						<el-select v-model="operatorClockInFormData.WorkMachineID">

						</el-select>
					</el-form-item>
				<el-form-item label="行为">
						<el-select v-model="operatorClockInFormData.ActionID">

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
	export default {
		name: "attendanceRecord",
		data() {
			return {
				shiftCodeData:[{ "ID": "01", "Display": "白班" }, { "ID": "02", "Display": "夜班" }],
			  classCodeData:	[{ "ID": "A" }, { "ID": "B" }, { "ID": "C" }],
				autoMachineData:[],
				clockInItemData:[],
				queryFormData: {
					BeginTime: '',
					EndTime: '',
				},
				operatorClockInTableData:[],
				operatorClockInTableColumns:['OperatorID','WorkMachineID','ShiftCode','ClassCode','ActionName','OccurTime'],
		    addVisible:false,
				operatorClockInFormData:{
					OperatorID:"",
					PassWord:"",ShiftCode:"",ClassCode:"",WorkMachineID:"",ActionID:"",
				},
			}
		},
		created(){
			this.getShiftInfo();
		},
		methods: {
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.dateFormat(new Date()));
				this.$axios.post('/api/Service/ShiftInfoService.ashx', fd).then(res => {
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

			dateFormat(formatDate) {
				if (formatDate == null || formatDate == "") return "";
				let date = new Date(formatDate);
				let Y = date.getFullYear();
				let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
				let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
				let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
			},
		}
	}
</script>

<style scoped>

</style>