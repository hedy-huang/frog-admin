<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="浆料报工" name="SizeBook">
				<div>
					<el-form :model="bookFormData" label-position="left" label-width="100px">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="物料编码">
									<el-input v-model="bookFormData.MaterialNo"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="物料标签">
									<el-input v-model="bookFormData.MaterialTagCode" @keyup.enter.native="getPartSizeBookList"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="批次号">
									<el-input v-model="bookFormData.LotNumber"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="工单">
									<el-select v-model="bookFormData.WorkOrderNO" style="width: 100%">
										<el-option v-if="workOrderList.length>0"
															 v-for="item in workOrderList"
															 :key="item.WorkOrderNO" :label="item.WorkOrderNO" :value="item.WorkOrderNO">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="净重">
									<el-input v-model="bookFormData.NetWeight"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item>
									<el-button size="small" @click="submitAfterQuantity">提交</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<el-divider></el-divider>
					<common-table :data="sizeBookTableData" :columns="sizeBookColumns"
												:pagination="true"></common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="报工历史" name="History">
				<div>
					<time-query-form :query-form-data="queryFormData"></time-query-form>
					<common-table :data="getSizeBookHistoryData" :columns="historyColumns"
												:pagination="true"></common-table>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	import TimeQueryForm from "../common/commonComponent/timeQueryForm";
	export default {
		name: "sizeBook",
		components: {TimeQueryForm, CommonTable},
		data(){
			return {
				tabName:"SizeBook",
				bookFormData:{},
				sizeBookTableData:[],
				sizeBookColumns:[{prop:"InternalPartNo",label:"物料编码"},{prop:"PartName",label:"物料名称"},
					{prop:"PartLotNumber",label:'批次号'},{prop:"Supplier",label:"供应商"},
					{prop:"MaterialTagCode",label:"标签号"},{prop:"WorkOrderNO",label:"工单号"},
					{prop:"RequireQuantity",label:"需求数量"},{prop:"ConsumptionQuantity",label:"单个用量"},
					{prop:"VerifyTime",label:"上线验证时间",type:"datetime"}],
				workOrderList:[],
				queryFormData:{BeginTime:new Date(),EndTime:new Date()},
				historyColumns:[{prop:"WorkOrderNo",label:"工单号"},{prop:"BatchNo",label:"物料标签"},
					{prop:"InternalPartNo",label:"物料编码"},{prop:"Quantity",label:"Quantity"},
					{prop:"AfterQuantity",label:"AfterQuantity"},{prop:"UseQuantity",label:"UseQuantity"},
					{prop:"Result",label:"报工结果"},{prop:"BookTime",label:"报工时间",type:"datetime"}],
			}
		},
		asyncComputed:{
			async getSizeBookHistoryData(){
				let fd = new FormData();
				fd.set('flag', 'getSizeBookhistoryList');
				fd.set('beginTime',this.common.datetimeFormat(this.queryFormData.BeginTime));
				fd.set('endTime',this.common.datetimeFormat(this.queryFormData.EndTime));
				return (await this.$axios.post('/mes/Service/SizeBookService.ashx', fd)).data.RtnData;
			},
		},
		created(){
			this.getShiftInfo();
		},
		methods:{
			getShiftInfo(){
				let fd = new FormData();
				fd.set('flag', 'getShiftInfoBySearchTime');
				fd.set('searchTime',this.common.datetimeFormat(new Date()));
				this.$axios.post('/mes/Service/ShiftInfoService.ashx', fd).then(res => {
					this.queryFormData.BeginTime=res.data.ShiftBegTime;
					this.queryFormData.EndTime=res.data.ShiftEndTime;
				})
			},
			getPartSizeBookList(){
				let fd = new FormData();
				fd.set('flag', 'getPartSizeBookList');
				fd.set('materialTagCode',this.bookFormData.MaterialTagCode);
				this.$axios.post('/mes/Service/SizeBookService.ashx', fd).then(res => {
					if (res.data.Result) {
						let source=res.data.RtnData;
					let workOrderNoList = [], workOrderList = [];
						for (let i = 0; i < source.length; i++) {
							if (workOrderNoList.indexOf(source[i].WorkOrderNO) === -1) {
								workOrderNoList.push(source[i].WorkOrderNO);
								workOrderList.push({
									WorkOrderID: source[i].WorkOrderID,
									WorkOrderNO: source[i].WorkOrderNO
								});
							}
						}
						if (workOrderList.length > 0) {
							this.workOrderList=workOrderList;
							this.$set(this.bookFormData,"WorkOrderID",workOrderList[0].WorkOrderID);
							this.sizeBookTableData= source.filter(function (item) {
								if (item.WorkOrderID === workOrderList[0].WorkOrderID) {
									return item;
								}
							});
						}else {
							this.workOrderList=[];
							this.$set(this.bookFormData,"WorkOrderNO",'');
							this.sizeBookTableData= [];
						}
						if (res.data.Message != "Success") {
							this.$message({
								type: 'warning',
								message: res.data.Message,
								showClose: true,
							});
						}
					} else {
						this.$message({
							type: 'error',
							message: res.data.Message,
							showClose: true,
						});
					}
				})
			},
			submitAfterQuantity(){
				if (!this.bookFormData.WorkOrderNO) {
					this.$message({
						type: 'warning',
						message: "请选择工单！",
						showClose: true,
					});
					return;
				}
				if (!this.bookFormData.MaterialTagCode) {
					this.$message({
						type: 'warning',
						message: "请输入物料标签！",
						showClose: true,
					});
					return;
				}
				if (!this.bookFormData.NetWeight) {
					this.$message({
						type: 'warning',
						message: "请输入净重！",
						showClose: true,
					});
					return;
				}
				this.$confirm('确认工单号'+this.bookFormData.WorkOrderNO+"？", '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'submitAfterQuantity');
					fd.set('materialTagCode', this.bookFormData.MaterialTagCode);
					fd.set('materialNo', this.bookFormData.MaterialNo);
					fd.set('lotNum', this.bookFormData.LotNumber);
					fd.set('netWeight', this.bookFormData.NetWeight);
					fd.set('workOrderNo', this.bookFormData.WorkOrderNO);
					this.$axios.post('/mes/Service/SizeBookService.ashx', fd).then(res => {
						if (res.data.Result) {
							this.getPartSizeBookList();
							this.$set(this.bookFormData,"NetWeight",null);
							this.$asyncComputed.getSizeBookHistoryData.update();
							this.$message({
								type: 'success',
								message: '提交成功！'
							});
						} else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				});
			},
		}
	}
</script>

<style scoped>

</style>