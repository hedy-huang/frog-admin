<template>
	<div>
		<el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
			<el-tab-pane label="集团" name="enterprise">
				<div>
					<el-button icon="el-icon-plus" size="small" style="float: right" slot="reference" @click="enterpriseAddPop"></el-button>
					<el-table :data="enterpriseTableData" @expand-change="enterpriseExpand">
						<el-table-column type="expand">
							<template slot-scope="props">
								<el-button icon="el-icon-plus" size="small" style="float: right" slot="reference" @click="siteAddPop(props.row.EnterpriseID)"></el-button>
								<el-table :data="siteTableData" @expand-change="siteExpand">
									<el-table-column type="expand">
										<template slot-scope="props">
											<el-button icon="el-icon-plus" size="small" style="float: right" slot="reference" @click="areaAddPop(props.row.SiteID)"></el-button>
											<el-table :data="areaTableData">
												<el-table-column prop="AreaName" label="车间名称"></el-table-column>
												<el-table-column	prop="AreaCode" label="车间编码"></el-table-column>
												<el-table-column	prop="Desc" label="车间描述"></el-table-column>
												<el-table-column	prop="CreateDate" label="创建时间" :formatter="columnDateFormat"></el-table-column>
												<el-table-column align="right">
													<template slot-scope="scope">
														<el-button
																size="mini"
																@click="areaEditPop(scope.$index, scope.row)">编辑</el-button>
														<el-button
																size="mini"
																type="danger"
																@click="areaDelete(scope.$index, scope.row)">删除</el-button>
													</template>
												</el-table-column>
											</el-table>
											<el-dialog  :visible.sync="areaEditVisible" :before-close="areaEditCancel">
												<el-form ref="areaFormData" :model="areaFormData" label-position="left" label-width="100px" style="width: 95%">
													<el-form-item label="车间名称">
														<el-input v-model="areaFormData.AreaName"></el-input>
													</el-form-item>
													<el-form-item label="车间编码">
														<el-input v-model="areaFormData.AreaCode"></el-input>
													</el-form-item>
													<el-form-item label="车间描述">
														<el-input v-model="areaFormData.Desc"></el-input>
													</el-form-item>
													<el-form-item>
														<el-button @click="areaEditSave">保存</el-button>
														<el-button @click="areaEditCancel">取消</el-button>
													</el-form-item>
												</el-form>
											</el-dialog>
										</template>
									</el-table-column>
									<el-table-column	prop="SiteName" label="公司名称"></el-table-column>
									<el-table-column	prop="SiteCode" label="公司编码"></el-table-column>
									<el-table-column	prop="Desc" label="公司描述"></el-table-column>
									<el-table-column	prop="CreateDate" label="创建时间" :formatter="columnDateFormat"></el-table-column>
									<el-table-column align="right">
										<template slot-scope="scope">
											<el-button
													size="mini"
													@click="siteEditPop(scope.$index, scope.row)">编辑</el-button>
											<el-button
													size="mini"
													type="danger"
													@click="siteDelete(scope.$index, scope.row)">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
								<el-dialog  :visible.sync="siteEditVisible" :before-close="siteEditCancel">
									<el-form ref="siteFormData" :model="siteFormData"  label-width="100px" style="width: 95%">
										<el-form-item label="公司名称">
											<el-input v-model="siteFormData.SiteName"></el-input>
										</el-form-item>
										<el-form-item label="公司编码">
											<el-input v-model="siteFormData.SiteCode"></el-input>
										</el-form-item>
										<el-form-item label="公司描述">
											<el-input v-model="siteFormData.Desc"></el-input>
										</el-form-item>
										<el-form-item>
											<el-button @click="siteEditSave">保存</el-button>
											<el-button @click="siteEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</el-dialog>
							</template>
						</el-table-column>
						<el-table-column	prop="EnterpriseName" label="集团名称"></el-table-column>
						<el-table-column	prop="EnterpriseCode" label="集团编码"></el-table-column>
						<el-table-column	prop="Desc" label="集团描述"></el-table-column>
						<el-table-column align="right">
							<template slot-scope="scope">
								<el-button
										size="mini"
										@click="enterpriseEditPop(scope.$index, scope.row)">编辑</el-button>
								<el-button
										size="mini"
										type="danger"
										@click="enterpriseDelete(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-dialog  :visible.sync="enterpriseEditVisible" :before-close="enterpriseEditCancel">
						<el-form ref="enterpriseFormData" :model="enterpriseFormData" label-position="left" label-width="100px" style="width: 95%">
							<el-form-item label="集团名称">
								<el-input v-model="enterpriseFormData.EnterpriseName"></el-input>
							</el-form-item>
							<el-form-item label="集团编码">
								<el-input v-model="enterpriseFormData.EnterpriseCode"></el-input>
							</el-form-item>
							<el-form-item label="集团描述">
								<el-input v-model="enterpriseFormData.Desc"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button @click="enterpriseEditSave">保存</el-button>
								<el-button @click="enterpriseEditCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
				</div>
			</el-tab-pane>
			<el-tab-pane label="工艺段" name="workCell">
				<div></div>
			</el-tab-pane>
			<el-tab-pane label="机器" name="workMachine">
				<div></div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	export default {
		name: "factoryConfig",
		data(){
			return {
				tabName:'enterprise',
				enterpriseTableData:[],
				enterpriseEditVisible:false,
				enterpriseFormData:{
					EnterpriseName:null	,
					EnterpriseCode:null,
					Desc:null,
				},
				siteTableData:[],
				siteEditVisible:false,
				siteFormData:{
					EnterpriseID:null	,
					SiteName:null	,
					SiteCode:null	,
					Desc:null	,
				},
				areaTableData:[],
				areaEditVisible:false,
				areaFormData:{
					SiteID:null	,
					AreaName:null	,
					AreaCode:null	,
					Desc:null	,
				},
			}
		},
		created(){
			this.showTab();
		},
		methods: {
			showTab() {
				switch (this.tabName) {
					case "enterprise":
						this.getEnterpriseData();
						break;
				}
			},
			handleTabClick(tab) {
				this.tabName=tab.name;
        this.showTab();
			},
			getEnterpriseData() {
				let fd = new FormData();
				fd.set('flag', 'allEnterprise');
				this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
					this.enterpriseTableData = res.data;
				})
			},
			enterpriseExpand(val) {
				this.siteTableData = val.Sites;
			},
			enterpriseAddPop(){
				this.enterpriseEditVisible=true;
			},
			enterpriseEditCancel(){
				this.enterpriseEditVisible=false;
				this.enterpriseFormData = {
					EnterpriseName:null	,
					EnterpriseCode:null	,
					Desc:null,
				};
			},
			enterpriseEditSave(){
				if (this.enterpriseFormData.EnterpriseID) {
					let fd = new FormData();
					fd.set('flag', 'EnterpriseEdit');
					fd.set('EnterpriseID',this.enterpriseFormData.EnterpriseID);
					fd.set('EnterpriseName',this.enterpriseFormData.EnterpriseName);
					fd.set('EnterpriseCode',this.enterpriseFormData.EnterpriseCode);
					fd.set('Desc',this.enterpriseFormData.Desc);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.enterpriseEditCancel();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
							this.getEnterpriseData();
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
					fd.set('flag', 'EnterpriseInsert');
					fd.set('EnterpriseName',this.enterpriseFormData.EnterpriseName);
					fd.set('EnterpriseCode',this.enterpriseFormData.EnterpriseCode);
					fd.set('Desc',this.enterpriseFormData.Desc);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.enterpriseEditCancel();
							this.$message({
								type: 'success',
								message: '添加成功！'
							});
							this.getEnterpriseData();
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
			enterpriseEditPop(index, row){
				this.enterpriseEditVisible=true;
				this.enterpriseFormData=row;
			},
			enterpriseDelete(index,row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'EnterpriseDel');
					fd.set('EnterpriseID',row.EnterpriseID);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
							this.getEnterpriseData();
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
			siteExpand(val) {
				this.areaTableData = val.Areas;
			},
			siteAddPop(enterpriseID){
				this.siteEditVisible=true;
				this.siteFormData.EnterpriseID=enterpriseID;
			},
			siteEditCancel(){
				this.siteEditVisible=false;
				this.siteFormData = {
					EnterpriseID:null	,
					SiteName:null	,
					SiteCode:null	,
					Desc:null,
				};
			},
			siteEditSave(){
				if (this.siteFormData.SiteID) {
					let fd = new FormData();
					fd.set('flag', 'SiteEdit');
					fd.set('EnterpriseID',this.siteFormData.EnterpriseID);
					fd.set('SiteID',this.siteFormData.SiteID);
					fd.set('SiteName',this.siteFormData.SiteName);
					fd.set('SiteCode',this.siteFormData.SiteCode);
					fd.set('Desc',this.siteFormData.Desc);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.siteEditCancel();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
							this.getEnterpriseData();
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
					fd.set('flag', 'SiteInsert');
					fd.set('EnterpriseID',this.siteFormData.EnterpriseID);
					fd.set('SiteName',this.siteFormData.SiteName);
					fd.set('SiteCode',this.siteFormData.SiteCode);
					fd.set('Desc',this.siteFormData.Desc);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.siteEditCancel();
							this.$message({
								type: 'success',
								message: '添加成功！'
							});
							this.getEnterpriseData();
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
			siteEditPop(index, row){
				this.siteEditVisible=true;
				this.siteFormData=row;
			},
			siteDelete(index,row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'SiteDel');
					fd.set('SiteID',row.SiteID);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
							this.getEnterpriseData();
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
			areaAddPop(siteID){
				this.areaEditVisible=true;
				this.areaFormData.SiteID=siteID;
			},
			areaEditCancel(){
				this.areaEditVisible=false;
				this.areaFormData = {
					SiteID:null	,
					AreaName:null	,
					AreaCode:null	,
					Desc:null,
				};
			},
			areaEditSave(){
				if (this.areaFormData.AreaID) {
					let fd = new FormData();
					fd.set('flag', 'AreaEdit');
					fd.set('SiteID',this.areaFormData.SiteID);
					fd.set('AreaID',this.areaFormData.AreaID);
					fd.set('AreaName',this.areaFormData.AreaName);
					fd.set('AreaCode',this.areaFormData.AreaCode);
					fd.set('Desc',this.areaFormData.Desc);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.siteEditCancel();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
							this.getEnterpriseData();
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
					fd.set('flag', 'AreaInsert');
					fd.set('SiteID',this.areaFormData.SiteID);
					fd.set('AreaName',this.areaFormData.AreaName);
					fd.set('AreaCode',this.areaFormData.AreaCode);
					fd.set('Desc',this.areaFormData.Desc);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.areaEditCancel();
							this.$message({
								type: 'success',
								message: '添加成功！'
							});
							this.getEnterpriseData();
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
			areaEditPop(index, row){
				this.areaEditVisible=true;
				this.areaFormData=row;
			},
			areaDelete(index,row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'AreaDel');
					fd.set('AreaID',row.AreaID);
					this.$axios.post('/api/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
							this.getEnterpriseData();
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
			columnDateFormat(row, column, cellValue) {
				if (cellValue == null || cellValue == "") return "";
				let date = new Date(cellValue);
				let Y = date.getFullYear();
				let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
				let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
				let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
				let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
			},
			columnTimeFormat(row, column, cellValue) {
				if (cellValue == null || cellValue == "") return "";
				let date = new Date(cellValue);
				let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
				let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				return h + ":" + m;
			},
		},
	}
</script>

<style scoped>

</style>