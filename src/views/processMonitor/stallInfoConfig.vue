<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="分档基础数据" name="stallInfo">
				<div>
					<common-table :data="getStallSchemeData" :columns="stallSchemeColumns"
												:pagination="true"
												:allow-adding="true" :allow-updating="true" :allow-deleting="true"
												@add="stallSchemeUpdate({})" @update="stallSchemeUpdate" @delete="stallSchemeDelete"
												v-loading="this.$asyncComputed.getStallSchemeData.updating"
												:show.sync="stallSchemeEditVisible">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.StallInfoList" :columns="stallInfoColumns"
															:pagination="true"
															:allow-adding="true" :allow-updating="true" :allow-deleting="true"
															@add="stallInfoAdd(scope.row.SchemeID)" @update="stallInfoUpdate" @delete="stallInfoDelete"
															:show.sync="stallInfoEditVisible">
									<div slot="dialog">
										<el-form :model="stallInfoFormData" label-position="left" label-width="100px" style="width: 95%">
											<el-form-item label="分档编码">
												<el-input v-model="stallInfoFormData.StallCode"></el-input>
											</el-form-item>
											<el-form-item label="入库效率">
												<el-input v-model="stallInfoFormData.Effectiveness"></el-input>
											</el-form-item>
											<el-form-item label="背面效率">
												<el-input v-model="stallInfoFormData.EtaBot"></el-input>
											</el-form-item>
											<el-form-item label="测试分档名称">
												<el-input v-model="stallInfoFormData.StallName"></el-input>
											</el-form-item>
											<el-form-item label="测试最小值">
												<el-input v-model="stallInfoFormData.MinValue"></el-input>
											</el-form-item>
											<el-form-item label="测试最大值">
												<el-input v-model="stallInfoFormData.MaxValue"></el-input>
											</el-form-item>
											<el-form-item label="功率">
												<el-input v-model="stallInfoFormData.Power"></el-input>
											</el-form-item>
											<el-form-item label="背面功率">
												<el-input v-model="stallInfoFormData.PmppBot"></el-input>
											</el-form-item>
											<el-form-item label="背面档位">
												<el-input v-model="stallInfoFormData.ClassBot"></el-input>
											</el-form-item>
											<el-form-item>
												<el-button @click="stallInfoEditSave">保存</el-button>
												<el-button @click="stallInfoEditCancel">取消</el-button>
											</el-form-item>
										</el-form>
									</div>
								</common-table>
							</template>
						</el-table-column>
						<div slot="dialog">
							<el-form :model="stallSchemeFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="名称">
									<el-input v-model="stallSchemeFormData.StallSchemeName"></el-input>
								</el-form-item>
								<el-form-item label="编码">
									<el-input v-model="stallSchemeFormData.StallSchemeCode"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="stallSchemeEditSave">保存</el-button>
									<el-button @click="stallSchemeEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="分档配置" name="stallConfig">
				<div>
					<common-table :data="getStallProductInformationData" :columns="productCategoryColumns"
												:pagination="true"
												v-loading="this.$asyncComputed.getStallProductInformationData.updating">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.ProductInformationList" :columns="productStallRelationColumns"
															:pagination="true"
															:allow-updating="true" @update="productStallRelationUpdate"
															:show.sync="productStallRelationEditVisible">
									<div slot="dialog">
										<el-form :model="productStallRelationFormData" label-position="left" label-width="100px" style="width: 95%">
											<el-form-item label="产品名称">
												<el-input v-model="productStallRelationFormData.ProductName" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="产品编号">
												<el-input v-model="productStallRelationFormData.ProductCode" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="产品版本">
												<el-input v-model="productStallRelationFormData.Version" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="描述">
												<el-input v-model="productStallRelationFormData.Description" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="英文描述">
												<el-input v-model="productStallRelationFormData.DescriptionEn" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="分档基础数据模板">
												<el-select v-model="productStallRelationFormData.StallSchemeIDs" multiple style="width: 100%">
													<el-option v-if="stallSchemeList.length>0"
															v-for="item in stallSchemeList"
															:key="item.SchemeID"
															:label="item.StallSchemeName"
															:value="item.SchemeID">
													</el-option>
												</el-select>
											</el-form-item>
											<el-form-item>
												<el-button @click="productStallRelationEditSave">保存</el-button>
												<el-button @click="productStallRelationEditCancel">取消</el-button>
											</el-form-item>
										</el-form>
									</div>
								</common-table>
							</template>
						</el-table-column>
					</common-table>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	export default {
		name: "stallInfoConfig",
		components: {CommonTable},
		data(){
			return {
				tabName:"stallInfo",

				stallSchemeColumns:[{prop:"StallSchemeName",label:"名称"},{prop:"StallSchemeCode",label:"编码"}],
				stallSchemeEditVisible:false,
				stallSchemeFormData:{},

				stallInfoColumns:[{prop:"StallCode",label:"分档编码"},{prop:"Effectiveness",label:"入库效率"},
					{prop:"EtaBot",label:"背面效率"},{prop:"StallName",label:"测试分档名称"},
					{prop:"MinValue",label:"测试最小值"},{prop:"MaxValue",label:"测试最大值"},
					{prop:"Power",label:"功率"},{prop:"PmppBot",label:"背面功率"},
					{prop:"ClassBot",label:"背面档位"}],
				stallInfoEditVisible:false,
				stallInfoFormData:{},
				productCategoryColumns:[{prop:"CategoryName",label:"分类名称"},{prop:"CategoryCode",label:"分类编码"},
					{prop:"GridNums",label:"主栅数"},{prop:"PropertyA",label:"属性A"},
					{prop:"PropertyB",label:"属性B"}],
				productStallRelationColumns:[{prop:"ProductName",label:"产品名称"},{prop:"ProductCode",label:"产品编号"},
					{prop:"Version",label:"产品版本"},{prop:"Description",label:"描述"},
					{prop:"DescriptionEn",label:"英文描述"},{prop:"ModelCode",label:"打印模型参数"},
					{prop:"StallSchemeNames",label:"分档基础数据模板"}],
				productStallRelationEditVisible:false,
				productStallRelationFormData:{},
				stallSchemeList:[],
			}
		},
		asyncComputed:{
			async getStallSchemeData(){
				let fd = new FormData();
				fd.set('flag', 'getStallSchemeListWithStallInfos');
				this.stallSchemeList= (await this.$axios.post('/mes/Service/StallInfoService.ashx', fd)).data;
				return this.stallSchemeList;
			},
			async getStallProductInformationData(){
				let fd = new FormData();
				fd.set('flag', 'getStallProductInformationList');
				return (await this.$axios.post('/mes/Service/StallInfoService.ashx', fd)).data;
			},

		},
		methods:{
			stallSchemeUpdate(row){
				this.stallSchemeFormData=row;
				this.stallSchemeEditVisible=true;
			},
			stallSchemeEditSave(){
				if (this.stallSchemeFormData.SchemeID) {
					let fd = new FormData();
					fd.set('flag', 'modifyStallScheme');
					fd.set('modifyData',JSON.stringify(this.stallSchemeFormData));
					this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.stallSchemeEditCancel();
							this.$asyncComputed.getStallSchemeData.update();
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
					fd.set('flag', 'addStallScheme');
					fd.set('addData',JSON.stringify(this.stallSchemeFormData));
					this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.stallSchemeEditCancel();
							this.$asyncComputed.getStallSchemeData.update();
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
			stallSchemeEditCancel(){
				this.stallSchemeEditVisible=false;
				this.stallSchemeFormData={};
			},
			stallSchemeDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteStallScheme');
					fd.set('schemeId',row.SchemeID);
					fd.set('isForce',false);
					this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							if (res.data.Message=="success"){
								this.$message({
									type: 'success',
									message: '删除成功！'
								});
								this.$asyncComputed.getStallSchemeData.update();
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
									this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
										if (res.data.Result){
											if (res.data.Message=="success"){
												this.$message({
													type: 'success',
													message: '删除成功！'
												});
												this.$asyncComputed.getStallSchemeData.update();
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

			stallInfoAdd(schemeID){
				this.stallInfoFormData={"StallSchemeID":schemeID};
				this.stallInfoEditVisible=true;
			},
			stallInfoUpdate(row){
				this.stallInfoFormData=row;
				this.stallInfoEditVisible=true;
			},
			stallInfoEditSave(){
				if (this.stallInfoFormData.StallInfID) {
					let fd = new FormData();
					fd.set('flag', 'modifyStallInfo');
					fd.set('stallInfo',JSON.stringify(this.stallInfoFormData));
					this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							this.stallInfoEditCancel();
							this.$asyncComputed.getStallSchemeData.update();
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
				}else {
					let fd = new FormData();
					fd.set('flag', 'addStallInfo');
					fd.set('stallInfo',JSON.stringify(this.stallInfoFormData));
					this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							this.stallInfoEditCancel();
							this.$asyncComputed.getStallSchemeData.update();
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
				}
			},
			stallInfoEditCancel(){
				this.stallInfoEditVisible=false;
				this.stallInfoFormData={};
			},
			stallInfoDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteStallInfo');
					fd.set('stallInfoId',row.StallInfID);
					this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							if (res.data.Result){
								this.$message({
									type: 'success',
									message: '删除成功！'
								});
								this.$asyncComputed.getStallSchemeData.update();
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
			},

			productStallRelationUpdate(row){
				this.productStallRelationFormData=row;
				this.productStallRelationEditVisible=true;

			},
			productStallRelationEditSave(){
					let fd = new FormData();
					fd.set('flag', 'updateProductStallRelation');
					fd.set('productNo',this.productStallRelationFormData.ProductNo);
					fd.set('schemeIds',JSON.stringify(this.productStallRelationFormData.StallSchemeIDs));
					this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
						if (res.data==="success"){
							this.productStallRelationEditCancel();
							this.$asyncComputed.getStallProductInformationData.update();
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
			productStallRelationEditCancel(){
				this.productStallRelationEditVisible=false;
				this.productStallRelationFormData={};
			},









		}
	}
</script>

<style scoped>

</style>