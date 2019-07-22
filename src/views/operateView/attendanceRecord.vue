<template>
	<div>
		<time-query-form :queryFormData="queryFormData" @query=""></time-query-form>
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
	import TimeQueryForm from "@/views/common/commonComponent/timeQueryForm";
	export default {
		name: "attendanceRecord",
		components:{TimeQueryForm},
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
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
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


		}
	}
</script>

<style scoped>

</style>