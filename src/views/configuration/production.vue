<template>
	<div>
		<el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
			<el-tab-pane label="打印模板" name="printModel">
				<div>
					<common-table :data="printModelTableData" :columns="printModelTableColumns" :pagination="true"
												:allowAdding="true" @add="printModelAddPop"
												:allowUpdating="true" @update="printModelUpdatePop"
												:allowDeleting="true" @delete="printModelDelete">
					</common-table>
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
	import CommonTable from "@/views/common/commonComponent/commonTable";
	export default {
		name: "production",
		components:{CommonTable},
		data() {
			return {
				tabName:"printModel",
				printModelTableData:[],
				printModelTableColumns:[
					{prop:"PrintModuleName",label:"名称"},{prop:"PrintFilePath",label:"打印文件路径"},
					{prop:"PrintModule",label:"打印模型参数"},{prop:"Property",label:"属性"}
				],
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
			printModelUpdatePop(row){
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
			printModelDelete(row){
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
								type: 'success',
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
		}
	}
</script>

<style scoped>

</style>