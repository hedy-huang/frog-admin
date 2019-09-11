<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="流程" name="route">
				<div>
					<common-table :data="getRouteData" :columns="routeColumns"
												:pagination="true"
												:allow-adding="true" :allow-updating="true" :allow-deleting="true"
												@add="routeAdd" @update="routeUpdate" @delete="routeDelete"
												:show.sync="routeEditVisible" @dialogClose="routeEditCancel">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.RouteProcessFlows" :columns="routeWorkCellColumns"
															:pagination="true"
															:allow-updating="true" @update="routeWorkCellUpdate"
															:show.sync="routeWorkCellEditVisible">
									<el-table-column type="expand" slot="expand">
										<template slot-scope="scope">
											<common-table :data="scope.row.RouteProcessMachines" :columns="routeMachineColumns"
																		:pagination="true">
											</common-table>
										</template>
									</el-table-column>
									<el-table-column slot="columnR" prop="IncludeInOutput" label="是否参与产量计算">
										<template slot-scope="scope">
											<el-checkbox :value="scope.row.IncludeInOutput"></el-checkbox>
										</template>
									</el-table-column>
									<div slot="dialog">
										<el-form :model="routeWorkCellFormData" label-position="left" label-width="100px" style="width: 95%">
											<el-form-item label="工艺段名称">
												<el-input v-model="routeWorkCellFormData.WorkCellName" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="是否计算产量">
												<el-checkbox v-model="routeWorkCellFormData.IncludeInOutput"></el-checkbox>
											</el-form-item>
											<el-form-item>
												<el-button @click="routeWorkCellEditSave">保存</el-button>
												<el-button @click="routeWorkCellEditCancel">取消</el-button>
											</el-form-item>
										</el-form>
									</div>
								</common-table>
							</template>
						</el-table-column>
						<div slot="dialog">
							<el-form :model="routeFormData" ref="routeForm" :rules="routeFormRules" label-width="100px" style="width: 95%">
								<el-form-item label="流程名称" prop="RouteName">
									<el-input v-model="routeFormData.RouteName"></el-input>
								</el-form-item>
								<el-form-item label="选择部门" prop="AreaID">
									<el-select v-model="routeFormData.AreaID" @change="routeAreaChange" style="width: 100%">
										<el-option v-if="areaList.length>0"
															 v-for="item in areaList"
															 :key="item.AreaID" :label="item.DisplayName" :value="item.AreaID">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="选择产线" prop="LineID">
									<el-select v-model="routeFormData.LineID" style="width: 100%">
										<el-option v-if="productLineList.length>0"
															 v-for="item in productLineList"
															 :key="item.LineID" :label="item.LineName" :value="item.LineID">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="请选择流程机器">
									<el-tree ref="cellMachineTree" :data="workCellMachineTreeByArea" :props="defaultProps"
													 show-checkbox  node-key="id"></el-tree>
								</el-form-item>
								<el-form-item>
									<el-button @click="routeEditSave">保存</el-button>
									<el-button @click="routeEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="流程配方" name="recipeForRoute">
				<div>
					<common-table :data="getRouteRecipeData" :columns="routeColumns"
												:pagination="true">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.Tasks" :columns="routeRecipeColumns"
															:pagination="true" :page-size="5"
															:allow-updating="true" @update="routeRecipeUpdate"
															:show.sync="routeRecipeEditVisible">
									<el-table-column slot="columnR" prop="RecipeID" label="配方">
										<template slot-scope="scope">
											{{scope.row.RecipeID|displayFilter(recipeList,"RecipeID","RecipeName")}}
										</template>
									</el-table-column>
									<div slot="dialog">
										<el-form :model="routeRecipeFormData" label-position="left" label-width="100px" style="width: 95%">
											<el-form-item label="设备名称">
												<el-input v-model="routeRecipeFormData.MachineName" :disabled="true"></el-input>
											</el-form-item>
											<el-form-item label="配方">
												<el-select v-model="routeRecipeFormData.RecipeID" style="width: 100%">
													<el-option v-if="recipeFilter(routeRecipeFormData).length>0"
																		 v-for="item in recipeFilter(routeRecipeFormData)"
																		 :key="item.RecipeID" :label="item.RecipeName" :value="item.RecipeID">
													</el-option>
												</el-select>
											</el-form-item>
											<el-form-item>
												<el-button @click="routeRecipeEditSave">保存</el-button>
												<el-button @click="routeRecipeEditCancel">取消</el-button>
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
	import {displayFilter} from "../common/commonFunction/displayFilter";
	export default {
		name: "routeConfig",
		components: {CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			return {
				tabName:"route",
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				routeColumns:[{prop:"RouteName",label:"流程名称"},{prop:"Desc",label:"描述"},
					{prop:"CreateTime",label:"创建时间",type:"datetime"}],
				routeWorkCellColumns:[{prop:"WorkCellName",label:"工艺段名称"},{prop:"StepNo",label:"序号"}],
				routeMachineColumns:[{prop:"MachineName",label:"设备名称"}],
				routeEditVisible:false,
				routeFormData:{},
				routeFormRules:{
					RouteName:[	{required: true, message: '请输入流程名称', trigger: 'blur'},],
					AreaID:[{required: true, message: '请选择部门', trigger: 'change'},],
					LineID:[{required: true, message: '请选择产线', trigger: 'change'},],
				},
				areaList:[],
				productLineList:[{ LineID:-1,LineName:"--",AreaID:-1}],
				workCellMachineTree:[],
				workCellMachineTreeByArea:[],
				routeWorkCellEditVisible:false,
				routeWorkCellFormData:{},
				routeRecipeColumns:[{prop:"MachineName",label:"设备名称"}],
				recipeList:[],
				routeRecipeEditVisible:false,
				routeRecipeFormData:{},
			}
		},
		asyncComputed:{
			async getRouteData() {
				let fd = new FormData();
				fd.set('flag', 'getRouteList');
				return (await this.$axios.post('/mes/Service/RouteInfoService.ashx', fd)).data;
			},
			async getRouteRecipeData() {
				let fd = new FormData();
				fd.set('flag', 'getRouteRecipeList');
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				return (await this.$axios.post('/mes/Service/RouteInfoService.ashx', fd)).data;
			},
		},
		created(){
			this.getAreaData();
			this.getProductLineData();
			this.getWorkCellMachineTree();
			this.getRecipeData();
		},
		methods:{
			getAreaData(){
				let fd = new FormData();
				fd.set('flag', 'getAreaList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.areaList=res.data;
				});
			},
			getProductLineData(){
				let fd = new FormData();
				fd.set('flag', 'getProductLineList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.productLineList=res.data;
					this.productLineList.unshift({ LineID:-1,LineName:"--",AreaID:-1});
				});
			},
			getWorkCellMachineTree(){
				let fd = new FormData();
				fd.set('flag', 'getWorktubeTree');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					let list= res.data;
					let tree=[];
					let areas= list.filter((item)=>{ if (item.Type===2){return item;}});
					if (areas){
						for (let i=0;i<areas.length;i++){
							let cells= list.filter((item)=>{ if (item.parentId==areas[i].id){return item;}});
							if (cells){
								for (let j=0;j<cells.length;j++){
									let machines= list.filter((item)=>{ if (item.parentId==cells[j].id){return item;}});
									if (machines){
										cells[j].children=machines;
									}
								}
								areas[i].children=cells;
							}
							tree.push(areas[i]);
						}
					}
					this.workCellMachineTree= tree;
				});
			},
			getRecipeData(){
				let fd = new FormData();
				fd.set('flag', 'getRecipeList');
				this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
					this.recipeList=res.data;
				});
			},

			routeAreaChange(val){
				if(val){
					let area=this.workCellMachineTree.find((item)=>{return item.ID === val;});
					if(area){
						this.workCellMachineTreeByArea=area.children;
					}else {
						this.workCellMachineTreeByArea=[];
					}
				}else{
					this.workCellMachineTreeByArea=[];
				}
			},
			routeAdd(){
				this.routeEditVisible=true;
				this.routeFormData={LineID:-1,RouteID:-1};
				this.workCellMachineTreeByArea=[];
			},
			routeUpdate(row){
				this.routeEditVisible=true;
				this.$nextTick(() => {
					this.routeFormData=row;
					let area=this.workCellMachineTree.find((item)=>{return item.ID === row.AreaID;});
					if(area){
						this.workCellMachineTreeByArea=area.children;
					}else {
						this.workCellMachineTreeByArea=[];
					}
					this.$refs.cellMachineTree.setCheckedKeys(row.IdList);
				});
			},
			routeEditSave(){
				this.$refs['routeForm'].validate((valid) => {
					if (valid) {
						let routeDetail= this.$refs.cellMachineTree.getCheckedNodes();
						let tempWorkcellMachineList = [];
						let tempWorkcellList = [];
						let routeWorkcellMachines = [];

						for (let i = 0; i < routeDetail.length; i++) {
							if (this.routeFormData.LineID === -1) {//不选产线
								if (routeDetail[i].Type ===5) {
									if (tempWorkcellList.indexOf(routeDetail[i].parentId) === -1) {
										tempWorkcellList.push(routeDetail[i].parentId);
										tempWorkcellMachineList.push({
											WorkCellId: routeDetail[i].parentId,
											MachineList: [
												routeDetail[i]
											]
										});
										routeWorkcellMachines.push({
											WorkCellID: routeDetail[i].ParentID,
											MachineIDList: [routeDetail[i].WorkMachineID]
										});
									} else {
										for (let j = 0; j < tempWorkcellMachineList.length; j++) {
											if (tempWorkcellMachineList[j].WorkCellId === routeDetail[i].parentId) {
												tempWorkcellMachineList[j].MachineList.push(routeDetail[i]);
											}
										}

										for (let j = 0; j < routeWorkcellMachines.length; j++) {
											if (routeWorkcellMachines[j].WorkCellID === routeDetail[i].ParentID) {
												routeWorkcellMachines[j].MachineIDList.push(routeDetail[i].WorkMachineID);
											}
										}
									}
								}
							} else {
								if ( routeDetail[i].Type === 4) {
									if ( tempWorkcellList.indexOf(routeDetail[i])=== -1) {
										tempWorkcellList.push(routeDetail[i]);
										routeWorkcellMachines.push({
											WorkCellID: routeDetail[i].ID
										});
									}
								}
							}
						}

						if (routeWorkcellMachines.length===0){
							this.$message({
								type: 'warning',
								message: '请选择流程机器！'
							});
							return ;
						}

						let fd = new FormData();
						fd.set('flag', 'submitRouteWithMachine');
						fd.set('routeId',this.routeFormData.RouteID);
						fd.set('routeName',this.routeFormData.RouteName);
						fd.set('areaId',this.routeFormData.AreaID);
						fd.set('routeWorkcellMachine',JSON.stringify(routeWorkcellMachines));
						fd.set('lineId',this.routeFormData.LineID);
						this.$axios.post('/mes/Service/RouteInfoService.ashx', fd).then(res => {
							if (res.data==='success'){
								this.routeEditCancel();
								this.$asyncComputed.getRouteData.update();
								this.$message({
									type: 'success',
									message: '操作成功！'
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
						return false;
					}
				});
			},
			routeEditCancel(){
				this.routeEditVisible=false;
				this.routeFormData={};
				this.workCellMachineTreeByArea=[];
				this.$refs['routeForm'].resetFields();
			},
			routeDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteRouteInfo');
					fd.set('RID',row.RouteID);
					this.$axios.post('/mes/Service/RouteInfoService.ashx', fd).then(res => {
						if (res.data==='success'){
							this.$asyncComputed.getRouteData.update();
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

			routeWorkCellUpdate(row){
				this.routeWorkCellEditVisible=true;
				this.routeWorkCellFormData=row;
			},
			routeWorkCellEditSave(){
				let fd = new FormData();
				fd.set('flag', 'updateRouteFlowIncludeOutput');
				fd.set('info',JSON.stringify(this.routeWorkCellFormData));
				this.$axios.post('/mes/Service/RouteInfoService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.routeWorkCellEditCancel();
						this.$asyncComputed.getRouteData.update();
						this.$message({
							type: 'success',
							message: '操作成功！'
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
			routeWorkCellEditCancel(){
				this.routeWorkCellEditVisible=false;
				this.routeWorkCellFormData={};
			},

			routeRecipeUpdate(row){
				this.routeRecipeEditVisible=true;
				this.routeRecipeFormData=row;
			},
			routeRecipeEditSave(){
				let fd = new FormData();
				fd.set('flag', 'updateRecipe');
				fd.set('routeId', this.routeRecipeFormData.RouteID);
				fd.set('machineId',this.routeRecipeFormData.MachineID);
				fd.set('recipeId', this.routeRecipeFormData.RecipeID);
				this.$axios.post('/mes/Service/RouteInfoService.ashx', fd).then(res => {
					if (res.data!= ""){
						this.routeRecipeEditCancel();
						this.$asyncComputed.getRouteRecipeData.update();
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
			routeRecipeEditCancel(){
				this.routeRecipeEditVisible=false;
				this.routeRecipeFormData={};
			},
			recipeFilter(row){
				let source = this.recipeList.filter((item)=>{
					if (item.TubeID != "" && item.TubeID != null) {
						if (item.TubeID == row.TubeID)
							return item;
					} else if (item.MachineGroupID > 0) {
						if (item.MachineGroupID == row.MachineGroupID)
							return item;
					} else if (item.MachineID > 0) {
						if (item.MachineID == row.MachineID)
							return item;
					} else if (item.WorkCellID > 0) {
						if (item.WorkCellID == row.WorkCellID)
							return item;
					} else {
						return item;
					}
				});
				return source;
			},
		}
	}
</script>

<style scoped>

</style>