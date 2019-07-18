<template>
	<div>
		<el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
			<el-tab-pane label="分档基础数据" name="stallInfo">
				<div>
					<el-button icon="el-icon-plus" size="small" style="float: right" slot="reference" @click="stallSchemeAddPop"></el-button>
					<el-table :data="getPageTableData(stallSchemeTableData)"
										@expand-change="stallSchemeExpand">
						<el-table-column type="expand">
							<template slot-scope="props">
								<el-table :data="stallInfoTableData">
									<el-table-column	prop="StallCode" label="分档编码"></el-table-column>
									<el-table-column	prop="Effectiveness" label="入库效率"></el-table-column>
									<el-table-column	prop="EtaBot" label="背面效率"></el-table-column>
									<el-table-column	prop="StallName" label="测试分档名称"></el-table-column>
									<el-table-column	prop="MinValue" label="测试最小值"></el-table-column>
									<el-table-column	prop="MaxValue" label="测试最大值"></el-table-column>
									<el-table-column	prop="Power" label="功率"></el-table-column>
									<el-table-column	prop="PmppBot" label="背面功率"></el-table-column>
									<el-table-column	prop="ClassBot" label="背面档位"></el-table-column>
								</el-table>
							</template>
						</el-table-column>
						<el-table-column prop="StallSchemeName" label="名称"></el-table-column>
						<el-table-column prop="StallSchemeCode" label="编码"></el-table-column>
						<el-table-column align="right">
							<template slot-scope="scope">
								<el-button
										size="mini"
										@click="stallSchemeEditPop(scope.$index, scope.row)">编辑</el-button>
								<el-button
										size="mini"
										type="danger"
										@click="stallSchemeDelete(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination :total="stallSchemeTableData?stallSchemeTableData.length:0"
												 @current-change="currentPageChange"
												 :current-page.sync="currentPage"
												 layout="total, prev, pager, next" :hide-on-single-page=true>
					</el-pagination>
					<el-dialog  :visible.sync="stallSchemeEditVisible" :before-close="stallSchemeEditCancel">
						<el-form ref="formData" :model="stallSchemeEditFormData"
										 label-position="left" label-width="100px" style="width: 95%">
							<el-form-item label="名称">
								<el-input v-model="stallSchemeEditFormData.StallSchemeName"></el-input>
							</el-form-item>
							<el-form-item label="编码">
								<el-input v-model="stallSchemeEditFormData.StallSchemeCode"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button @click="stallSchemeEditSave">保存</el-button>
								<el-button @click="stallSchemeEditCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
				</div>
			</el-tab-pane>
			<el-tab-pane label="分档配置" name="stallConfig">
				<div>
					<el-table :data="getPageTableData(productCategoryTableData)"
										@expand-change="productCategoryExpand">
						<el-table-column type="expand">
							<template slot-scope="props">
								<el-table :data="stallProductInformationTableData">
									<el-table-column	prop="ProductName" label="产品名称"></el-table-column>
									<el-table-column	prop="ProductCode" label="产品编号"></el-table-column>
									<el-table-column	prop="Version" label="产品版本"></el-table-column>
									<el-table-column	prop="Description" label="描述"></el-table-column>
									<el-table-column	prop="DescriptionEn" label="英文描述"></el-table-column>
									<el-table-column	prop="ModelCode" label="打印模型参数"></el-table-column>
									<el-table-column	prop="StallSchemeNames" label="分档基础数据模板"></el-table-column>
								</el-table>
							</template>
						</el-table-column>
						<el-table-column prop="CategoryName" label="分类名称"></el-table-column>
						<el-table-column prop="CategoryCode" label="分类编码"></el-table-column>
						<el-table-column prop="GridNums" label="主栅数"></el-table-column>
						<el-table-column prop="PropertyA" label="属性A"></el-table-column>
						<el-table-column prop="PropertyB" label="属性B"></el-table-column>
					</el-table>
					<el-pagination :total="productCategoryTableData?productCategoryTableData.length:0"
												 @current-change="currentPageChange"
												 :current-page.sync="currentPage"
												 layout="total, prev, pager, next" :hide-on-single-page=true>
					</el-pagination>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	export default {
		name: "stallInfoConfig",
		data(){
			return {
				tabName:"stallInfo",
				currentPage:1,
				pageSize:10,
				stallSchemeTableData:[],
				stallInfoTableData:[],
				stallSchemeEditVisible:false,
				stallSchemeEditFormData:{
					SchemeID:"",StallSchemeName:"",StallSchemeCode:"",
				},
				productCategoryTableData:[],
				stallProductInformationTableData:[],
			}
		},
		created() {
			this.showTab();
		},
		methods:{
			showTab(){
				switch (this.tabName) {
					case "stallInfo":
						this.getStallSchemeList();
						break;
					case "stallConfig":
						this.getStallProductInformationList();
						break;
				}
			},
			handleTabClick(tab){
				this.tabName=tab.name;
				this.showTab();
				this.currentPage=1;
			},
			getStallSchemeList(){
				let fd = new FormData();
				fd.set('flag', 'getStallSchemeListWithStallInfos');
				this.$axios.post('/api/Service/StallInfoService.ashx', fd).then(res => {
					this.stallSchemeTableData = res.data;
				})
			},
			stallSchemeExpand(val){
				this.stallInfoTableData = val.StallInfoList;
			},
			getStallProductInformationList(){
				let fd = new FormData();
				fd.set('flag', 'getStallProductInformationList');
				this.$axios.post('/api/Service/StallInfoService.ashx', fd).then(res => {
					this.productCategoryTableData = res.data;
				})
			},
			productCategoryExpand(val) {
				this.stallProductInformationTableData = val.ProductInformationList;
			},
			stallSchemeAddPop() {
				this.stallSchemeEditVisible = true;
			},
			stallSchemeEditPop(index, row){
				this.stallSchemeEditVisible=true;
				this.stallSchemeEditFormData=row;
			},
			stallSchemeEditSave(){
				if (this.stallSchemeEditFormData.SchemeID) {
					let fd = new FormData();
					fd.set('flag', 'modifyStallScheme');
					fd.set('modifyData',JSON.stringify(this.stallSchemeEditFormData));
					this.$axios.post('/api/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.stallSchemeEditCancel();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
							this.getStallSchemeList();
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
					fd.set('flag', 'addStallScheme');
					fd.set('addData',JSON.stringify(this.stallSchemeEditFormData));
					this.$axios.post('/api/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.stallSchemeEditCancel();
							this.$message({
								type: 'success',
								message: '添加成功！'
							});
							this.getStallSchemeList();
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
			stallSchemeEditCancel(){
				this.stallSchemeEditVisible=false;
				this.stallSchemeEditFormData={SchemeID:"",StallSchemeName:"",StallSchemeCode:"",};
			},
			stallSchemeDelete(index, row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteStallScheme');
					fd.set('schemeId',row.SchemeID);
					fd.set('isForce',false);
					this.$axios.post('/api/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							if (res.data.Message=="success"){
								this.$message({
									type: 'success',
									message: '删除成功！'
								});
								this.getStallSchemeList();
							}
							else {
								this.$confirm('确定强制删除？'+res.data.Message, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
								}).then(()=>{
									let fd = new FormData();
									fd.set('flag', 'deleteStallScheme');
									fd.set('schemeId',row.SchemeID);
									fd.set('isForce',true);
									this.$axios.post('/api/Service/StallInfoService.ashx', fd).then(res => {
										if (res.data.Result){
											if (res.data.Message=="success"){
												this.$message({
													type: 'success',
													message: '删除成功！'
												});
												this.getStallSchemeList();
											}
										}else {
											this.$message({
												type: 'error',
												message: res.data.Message,
												showClose: true,
											});
										}
									})
								});
							}
						}else {
							this.$alert(res.data.Message, '', {
								confirmButtonText: '确定',
							});
						}
					})
				});
			},
			currentPageChange(val){
				this.currentPage = val;
			},
			getPageTableData(tableData){
				return 	tableData? tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) : [];
			},
		}
	}
</script>

<style scoped>

</style>