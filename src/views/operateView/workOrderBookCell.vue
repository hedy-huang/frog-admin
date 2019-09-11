<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="当前班次" name="Current">
				<div>
					<el-form :model="addFormData" label-position="left" label-width="100px">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="部门">
									<el-select v-model="addFormData.AreaID" @change="areaChange" style="width: 100%">
										<el-option v-if="areaList.length>0"
															 v-for="item in areaList"
															 :key="item.AreaID" :label="item.DisplayName" :value="item.AreaID">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="工单">
									<el-select v-model="addFormData.WorkOrderID" filterable @change="workOrderChange" style="width: 100%">
										<el-option v-if="workOrderAreaList.length>0"
															 v-for="item in workOrderAreaList"
															 :key="item.WorkOrderID" :label="item.WorkOrderNO" :value="item.WorkOrderID">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="班组">
									<el-select v-model="addFormData.ShiftClass" style="width: 100%">
										<el-option v-if="shiftClassList.length>0"
															 v-for="item in shiftClassList"
															 :key="item" :label="item" :value="item">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="报工时间">
									<el-date-picker v-model="addFormData.BookDate" type="datetime" style="width:100%"
																	:clearable="false" @change="bookDateChange"></el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="班次">
									<el-input v-model="addFormData.Shift" readonly></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<h4>当班报工</h4>
					<el-divider></el-divider>
					<common-table :data="getWorkOrderBookCellData" :columns="sumColumns"></common-table>
					<h4>新增报工</h4>
					<el-divider></el-divider>
					<el-table :data="getAddWorkCellData" ref="bookTable">
						<el-table-column prop="SapCellName" label="工艺段"></el-table-column>
						<el-table-column prop="IncomeMaterial" label="来料">
							<template slot-scope="scope">
								<el-input v-model="scope.row.IncomeMaterial" type="number" :min="0"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="Input" label="投入">
							<template slot-scope="scope">
								<el-input v-model="scope.row.Input" type="number" :min="0"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="Product" label="产出">
							<template slot-scope="scope">
								<el-input v-model="scope.row.Product" type="number" :min="0"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="Chip" label="碎片">
							<template slot-scope="scope">
								<el-input v-model="scope.row.Chip" type="number" :min="0"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="Reprocess" label="不良">
							<template slot-scope="scope">
								<el-input v-model="scope.row.Reprocess" type="number" :min="0"></el-input>
							</template>
						</el-table-column>
					</el-table>
					<el-button size="small" @click="bookSubmit">提交</el-button>
					<el-button size="small" @click="bookCancel">取消</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane label="历史数据" name="History">
				<div>
					<el-form :model="queryFormData" label-position="left" label-width="100px">
						<el-row :gutter="20">
							<el-col :span="24">
								<el-form-item label="查询方式">
									<el-radio-group v-model="queryType" @change="queryTypeChange">
										<el-radio label="byTime">按时间</el-radio>
										<el-radio label="byWorkOrder">按工单</el-radio>
										<el-radio label="byAll">按工单和时间</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="工单" v-if="workOrderVisible">
									<el-select v-model="queryFormData.WorkOrderNO" filterable>
										<el-option v-if="workOrderList.length>0"
															 v-for="item in workOrderList"
															 :key="item.WorkOrderNO" :label="item.WorkOrderNO" :value="item.WorkOrderNO">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="开始时间" v-if="timeVisible">
									<el-date-picker v-model="queryFormData.BeginTime" type="datetime">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="结束时间" v-if="timeVisible">
									<el-date-picker v-model="queryFormData.EndTime" type="datetime">
									</el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<el-divider></el-divider>
					<common-table :data="getWorkOrderBookData" :show-header="false">
						<el-table-column slot="expand" type="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.List" :columns="historyColumns"
															:pagination="true">
									<el-table-column slot="expand" type="expand">
										<template slot-scope="scope">
											<common-table :data="scope.row.DetailList" :columns="detailColumns"
																		:pagination="true" :page-size="5">
												<el-table-column slot="columnR" prop="Flag" label="报工状态">
													<template slot-scope="scope">
														{{scope.row.Flag|displayFilter(workOrderBookFlagList,"id","text")}}
													</template>
												</el-table-column>
												<el-table-column slot="columnR" align="right" width="100px">
													<template slot-scope="scope">
														<el-button v-if="scope.row.Flag===2"
																			 size="small" type="text"
																			 @click="workOrderBookUpdate(scope.$index, scope.row)">编辑</el-button>
														<el-button v-if="scope.row.Flag===2 && scope.row.RevocationStatus !=1"
																			 size="small" type="text"
																			 @click="workOrderBookDelete(scope.$index, scope.row)">删除</el-button>
													</template>
												</el-table-column>
											</common-table>
											<el-dialog :visible.sync="bookEditVisible" :before-close="workOrderBookEditCancel" width="90%" append-to-body>
												<el-form :model="bookEditFormData" label-position="left" label-width="100px" style="width: 95%">
													<el-form-item label="来料">
														<el-input v-model="bookEditFormData.IncomeMaterial" type="number" :min="0"></el-input>
													</el-form-item>
													<el-form-item label="投入">
														<el-input v-model="bookEditFormData.Input" type="number" :min="0"></el-input>
													</el-form-item>
													<el-form-item label="产出">
														<el-input v-model="bookEditFormData.Product" type="number" :min="0"></el-input>
													</el-form-item>
													<el-form-item label="碎片">
														<el-input v-model="bookEditFormData.Chip" type="number" :min="0"></el-input>
													</el-form-item>
													<el-form-item label="不良">
														<el-input v-model="bookEditFormData.Reprocess" type="number" :min="0"></el-input>
													</el-form-item>
													<el-form-item>
														<el-button @click="workOrderBookEditSave">保存</el-button>
														<el-button @click="workOrderBookEditCancel">取消</el-button>
													</el-form-item>
												</el-form>
											</el-dialog>
										</template>
									</el-table-column>
								</common-table>
							</template>
						</el-table-column>
						<el-table-column slot="columnL" prop="AreaName">
							<template slot-scope="scope">
								工艺段：{{scope.row.AreaName}}
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
		name: "workOrderBookCell",
		components: {CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			return{
				tabName:"Current",
				areaList:[],
				workOrderList:[],
				workOrderAreaList:[],
				shiftClassList:['A','B','C'],
				shiftData:{},
				addFormData:{},
				sumColumns:[{prop:"WorkCellName",label:"工艺段"},{prop:"BeforeShiftWIP",label:"班前在制"},
					{prop:"IncomeMaterial",label:"来料"},{prop:"Input",label:"投入"},
					{prop:"Product",label:"产出"},{prop:"Chip",label:"碎片"},
					{prop:"Reprocess",label:"不良"},{prop:"AfterShiftWIP",label:"班后在制"}],
				queryType:"byTime",
				queryFormData:{},
				timeVisible:true,
				workOrderVisible:false,
				historyColumns:[{prop:"SapCellName",label:"工艺段"},{prop:"IncomeMaterial",label:"来料"},
					{prop:"Input",label:"投入"},{prop:"Product",label:"产出"},
					{prop:"Chip",label:"碎片"},{prop:"Reprocess",label:"不良"}],
				detailColumns:[{prop:"WorkOrderNO",label:"工单号"},{prop:"IncomeMaterial",label:"来料"},
					{prop:"Input",label:"投入"},{prop:"Product",label:"产出"},
					{prop:"Chip",label:"碎片"},{prop:"Reprocess",label:"不良"},
					{prop:"BookDate",label:"报工时间",type:"datetime"},{prop:"ShiftTime",label:"班次"},
					{prop:"Shift",label:"班组"}],
				workOrderBookFlagList : [{ id: 0, text: '已提交' }, { id: 1, text: '报工完成' },
					{ id: 2, text: '未提交' }, { id: 3, text: '报工失败' }],
				bookEditVisible:false,
				bookEditFormData: {},
			}
		},
		asyncComputed: {
			async getWorkOrderBookCellData() {
				if (this.addFormData.WorkOrderNO) {
					let fd = new FormData();
					fd.set('flag', 'getWorkOrderBookCellList');
					fd.set('workOrderNo', this.addFormData.WorkOrderNO);
					fd.set('beginTime', this.common.datetimeFormat(this.addFormData.ShiftBegTime));
					fd.set('endTime', this.common.datetimeFormat(this.addFormData.ShiftEndTime));
					let result = (await this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd)).data;
					if (result) {
						return result;
					}
				}
				return [];
			},
			async getAddWorkCellData() {
				if (this.addFormData.WorkOrderNO) {
					let fd = new FormData();
					fd.set('flag', 'getBookWorkCellList');
					fd.set('workOrderNo', this.addFormData.WorkOrderNO);
					fd.set('routeId', this.addFormData.RouteID);
					fd.set('lineId', this.addFormData.LineID);
					return (await this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd)).data.RtnData;
				}
				return [];
			},
			async getWorkOrderBookData() {
				if ((this.queryType === 'byWorkOrder' || this.queryType === 'byAll') && !this.queryFormData.WorkOrderNO) {
					return [];
				}
				let fd = new FormData();
				fd.set('flag', 'getWorkOrderBooks');
				fd.set('areaIds', '[]');
				fd.set('beginTime', this.queryType === 'byWorkOrder' ? '' : this.common.datetimeFormat(this.queryFormData.BeginTime));
				fd.set('endTime', this.queryType === 'byWorkOrder' ? '' : this.common.datetimeFormat(this.queryFormData.EndTime));
				fd.set('workOrderNo', this.queryType === 'byTime' ? '' : this.queryFormData.WorkOrderNO);
				let list = (await this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd)).data;
				return this.common.groupData(list,'AreaName');
			},
		},
		created(){
			this.getAreaData();
			this.getWorkOrderData();
			this.getShiftInfo(new Date());
		},
		methods:{
			getAreaData(){
				let fd = new FormData();
				fd.set('flag', 'getAreaList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
				 this.areaList=res.data;
				})
			},
			getWorkOrderData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkOrderListToWorkOrderBook');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					this.workOrderList=res.data;
					this.workOrderAreaList=res.data;
				})
			},
			getShiftInfo(date){
				this.$set(this.addFormData,'BookDate',date);
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(this.addFormData.BookDate));
				this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
					this.$set(this.addFormData,'ShiftBegTime',res.data.ShiftBegTime);
					this.$set(this.addFormData,'ShiftEndTime',res.data.ShiftEndTime);
					this.$set(this.addFormData,'ShiftClass',res.data.ClassCode);
					this.$set(this.addFormData,'Shift',res.data.ShiftName);
					this.$set(this.queryFormData,'BeginTime',res.data.ShiftBegTime);
					this.$set(this.queryFormData,'EndTime',res.data.ShiftEndTime);
				})
			},
			areaChange(val){
				this.workOrderAreaList = this.workOrderList.filter((item)=> { return item.FactoryID === val; });
				if (this.addFormData.WorkOrderID){
					this.$set(this.addFormData,'WorkOrderID',null);
					this.$set(this.addFormData,'WorkOrderNO',null);
					this.$set(this.addFormData,'RouteID',null);
					this.$set(this.addFormData,'LineID',null);
					this.$set(this.queryFormData,'WorkOrderNO',null);
				}
			},
			workOrderChange(val){
				let select = this.workOrderList.find((item)=> { return item.WorkOrderID === val; });
				if (select){
					this.$set(this.addFormData,'AreaID',select.FactoryID);
					this.$set(this.addFormData,'WorkOrderNO',select.WorkOrderNO);
					this.$set(this.addFormData,'RouteID',select.RouteID);
					this.$set(this.addFormData,'LineID',select.InputMachine);
					this.$set(this.queryFormData,'WorkOrderNO',select.WorkOrderNO);
					this.workOrderAreaList = this.workOrderList.filter((item)=> { return item.FactoryID === select.FactoryID; });
				}else {
					this.$set(this.addFormData,'AreaID',null);
				}
			},
			bookDateChange(val){
				this.getShiftInfo(val);
			},
			bookSubmit(){
				if (this.addFormData.BookDate>new Date()){
					this.$message({
						type: 'warning',
						message: "报工时间不能超过当前时间",
						showClose: true,
					});
					return;
				}
				let source = this.$refs.bookTable.data;
				let info = [];
				for (let i = 0; i < source.length; i++) {
					let book = source[i];
					if (book.IncomeMaterial > 0 || book.Input > 0 || book.Product > 0 || book.Chip > 0 || book.Reprocess > 0) {
						if (!book.SapCellID) {
							this.$message({
								type: 'warning',
								message: book.SapCellName + "工作中心数据异常,请检查",
								showClose: true,
							});
							return;
						}
						book["BookDate"] = this.common.datetimeFormat(this.addFormData.BookDate);
						book["ShiftTime"] = this.addFormData.Shift;
						book["Shift"] = this.addFormData.ShiftClass;
						book["OperatorID"] = '';
						book["ShiftBegTime"] = this.addFormData.ShiftBegTime;
						if (!book.IncomeMaterial) { book.IncomeMaterial = 0; }
						if (!book.Input) { book.Input = 0; }
						if (!book.Product) { book.Product = 0; }
						if (!book.Chip) { book.Chip = 0; }
						if (!book.Reprocess) { book.Reprocess = 0; }
						info.push(book);
					}
				}
				if (info.length == 0) {
					this.$message({
						type: 'warning',
						message: "当前无数据提交",
						showClose: true,
					});
					return;
				}
				let fd = new FormData();
				fd.set('flag', 'addWorkOrderBookList');
				fd.set('bookList', JSON.stringify(info));
				this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
					if (res.data==='success') {
						this.$asyncComputed.getWorkOrderBookCellData.update();
						this.$asyncComputed.getAddWorkCellData.update();
						this.$message({
							type: 'success',
							message: '提交成功！'
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
			bookCancel(){
				this.$asyncComputed.getAddWorkCellData.update();
			},
			queryTypeChange(val){
				switch (val) {
					case "byTime":
						this.timeVisible=true;
						this.workOrderVisible=false;
						break;
					case "byWorkOrder":
						this.timeVisible=false;
						this.workOrderVisible=true;
						break;
					case "byAll":
						this.timeVisible=true;
						this.workOrderVisible=true;
						break;
				}
			},
			workOrderBookUpdate(index,row){
				this.bookEditVisible=true;
				this.bookEditFormData=row;
			},
			workOrderBookEditSave(){
				let fd = new FormData();
				fd.set('flag', 'updateWorkOrderBook');
				fd.set('info', JSON.stringify(this.bookEditFormData));
				this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
					if (res.data==='success') {
						this.$asyncComputed.getWorkOrderBookData.update();
						this.workOrderBookEditCancel();
						this.$message({
							type: 'success',
							message: '修改成功！'
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
			workOrderBookEditCancel(){
				this.bookEditVisible=false;
				this.bookEditFormData={};
			},
			workOrderBookDelete(index,row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'delWorkOrderBook');
					fd.set('bookId',row.ID);
					this.$axios.post('/mes/Service/TraceabilityObjectService.ashx', fd).then(res => {
						if (res.data==='success'){
							this.$asyncComputed.getWorkOrderBookData.update();
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