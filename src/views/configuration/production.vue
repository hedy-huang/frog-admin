<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="打印模板" name="printModel">
				<div>
					<common-table :data="getPrintModelData" :columns="printModelColumns"
												:pagination="true"
												:allowAdding="true" :allowUpdating="true" :allowDeleting="true"
												@add="printModelUpdate({})" @update="printModelUpdate" @delete="printModelDelete"
												:show.sync="printModelEditVisible">
						<div slot="dialog">
							<el-form :model="printModelFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="名称">
									<el-input v-model="printModelFormData.PrintModuleName"></el-input>
								</el-form-item>
								<el-form-item label="打印文件路径">
									<el-input v-model="printModelFormData.PrintFilePath"></el-input>
								</el-form-item>
								<el-form-item label="打印模型参数">
									<el-input v-model="printModelFormData.PrintModule"></el-input>
								</el-form-item>
								<el-form-item label="属性">
									<el-input v-model="printModelFormData.Property"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="printModelEditSave">保存</el-button>
									<el-button @click="printModelEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="产品" name="productInformation">
				<div>
					<common-table :data="getProductData" :columns="productCategoryColumns"
												:pagination="true"
												:allow-adding="true" :allow-updating="true" :allow-deleting="true"
												@add="productCategoryUpdate({})" @update="productCategoryUpdate" @delete="productCategoryDelete"
												:show.sync="productCategoryEditVisible">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.ProductInformationList" :columns="productColumns"
															:pagination="true"
															:allow-updating="true" @update="productUpdate"
															:show.sync="productEditVisible">
									<el-table-column type="expand" slot="expand">
										<template slot-scope="scope">
											<el-tabs v-model="productTabName">
												<el-tab-pane label="产线流程" name="lineRoute">
													<div>
														<common-table :data="scope.row.ProductLineRouteList"
																					:pagination="true"
																					:allow-adding="true" :allow-deleting="true"
																					@add="lineRouteAdd(scope.row.ProductNo)" @delete="lineRouteDelete"
																					:show.sync="lineRouteEditVisible">
															<el-table-column slot="columnL" prop="LineID" label="产线">
																<template slot-scope="scope">
																	{{scope.row.LineID| displayFilter(productLineList,"LineID","LineName")}}
																</template>
															</el-table-column>
															<el-table-column slot="columnL" prop="RouteID" label="流程">
																<template slot-scope="scope">
																	{{scope.row.RouteID| displayFilter(routeList,"RouteID","RouteName")}}
																</template>
															</el-table-column>
															<div slot="dialog">
																<el-form :model="lineRouteFormData" label-position="left" label-width="100px" style="width: 95%">
																	<el-form-item label="产线">
																		<el-select v-model="lineRouteFormData.LineID" @change="lineRouteLineChange" style="width: 100%">
																			<el-option v-if="productLineList.length>0"
																					v-for="item in productLineList"
																					:key="item.LineID"
																					:label="item.LineName"
																					:value="item.LineID">
																			</el-option>
																		</el-select>
																	</el-form-item>
																	<el-form-item label="流程">
																		<el-select v-model="lineRouteFormData.RouteIDs" multiple style="width: 100%">
																			<el-option v-if="lineRouteList.length>0"
																					v-for="item in lineRouteList"
																					:key="item.RouteID"
																					:label="item.RouteName"
																					:value="item.RouteID">
																			</el-option>
																		</el-select>
																	</el-form-item>
																	<el-form-item>
																		<el-button @click="lineRouteEditSave">保存</el-button>
																		<el-button @click="lineRouteEditCancel">取消</el-button>
																	</el-form-item>
																</el-form>
															</div>
														</common-table>
													</div>
												</el-tab-pane>
												<el-tab-pane label="产线打印" name="linePrint">
													<div>
														<common-table :data="scope.row.PrintRelationList" :columns="linePrintColumns"
																					:pagination="true"
																					:allow-adding="true" :allow-deleting="true"
																					@add="linePrintAdd(scope.row.ProductNo,scope.row.ModelCode)" @delete="linePrintDelete"
																					:show.sync="linePrintEditVisible">
															<el-table-column slot="columnL" prop="WorkMachineID" label="线别">
																<template slot-scope="scope">
																	{{scope.row.WorkMachineID| displayFilter(halmMachineList,"WorkMachineID","MachineName")}}
																</template>
															</el-table-column>
															<el-table-column slot="columnL" prop="PrintModuleID" label="打印模板">
																<template slot-scope="scope">
																	{{scope.row.PrintModuleID| displayFilter(printModelList,"PrintModuleID","PrintModuleName")}}
																</template>
															</el-table-column>
															<el-table-column slot="columnR" prop="BinGroupID" label="bin盒分组">
																<template slot-scope="scope">
																	{{scope.row.BinGroupID| displayFilter(binGroupList,"BinGroupID","Name")}}
																</template>
															</el-table-column>
															<div slot="dialog">
																<el-form :model="linePrintFormData" label-position="left" label-width="100px" style="width: 95%">
																	<el-form-item label="线别">
																		<el-select v-model="linePrintFormData.WorkMachineIDs" multiple style="width: 100%">
																			<el-option v-if="halmMachineList.length>0"
																								 v-for="item in halmMachineList"
																								 :key="item.WorkMachineID"
																								 :label="item.MachineName"
																								 :value="item.WorkMachineID">
																			</el-option>
																		</el-select>
																	</el-form-item>
																	<el-form-item label="打印模板">
																		<el-select v-model="linePrintFormData.PrintModuleID" style="width: 100%">
																			<el-option v-if="printModelList.length>0"
																								 v-for="item in printModelList"
																								 :key="item.PrintModuleID"
																								 :label="item.PrintModuleName"
																								 :value="item.PrintModuleID">
																			</el-option>
																		</el-select>
																	</el-form-item>
																	<el-form-item label="打印模型参数">
																		<el-input v-model="linePrintFormData.ModelCode" :disabled="true"></el-input>
																	</el-form-item>
																	<el-form-item label="Bin盒分组">
																		<el-select v-model="linePrintFormData.BinGroupID" style="width: 100%">
																			<el-option v-if="binGroupList.length>0"
																								 v-for="item in binGroupList"
																								 :key="item.BinGroupID"
																								 :label="item.Name"
																								 :value="item.BinGroupID">
																			</el-option>
																		</el-select>
																	</el-form-item>
																	<el-form-item>
																		<el-button @click="linePrintEditSave">保存</el-button>
																		<el-button @click="linePrintEditCancel">取消</el-button>
																	</el-form-item>
																</el-form>
															</div>
														</common-table>
													</div>
												</el-tab-pane>
											</el-tabs>
										</template>
									</el-table-column>
									<div slot="dialog">
										<el-form :model="productFormData" label-position="left" label-width="100px" style="width: 95%">
											<el-form-item label="产品名称">
												<el-input v-model="productFormData.ProductName" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="产品编号">
												<el-input v-model="productFormData.ProductCode" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="产品版本">
												<el-input v-model="productFormData.Version" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="描述">
												<el-input v-model="productFormData.Description" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="英文描述">
												<el-input v-model="productFormData.DescriptionEn"></el-input>
											</el-form-item>
											<el-form-item>
												<el-button @click="productEditSave">保存</el-button>
												<el-button @click="productEditCancel">取消</el-button>
											</el-form-item>
										</el-form>
									</div>
								</common-table>
							</template>
						</el-table-column>
						<div slot="dialog">
							<el-form :model="productCategoryFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="分类名称">
									<el-input v-model="productCategoryFormData.CategoryName"></el-input>
								</el-form-item>
								<el-form-item label="分类编码">
									<el-input v-model="productCategoryFormData.CategoryCode"></el-input>
								</el-form-item>
								<el-form-item label="主栅数">
									<el-input v-model="productCategoryFormData.GridNums"></el-input>
								</el-form-item>
								<el-form-item label="属性A">
									<el-input v-model="productCategoryFormData.PropertyA"></el-input>
								</el-form-item>
								<el-form-item label="属性B">
									<el-input v-model="productCategoryFormData.PropertyB"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="productCategoryEditSave">保存</el-button>
									<el-button @click="productCategoryEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="供应商" name="supplierInformation">
				<div>
					<common-table :data="getSupplierData" :columns="supplierColumns"
												:pagination="true"
												:allow-adding="true" :allow-updating="true" :allow-deleting="true"
												@add="supplierUpdate({})" @update="supplierUpdate" @delete="supplierDelete"
												:show.sync="supplierEditVisible">
						<div slot="dialog">
							<el-form :model="supplierFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="供应商名称">
									<el-input v-model="supplierFormData.SupplierName"></el-input>
								</el-form-item>
								<el-form-item label="供应商编号">
									<el-input v-model="supplierFormData.SupplierCode"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="supplierEditSave">保存</el-button>
									<el-button @click="supplierEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="客户" name="customerInformation">
				<div>
					<common-table :data="getCustomerData" :columns="customerColumns"
												:pagination="true"
												:allow-adding="true" :allow-updating="true" :allow-deleting="true"
												@add="customerUpdate({})" @update="customerUpdate" @delete="customerDelete"
												:show.sync="customerEditVisible">
						<div slot="dialog">
							<el-form :model="customerFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="客户名称">
									<el-input v-model="customerFormData.CustomerName"></el-input>
								</el-form-item>
								<el-form-item label="客户编号">
									<el-input v-model="customerFormData.Code"></el-input>
								</el-form-item>
								<el-form-item label="描述">
									<el-input v-model="customerFormData.Description"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="customerEditSave">保存</el-button>
									<el-button @click="customerEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from '../common/commonFunction/displayFilter'

	export default {
		name: "production",
		components:{CommonTable},
		data() {
			return {
				tabName:"printModel",

				printModelColumns:[
					{prop:"PrintModuleName",label:"名称"},{prop:"PrintFilePath",label:"打印文件路径"},
					{prop:"PrintModule",label:"打印模型参数"},{prop:"Property",label:"属性"}
				],
				printModelEditVisible:false,
				printModelFormData:{},
				printModelList:[],

				productCategoryColumns:[{prop:"CategoryName",label:"分类名称"},{prop:"CategoryCode",label:"分类编码"},
					{prop:"GridNums",label:"主栅数"},{prop:"PropertyA",label:"属性A"},{prop:"PropertyB",label:"属性B"}],
				productCategoryEditVisible:false,
				productCategoryFormData:{},

				productColumns:[{prop:"ProductName",label:"产品名称"},{prop:"ProductCode",label:"产品编号"},
					{prop:"Version",label:"产品版本"},{prop:"Description",label:"描述"},
					{prop:"DescriptionEn",label:"英文描述"},{prop:"ModelCode",label:"打印模型参数"}],
				productEditVisible:false,
				productFormData:{},

				productTabName:"lineRoute",
				productLineList:[],
				routeList:[],
				lineRouteList:[],
				lineRouteEditVisible:false,
				lineRouteFormData:{},
				linePrintColumns:[{prop:"ModelCode",label:"打印模型参数"}],
				halmMachineList:[],
				binGroupList:[],
				linePrintEditVisible:false,
				linePrintFormData:{},

				supplierColumns:[{prop:"SupplierName",label:"供应商名称"},{prop:"SupplierCode",label:"供应商编号"},
					{prop:"CreateTime",label:"创建时间",type:"datetime"}],
				supplierEditVisible:false,
				supplierFormData:{},

				customerColumns:[{prop:"CustomerName",label:"客户名称"},{prop:"Code",label:"客户编号"},
					{prop:"Description",label:"描述"},{prop:"CreateDate",label:"创建时间",type:"datetime"}],
				customerEditVisible:false,
				customerFormData:{},
			}
	  },
		filters:{
			displayFilter,
		},
		asyncComputed:{
			async getPrintModelData(){
				let fd = new FormData();
				fd.set('flag', 'getPrintModelList');
			this.printModelList= (await this.$axios.post('/mes/Service/ProductManageService.ashx', fd)).data;
			return  this.printModelList;
			},
			async getProductData(){
				let fd = new FormData();
				fd.set('flag', 'getProductInformationList');
				return (await this.$axios.post('/mes/Service/ProductManageService.ashx', fd)).data;
			},
			async getSupplierData(){
				let fd = new FormData();
				fd.set('flag', 'getSupplierInfomationList');
				return (await this.$axios.post('/mes/Service/ProductManageService.ashx', fd)).data;
			},
			async getCustomerData(){
				let fd = new FormData();
				fd.set('flag', 'getCustomerInformationList');
				return (await this.$axios.post('/mes/Service/ProductManageService.ashx', fd)).data;
			},
		},
		created() {
			this.getProductLineData();
			this.getRouteData();
			this.getHalmMachineData();
			this.getBinGroupData();
		},
		methods:{
			printModelUpdate(row){
				this.printModelEditVisible=true;
				this.printModelFormData=row;
			},
			printModelEditSave(){
				if (this.printModelFormData.PrintModuleID) {
					let fd = new FormData();
					fd.set('flag', 'modifyPrintModel');
					fd.set('printModel',JSON.stringify(this.printModelFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.printModelEditCancel();
							this.$asyncComputed.getPrintModelData.update();
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
					fd.set('flag', 'addPrintModel');
					fd.set('printModel',JSON.stringify(this.printModelFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.printModelEditCancel();
							this.$asyncComputed.getPrintModelData.update();
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
			printModelEditCancel(){
				this.printModelEditVisible=false;
				this.printModelFormData={};
			},
			printModelDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deletePrintModel');
					fd.set('printModuleId',row.PrintModuleID);
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getPrintModelData.update();
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

			productCategoryUpdate(row){
				this.productCategoryEditVisible=true;
				this.productCategoryFormData=row;
			},
			productCategoryEditSave(){
				if (this.productCategoryFormData.ProductCategoryID) {
					let fd = new FormData();
					fd.set('flag', 'modifyProductCategory');
					fd.set('categoryInfo',JSON.stringify(this.productCategoryFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.productCategoryEditCancel();
							this.$asyncComputed.getProductData.update();
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
					fd.set('flag', 'addProductCategory');
					fd.set('categoryInfo',JSON.stringify(this.productCategoryFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.productCategoryEditCancel();
							this.$asyncComputed.getProductData.update();
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
			productCategoryEditCancel(){
				this.productCategoryEditVisible=false;
				this.productCategoryFormData={};
			},
			productCategoryDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteProductCategory');
					fd.set('categoryId',row.ProductCategoryID);
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getProductData.update();
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

			productUpdate(row){
				this.productEditVisible=true;
				this.productFormData=row;
			},
			productEditSave(){
				let fd = new FormData();
				fd.set('flag', 'modifyProductInformation');
				fd.set('productInfo',JSON.stringify(this.productFormData));
				this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
					if (res.data=='success'){
						this.productEditCancel();
						this.$asyncComputed.getProductData.update();
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
			},
			productEditCancel(){
				this.productEditVisible=false;
				this.productFormData={};
			},

			getRouteData(){
				let fd = new FormData();
				fd.set('flag', 'getRouteList');
				this.$axios.post('/mes/Service/RouteInfoService.ashx', fd).then(res => {
					this.routeList=res.data;
				});
			},
			getProductLineData(){
				let fd = new FormData();
				fd.set('flag', 'getProductLineList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.productLineList=res.data;
				});
			},

			lineRouteLineChange(val){
				this.lineRouteList=this.routeList.filter((item)=>{return item.LineID === val;});
				this.$set(this.lineRouteFormData,'RouteIDs',null);
			},
			lineRouteAdd(productNo){
				this.lineRouteEditVisible=true;
				this.lineRouteFormData={ProductNo:productNo};
			},
			lineRouteEditSave(){
					let fd = new FormData();
					fd.set('flag', 'addProductLineRoute');
					fd.set('lineRoute',JSON.stringify(this.lineRouteFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.lineRouteEditCancel();
							this.$asyncComputed.getProductData.update();
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
			},
			lineRouteEditCancel(){
				this.lineRouteEditVisible=false;
				this.lineRouteFormData={};
			},
			lineRouteDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteLineRoute');
					fd.set('lineRouteId',row.PLineRouteID);
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getProductData.update();
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

			getHalmMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getHalmMachineList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.halmMachineList=res.data;
				});
			},
			getBinGroupData(){
				let fd = new FormData();
				fd.set('flag', 'getBinGroupList');
				this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
					this.binGroupList=res.data;
				});
			},

			linePrintAdd(productNo,modelCode){
				this.linePrintEditVisible=true;
				this.linePrintFormData={ProductNo:productNo,ModelCode:modelCode};
			},
			linePrintEditSave(){
				let fd = new FormData();
				fd.set('flag', 'addPrintRelation');
				fd.set('addData',JSON.stringify(this.linePrintFormData));
				this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
					if (res.data=='success'){
						this.linePrintEditCancel();
						this.$asyncComputed.getProductData.update();
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
			},
			linePrintEditCancel(){
				this.linePrintEditVisible=false;
				this.linePrintFormData={};
			},
			linePrintDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deletePrintRelation');
					fd.set('printRelationId',row.PrintRelationID);
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getProductData.update();
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

			supplierUpdate(row){
				this.supplierEditVisible=true;
				this.supplierFormData=row;
			},
			supplierEditSave(){
				if (this.supplierFormData.SupplierID) {
					let fd = new FormData();
					fd.set('flag', 'modifySupplierInfomation');
					fd.set('supplierInfo',JSON.stringify(this.supplierFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.supplierEditCancel();
							this.$asyncComputed.getSupplierData.update();
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
					fd.set('flag', 'addSupplierInfomation');
					fd.set('supplierInfo',JSON.stringify(this.supplierFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.supplierEditCancel();
							this.$asyncComputed.getSupplierData.update();
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
			supplierEditCancel(){
				this.supplierEditVisible=false;
				this.supplierFormData={};
			},
			supplierDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteSupplierInfomation');
					fd.set('supplierId',row.SupplierID);
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getSupplierData.update();
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

			customerUpdate(row){
				this.customerEditVisible=true;
				this.customerFormData=row;
			},
			customerEditSave(){
				if (this.customerFormData.CustomerID) {
					let fd = new FormData();
					fd.set('flag', 'modifyCustomerInformation');
					fd.set('customerInfo',JSON.stringify(this.customerFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.customerEditCancel();
							this.$asyncComputed.getCustomerData.update();
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
					fd.set('flag', 'addCustomerInformation');
					fd.set('customerInfo',JSON.stringify(this.customerFormData));
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.customerEditCancel();
							this.$asyncComputed.getCustomerData.update();
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
			customerEditCancel(){
				this.customerEditVisible=false;
				this.customerFormData={};
			},
			customerDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteCustomerInformation');
					fd.set('customerId',row.CustomerID);
					this.$axios.post('/mes/Service/ProductManageService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$asyncComputed.getCustomerData.update();
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
			},
	}
</script>

<style scoped>

</style>