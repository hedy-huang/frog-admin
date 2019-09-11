<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="配方项目" name="recipeItem">
				<div>
					<common-table :data="getRecipeItemData" :show-header="false"
												:pagination="true"
												:allow-adding="true" @add="recipeItemAdd"
												:show.sync="recipeItemAddVisible">
						<el-table-column slot="expand" type="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.MachineList" :show-header="false"
															:pagination="true">
									<el-table-column slot="expand" type="expand">
										<template slot-scope="scope">
											<common-table :data="scope.row.ItemList" :columns="recipeItemColumns"
																		:pagination="true"
																		:allow-updating="true" :allow-deleting="true"
																		@update="recipeItemUpdate" @delete="recipeItemDelete"
																		:show.sync="recipeItemEditVisible">
												<el-table-column slot="columnR" prop="Flag" label="Flag">
													<template slot-scope="scope">
														{{scope.row.Flag|displayFilter(recipeItemFlagList,"Value","Text")}}
													</template>
												</el-table-column>
												<el-table-column slot="columnR" prop="SpotInspect" label="SpotInspect">
													<template slot-scope="scope">
														<el-checkbox :value="scope.row.SpotInspect"></el-checkbox>
													</template>
												</el-table-column>
												<div slot="dialog">
													<el-form :model="recipeItemFormData" label-position="left" label-width="100px" style="width: 95%">
														<el-form-item label="ItemName">
															<el-input v-model="recipeItemFormData.ItemName"></el-input>
														</el-form-item>
														<el-form-item label="Desc">
															<el-input v-model="recipeItemFormData.Desc"></el-input>
														</el-form-item>
														<el-form-item label="WorkCell">
															<el-select v-model="recipeItemFormData.WorkCellID" @change="cellChange" style="width: 100%">
																<el-option v-if="workCellList.length>0"
																					 v-for="item in workCellList"
																					 :key="item.WorkCellID" :label="item.DisplayName" :value="item.WorkCellID">
																</el-option>
															</el-select>
														</el-form-item>
														<el-form-item label="WorkMachine">
															<el-select v-model="recipeItemFormData.MachineID" style="width: 100%">
																<el-option v-if="workMachineCellList.length>0"
																					 v-for="item in workMachineCellList"
																					 :key="item.MachineID" :label="item.MachineName" :value="item.MachineID">
																</el-option>
															</el-select>
														</el-form-item>
														<el-form-item label="Flag">
															<el-select v-model="recipeItemFormData.Flag" style="width: 100%">
																<el-option v-if="recipeItemFlagList.length>0"
																					 v-for="item in recipeItemFlagList"
																					 :key="item.Value" :label="item.Text" :value="item.Value">
																</el-option>
															</el-select>
														</el-form-item>
														<el-form-item label="SpotInspect">
															<el-checkbox v-model="recipeItemFormData.SpotInspect"></el-checkbox>
														</el-form-item>
														<el-form-item>
															<el-button @click="recipeItemEditSave">保存</el-button>
															<el-button @click="recipeItemEditCancel">取消</el-button>
														</el-form-item>
													</el-form>
												</div>
											</common-table>
										</template>
									</el-table-column>
									<el-table-column slot="columnL" prop="MachineID">
										<template slot-scope="scope">
											机器：{{scope.row.MachineID|displayFilter(workMachineList,"MachineID","MachineName")}}
										</template>
									</el-table-column>
								</common-table>
							</template>
						</el-table-column>
						<el-table-column slot="columnL" prop="WorkCellID">
							<template slot-scope="scope">
								工艺段：{{scope.row.WorkCellID|displayFilter(workCellList,"WorkCellID","DisplayName")}}
							</template>
						</el-table-column>
						<div slot="dialog">
							<el-form :model="recipeItemFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="ItemName">
									<el-input v-model="recipeItemFormData.ItemName"></el-input>
								</el-form-item>
								<el-form-item label="Desc">
									<el-input v-model="recipeItemFormData.Desc"></el-input>
								</el-form-item>
								<el-form-item label="WorkCell">
									<el-select v-model="recipeItemFormData.WorkCellID" @change="cellChange" style="width: 100%">
										<el-option v-if="workCellList.length>0"
															 v-for="item in workCellList"
															 :key="item.WorkCellID" :label="item.DisplayName" :value="item.WorkCellID">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="WorkMachine">
									<el-select v-model="recipeItemFormData.MachineID" style="width: 100%">
										<el-option v-if="workMachineCellList.length>0"
															 v-for="item in workMachineCellList"
															 :key="item.MachineID" :label="item.MachineName" :value="item.MachineID">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="Flag">
									<el-select v-model="recipeItemFormData.Flag" style="width: 100%">
										<el-option v-if="recipeItemFlagList.length>0"
															 v-for="item in recipeItemFlagList"
															 :key="item.Value" :label="item.Text" :value="item.Value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="SpotInspect">
										<el-checkbox v-model="recipeItemFormData.SpotInspect"></el-checkbox>
								</el-form-item>
								<el-form-item>
									<el-button @click="recipeItemEditSave">保存</el-button>
									<el-button @click="recipeItemAddCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="配方信息" name="recipeInfo">
				<div>
					<el-button size="small" @click="copyButtonClick">Copy</el-button>
					<el-dialog :visible.sync="copyDialogVisible" :before-close="copyCancel" append-to-body>
						<el-form :model="copyFormData" label-position="left" label-width="100px" style="width: 95%">
							<el-form-item label="From">
								<el-select v-model="copyFormData.From" style="width: 100%">
									<el-option v-if="recipeInfoData.length>0"
														 v-for="item in recipeInfoData"
														 :key="item.RecipeID" :label="item.DisplayName" :value="item.RecipeID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="To">
								<el-select v-model="copyFormData.To" style="width: 100%">
									<el-option v-if="recipeInfoData.length>0"
														 v-for="item in recipeInfoData"
														 :key="item.RecipeID" :label="item.DisplayName" :value="item.RecipeID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button @click="copySave">保存</el-button>
								<el-button @click="copyCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
					<common-table :data="getRecipeInfoData" :columns="recipeInfoColumns"
												:pagination="true" :page-size="5"
												:allow-adding="true" :allow-updating="true" :allow-deleting="true"
												@add="recipeInfoUpdate({})" @update="recipeInfoUpdate" @delete="recipeInfoDelete"
												@rowClick="recipeInfoRowClick"
												:show.sync="recipeInfoEditVisible">
						<el-table-column slot="columnR" prop="Flag" label="Flag">
							<template slot-scope="scope">
								{{scope.row.Flag|displayFilter(recipeInfoFlagList,"Value","Text")}}
							</template>
						</el-table-column>
						<el-table-column slot="columnR" prop="WorkCellID" label="WorkCell">
							<template slot-scope="scope">
								{{scope.row.WorkCellID|displayFilter(workCellList,"WorkCellID","DisplayName")}}
							</template>
						</el-table-column>
						<el-table-column slot="columnR" prop="MachineName" label="WorkMachine"></el-table-column>
						<el-table-column slot="columnR" prop="TubeID" label="WorkTube"></el-table-column>
						<div slot="dialog">
							<el-form :model="recipeInfoFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="RecipeName">
									<el-input v-model="recipeInfoFormData.RecipeName"></el-input>
								</el-form-item>
								<el-form-item label="Version">
									<el-input v-model="recipeInfoFormData.Version"></el-input>
								</el-form-item>
								<el-form-item label="Flag">
									<el-select v-model="recipeInfoFormData.Flag" style="width: 100%">
										<el-option v-if="recipeInfoFlagList.length>0"
															 v-for="item in recipeInfoFlagList"
															 :key="item.Value" :label="item.Text" :value="item.Value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="WorkCell">
									<el-select v-model="recipeInfoFormData.WorkCellID" @change="cellChange" style="width: 100%">
										<el-option v-if="workCellList.length>0"
															 v-for="item in workCellList"
															 :key="item.WorkCellID" :label="item.DisplayName" :value="item.WorkCellID">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="WorkMachine">
									<el-select v-model="recipeInfoFormData.MachineID" @change="machineChange" style="width: 100%">
										<el-option v-if="workMachineCellList.length>0"
															 v-for="item in workMachineCellList"
															 :key="item.MachineID" :label="item.MachineName" :value="item.MachineID">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="WorkTube">
									<el-select v-model="recipeInfoFormData.TubeID" style="width: 100%">
										<el-option v-if="workTubeMachineList.length>0"
															 v-for="item in workTubeMachineList"
															 :key="item.TubeName" :label="item.TubeName" :value="item.TubeName">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button @click="recipeInfoEditSave">保存</el-button>
									<el-button @click="recipeInfoEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
					<common-table v-if="itemMatrixVisible" :data="itemMatrixTableData" :columns="itemMatrixColumns">
						<el-table-column v-if="itemMatrixRVisible" slot="columnR"  v-for="column in itemMatrixRColumns" :prop="column.ItemName" :label="column.ItemName">
						<el-table-column v-for="column in column.columns" :prop="column.prop" :label="column.label"></el-table-column>
						</el-table-column>
					</common-table>
					<el-button v-if="itemMatrixVisible">提交</el-button>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";
	export default {
		name: "recipeManage",
		components: {CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			return{
				tabName:"recipeItem",
				workCellList:[],
				workMachineList:[],
				workTubeList:[],
				recipeItemFlagList:[{ Text: "Enable", Value: 0 }, { Text: "Disable", Value: 1 }],
				recipeInfoFlagList:[{ Text: "Enable", Value: 0 }, { Text: "Disable", Value: 1 }, { Text: "Template", Value: 2 }],
				recipeItemColumns:[{prop:"ItemName",label:"ItemName"},{prop:"Desc",label:"Desc"},
					{prop:"CreateTime",label:"CreateTime",type:"datetime"},{prop:"CreateUser",label:"CreateUser"}],
				recipeItemAddVisible:false,
				recipeItemEditVisible:false,
				recipeItemFormData:{},
				workMachineCellList:[],
				recipeInfoColumns:[{prop:"RecipeName",label:"RecipeName"},{prop:"Version",label:"Version"},
					{prop:"CreateTime",label:"CreateTime",type:"datetime"},{prop:"CreateUser",label:"CreateUser"}],
				recipeInfoEditVisible:false,
				recipeInfoFormData:{},
				workTubeMachineList:[],
				copyDialogVisible:false,
				copyFormData:{},
				recipeInfoData:[],
				itemMatrixTableData:[],
				itemMatrixColumns:[],
				itemMatrixVisible:false,
				itemMatrixRVisible:false,
				itemMatrixRColumns:[],
			}
		},
		asyncComputed:{
			async getRecipeItemData(){
				let fd = new FormData();
				fd.set('flag', 'GRI');
				let itemList= (await this.$axios.post('/mes/Service/RecipeService.ashx', fd)).data;
				if (itemList.length>0){
					let temp=[];
					let workCellIds=[];
					for (let j = 0; j < itemList.length;j++){
						if (workCellIds.indexOf(itemList[j].WorkCellID)===-1){
							workCellIds.push(itemList[j].WorkCellID);
						}
					}
					for (let i=0;i<workCellIds.length;i++) {
						let machineIds=[];
						for (let j = 0; j < itemList.length;j++){
							if (itemList[j].WorkCellID==workCellIds[i] && machineIds.indexOf(itemList[j].MachineID)===-1){
								machineIds.push(itemList[j].MachineID);
							}
						}
						let machineTemp=[];
						for (let k=0;k<machineIds.length;k++){
							let list = itemList.filter((item) => {
								if (item.WorkCellID == workCellIds[i] && item.MachineID == machineIds[k]) {
									return item;
								}
							});
							if (list.length > 0) {
								machineTemp.push({MachineID:machineIds[k] ,ItemList:list});
							}
						}
						if (machineTemp.length>0){
							temp.push({WorkCellID:workCellIds[i],MachineList:machineTemp});
						}
					}
					return temp;
				} else {return [];}
			},
			async getRecipeInfoData(){
				let fd = new FormData();
				fd.set('flag', 'getRecipeInfo');
				this.recipeInfoData= (await this.$axios.post('/mes/Service/RecipeService.ashx', fd)).data;
				return  this.recipeInfoData;
			},
		},
		created(){
			this.getWorkCellData();
			this.getWorkMachineData();
			this.getWorkTubeData();
		},
		methods:{
			getWorkCellData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkCellListByWorkCellType');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.workCellList=res.data;
				});
			},
			getWorkMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getMachineList');
				fd.set('workCellTypeName','');
				fd.set('machineType','1');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.workMachineList=res.data;
				});
			},
			getWorkTubeData(){
				let fd = new FormData();
				fd.set('flag', 'WorkTube');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.workTubeList=res.data;
				});
			},
			cellChange(val){
				this.workMachineCellList= this.workMachineList.filter((item)=>{return item.WorkCellID === val;});
			},
			recipeItemAdd(){
				this.recipeItemFormData={};
				this.recipeItemAddVisible=true;
			},
			recipeItemUpdate(row){
				this.recipeItemFormData=row;
				this.recipeItemEditVisible=true;
				this.cellChange(row.WorkCellID);
			},
			recipeItemEditSave(){
				if (this.recipeItemFormData.ItemID) {
					let fd = new FormData();
					fd.set('flag', 'UPRI');
					fd.set('RID',this.recipeItemFormData.ItemID)
					fd.set('NDATA',JSON.stringify(this.recipeItemFormData));
					this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
						if (res.data==='Success'){
							this.recipeItemEditCancel();
							this.$asyncComputed.getRecipeItemData.update();
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
					fd.set('flag', 'NII');
					fd.set('DATA',JSON.stringify(this.recipeItemFormData));
					this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
						if (res.data==='Success'){
							this.recipeItemAddCancel();
							this.$asyncComputed.getRecipeItemData.update();
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
			recipeItemAddCancel(){
				this.recipeItemAddVisible=false;
				this.recipeItemFormData = {};
			},
			recipeItemEditCancel(){
					this.recipeItemEditVisible=false;
				this.recipeItemFormData = {};
			},
			recipeItemDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'DELETERECIPEITEM');
					fd.set('recipeItemId',row.ItemID);
					this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
						if (res.data==='Success'){
							this.$asyncComputed.getRecipeItemData.update();
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
			machineChange(val){
				this.workTubeMachineList= this.workTubeList.filter((item)=>{return item.MachineID === val;});
			},
			recipeInfoUpdate(row){
				this.recipeInfoFormData=row;
				this.recipeInfoEditVisible=true;
			},
			recipeInfoEditSave(){
				if (this.recipeInfoFormData.RecipeID) {
					let fd = new FormData();
					fd.set('flag', 'UPD');
					fd.set('RID',this.recipeInfoFormData.RecipeID)
					fd.set('NDATA',JSON.stringify(this.recipeInfoFormData));
					this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
						if (res.data==='Success'){
							this.recipeInfoEditCancel();
							this.$asyncComputed.getRecipeInfoData.update();
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
					fd.set('flag', 'NR');
					fd.set('DATA',JSON.stringify(this.recipeInfoFormData));
					this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
						if (res.data==='Success'){
							this.recipeInfoEditCancel();
							this.$asyncComputed.getRecipeInfoData.update();
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
			recipeInfoEditCancel(){
				this.recipeInfoEditVisible=false;
				this.recipeInfoFormData = {};
				this.itemMatrixVisible=false;
			},
			recipeInfoDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'DELETERECIPEINFO');
					fd.set('recipeInfoId',row.RecipeID);
					this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
						if (res.data==='Success'){
							this.$asyncComputed.getRecipeInfoData.update();
							this.itemMatrixVisible=false;
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
			copyButtonClick(){
				this.copyDialogVisible=true;
				this.copyFormData={};
			},
			copySave(){
				let fd = new FormData();
				fd.set('flag', 'COPY');
				fd.set('FROM',this.copyFormData.From);
				fd.set('TO',this.copyFormData.To);
				this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
					if (res.data==='Success'){
						this.copyCancel();
						this.$asyncComputed.getRecipeInfoData.update();
						this.$message({
							type: 'success',
							message: 'copy成功！'
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
			copyCancel(){
				this.copyDialogVisible=false;
				this.copyFormData={};
			},
			recipeInfoRowClick(row){
				this.itemMatrixVisible=true;
				let fd = new FormData();
				fd.set('flag', 'GI');
				fd.set('recipeId',row.RecipeID);
				this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
					if (res.data && res.data.DataList.length>0) {
						this.itemMatrixRVisible=false;
						this.itemMatrixColumns=res.data.ColumnList;
						this.itemMatrixTableData=res.data.DataList;
					}else {
						this.itemMatrixRVisible=true;
						let fd = new FormData();
						fd.set('flag', 'GETRECIPEITEMS');
						fd.set('machineId',row.MachineID);
						fd.set('workCellId',row.WorkCellID);
						this.$axios.post('/mes/Service/RecipeService.ashx', fd).then(res => {
							this.itemMatrixColumns=[{prop:"SpotInspect",label:"SpotInspect"},{prop:"StepIndex",label:"StepIndex"},{prop:"StepName",label:"StepName"}];
							this.itemMatrixTableData=[];
							let columns= [];
							for(let i=0;i<res.data.length;i++){
								columns.push({ItemName:res.data[i].ItemName,columns:[{prop:res.data[i].ItemName,label:res.data[i].ItemName},{prop:res.data[i].ItemName+'--Plus',label:res.data[i].ItemName+'--Plus'},{prop:res.data[i].ItemName+'--Minus',label:res.data[i].ItemName+'--Minus'}]});
							}
							this.itemMatrixRColumns=columns;
						});
					}
				});
			},
		},
	}
</script>

<style scoped>

</style>