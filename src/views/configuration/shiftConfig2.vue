<template>
	<div>
		<el-button icon="el-icon-plus" size="small" style="float: right" slot="reference" @click="shiftAddPop()"></el-button>
		<el-table :data="shiftTableData">
			<el-table-column prop="ShiftName" label="班次名称"></el-table-column>
			<el-table-column prop="Start" label="开始时间" :formatter="columnTimeFormat"></el-table-column>
			<el-table-column prop="End" label="结束时间" :formatter="columnTimeFormat"></el-table-column>
			<el-table-column prop="CreateDate" label="创建时间" :formatter="columnDateFormat"></el-table-column>
			<el-table-column align="right">
				<template slot-scope="scope">
					<el-button
							size="mini"
							@click="shiftEditPop(scope.$index, scope.row)">编辑</el-button>
					<el-button
							size="mini"
							type="danger"
							@click="shiftDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog  :visible.sync="editVisible" :before-close="shiftEditCancel">
			<el-form ref="formData" :model="formData" label-position="left" label-width="100px" style="width: 95%">
				<el-form-item label="班次名称">
					<el-input v-model="formData.ShiftName"></el-input>
				</el-form-item>
				<el-form-item label="开始时间">
					<el-time-picker v-model="formData.Start" value-format="HH:mm" style="width: 100%"></el-time-picker>
				</el-form-item>
				<el-form-item label="结束时间">
					<el-time-picker v-model="formData.End" value-format="HH:mm" style="width: 100%"></el-time-picker>
				</el-form-item>
				<el-form-item>
					<el-button @click="shiftEditSave()">保存</el-button>
					<el-button @click="shiftEditCancel()">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "shiftConfig2",
		data(){
			return{
				shiftTableData:[],
				editVisible:false,
				formData:{
					ShiftName:null,Start:null,End:null,
				},
			}
		},
		created(){
			this.getShiftData();
		},
		methods:{
			getShiftData(){
				let fd = new FormData();
				fd.set('flag', 'ShiftAll');
				this.$axios.post('/api/Service/ShiftInfoService.ashx', fd).then(res => {
					this.shiftTableData = res.data;
				})
			},
			shiftAddPop(){
				this.editVisible=true;
			},
			shiftEditSave(){
				if (this.formData.ShiftID) {
					let fd = new FormData();
					fd.set('flag', 'ShiftEdit');
					fd.set('ShiftID',this.formData.ShiftID);
					fd.set('GroupName','\'SYSTEM\'');
					fd.set('ShiftName',this.formData.ShiftName);
					fd.set('Remark','REST');
					fd.set('StartTime',this.formData.Start);
					fd.set('EndTime',this.formData.End);
					fd.set('Index','1');
					this.$axios.post('/api/Service/ShiftInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.shiftEditCancel();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
							this.getShiftData();
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
					fd.set('flag', 'ShiftInsert');
					fd.set('GroupName','\'SYSTEM\'');
					fd.set('ShiftName',this.formData.ShiftName);
					fd.set('Remark','REST');
					fd.set('StartTime',this.formData.Start);
					fd.set('EndTime',this.formData.End);
					fd.set('Index','1');
					this.$axios.post('/api/Service/ShiftInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.shiftEditCancel();
							this.$message({
								type: 'success',
								message: '添加成功！'
							});
							this.getShiftData();
						}else {
							this.$message({
								type: 'error',
								message: res.data,
								showClose: true,
							});
						}
					})
				}
			},
			shiftEditCancel(){
				this.editVisible=false;
				this.formData = {
					ShiftID:null,
					ShiftName:null,
					Start:null,
					End:null,
				};
			},
			shiftEditPop(index, row){
				this.editVisible=true;
				this.formData=row;
			},
			shiftDelete(index,row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'ShiftDel');
					fd.set('ShiftID',row.ShiftID);
					this.$axios.post('/api/Service/ShiftInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
							this.getShiftData();
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
			columnTimeFormat(row, column, cellValue) {
				if (cellValue == null || cellValue == "") return "";
				let date = new Date(cellValue);
				let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
				let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				return h + ":" + m;
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
			columnDateFormat(row, column, cellValue) {
				return this.dateFormat(cellValue);
			},
		},
	}
</script>

<style scoped>

</style>