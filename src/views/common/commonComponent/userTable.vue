<template>
	<div class="user-table">
		<el-button-group style="float: right">
			<el-button size="small" icon="el-icon-plus" @click="handleUserAdd">添加人员</el-button>
			<el-button size="small" icon="el-icon-close" @click="handleUserDelete">删除人员</el-button>
		</el-button-group>
		<common-table ref="relationusertable" :data="getRelationUserData" :columns="userColumns"
									:pagination="true" :multipleSelection="true"
									v-loading="this.$asyncComputed.getRelationUserData.updating">
		</common-table>
		<el-dialog :visible.sync="userAddVisible" append-to-body
							 :before-close="userAddCancel">
			<common-table ref="selectusertable" :data="userData" :columns="userColumns" style="width: 95%"
										:pagination="true" :page-size="5" :multiple-selection="true">
			</common-table>
			<el-button size="small" @click="userRelationAddSave">提交</el-button>
		</el-dialog>
	</div>
</template>

<script>
	import CommonTable from "./commonTable";
	export default {
		name: "userTable",
		components: {CommonTable},
		props:{
			queryConditions:{Type:"",ID:"",Index:""},
			userData:{
				type: Array,
				default: () => {
					return [];
				}
				},
		},
		data(){
			return{
				userColumns:[{prop:"OperatorID",label:"操作人"},{prop:"EmployeeName",label:"姓名"},
					{prop:"Gender",label:"性别"},{prop:"CreateDate",label:"创建时间",type:"datetime"}],
				userAddVisible:false,
			}
		},
		asyncComputed:{
			async getRelationUserData(){
				if (this.queryConditions.ID) {
					let fd = new FormData();
					switch (this.queryConditions.Type) {
						case "Department":
							fd.set('flag', 'getDepartmentUserList');
							fd.set('departmentId',this.queryConditions.ID);
							return (await this.$axios.post('/mes/Service/UserService.ashx', fd)).data;
							break;
						case "Role":
							fd.set('flag', 'getRoleUserList');
							fd.set('roleId',this.queryConditions.ID);
							return (await this.$axios.post('/mes/Service/UserService.ashx', fd)).data;
							break;
						case "Group":
							fd.set('flag', 'getGroupUserList');
							fd.set('groupId',this.queryConditions.ID);
							return (await this.$axios.post('/mes/Service/UserService.ashx', fd)).data;
							break;
							case "User":
								return [];
								break;
						case "App":
							fd.set('flag', 'getAppUserList');
							fd.set('appId',this.queryConditions.ID);
							return (await this.$axios.post('/mes/Service/UserService.ashx', fd)).data;
							break;
					}
				}
				else {return [];}

			},
			async getUserData(){
				let fd = new FormData();
				fd.set('flag', 'getUserList');
				return (await this.$axios.post('/mes/Service/UserService.ashx', fd)).data;
			},
		},
		methods:{
			handleUserAdd(){
				if (this.queryConditions.Type && this.queryConditions.ID){
					this.userAddVisible=true;
				}else {
					this.$message({
						type: 'warning',
						message: "请选择人员所属部门/角色/组/APP！",
					});
				}
			},
			handleUserDelete(){
				let selectUsers= this.$refs.relationusertable.multipleSelectionAll;
				if (selectUsers.length>0){
					let userIds = selectUsers.map((item)=>{return item.EmployeeID;});
					let fd = new FormData();
					fd.set('flag', 'deleteUserRelation');
					fd.set('relationType',this.queryConditions.Index);
					fd.set('relationKeyId',this.queryConditions.ID);
					fd.set('userIdList',JSON.stringify(userIds));
					this.$axios.post('/mes/Service/UserService.ashx', fd).then(res => {
						if (res.data ==''||res.data.Message===''){
							this.$asyncComputed.getRelationUserData.update();
							this.$refs.relationusertable.clearMultipleSelection();
							this.$message({
								type: 'success',
								message: '删除成功！'
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
					this.$message({
						type: 'warning',
						message: '请选择具体人员！'
					});
				}
			},
			userRelationAddSave(){
				let selectUsers= this.$refs.selectusertable.multipleSelectionAll;
				if (selectUsers.length>0){
					let userIds = selectUsers.map((item)=>{return item.EmployeeID;});
					let fd = new FormData();
					fd.set('flag', 'addUserRelation');
					fd.set('relationType',this.queryConditions.Index);
					fd.set('relationKeyId',this.queryConditions.ID);
					fd.set('userIdList',JSON.stringify(userIds));
					this.$axios.post('/mes/Service/UserService.ashx', fd).then(res => {
						if (res.data ==''||res.data.Message===''){
							this.userAddCancel();
							this.$asyncComputed.getRelationUserData.update();
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
				} else {
					this.$message({
						type: 'warning',
						message: '请选择具体人员！'
					});
				}
			},
			userAddCancel(){
				this.$refs.selectusertable.clearMultipleSelection();
				this.userAddVisible=false;
			}
		}
	}
</script>

<style scoped>

</style>