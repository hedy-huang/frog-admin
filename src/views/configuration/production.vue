<template>
	<div>
		<el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
			<el-tab-pane label="打印模板" name="printModel">
				<div>
					<el-button icon="el-icon-plus" size="small" style="float: right" slot="reference" @click="printModelAddPop"></el-button>
				  <el-table :data="getPageTableData(printModelTableData)">
					<el-table-column prop="PrintModuleName" label="名称"></el-table-column>
					<el-table-column prop="PrintFilePath" label="打印文件路径"></el-table-column>
					<el-table-column prop="PrintModule" label="打印模型参数"></el-table-column>
					<el-table-column prop="Property" label="属性"></el-table-column>
					<el-table-column align="right">
						<template slot-scope="scope">
							<el-button
									size="mini"
									@click="printModelEditPop(scope.$index, scope.row)">编辑</el-button>
							<el-button
									size="mini"
									type="danger"
									@click="printModelDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				  <el-pagination :total="printModelTableData?printModelTableData.length:0"
											 @current-change="currentPageChange"
											 :current-page.sync="currentPage"
											 layout="total, prev, pager, next" :hide-on-single-page=true>
				</el-pagination>
				  <el-dialog :visible.sync="printModelEditVisible" :before-close="printModelEditCancel">
							<el-form :model="printModelEditFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="名称">
									<el-input v-model="printModelEditFormData.PrintModuleName"></el-input>
								</el-form-item>
								<el-form-item label="打印文件路径">
									<el-input v-model="printModelEditFormData.PrintFilePath"></el-input>
								</el-form-item>
								<el-form-item label="打印模型参数">
									<el-input v-model="printModelEditFormData.PrintModule"></el-input>
								</el-form-item>
								<el-form-item label="属性">
									<el-input v-model="printModelEditFormData.Property"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="printModelEditSave">保存</el-button>
									<el-button @click="printModelEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
			  	</el-dialog>
				</div>
			</el-tab-pane>
			<el-tab-pane label="产品" name="productInformation"></el-tab-pane>
			<el-tab-pane label="供应商" name="supplierInformation"></el-tab-pane>
			<el-tab-pane label="客户" name="customerInformation"></el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	export default {
		name: "production",
		data() {
			return {
				tabName:"printModel",
				currentPage:1,
				pageSize:10,
				printModelTableData:[],
				printModelEditVisible:false,
				printModelEditFormData:{
					PrintModuleName:"",PrintFilePath:"",PrintModule:"",Property:""
				},
				productCategoryTableData:[],
				productCategoryEditVisible:false,
				productCategoryEditFormData:{},
			}
	  },
		created() {
			this.showTab();
		},
		methods:{
			showTab(){
				switch (this.tabName) {
					case "printModel":
						this.getPrintModelData();
						break;
					case "productInformation":
						break;
					case "supplierInformation":
						break;
					case "customerInformation":
						break;
				}
			},
			handleTabClick(tab) {
				this.tabName = tab.name;
				this.showTab();
				this.currentPage=1;
			},
			getPrintModelData(){
				let fd = new FormData();
				fd.set('flag', 'getPrintModelList');
				this.$axios.post('/api/Service/ProductManageService.ashx', fd).then(res => {
					this.printModelTableData=res.data;
				})
			},
			printModelAddPop(){
				this.printModelEditVisible=true;
			},
			printModelEditPop(index,row){
				this.printModelEditVisible=true;
				this.printModelEditFormData=row;
			},
			printModelEditSave(){
				if (this.printModelEditFormData.PrintModuleID) {
					let fd = new FormData();
					fd.set('flag', 'modifyPrintModel');
					fd.set('printModel',JSON.stringify(this.printModelEditFormData));
					this.$axios.post('/api/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.printModelEditCancel();
							this.$message({
								type: 'success',
								message: '修改成功！'
							});
							this.getPrintModelData();
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
					fd.set('flag', 'addPrintModel');
					fd.set('printModel',JSON.stringify(this.printModelEditFormData));
					this.$axios.post('/api/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.printModelEditCancel();
							this.$message({
								type: 'success',
								message: '添加成功！'
							});
							this.getPrintModelData();
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
			printModelEditCancel(){
				this.printModelEditVisible=false;
				this.printModelEditFormData={
					PrintModuleName:"",PrintFilePath:"",PrintModule:"",Property:""
				};
			},
			printModelDelete(index,row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deletePrintModel');
					fd.set('printModuleId',row.PrintModuleID);
					this.$axios.post('/api/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$message({
								type: 'info',
								message: '删除成功！'
							});
							this.getPrintModelData();
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
			getProductCategoryData(){},
			productCategoryAddPop(){},
			productCategoryEditPop(index,row){},
			productCategoryEditSave(){},
			productCategoryEditCancel(){
			},
			productCategoryDelete(index,row){},


			currentPageChange(val){
				this.currentPage = val;
			},
			getPageTableData(tableData){
				return 	tableData? tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) : [];
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
		}
	}
</script>

<style scoped>

</style>