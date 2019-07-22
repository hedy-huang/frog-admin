<template>
	<div>
		<common-table :data="shiftTableData" :columns="shiftTableColumns" :pagination="true" :formData="formData"
									:allowAdding="true"
									:allowUpdating="true" @edit="shiftEditSave"
									:allowDeleting="true" @delete="shiftDelete">
		</common-table>
	</div>
</template>

<script>
	import CommonTable from "@/views/common/commonComponent/commonTable";
	export default {
		name: "shiftConfig2",
		components:{CommonTable},
		data(){
			return{
				shiftTableData:[],
				shiftTableColumns:[
					{prop:"ShiftName",label:"班次名称"},{prop:"Start",label:"开始时间",type:"time"},
					{prop:"End",label:"结束时间",type:"time"},{prop:"CreateDate",label:"创建时间",type:"datetime",editable:false}],
				formData:{},
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
			shiftEditSave(editData){
				if (editData.ShiftID) {
					let fd = new FormData();
					fd.set('flag', 'ShiftEdit');
					fd.set('ShiftID',editData.ShiftID);
					fd.set('GroupName','\'SYSTEM\'');
					fd.set('ShiftName',editData.ShiftName);
					fd.set('Remark','REST');
					fd.set('StartTime',editData.Start);
					fd.set('EndTime',editData.End);
					fd.set('Index','1');
					this.$axios.post('/api/Service/ShiftInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
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
			shiftDelete(row){
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
		},
	}
</script>

<style scoped>

</style>