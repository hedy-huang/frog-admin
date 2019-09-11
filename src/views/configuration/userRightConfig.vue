<template>
	<el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
		<el-tab-pane label="部门" name="department">
			<div>
				<el-row :gutter="20">
					<el-col :span="9">
						<common-table ref="departmenttable"  :data="getDepartmentData" :columns="departmentColumns"
													:pagination="true" row-key="DepartmentID"
													:allow-adding="true" :allow-updating="true" :allow-deleting="true"
													@add="departmentUpdate({})" @update="departmentUpdate" @delete="departmentDelete"
													:show.sync="departmentEditVisible"
													@rowClick="getDepartmentUserData">
							<div slot="dialog">
								<el-form :model="departmentFormData" label-position="left" label-width="100px" style="width: 95%">
									<el-form-item label="部门名称">
										<el-input v-model="departmentFormData.DepartmentName"></el-input>
									</el-form-item>
									<el-form-item label="部门描述">
										<el-input v-model="departmentFormData.Desc"></el-input>
									</el-form-item>
									<el-form-item label="上级部门">
										<el-select v-model="departmentFormData.ParentID" clearable style="width: 100%">
											<el-option v-if="departmentList.length>0"
																 v-for="item in departmentList"
																 :key="item.DepartmentID" :label="item.DepartmentName" :value="item.DepartmentID">
											</el-option>
										</el-select>
									</el-form-item>
									<el-form-item>
										<el-button @click="departmentEditSave">保存</el-button>
										<el-button @click="departmentEditCancel">取消</el-button>
									</el-form-item>
								</el-form>
							</div>
						</common-table>
					</el-col>
					<el-col :span="15">
						<user-table :queryConditions="userQueryConditions" :user-data="userList"></user-table>
					</el-col>
				</el-row>
			</div>
		</el-tab-pane>
		<el-tab-pane label="角色" name="role">
			<div>
				<el-row :gutter="20">
					<el-col :span="9">
						<common-table ref="roletable" :data="getRoleData" :columns="roleColumns"
													:pagination="true"
													:allow-adding="true" :allow-updating="true" :allow-deleting="true"
													@add="roleUpdate({})" @update="roleUpdate" @delete="roleDelete"
													:show.sync="roleEditVisible"
													@rowClick="getRoleUserData">
							<div slot="dialog">
								<el-form :model="roleFormData" label-position="left" label-width="100px" style="width: 95%">
									<el-form-item label="角色名称">
										<el-input v-model="roleFormData.RoleName"></el-input>
									</el-form-item>
									<el-form-item label="角色描述">
										<el-input v-model="roleFormData.Desc"></el-input>
									</el-form-item>
									<el-form-item>
										<el-button @click="roleEditSave">保存</el-button>
										<el-button @click="roleEditCancel">取消</el-button>
									</el-form-item>
								</el-form>
							</div>
						</common-table>
					</el-col>
					<el-col :span="15">
						<user-table :queryConditions="userQueryConditions" :user-data="userList"></user-table>
					</el-col>
				</el-row>
			</div>
		</el-tab-pane>
		<el-tab-pane label="用户组" name="userGroup">
			<div>
				<el-row :gutter="20">
					<el-col :span="9">
						<common-table ref="grouptable" :data="getGroupData" :columns="groupColumns"
													:pagination="true"
													:allow-adding="true" :allow-updating="true" :allow-deleting="true"
													@add="groupUpdate({})" @update="groupUpdate" @delete="groupDelete"
													:show.sync="groupEditVisible"
													@rowClick="getGroupUserData">
							<div slot="dialog">
								<el-form :model="groupFormData" label-position="left" label-width="100px" style="width: 95%">
									<el-form-item label="组名称">
										<el-input v-model="groupFormData.GroupName"></el-input>
									</el-form-item>
									<el-form-item>
										<el-button @click="groupEditSave">保存</el-button>
										<el-button @click="groupEditCancel">取消</el-button>
									</el-form-item>
								</el-form>
							</div>
						</common-table>
					</el-col>
					<el-col :span="15">
						<user-table :queryConditions="userQueryConditions" :user-data="userList"></user-table>
					</el-col>
				</el-row>
			</div>
		</el-tab-pane>
		<el-tab-pane label="用户" name="user">
			<div>
				<common-table :data="getUserData" :columns="userColumns"
											:pagination="true"
											:allow-adding="true" :allow-updating="true" :allow-deleting="true"
											@add="userUpdate({})" @update="userUpdate" @delete="userDelete"
											:show.sync="userEditVisible">
					<el-table-column slot="columnR" prop="DepartmentID" label="部门">
						<template slot-scope="scope">
							{{scope.row.DepartmentID|displayFilter(departmentList,"DepartmentID","DepartmentName")}}
						</template>
					</el-table-column>
					<el-table-column slot="columnR" prop="RoleID" label="角色">
						<template slot-scope="scope">
							{{scope.row.RoleID|displayFilter(roleList,"RoleID","RoleName")}}
						</template>
					</el-table-column>
					<el-table-column slot="columnR" prop="GroupID" label="用户组">
						<template slot-scope="scope">
							{{scope.row.GroupID|displayFilter(groupList,"GroupID","GroupName")}}
						</template>
					</el-table-column>
					<el-table-column slot="columnR" prop="StatusID" label="状态">
						<template slot-scope="scope">
							{{scope.row.StatusID|displayFilter([{ Text: "Normal", Value: 0 }, { Text: "Dimission", Value: 1 }],"Value","Text")}}
						</template>
					</el-table-column>
					<div slot="dialog">
						<el-form :model="userFormData" label-position="left" label-width="100px" style="width: 95%">
							<el-form-item label="操作人">
								<el-input v-model="userFormData.OperatorID"></el-input>
							</el-form-item>
							<el-form-item label="姓名">
								<el-input v-model="userFormData.EmployeeName"></el-input>
							</el-form-item>
							<el-form-item label="密码">
								<el-input v-model="userFormData.Password"></el-input>
							</el-form-item>
							<el-form-item label="性别">
								<el-select v-model="userFormData.Gender" clearable style="width: 100%">
									<el-option
														 v-for="item in ['Male', 'Female']"
														 :key="item" :label="item" :value="item">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="部门">
								<el-select v-model="userFormData.DepartmentID" multiple style="width: 100%">
									<el-option v-if="departmentList.length>0"
														 v-for="item in departmentList"
														 :key="item.DepartmentID" :label="item.DepartmentName" :value="item.DepartmentID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="角色">
								<el-select v-model="userFormData.RoleID" multiple style="width: 100%">
									<el-option v-if="roleList.length>0"
														 v-for="item in roleList"
														 :key="item.RoleID" :label="item.RoleName" :value="item.RoleID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="用户组">
								<el-select v-model="userFormData.GroupID" multiple style="width: 100%">
									<el-option v-if="groupList.length>0"
														 v-for="item in groupList"
														 :key="item.GroupID" :label="item.GroupName" :value="item.GroupID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="人员状态">
								<el-select v-model="userFormData.StatusID" clearable style="width: 100%">
									<el-option
														 v-for="item in [{ Text: 'Normal', Value: 0 }, { Text: 'Dimission', Value: 1 }]"
														 :key="item.Value" :label="item.Text" :value="item.Value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button @click="userEditSave">保存</el-button>
								<el-button @click="userEditCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</div>
				</common-table>
			</div>
		</el-tab-pane>
		<el-tab-pane label="App" name="appUser">
			<div>
				<el-row :gutter="20">
					<el-col :span="9">
						<common-table ref="apptable" :data="getAppData" :columns="appColumns"
													:pagination="true"
													:allow-adding="true" :allow-updating="true" :allow-deleting="true"
													@add="appAdd" @update="appUpdate" @delete="appDelete"
													:show.sync="appEditVisible"
													@rowClick="getAppUserData">
							<div slot="dialog">
								<el-form :model="appFormData" label-position="left" label-width="100px" style="width: 95%">
									<el-form-item label="App ID">
										<el-input v-model="appFormData.AppID"></el-input>
									</el-form-item>
									<el-form-item label="App名称">
										<el-input v-model="appFormData.AppName"></el-input>
									</el-form-item>
									<el-form-item>
										<el-button @click="appEditSave">保存</el-button>
										<el-button @click="appEditCancel">取消</el-button>
									</el-form-item>
								</el-form>
							</div>
						</common-table>
					</el-col>
					<el-col :span="15">
						<user-table :queryConditions="userQueryConditions" :user-data="userList"></user-table>
					</el-col>
				</el-row>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	import UserTable from "../common/commonComponent/userTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";
	export default {
		name: "userRightConfig",
		components: {UserTable, CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			return {
				tabName:"department",

				departmentList:[],
				departmentColumns:[{prop:"DepartmentName",label:"部门名称"}],
				departmentEditVisible:false,
				departmentFormData:{},

				roleList:[],
				roleColumns:[{prop:"RoleName",label:"角色名称"}],
				roleEditVisible:false,
				roleFormData:{},

				groupList:[],
				groupColumns:[{prop:"GroupName",label:"组名称"}],
				groupEditVisible:false,
				groupFormData:{},

				userList:[],
				userColumns:[{prop:"OperatorID",label:"操作人"},{prop:"EmployeeName",label:"姓名"},
					{prop:"Gender",label:"性别"}, {prop:"CreateDate",label:"创建时间",type:"datetime"}],
				userEditVisible:false,
				userFormData:{},

				appColumns:[{prop:"AppID",label:"App ID"},{prop:"AppName",label:"App名称"}],
				appEditVisible:false,
				appFormData:{},

				userQueryConditions:{}
			}
		},
		asyncComputed:{
			async getDepartmentData(){
				let fd = new FormData();
				fd.set('flag', 'getDepartmentList');
				this.departmentList=(await this.$axios.post('/mes/Service/DepartmentService.ashx', fd)).data;
				if (this.departmentList.length>0){
					return this.getDepartmentTree(this.departmentList);
				}else {return this.departmentList;}
			},
			async getRoleData(){
				let fd = new FormData();
				fd.set('flag', 'getRoleList');
				this.roleList= (await this.$axios.post('/mes/Service/RoleInfoService.ashx', fd)).data;
				return this.roleList;
			},
			async getGroupData(){
				let fd = new FormData();
				fd.set('flag', 'getGroupList');
				this.groupList= (await this.$axios.post('/mes/Service/UserGroupService.ashx', fd)).data;
				return  this.groupList;
			},
			async getUserData(){
				let fd = new FormData();
				fd.set('flag', 'getUserInfo');
				this.userList= (await this.$axios.post('/mes/Service/UserService.ashx', fd)).data;
				return this.userList;
			},
			async getAppData(){
				let fd = new FormData();
				fd.set('flag', 'getAppList');
				return (await this.$axios.post('/mes/Service/UserService.ashx', fd)).data;
			},
		},
		created() {
		},
		methods: {
			getDepartmentTree(list) {
				let map = {};
				let val = [];
				//生成数据对象集合
				list.forEach(it => {
					map[it.DepartmentID] = it;
				})
				//生成结果集
				list.forEach(it => {
					const parent = map[it.ParentID];
					if (parent) {
						if (!Array.isArray(parent.children)) parent.children = [];
						parent.children.push(it);
					} else {
						val.push(it);
					}
				})
				return val;
			},
			departmentUpdate(row){
				this.departmentEditVisible=true;
				this.departmentFormData=row;
			},
			departmentEditSave(){
				if (this.departmentFormData.DepartmentID) {
					let fd = new FormData();
					fd.set('flag', 'saveDepartment');
					fd.set('departmentId',this.departmentFormData.DepartmentID);
					fd.set('departmentParentId',(this.departmentFormData.ParentID === undefined ||this.departmentFormData.ParentID === null)? '' : this.departmentFormData.ParentID);
					fd.set('departmentName',this.departmentFormData.DepartmentName);
					fd.set('departmentDesc',this.departmentFormData.Desc);
					this.$axios.post('/mes/Service/DepartmentService.ashx', fd).then(res => {
						if (res.data=='True'){
							this.departmentEditCancel();
							this.$asyncComputed.getDepartmentData.update();
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
					fd.set('flag', 'saveDepartment');
					fd.set('departmentId', '');
					fd.set('departmentParentId',this.departmentFormData.ParentID === undefined ? '' : this.departmentFormData.ParentID);
					fd.set('departmentName',this.departmentFormData.DepartmentName);
					fd.set('departmentDesc',this.departmentFormData.Desc);
					this.$axios.post('/mes/Service/DepartmentService.ashx', fd).then(res => {
						if (res.data=='True'){
							this.departmentEditCancel();
							this.$asyncComputed.getDepartmentData.update();
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
			},
			departmentEditCancel(){
				this.departmentEditVisible=false;
				this.departmentFormData={};
			},
			departmentDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteDepartment');
					fd.set('departmentId',row.DepartmentID);
					this.$axios.post('/mes/Service/DepartmentService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getDepartmentData.update();
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
				});
			},
			getDepartmentUserData(row){
				this.userQueryConditions={Type:"Department",ID:row.DepartmentID,Index:0};
			},

			roleUpdate(row){
				this.roleEditVisible=true;
				this.roleFormData=row;
			},
			roleEditSave(){
				if (this.roleFormData.RoleID) {
					let fd = new FormData();
					fd.set('flag', 'updateRole');
					fd.set('RoleID',this.roleFormData.RoleID);
					fd.set('RoleName',this.roleFormData.RoleName);
					fd.set('Desc',this.roleFormData.Desc);
					fd.set('Enable',0);
					this.$axios.post('/mes/Service/RoleInfoService.ashx', fd).then(res => {
						if (res.data=='True'){
							this.roleEditCancel();
							this.$asyncComputed.getRoleData.update();
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
					fd.set('flag', 'addRole');
					fd.set('RoleName',this.roleFormData.RoleName);
					fd.set('Desc',this.roleFormData.Desc);
					fd.set('Enable',0);
					this.$axios.post('/mes/Service/RoleInfoService.ashx', fd).then(res => {
						if (res.data=='True'){
							this.roleEditCancel();
							this.$asyncComputed.getRoleData.update();
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
			},
			roleEditCancel(){
				this.roleEditVisible=false;
				this.roleFormData={};
			},
			roleDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteRole');
					fd.set('RoleID',row.RoleID);
					this.$axios.post('/mes/Service/RoleInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getRoleData.update();
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
				});
			},
			getRoleUserData(row){
				this.userQueryConditions={Type:"Role",ID:row.RoleID,Index:1};
			},

			userUpdate(row){
				this.userEditVisible=true;
				this.userFormData=row;
			},
			userEditSave(){
				if (this.userFormData.EmployeeID) {
					let fd = new FormData();
					fd.set('flag', 'updateUser');
					fd.set('USER',JSON.stringify(this.userFormData));
					this.$axios.post('/mes/Service/UserService.ashx', fd).then(res => {
						if (res.data===true){
							this.userEditCancel();
							this.$asyncComputed.getUserData.update();
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
					fd.set('flag', 'addUser');
					fd.set('USER',JSON.stringify(this.userFormData));
					this.$axios.post('/mes/Service/UserService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.userEditCancel();
							this.$asyncComputed.getUserData.update();
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
			},
			userEditCancel(){
				this.userEditVisible=false;
				this.userFormData={};
			},
			userDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteUser');
					fd.set('employeeId',row.EmployeeID);
					this.$axios.post('/mes/Service/UserService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getUserData.update();
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
				});
			},

			groupUpdate(row){
				this.groupEditVisible=true;
				this.groupFormData=row;
			},
			groupEditSave(){
				if (this.groupFormData.GroupID) {
					let fd = new FormData();
					fd.set('flag', 'updateGroup');
					fd.set('DATA',JSON.stringify(this.groupFormData));
					this.$axios.post('/mes/Service/UserGroupService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.groupEditCancel();
							this.$asyncComputed.getGroupData.update();
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
					fd.set('flag', 'addGroup');
					fd.set('DATA',JSON.stringify(this.groupFormData));
					this.$axios.post('/mes/Service/UserGroupService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.groupEditCancel();
							this.$asyncComputed.getGroupData.update();
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
			},
			groupEditCancel(){
				this.groupEditVisible=false;
				this.groupFormData={};
			},
			groupDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteGroup');
					fd.set('groupId',row.GroupID);
					this.$axios.post('/mes/Service/UserGroupService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getGroupData.update();
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
				});
			},
			getGroupUserData(row){
				this.userQueryConditions={Type:"Group",ID:row.GroupID,Index:2};
			},

			appAdd(){
				this.appEditVisible=true;
				this.appFormData.Add=true;
			},
			appUpdate(row){
				this.appEditVisible=true;
				this.appFormData=row;
				this.appFormData.Add=false;
			},
			appEditSave(){
				if (this.appFormData.Add) {
					let fd = new FormData();
					fd.set('flag', 'addApp');
					fd.set('appInfo',JSON.stringify(this.appFormData));
					this.$axios.post('/mes/Service/UserService.ashx', fd).then(res => {
						if (res.data.Result){
							this.appEditCancel();
							this.$asyncComputed.getAppData.update();
							this.$message({
								type: 'success',
								message: '添加成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				}else {
					let fd = new FormData();
					fd.set('flag', 'updateApp');
					fd.set('appInfo',JSON.stringify(this.appFormData));
					this.$axios.post('/mes/Service/UserService.ashx', fd).then(res => {
						if (res.data.Result){
							this.appEditCancel();
							this.$asyncComputed.getAppData.update();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				}
			},
			appEditCancel(){
				this.appEditVisible=false;
				this.appFormData={};
			},
			appDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteApp');
					fd.set('appId',row.AppID);
					this.$axios.post('/mes/Service/UserService.ashx', fd).then(res => {
						if (res.data.Result){
							this.$asyncComputed.getAppData.update();
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
			getAppUserData(row){
				this.userQueryConditions={Type:"App",ID:row.AppID,Index:6};
			},

			handleTabClick(tab){
				switch (tab.name) {
					case "department":
						let department= this.$refs.departmenttable.currentRow;
						this.userQueryConditions={Type:"Department",ID:department.DepartmentID,Index:0};
						break;
					case "role":
						let role= this.$refs.roletable.currentRow;
						this.userQueryConditions={Type:"Role",ID:role.RoleID,Index:1};
						break;
					case "userGroup":
						let group= this.$refs.grouptable.currentRow;
						this.userQueryConditions={Type:"Group",ID:group.GroupID,Index:2};
						break;
					case "User":
						this.userQueryConditions={Type:"User",ID:"",Index:3};
						break;
					case "appUser":
						let app= this.$refs.apptable.currentRow;
						this.userQueryConditions={Type:"App",ID:app.AppID,Index:6};
						break;
				}
			},
		}
	}
</script>

<style scoped>

</style>