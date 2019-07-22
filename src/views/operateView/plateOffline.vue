<template>
	<div>
		<el-tabs type="border-card" v-model="tabName" @tab-click="handleTabClick">
			<el-tab-pane label="网版下线验证" name="verify">
				<div>
					<el-form :model="plateOfflineFormData" label-position="left" label-width="100px">
						<el-row :gutter="20">
							<el-col span="8">
								<el-form-item label="物料编码">
									<el-input v-model="plateOfflineFormData.MaterialNo"></el-input>
								</el-form-item>
							</el-col>
							<el-col span="8">
								<el-form-item label="物料标签">
									<el-input v-model="plateOfflineFormData.MaterialTagNo"></el-input>
								</el-form-item>
							</el-col>
							<el-col span="8">
								<el-form-item label="批次号">
									<el-input v-model="plateOfflineFormData.BatchNo"></el-input>
								</el-form-item>
							</el-col>
							<el-col span="8">
								<el-form-item label="工号">
									<el-input v-model="plateOfflineFormData.OperatorID"></el-input>
								</el-form-item>
							</el-col>
							<el-col span="8">
								<el-form-item label="下线原因">
									<el-select v-model="plateOfflineFormData.Reason" placeholder="请选择"
														 @change="verifyReasonSelectChange" style="width: 100%">
										<el-option v-if="reasonParentData.length>0"
															 v-for="item in reasonParentData"
															 :key="item.ErrorCodeName" :label="item.ErrorCodeName" :value="item.ErrorCodeName">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col span="8">
								<el-form-item label="原因描述">
									<el-select v-model="plateOfflineFormData.ReasonDesc" placeholder="请选择"
														 @change="verifyReasonDescSelectChange" style="width: 100%">
										<el-option v-if="reasonDescData.length>0"
															 v-for="item in reasonDescData"
															 :key="item.ErrorCodeName" :label="item.ErrorCodeName" :value="item.ErrorCodeName">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col span="8">
								<el-form-item>
								<el-button @click="plateOfflineSubmit">提交</el-button>
							</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<span>历史记录</span>
					<el-divider></el-divider>
					<fr-date-time-picker v-model="date"/>
<!--					<time-query-form :queryFormData="queryFormData" @query="getPlateOfflineHistoryData"></time-query-form>-->
					<el-table :data="getPageTableData(plateOfflineTableData)">
						<el-table-column prop="MaterialNo" label="物料编码"></el-table-column>
						<el-table-column prop="MaterialTagNo" label="物料标签"></el-table-column>
						<el-table-column prop="BatchNo" label="批次号"></el-table-column>
						<el-table-column prop="WorkOrderNO" label="工单号"></el-table-column>
						<el-table-column prop="WorkMachineID" label="机器"></el-table-column>
						<el-table-column prop="OnlineTime" label="上线时间" :formatter="columnDateFormat"></el-table-column>
						<el-table-column prop="OfflineTime" label="下线时间" :formatter="columnDateFormat"></el-table-column>
						<el-table-column prop="Reason" label="下线原因分类"></el-table-column>
						<el-table-column prop="ReasonDesc" label="下线原因描述"></el-table-column>
						<el-table-column prop="Operator" label="工号"></el-table-column>
						<el-table-column prop="Product" label="印刷量"></el-table-column>
					</el-table>
					<el-pagination :total="plateOfflineTableData?plateOfflineTableData.length:0"
												 @current-change="currentPageChange"
												 :current-page.sync="currentPage"
												 layout="total, prev, pager, next" :hide-on-single-page=true>
					</el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="网版下线原因" name="reason">
				<div>
					<el-form ref="reasonFormData" :model="reasonFormData" label-position="left" label-width="100px">
						<el-row :gutter="20">
							<el-col span="12">
								<el-form-item label="原因类别" prop="reason">
								<el-select v-model="reasonFormData.Reason" filterable allow-create clearable
													 placeholder="请选择" @change="reasonValueChange" @clear="reasonValueClear"
													 style="width: 100%">
									<el-option v-if="reasonParents.length>0"
														 v-for="item in reasonParents"
														 :key="item" :label="item" :value="item">
									</el-option>
								</el-select>
							</el-form-item>
							</el-col>
							<el-col span="12">
								<el-form-item label="类别编码" prop="reasonCode">
									<el-input v-model="reasonFormData.ReasonCode" :disabled="reasonCodeDisabled"></el-input>
								</el-form-item>
							</el-col>
							<el-col span="12">
								<el-form-item label="原因描述" prop="reasonDesc">
									<el-input v-model="reasonFormData.ReasonDesc"></el-input>
								</el-form-item>
							</el-col>
							<el-col span="12">
								<el-form-item label="描述编码" prop="descCode">
									<el-input v-model="reasonFormData.DescCode"></el-input>
								</el-form-item>
							</el-col>
							<el-col>
								<el-form-item>
									<el-checkbox v-model="reasonFormData.IsConsume">是否计入消耗</el-checkbox>
								</el-form-item>
								<el-form-item>
									<el-button @click="addPlateOfflineReason">提交</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<el-divider></el-divider>
					<el-table :data="reasonTableData" row-key="ErrorCodeID" lazy :load="reasonChildrenLoad"
										:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<el-table-column prop="ErrorCodeName" label="原因"></el-table-column>
						<el-table-column prop="ErrorCode" label="编码"></el-table-column>
						<el-table-column prop="IsConsume" label="是否计入消耗">
							<template slot-scope="scope" v-if="scope.row.ParentID!=0">
								<el-checkbox v-model="scope.row.IsConsume"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column align="right">
						<template slot-scope="scope">
							<el-button
									size="mini"
									@click="reasonEditPop(scope.$index, scope.row)">编辑</el-button>
							<el-button
									size="mini"
									type="danger"
									@click="reasonDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
					</el-table>
					<el-dialog :visible.sync="reasonEditVisible" :before-close="reasonEditCancel">
						<el-form :model="reasonEditFormData" label-position="left" label-width="100px"
										 style="width: 95%">
							<el-form-item label="原因">
								<el-input v-model="reasonEditFormData.ErrorCodeName"></el-input>
							</el-form-item>
							<el-form-item label="编码">
								<el-input v-model="reasonEditFormData.ErrorCode"></el-input>
							</el-form-item>
							<el-form-item label="原因分类" v-if="reasonEditFormData.ParentID!=0">
								<el-select v-model="reasonEditFormData.ParentID"style="width: 100%">
									<el-option v-if="reasonParentData.length>0"
														 v-for="item in reasonParentData"
														 :key="item.ErrorCodeID" :label="item.ErrorCodeName" :value="item.ErrorCodeID">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="reasonEditFormData.ParentID!=0">
								<el-checkbox v-model="reasonEditFormData.IsConsume">是否计入消耗</el-checkbox>
							</el-form-item>
							<el-form-item>
								<el-button @click="reasonEditSave">保存</el-button>
								<el-button @click="reasonEditCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</el-dialog>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import TimeQueryForm from "@/views/common/commonComponent/timeQueryForm";
	import FrDateTimePicker from "../../components/frog-ui/dateTimePicker/dateTimePicker";
	export default {
		name: "plateOffline",
		components:{FrDateTimePicker, TimeQueryForm},
		data(){
			return {
				date:[new Date(),new Date()],
				tabName:"verify",
				currentPage:1,
				pageSize:10,
				plateOfflineFormData: {
					MaterialNo: "", MaterialTagNo: "", BatchNo: "", OperatorID: "",
					Reason: "", ReasonDesc: "",IsConsume:false
				},
				queryFormData:{
					BeginTime:"",EndTime:""
				},
				plateOfflineTableData:[],
				reasonFormData:{
					Reason:"",ReasonCode:"",ReasonDesc:"",DescCode:"",IsConsume:true,
				},
				reasonParents:[],
				reasonParentData:[],
				reasonData:[],
				reasonCodeDisabled:true,
				reasonDescData:[],
				reasonTableData:[],
				reasonEditVisible:false,
				reasonEditFormData:{
					"ErrorCodeName":"","ErrorCode":"","ParentID":"","IsConsume":"",DefectGrade:0
				},
			}
		},
		created(){
			this.getPlateOfflineReasonData();
			this.showTab();
		},
		methods:{
			showTab(){
				switch (this.tabName) {
					case "verify":
						this.getShiftInfo();
						break;
					case "reason":
						break;
				}
			},
			handleTabClick(tab) {
				this.tabName = tab.name;
				this.showTab();
				this.currentPage=1;
			},
			getPlateOfflineHistoryData(){
				let fd = new FormData();
				fd.set('flag', 'getPlateOfflineHistory');
				fd.set('beginTime',this.common.datetimeFormat(this.queryFormData.BeginTime));
				fd.set('endTime',this.common.datetimeFormat(this.queryFormData.EndTime));
				this.$axios.post('/api/Service/TraceabilityObjectService.ashx', fd).then(res => {
					this.plateOfflineTableData = res.data;
				})
			},
			getPlateOfflineReasonData(){
				let fd = new FormData();
				fd.set('flag', 'getPlateOfflineReasonList');
				this.$axios.post('/api/Service/ErrorCodeService.ashx', fd).then(res => {
					this.reasonData = res.data;
					this.reasonParentData = this.reasonData.filter(function (item) {
						if (item.ParentID == 0) {
							return item;
						}
					});
					this.reasonParents= this.reasonParentData.map(function (item) {
						return item.ErrorCodeName;
					});
					let parentErrorCodeIds= this.reasonData.map(function (item) {
						return item.ParentID;
					});
					let parentReasonList = [];
					for (let i=0;i<this.reasonParentData.length;i++){
						let temp=this.reasonParentData[i];
					 if (parentErrorCodeIds.indexOf(temp.ErrorCodeID) > -1) {
					 	 temp["hasChildren"]=true;
					 }
					 parentReasonList.push(temp);
					}
					this.reasonTableData = parentReasonList;
				})
			},
			reasonValueChange(val){
				if (val) {
					let find = this.reasonParentData.find(function (item) { return item.ErrorCodeName == val; });
					if (find) {
						this.reasonFormData.ReasonCode=find.ErrorCode;
						this.reasonCodeDisabled = true;
					} else {
						this.reasonCodeDisabled = false;
					}
				} else {
				this.reasonCodeDisabled = true;
				}
			},
			reasonValueClear(){
				this.reasonFormData.ReasonCode="";
				this.reasonCodeDisabled=true;
			},
			addPlateOfflineReason() {
				if (!this.reasonFormData.Reason) {
					this.$message({
						type: 'warning',
						message: '请选择或输入原因类别！'
					});
					return;
				}
				if (!this.reasonFormData.ReasonCode) {
					this.$message({
						type: 'warning',
						message: '请选择或输入类别编码！'
					});
					return;
				}
				if (!this.reasonFormData.ReasonDesc) {
					this.$message({
						type: 'warning',
						message: '请输入原因描述！'
					});
					return;
				}
				if (!this.reasonFormData.DescCode) {
					this.$message({
						type: 'warning',
						message: '请输入描述编码！'
					});
					return;
				}
				if (this.reasonFormData.ReasonCode == this.reasonFormData.DescCode) {
					this.$message({
						type: 'warning',
						message: '编码重复！'
					});
					return;
				}
				let isConsume = 0;
				if (this.reasonFormData.IsConsume == true) {
					isConsume = 1;
				}
				let fd = new FormData();
				fd.set('flag', 'addPlateOfflineReason');
				fd.set('reason', this.reasonFormData.Reason);
				fd.set('reasonCode', this.reasonFormData.ReasonCode);
				fd.set('reasonDesc', this.reasonFormData.ReasonDesc);
				fd.set('descCode', this.reasonFormData.DescCode);
				fd.set('isConsume', isConsume);
				this.$axios.post('/api/Service/ErrorCodeService.ashx', fd).then(res => {
					if (res.data == "success") {
						this.reasonFormData = {
							Reason: "", ReasonCode: "", ReasonDesc: "", DescCode: "", IsConsume: true,
						};
						this.getPlateOfflineReasonData();
						this.$message({
							type: 'success',
							message: '添加成功！'
						});
					} else {
						this.$message({
							type: 'error',
							message: res.data,
							showClose: true,
						});
					}
				})
			},
			verifyReasonSelectChange(val) {
				if (val) {
					let find = this.reasonParentData.find(function (item) { return item.ErrorCodeName == val; });
					if (find) {
						this.reasonDescData = this.reasonData.filter(function (item) {
							if (item.ParentID == find.ErrorCodeID) {
								return item;
							}
						});
					} else {
						this.reasonDescData = [];
					}
				} else {
					this.reasonDescData = [];
				}
				this.plateOfflineFormData.ReasonDesc="";
				this.plateOfflineFormData.IsConsume=false;
			},
			verifyReasonDescSelectChange(val){
				if (val) {
					let find = this.reasonDescData.find(function (item) { return item.ErrorCodeName == val; });
					if (find) {
					this.plateOfflineFormData.IsConsume=find.IsConsume;
					} else {
						this.plateOfflineFormData.IsConsume=false;
					}
				} else {
					this.plateOfflineFormData.IsConsume=false;
				}
			},
			plateOfflineSubmit(){
				if (!this.plateOfflineFormData.MaterialNo) {
					this.$message({
						type: 'warning',
						message: '请输入物料号！'
					});
					return;
				}
				if (!this.plateOfflineFormData.MaterialTagNo) {
					this.$message({
						type: 'warning',
						message: '请输入物料标签号！'
					});
					return;
				}
				if (!this.plateOfflineFormData.BatchNo) {
					this.$message({
						type: 'warning',
						message: '请输入批次号！'
					});
					return;
				}
				if (!this.plateOfflineFormData.OperatorID) {
					this.$message({
						type: 'warning',
						message: '请输入工号！'
					});
					return;
				}
				if (!this.plateOfflineFormData.Reason) {
					this.$message({
						type: 'warning',
						message: '请选择原因分类！'
					});
					return;
				}
				if (!this.plateOfflineFormData.ReasonDesc) {
					this.$message({
						type: 'warning',
						message: '请选择原因描述！'
					});
					return;
				}
				let fd = new FormData();
				fd.set('flag', 'plateOffline');
				fd.set('materialNo', this.plateOfflineFormData.MaterialNo);
				fd.set('materialTagNo', this.plateOfflineFormData.MaterialTagNo);
				fd.set('batchNo', this.plateOfflineFormData.BatchNo);
				fd.set('reason', this.plateOfflineFormData.Reason);
				fd.set('reasonDesc', this.plateOfflineFormData.ReasonDesc);
				fd.set('operatorID', this.plateOfflineFormData.OperatorID);
				fd.set('isConsume', this.plateOfflineFormData.IsConsume);
				this.$axios.post('/api/Service/TraceabilityObjectService.ashx', fd).then(res => {
					if (res.data == "success") {
						this.plateOfflineFormData = {
							MaterialNo: "", MaterialTagNo: "", BatchNo: "", OperatorID: "",
							Reason: "", ReasonDesc: "",IsConsume:false
						};
						this.$message({
							type: 'success',
							message: '添加成功！'
						});
					} else {
						this.$message({
							type: 'error',
							message: res.data,
							showClose: true,
						});
					}
				})
			},
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
				this.$axios.post('/api/Service/ShiftInfoService.ashx', fd).then(res => {
					this.date[0]=res.data.ShiftBegTime;
					this.date[1]=res.data.ShiftEndTime;
				})
			},
			reasonChildrenLoad(tree, treeNode, resolve){
				let children=this.reasonData.filter(function (item) {
					if (item.ParentID == tree.ErrorCodeID){
						return item;
					}
				});
				setTimeout(() => {resolve(children)}, 1000)
			},
			reasonEditPop(index, row){
				this.reasonEditVisible=true;
				this.reasonEditFormData=row;
			},
			reasonEditSave(){
				if (this.reasonEditFormData.IsConsume){
					this.reasonEditFormData.DefectGrade=1;
				} else {this.reasonEditFormData.DefectGrade=0;}
				let fd = new FormData();
				fd.set('flag', 'modifyPlateOfflineReason');
				fd.set('detailData',JSON.stringify(this.reasonEditFormData));
				this.$axios.post('/api/Service/ErrorCodeService.ashx', fd).then(res => {
					if (res.data=='success'){
						this.reasonEditCancel();
						this.$message({
							type: 'success',
							message: '修改成功！'
						});
						this.getPlateOfflineReasonData();
					}else {
						this.$message({
							type: 'error',
							message: res.data,
							showClose: true,
						});
					}
				})
			},
			reasonEditCancel(){
				this.reasonEditVisible=false;
				this.reasonEditFormData={
					"ErrorCodeName":"","ErrorCode":"","ParentID":"","IsConsume":"","DefectGrade":0
				};
			},
			reasonDelete(index,row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deletePlateOfflineReason');
					fd.set('detailId',row.ErrorCodeID);
					this.$axios.post('/api/Service/ErrorCodeService.ashx', fd).then(res => {
						if (res.data=='success'){
							this.$message({
								type: 'info',
								message: '删除成功！'
							});
							this.getPlateOfflineReasonData();
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
			currentPageChange(val){
				this.currentPage = val;
			},
			getPageTableData(tableData){
			return 	tableData? tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) : [];
			},
			columnDateFormat(row, column, cellValue) {
				return this.common.datetimeFormat(cellValue);
			},
		}
	}
</script>

<style scoped>
</style>