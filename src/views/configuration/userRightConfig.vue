<template>
	<el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
		<el-tab-pane label="部门" name="department"></el-tab-pane>
		<el-tab-pane label="角色" name="role">
			<div>
				<el-row :gutter="20">
					<el-col span="8">
						<el-table :data="roleTableData" highlight-current-row @current-change="handleRoleCurrentChange">
							<el-table-column prop="RoleName" label="角色名称"></el-table-column>
						</el-table>
					</el-col>
					<el-col span="16">
						<el-table :data="roleUserTableData">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="OperatorID" label="操作人"></el-table-column>
							<el-table-column prop="EmployeeName" label="姓名"></el-table-column>
							<el-table-column prop="Gender" label="性别"></el-table-column>
							<el-table-column prop="CreateDate" label="创建时间"></el-table-column>
						</el-table>
					</el-col>
				</el-row>
			</div>
		</el-tab-pane>
		<el-tab-pane label="用户组" name="userGroup"></el-tab-pane>
		<el-tab-pane label="用户" name="user"></el-tab-pane>
		<el-tab-pane label="App" name="appUser"></el-tab-pane>
	</el-tabs>
</template>

<script>
	export default {
		name: "userRightConfig",
		data(){
			return {
				tabName:"department",
				roleTableData:[],
				roleUserTableData:[],
			}
		},
		created() {
			this.showTab();
		},
		methods: {
			showTab() {
				switch (this.tabName) {
					case "department":
						break;
					case "role":
						this.getRoleData();
						break;
					case "userGroup":
						break;
					case "user":
						break;
					case "appUser":
						break;
				}
			},
			handleTabClick(tab) {
				this.tabName = tab.name;
				this.showTab();
			},
			getRoleData() {
				let fd = new FormData();
				fd.set('flag', 'getRoleList');
				this.$axios.post('/api/Service/RoleInfoService.ashx', fd).then(res => {
					this.roleTableData = res.data;
				})
			},
			handleRoleCurrentChange(val){
				console.log(val);
				this.getRoleUserListByRoleID(val.RoleID);
			},
			getRoleUserListByRoleID(roleId){
				let fd = new FormData();
				fd.set('flag', 'getRoleUserList');
				fd.set('roleId',roleId);
				this.$axios.post('/api/Service/UserService.ashx', fd).then(res => {
					this.roleUserTableData = res.data;
				})
			},
		}
	}
</script>

<style scoped>

</style>