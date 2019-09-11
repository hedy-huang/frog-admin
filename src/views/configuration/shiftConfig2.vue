<template>
	<div>
		<common-table ref="table" :data="getShiftData" :columns="shiftTableColumns" :pagination="true"
									:allowAdding="true" :allowUpdating="true" :allowDeleting="true"
									@add=shiftUpdate({}) @update="shiftUpdate" @delete="shiftDelete"
									:show.sync="show"
									@dialogClose="shiftEditCancel">
			<div slot="dialog">
				<el-form :model="formData" ref="shiftForm" :rules="shiftFormRules"
								 label-width="100px" style="width:95%">
					<el-form-item label="班次名称" prop="ShiftName">
						<el-input v-model="formData.ShiftName"></el-input>
					</el-form-item>
					<el-form-item label="开始时间" prop="Start">
						<el-time-picker v-model="formData.Start" value-format="HH:mm" style="width: 100%"></el-time-picker>
					</el-form-item>
					<el-form-item label="结束时间" prop="End">
						<el-time-picker v-model="formData.End" value-format="HH:mm" style="width: 100%"></el-time-picker>
					</el-form-item>
					<el-form-item>
						<el-button @click="shiftEditSave">保存</el-button>
						<el-button @click="shiftEditCancel">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</common-table>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	export default {
		name: "shiftConfig2",
		components:{CommonTable},
		data(){
			return{
				shiftTableColumns:[
					{prop:"ShiftName",label:"班次名称"},{prop:"Start",label:"开始时间",type:"time"},
					{prop:"End",label:"结束时间",type:"time"},{prop:"CreateDate",label:"创建时间",type:"datetime"}],
				formData:{},
				show:false,
				shiftFormRules:{
					ShiftName: [
						{required: true, message: '请输入班次名称', trigger: 'blur'},
					],
					Start: [
						{required: true, message: '请选择开始时间', trigger: 'change'},
					],
					End: [
						{required: true, message: '请选择结束时间', trigger: 'change'},
					],
				},
			}
		},
		asyncComputed:{
			async getShiftData(){
				let fd = new FormData();
				fd.set('flag', 'ShiftAll');
				return (await this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd)).data;
			},
		},
		methods:{
			shiftUpdate(row){
				this.formData=row;
				this.show=true;
			},
			shiftEditSave(){
				this.$refs['shiftForm'].validate((valid) => {
					if (valid) {
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
							this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
								if (res.data==='success'){
									this.shiftEditCancel();
									this.$asyncComputed.getShiftData.update();
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
							fd.set('flag', 'ShiftInsert');
							fd.set('GroupName','\'SYSTEM\'');
							fd.set('ShiftName',this.formData.ShiftName);
							fd.set('Remark','REST');
							fd.set('StartTime',this.formData.Start);
							fd.set('EndTime',this.formData.End);
							fd.set('Index','1');
							this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
								if (res.data==='success'){
									this.shiftEditCancel();
									this.$asyncComputed.getShiftData.update();
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
			shiftEditCancel(){
				this.formData={};
				this.show=false;
				this.$refs['shiftForm'].resetFields();
			},
			shiftDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'ShiftDel');
					fd.set('ShiftID',row.ShiftID);
					this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getShiftData.update();
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

		},
	}
</script>

<style scoped>

</style>