<template>
	<div>
		<common-table :data="getBinBoxInfoData" :columns="binGroupColumns"
									:pagination="true"
									:allowAdding="true" :allow-updating="true" :allow-deleting="true"
									@add="binGroupUpdate({})" @update="binGroupUpdate" @delete="binGroupDelete"
									:show.sync="binGroupEditVisible">
			<el-table-column slot="expand" type="expand">
				<template slot-scope="scope">
					<common-table :data="scope.row.BinBoxInfoList" :columns="binBoxInfoColumns"
												:pagination="true"
												:allow-adding="true" :allow-updating="true" :allow-deleting="true"
												@add="binBoxAdd(scope.row.StallSchemeID,scope.row.BinGroupID)"
												@update="binBoxUpdate" @delete="binBoxDelete"
												:show.sync="binBoxEditVisible">
						<el-table-column slot="columnR" prop="Type" label="类型">
							<template slot-scope="scope">
								{{scope.row.Type| displayFilter(binBoxTypeList,"Name","Description")}}
							</template>
						</el-table-column>
						<div slot="dialog" >
							<el-form :model="binBoxFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="bin盒">
									<el-input v-model="binBoxFormData.BinCode"></el-input>
								</el-form-item>
								<el-form-item label="类型">
									<el-select v-model="binBoxFormData.Type" @change="typeSelectChange" style="width: 100%">
										<el-option v-if="binBoxTypeList.length>0"
															 v-for="item in binBoxTypeList"
															 :key="item.Name" :label="item.Description" :value="item.Name">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="Value">
									<el-select v-model="binBoxFormData.Value" style="width: 100%">
										<el-option v-if="binBoxValueList.length>0"
															 v-for="item in binBoxValueList"
															 :key="item.Value" :label="item.Description" :value="item.Value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button @click="binBoxEditSave">保存</el-button>
									<el-button @click="binBoxEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</template>
			</el-table-column>
			<el-table-column slot="columnR" prop="StallSchemeID" label="分档名称">
				<template slot-scope="scope">
					{{scope.row.StallSchemeID| displayFilter(stallSchemeList,"SchemeID","StallSchemeName")}}
				</template>
			</el-table-column>
			<el-table-column slot="columnR">
				<template slot-scope="scope">
					<el-button size="small" type="text" @click="handleCopy(scope.row)">复制</el-button>
				</template>
			</el-table-column>
			<div slot="dialog" >
				<el-form :model="binGroupFormData" label-position="left" label-width="100px" style="width: 95%">
					<el-form-item label="名称">
						<el-input v-model="binGroupFormData.Name"></el-input>
					</el-form-item>
					<el-form-item label="编码">
						<el-input v-model="binGroupFormData.Code"></el-input>
					</el-form-item>
					<el-form-item label="分档名称">
						<el-select v-model="binGroupFormData.StallSchemeID" style="width: 100%">
							<el-option v-if="stallSchemeList.length>0"
												 v-for="item in stallSchemeList"
												 :key="item.SchemeID" :label="item.StallSchemeName" :value="item.SchemeID">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="binGroupEditSave">保存</el-button>
						<el-button @click="binGroupEditCancel">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</common-table>
		<el-dialog :visible.sync="copyDialogVisible" :before-close="copyCancel" append-to-body width="80%">
			<el-form :model="copyFormData" label-position="left" label-width="100px" style="width: 95%">
				<el-form-item label="来源bin盒分组">
					<el-select v-model="copyFormData.CopyBinGroupID" @change="copyBinGroupSelectChange" style="width: 100%">
						<el-option v-if="binGroupList.length>0"
											 v-for="item in binGroupList"
											 :key="item.BinGroupID" :label="item.Name" :value="item.BinGroupID">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button icon="el-icon-plus" size="small" style="float: right" @click="copyBinBoxAdd"></el-button>
					<common-table :data="copyFormData.BinBoxInfoList"
												:pagination="true" :page-size="5">
						<el-table-column slot="columnR" prop="BinCode" label="Bin盒">
							<template slot-scope="scope">
								<el-input v-if="scope.row.editable" v-model="scope.row.BinCode"></el-input>
								<span v-show="!scope.row.editable">{{ scope.row.BinCode }}</span>
							</template>
						</el-table-column>
						<el-table-column slot="columnR" prop="Type" label="类型">
							<template slot-scope="scope">
								<el-select v-if="scope.row.editable" v-model="scope.row.Type" @change="copyTypeSelectChange">
									<el-option v-if="binBoxTypeList.length>0"
														 v-for="item in binBoxTypeList"
														 :key="item.Name" :label="item.Description" :value="item.Name">
									</el-option>
								</el-select>
								<span v-show="!scope.row.editable">{{scope.row.Type| displayFilter(binBoxTypeList,"Name","Description")}}</span>
							</template>
						</el-table-column>
						<el-table-column slot="columnR" prop="Value" label="值">
							<template slot-scope="scope">
								<el-select v-if="scope.row.editable" v-model="scope.row.Value">
										<el-option v-if="copyBinBoxValueList.length>0"
															 v-for="item in copyBinBoxValueList"
															 :key="item.Value" :label="item.Description" :value="item.Value">
										</el-option>
								</el-select>
								<span v-show="!scope.row.editable">{{ scope.row.Value }}</span>
							</template>
						</el-table-column>
						<el-table-column slot="columnR" align="right" width="100px">
							<template slot-scope="scope">
								<el-button v-if="!scope.row.editable" size="small" type="text"
													 @click="copyBinBoxDelete(scope.row)">删除</el-button>
								<el-button v-if="scope.row.editable" size="small" type="text"
													 @click="copyBinBoxAddSave(scope.row)">保存</el-button>
								<el-button v-if="scope.row.editable" size="small" type="text"
													 @click="copyBinBoxAddCancel(scope.row)">取消</el-button>
							</template>
						</el-table-column>
					</common-table>
				</el-form-item>
				<el-form-item>
					<el-button @click="copySave">保存</el-button>
					<el-button @click="copyCancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";
	import C from "../common/About/c";
	export default {
		name: "binBoxInfoConfig",
		components: {C, CommonTable},
		data(){
			return{
				binBoxTypeList:[{ "Name": "Class", "Description": "档位" }, { "Name": "Grade", "Description": "等级" }, { "Name": "Color", "Description": "膜色" }],
				binBoxGradeList:[{ "Type": "Grade", "Value": "A", "Description": "A" }, { "Type": "Grade", "Value": "B", "Description": "B" }, { "Type": "Grade", "Value": "C", "Description": "C" }, { "Type": "Grade", "Value": "O", "Description": "O" }, { "Type": "Grade", "Value": "S", "Description": "S" }, { "Type": "Grade", "Value": "B+", "Description": "B+" }, { "Type": "Grade", "Value": "EL不良", "Description": "EL不良" }, { "Type": "Grade", "Value": "外观不良", "Description": "外观不良" }, { "Type": "Grade", "Value": "EL+外观全检", "Description": "EL+外观全检" }, { "Type": "Grade", "Value": "90BinEL不良", "Description": "90BinEL不良" }, { "Type": "Grade", "Value": "---", "Description": "---" }],
			  binBoxColorList:[{ "Type": "Color", "Value": "A", "Description": "A" }, { "Type": "Color", "Value": "B", "Description": "B" }, { "Type": "Color", "Value": "C", "Description": "C" }, { "Type": "Color", "Value": "D", "Description": "D" }, { "Type": "Color", "Value": "1", "Description": "1" }, { "Type": "Color", "Value": "2", "Description": "2" }, { "Type": "Color", "Value": "3", "Description": "3" }, { "Type": "Color", "Value": "4", "Description": "4" }, { "Type": "Color", "Value": "05", "Description": "05" }, { "Type": "Color", "Value": "---", "Description": "---" }],
				binBoxClassList:[],
				binBoxClassDataBase: { "StallCode": "---", "Effectiveness": "---", "Power": "---", "EtaBot": "---", "PmppBot": "---", "ClassBot": "---", "Type": "Class", "Description": "---/---/---/---/---/---", "Value": "---/---/---/---/---/---" },
				binGroupList:[],
				binGroupColumns:[{prop:"Name",label:"名称"},{prop:"Code",label:"编码"}],
				binGroupEditVisible:false,
				binGroupFormData:{},
				stallSchemeList:[],
				binBoxInfoColumns:[{prop:"BinCode",label:"bin盒"},{prop:"Value",label:"值"}],
				binBoxEditVisible:false,
				binBoxFormData:{},
				binBoxValueList:[],
				copyDialogVisible:false,
				copyFormData:{},
				copyBinBoxValueList:[],
			}
		},
		filters:{
			displayFilter,
		},
		asyncComputed:{
			async getBinBoxInfoData(){
				let fd = new FormData();
				fd.set('flag', 'getBinBoxInfoList');
				this.binGroupList= (await this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd)).data.RtnData;
			  return this.binGroupList;
			}
		},
		created(){
			this.getStallSchemeData();
			this.getBinBoxClassData();
		},
		methods:{
			getStallSchemeData() {
				let fd = new FormData();
				fd.set('flag', 'getStallSchemeListWithStallInfos');
				this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
					this.stallSchemeList=res.data;
				});
			},
			getBinBoxClassData() {
				let fd = new FormData();
				fd.set('flag', 'getBinBoxClassList');
				this.$axios.post('/mes/Service/StallInfoService.ashx', fd).then(res => {
					this.binBoxClassList=res.data;
				});
			},

			binGroupUpdate(row){
				this.binGroupFormData=row;
				this.binGroupEditVisible=true;
			},
			binGroupEditSave(){
				if (this.binGroupFormData.BinGroupID) {
					let fd = new FormData();
					fd.set('flag', 'modifyBinGroup');
					fd.set('binGroupInfo',JSON.stringify(this.binGroupFormData));
					this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							this.binGroupEditCancel();
							this.$asyncComputed.getBinBoxInfoData.update();
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
					fd.set('flag', 'addBinGroup');
					fd.set('binGroupInfo',JSON.stringify(this.binGroupFormData));
					this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							this.binGroupEditCancel();
							this.$asyncComputed.getBinBoxInfoData.update();
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
			binGroupEditCancel(){
				this.binGroupEditVisible=false;
				this.binGroupFormData = {};
			},
			binGroupDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteBinGroup');
					fd.set('binGroupId',row.BinGroupID);
					fd.set('isForce',false);
					this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							if (res.data.Message==""){
								this.$message({
									type: 'success',
									message: '删除成功！'
								});
								this.$asyncComputed.getBinBoxInfoData.update();
							}
							else {
								this.$confirm('确定强制删除？'+res.data.Message, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
								}).then(()=>{
									let fd = new FormData();
									fd.set('flag', 'deleteBinGroup');
									fd.set('binGroupId',row.BinGroupID);
									fd.set('isForce',true);
									this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
										if (res.data.Result){
											if (res.data.Message==""){
												this.$message({
													type: 'success',
													message: '删除成功！'
												});
												this.$asyncComputed.getBinBoxInfoData.update();
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

			typeSelectChange(val){
				this.binBoxValueList=[];
				switch (val) {
					case "Grade":
						this.binBoxValueList=this.binBoxGradeList;
						break;
					case "Color":
						this.binBoxValueList=this.binBoxColorList;
						break;
					case "Class":
						let valueList=[];
						for	(let i=0;i<this.binBoxClassList.length;i++){
							if(this.binBoxClassList[i].StallSchemeID === this.binBoxFormData.StallSchemeID){
								if (valueList.indexOf(this.binBoxClassList[i].Value)===-1){
									valueList.push(this.binBoxClassList[i].Value);
									this.binBoxValueList.push(this.binBoxClassList[i]);
								}
							}
						}
						this.binBoxValueList.unshift(this.binBoxClassDataBase);
						break;
				}
				this.$set(this.binBoxFormData,"Value",null);
			},
			binBoxAdd(stallSchemeID,binGroupID){
				this.binBoxEditVisible=true;
				this.binBoxFormData={StallSchemeID:stallSchemeID,BinGroupID:binGroupID};
			},
			binBoxUpdate(row){
				this.binBoxEditVisible=true;
				this.binBoxFormData=row;
				this.typeSelectChange(row.Type);
			},
			binBoxEditSave(){
				if (this.binBoxFormData.BinID) {
					let fd = new FormData();
					fd.set('flag', 'modifyBinBoxInfo');
					fd.set('binBoxInfo',JSON.stringify(this.binBoxFormData));
					this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							this.binBoxEditCancel();
							this.$asyncComputed.getBinBoxInfoData.update();
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
					fd.set('flag', 'addBinBoxInfo');
					fd.set('binBoxInfo',JSON.stringify(this.binBoxFormData));
					this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
						if (res.data.Result){
							this.binBoxEditCancel();
							this.$asyncComputed.getBinBoxInfoData.update();
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
			binBoxEditCancel(){
				this.binBoxEditVisible=false;
				this.binBoxFormData={};
				this.binBoxValueList=[];
			},
			binBoxDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=> {
					let fd = new FormData();
					fd.set('flag', 'deleteBinBoxInfo');
					fd.set('binId', row.BinID);
					this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
						if (res.data.Result) {
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
							this.$asyncComputed.getBinBoxInfoData.update();
						} else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					});
				});
			},

			handleCopy(row){
				this.copyDialogVisible=true;
				this.copyFormData={BinGroupID:row.BinGroupID};
			},
			copyBinGroupSelectChange(val){
				let group = this.binGroupList.find((item)=>{return item.BinGroupID===val;});
				if(group){
					this.copyFormData.BinBoxInfoList=group.BinBoxInfoList;
					this.copyFormData.StallSchemeID = group.StallSchemeID;
				}else {
					this.copyFormData.BinBoxInfoList =[];
				}
			},
			copyTypeSelectChange(val){
				this.copyBinBoxValueList=[];
				switch (val) {
					case "Grade":
						this.copyBinBoxValueList=this.binBoxGradeList;
						break;
					case "Color":
						this.copyBinBoxValueList=this.binBoxColorList;
						break;
					case "Class":
						let valueList=[];
						for	(let i=0;i<this.binBoxClassList.length;i++){
							if(this.binBoxClassList[i].StallSchemeID === this.copyFormData.StallSchemeID){
								if (valueList.indexOf(this.binBoxClassList[i].Value)===-1){
									valueList.push(this.binBoxClassList[i].Value);
									this.copyBinBoxValueList.push(this.binBoxClassList[i]);
								}
							}
						}
						this.copyBinBoxValueList.unshift(this.binBoxClassDataBase);
						break;
				}
			},
			copyBinBoxAdd(){
				this.copyFormData.BinBoxInfoList.unshift({editable:true});
			},
			copyBinBoxDelete(row){
				let index= this.copyFormData.BinBoxInfoList.indexOf(row);
				this.copyFormData.BinBoxInfoList.splice(index, 1);
			},
			copyBinBoxAddSave(row){
				this.copyFormData.BinBoxInfoList = this.copyFormData.BinBoxInfoList.map((item)=>{item.editable=false;return item;});
			},
			copyBinBoxAddCancel(row){
				let index= this.copyFormData.BinBoxInfoList.indexOf(row);
				this.copyFormData.BinBoxInfoList.splice(index, 1);
			},
			copySave(){
				let fd = new FormData();
				fd.set('flag', 'addBinBoxInfoList');
				fd.set('binGroupId',this.copyFormData.BinGroupID);
				fd.set('binBoxInfoList',JSON.stringify(this.copyFormData.BinBoxInfoList));
				this.$axios.post('/mes/Service/BinBoxInfoService.ashx', fd).then(res => {
					if (res.data.Result){
						this.copyCancel();
						this.$asyncComputed.getBinBoxInfoData.update();
						this.$message({
							type: 'success',
							message: '复制成功！'
						});

					}else {
						this.$message({
							type: 'error',
							message: res.data.Message,
							showClose: true,
						});
					}
				})
			},
			copyCancel(){
				this.copyDialogVisible=false;
				this.copyFormData={};
			},
		}
	}
</script>

<style scoped>

</style>