<template>
	<div>
		<el-form :model="workOrderQueryFormData" label-position="left" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-form-item label="工艺路线">
						<el-select v-model="workOrderQueryFormData.RouteID" clearable style="width: 100%">
							<el-option v-if="routeList.length>0"
												 v-for="item in routeList"
												 :key="item.RouteID" :label="item.RouteName" :value="item.RouteID">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="工单号">
						<el-input v-model="workOrderQueryFormData.WorkOrderNO"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="工单状态">
						<el-select v-model="workOrderQueryFormData.WorkOrderStatus" clearable style="width: 100%">
							<el-option v-if="workOrderStatusList.length>0"
												 v-for="item in workOrderStatusList"
												 :key="item.id" :label="item.text" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="开始时间">
						<el-date-picker v-model="workOrderQueryFormData.BeginTime" type="datetime" style="width: 100%"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="结束时间">
						<el-date-picker v-model="workOrderQueryFormData.EndTime" type="datetime" style="width: 100%"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-switch v-model="getSapSwitchValue" active-text="外网应急" inactive-text="内网专线"
							 @change="handleSwitchChange">
		</el-switch>
		<el-button-group style="float: right">
			<el-button size="small" @click="workOrderDownload">手工下载</el-button>
			<el-button size="small" @click="getProgressDetailData">进度详情</el-button>
			<el-dialog :visible.sync="progressDetailDialogVisible" :title="progressDetailTitle" width="90%" append-to-body>
				<el-table :data="progressDetailData" style="width: 95%">
					<el-table-column prop="WorkCellName" label="工艺段名称"></el-table-column>
					<el-table-column label="工序内">
						<el-table-column prop="Input" label="投入"></el-table-column>
						<el-table-column prop="Output" label="产出">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.Output:""}}
							</template>
						</el-table-column>
						<el-table-column prop="IncomeMaterialBad" label="来料不良">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.IncomeMaterialBad:""}}
							</template>
						</el-table-column>
						<el-table-column prop="DebrisNum" label="碎片">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.DebrisNum:""}}
							</template>
						</el-table-column>
						<el-table-column prop="ReworkNum" label="返工">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.ReworkNum:""}}
							</template>
						</el-table-column>
						<el-table-column label="差异">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.Input - scope.row.Output - scope.row.DebrisNum - scope.row.ReworkNum:""}}
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="工序间">
						<el-table-column prop="WIPInTheory" label="WIP站">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.WIP:""}}
							</template>
						</el-table-column>
						<el-table-column prop="OnPassage" label="IGV在途">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.OnPassage:""}}
							</template>
						</el-table-column>
						<el-table-column prop="InBuffer" label="大Buffer">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.InBuffer:""}}
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="碎片差异">
						<el-table-column prop="WeighDebrisNum" label="称重碎片">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.WeighDebrisNum:""}}
							</template>
						</el-table-column>
						<el-table-column label="差异">
							<template slot-scope="scope">
								{{scope.row.WorkCellName != "仓库发料" && scope.row.WorkCellName != "实际入库"?scope.row.DebrisNum - scope.row.WeighDebrisNum:""}}
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</el-dialog>
			<el-button size="small" @click="workOrderInput">投产</el-button>
			<el-dialog :visible.sync="workOrderInputDialogVisible" title="工单投产" append-to-body>
				<el-form :model="workOrderInputFormData" label-position="left" label-width="100px" style="width: 95%">
					<el-form-item label="工艺路线">
						<el-select v-model="workOrderInputFormData.RouteID">
							<el-option v-if="routeList.length>0"
												 v-for="item in routeList"
												 :key="item.RouteID" :label="item.RouteName" :value="item.RouteID">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="workOrderInputSave">保存</el-button>
						<el-button @click="workOrderInputCancel">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
			<el-button size="small" @click="workOrderBook">报工</el-button>
			<el-dialog :visible.sync="workOrderBookDialogVisible" title="报工" width="90%" append-to-body>
				<el-tabs type="border-card" v-model="bookTabName" style="width: 95%;">
					工单号：<el-input v-model="selectWorkOrderNO" :disabled="true" size="small" style="width:auto"></el-input>
					<el-tab-pane label="工单报工" name="workOrderBook">
						<div>
							<el-button-group style="float: right">
								<el-button size="small" @click="sapWorkCellRefresh">刷新SAP编码</el-button>
								<el-tooltip content="帮助信息：若操作【SAP撤销报工】，点击【撤销报工】按钮，修改数据后，点击【报工】按钮；若操作【SAP更新报工】，点击【重置报工】按钮，修改数据后，点击【更新报工】按钮。" placement="top-start">
									<el-button icon="el-icon-warning" size="small"></el-button>
								</el-tooltip>
								<el-button size="small" @click="workOrderBookSave">报工</el-button>
								<el-button size="small" @click="workOrderBookDiscard">撤销报工</el-button>
								<el-button size="small" @click="getWorkOrderBookData">刷新</el-button>
							</el-button-group>
							<common-table :data="workOrderBookData" :columns="workOrderBookColumns">
								<el-table-column type="expand" slot="expand">
									<template slot-scope="scope">
										<common-table ref="workOrderBookDetailTable" :data="scope.row.WorkOrderBookList" :columns="workOrderBookDetailColumns"
																	:pagination="true" :page-size="5">
											<el-table-column type="expand" slot="expand">
												<template slot-scope="scope">
													{{scope.row.Result}}
												</template>
											</el-table-column>
											<el-table-column slot="columnL" prop="ShiftTime" label="班次">
												<template slot-scope="scope">
													{{scope.row.ShiftTime|displayFilter(shiftTimeList,"ID","Display")}}
												</template>
											</el-table-column>
											<el-table-column slot="columnR" prop="Flag" label="报工状态">
												<template slot-scope="scope">
													{{scope.row.Flag|displayFilter(workOrderBookFlagList,"id","text")}}
												</template>
											</el-table-column>
											<el-table-column slot="columnR" prop="RevocationStatus" label="重置状态">
												<template slot-scope="scope">
													{{scope.row.RevocationStatus|displayFilter(revocationStatusList,"id","text")}}
												</template>
											</el-table-column>
										</common-table>
									</template>
								</el-table-column>
							</common-table>
						</div>
					</el-tab-pane>
					<el-tab-pane label="浆料网版报工" name="sizeBook">
						<div>
							<el-button-group style="float: right">
								<el-button size="small" @click="getSizeBookData">刷新</el-button>
							</el-button-group>
							<common-table :data="sizeBookData" :columns="sizeBookColumns">
								<el-table-column type="expand" slot="expand">
									<template slot-scope="scope">
										<common-table  :data="scope.row.DetailList" :columns="sizeBookDetailColumns"
																	:pagination="true" :page-size="5">
										</common-table>
									</template>
								</el-table-column>
							</common-table>
						</div>
					</el-tab-pane>
				</el-tabs>
			</el-dialog>
			<el-button size="small" @click="workOrderFrozen">冻结</el-button>
			<el-dialog :visible.sync="workOrderFrozenDialogVisible" title="冻结" width="90%" append-to-body>
				<el-button-group style="float: right">
					<el-button size="small" @click="checkResultRefresh">OA审批更新</el-button>
					<el-button size="small" @click="workOrderFrozenSave">冻结</el-button>
					<el-button size="small" @click="workOrderForzenUploadSAP">上传SAP</el-button>
				</el-button-group>
				<common-table :data="workOrderFrozenTableData" :columns="workOrderFrozenColumns"
											:pagination="true" :page-size="5">
					<el-table-column slot="columnR" prop="CheckResult" label="审批结果">
						<template slot-scope="scope">
							{{scope.row.CheckResult|displayFilter([{ id: 0, text: '不可冻结' }, { id: 1, text: '可冻结' }],"id","text")}}
						</template>
					</el-table-column>
					<el-table-column slot="columnR" prop="FrozenStatus" label="冻结状态">
						<template slot-scope="scope">
							{{scope.row.FrozenStatus|displayFilter([{ id: 0, text: '未冻结' }, { id: 1, text: '已冻结' }],"id","text")}}
						</template>
					</el-table-column>
					<el-table-column slot="columnR" prop="FrozenType" label="冻结类型">
						<template slot-scope="scope">
							<el-select v-if="scope.row.editable" v-model="scope.row.FrozenType">
								<el-option v-if="frozenTypeData.length>0"
													 v-for="item in frozenTypeData"
													 :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
							<span v-show="!scope.row.editable">{{scope.row.FrozenType|displayFilter(frozenTypeData,"id","name")}}</span>
						</template>
					</el-table-column>
					<el-table-column slot="columnR" prop="FrozenQuantity" label="冻结数量">
						<template slot-scope="scope">
							<el-input v-if="scope.row.editable" v-model.number="scope.row.FrozenQuantity" type="number"></el-input>
							<span v-show="!scope.row.editable">{{ scope.row.FrozenQuantity }}</span>
						</template>
					</el-table-column>
					<el-table-column slot="columnR">
						<template slot-scope="scope">
						<el-button v-if="scope.row.CheckResult===1 && scope.row.FrozenStatus===0&&!scope.row.editable" size="small" type="text" @click="workOrderFrozenEdit(scope.row)">编辑</el-button>
						<el-button v-if="scope.row.editable" size="small" type="text" @click="workOrderFrozenEditSave(scope.row)">保存</el-button>
						<el-button v-if="scope.row.editable" size="small" type="text" @click="workOrderFrozenEditCancel()">取消</el-button>
						</template>
					</el-table-column>
				</common-table>
			</el-dialog>
			<el-button size="small" @click="workOrderEnable">启用</el-button>
			<el-button size="small" @click="workOrderFinish">工单完成</el-button>
			<el-button size="small" @click="workOrderForcedClose">强制关闭</el-button>
		</el-button-group>

		<common-table ref="workOrderTable" :data="getWorkOrderData" :columns="workOrderColumns"
									:pagination="true" :page-size="5"
									v-loading="this.$asyncComputed.getWorkOrderData.updating"
									@rowClick="handleWorkOrderRowClick">
			<el-table-column type="expand" slot="expand">
				<template slot-scope="scope">
					<common-table :data="scope.row.AttachmentList" :columns="attachmentColumns"
												:allow-updating="true" @update="attachmentUpdate"
												:show.sync="attachmentEditVisible">
						<el-table-column slot="columnR" prop="ProductionType" label="产品类型">
							<template slot-scope="scope">
								{{scope.row.ProductionType| displayFilter(productionTypeList,"id","text")}}
							</template>
						</el-table-column>
						<div slot="dialog">
							<el-form :model="attachmentFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="优先级">
									<el-input-number v-model="attachmentFormData.Priority" style="width: 100%">
									</el-input-number>
								</el-form-item>
								<el-form-item>
									<el-button @click="attachmentEditSave">保存</el-button>
									<el-button @click="attachmentEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</template>
			</el-table-column>
			<el-table-column slot="columnL" prop="RouteID" label="工艺路线">
				<template slot-scope="scope">
					{{scope.row.RouteID| displayFilter(routeList,"RouteID","RouteName")}}
				</template>
			</el-table-column>
			<el-table-column slot="columnR" prop="WorkMachineID" label="产线">
				<template slot-scope="scope">
					{{scope.row.WorkMachineID| displayFilter(productLineList,"LineID","LineName")}}
				</template>
			</el-table-column>
		</common-table>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="物料" name="workOrderPart">
				<div>
					<common-table :data="workOrderPartTableData" :columns="workOrderPartColumns"
												:pagination="true" :page-size="5">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<h4>备料信息</h4>
								<common-table :data="scope.row.WorkOrderPartDetailList" :columns="workOrderPartDetailColumns"
															:pagination="true" :page-size="5"></common-table>
								<h4>绑定机器(浆料、网版)</h4>
								<common-table :data="scope.row.WorkMachineList" :columns="bindWorkMachineColumns"
															:pagination="true" :page-size="5"
															:allow-adding="true" :allow-deleting="true"
															@add="workOrderPartMachineAdd(scope.row.Id)" @delete="workOrderPartMachineDelete"
															:show.sync="workOrderPartMachineEditVisible">
									<el-table-column slot="columnL" prop="WorkMachineID" label="机器编码">
										<template slot-scope="scope">
											{{scope.row.WorkMachineID| displayFilter(bindMachineList,"WorkMachineID","MachineCode")}}
										</template>
									</el-table-column>
									<el-table-column slot="columnL" prop="WorkMachineID" label="机器名称">
										<template slot-scope="scope">
											{{scope.row.WorkMachineID| displayFilter(bindMachineList,"WorkMachineID","MachineName")}}
										</template>
									</el-table-column>
									<div slot="dialog">
										<el-form :model="workOrderPartMachineFormData" label-position="left" label-width="100px" style="width: 95%">
											<el-form-item label="机器名称">
												<el-select v-model="workOrderPartMachineFormData.WorkMachineID" style="width: 100%">
													<el-option v-if="bindMachineList.length>0"
																		 v-for="item in bindMachineList"
																		 :key="item.WorkMachineID" :label="item.MachineName" :value="item.WorkMachineID">
													</el-option>
												</el-select>
											</el-form-item>
											<el-form-item>
												<el-button @click="workOrderPartMachineEditSave">保存</el-button>
												<el-button @click="workOrderPartMachineEditCancel">取消</el-button>
											</el-form-item>
										</el-form>
									</div>
								</common-table>
							</template>
						</el-table-column>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="工作中心" name="workOrderCenter">
				<div>
					<common-table :data="workCenterTableData" :columns="workCenterColumns"
												:pagination="true" :page-size="5">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<h4>投产机器</h4>
								<common-table :data="scope.row.InputMachineList" :columns="inputMachineColumns">
									<el-table-column slot="columnR" prop="InputStatus" label="投产状态">
										<template slot-scope="scope">
											{{scope.row.InputStatus| displayFilter(machineWorkOrderStatusList,"EnumValue","Description")}}
										</template>
									</el-table-column>
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
		name: "workOrderInfo",
		components: {CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			return {
				workOrderQueryFormData: {
					RouteID:"",WorkOrderNO:"",WorkOrderStatus:"",
					BeginTime:new Date(new Date().setDate(new Date().getDate() - 4)),
					EndTime:new Date(new Date().setDate(new Date().getDate() + 3))
				},
				routeList: [],
				workOrderStatusList: [{id: 0, text: '已下达'}, {id: 1, text: '已冻结'}, {id: 2, text: '已关闭'},
					{id: 3, text: '已删除'}, {id: 4, text: '已投产'}, {id: 5, text: '已完成'}],
			  productLineList:[],
				productionTypeList:[{ id: 0, text: "N" }, { id: 1, text: "P" }],
				machineWorkOrderStatusList:[],
				bindMachineList:[],
				shiftTimeList: [{ "ID": "01", "Display": "白班" }, { "ID": "02", "Display": "夜班" }],
				workOrderBookFlagList : [{ id: 0, text: '已提交' }, { id: 1, text: '报工完成' },
					{ id: 2, text: '未提交' }, { id: 3, text: '报工失败' }],
			  revocationStatusList : [{ id: 0, text: '正常' }, { id: 1, text:'已重置' }],
				workOrderColumns:[{prop:"WorkOrderNO",label:"工单号"},{prop:"Target",label:"目标数量"},
					{prop:"WorkOrderStatus",label:"工单状态"},{prop:"DifferenceStatus",label:"差异状态"},{prop:"WorkOrderBookStatus",label:"报工状态"},
					{prop:"PlanStartTime",label:"计划开始时间",type:"datetime"},{prop:"PlanEndTime",label:"预计结束时间",type:"datetime"},
					{prop:"ProductName",label:"成品料号"},{prop:"SapInputMachine",label:"SAP产线"}],
				attachmentColumns:[{prop:"Category",label:"类别"},{prop:"Priority",label:"优先级"},
					{prop:"Customer",label:"客户"}],
				attachmentEditVisible:false,
				attachmentFormData:{},
				tabName:"workOrderPart",
				workOrderPartTableData:[],
				workOrderPartColumns:[{prop:"InternalPartNo",label:"物料编码"},{prop:"PartDesc",label:"物料名称"},
					{prop:"PartKind",label:"物料类型"},{prop:"BatchNo",label:"批次"},
					{prop:"SupplierName",label:"供应商"},{prop:"ConsumptionQuantity",label:"单个用量"},
					{prop:"RequireQuantity",label:"需求数量"},{prop:"Unit",label:"单位"},
					{prop:"VerifyResult",label:"验证结果"}],
				workOrderPartDetailColumns:[{prop:"InternalPartNo",label:"物料编码"},{prop:"PartDesc",label:"物料名称"},
					{prop:"MaterialTagCode",label:"物料标签"},{prop:"BatchNo",label:"批次"},
					{prop:"Supplier",label:"供应商"},{prop:"WorkOrderSpareNo",label:"备料单"},
					{prop:"Quality",label:"备料数量"},{prop:"Unit",label:"单位"},
					{prop:"AverageThickness",label:"平均厚度"},{prop:"VerifyResult",label:"是否校验"},
					{prop:"ForceTrue",label:"强制校验"}],
				bindWorkMachineColumns:[{prop:"Operator",label:"操作人"},{prop:"OrrcurTime",label:"操作时间",type:"datetime"}],
				workOrderPartMachineEditVisible:false,
				workOrderPartMachineFormData:{},
				workCenterTableData:[],
				workCenterColumns:[{prop:"AreaName",label:"部门名称"},{prop:"SapWorkCellNo",label:"SAP工艺段编码"},
					{prop:"SapWorkCellName",label:"SAP工艺段名称"},{prop:"MesWorkCellName",label:"MES工艺段名称"},
					{prop:"SapWorkCenterNo",label:"SAP工作中心"},{prop:"MesWorkCenterNo",label:"MES工作中心"}],
				inputMachineColumns:[{prop:"MachineCode",label:"机器编码"},{prop:"MachineName",label:"机器名称"},
					{prop:"InputDate",label:"投产时间",type:"datetime"},{prop:"StartDate",label:"开始时间",type:"datetime"},
					{prop:"EndDate",label:"结束时间",type:"datetime"}],
				progressDetailDialogVisible:false,
				progressDetailData:[],
				progressDetailTitle:"",
				workOrderInputDialogVisible:false,
				workOrderInputFormData:{},
				bookTabName:"workOrderBook",
				workOrderBookDialogVisible:false,
				selectWorkOrderNO:"",
				workOrderBookColumns:[{prop:"WorkCellName",label:"工艺段名称"},{prop:"WorkOrderStatus",label:"工单状态"},
					{prop:"IncomeMaterial",label:"来料"},{prop:"Input",label:"工序投入"},
					{prop:"Product",label:"工序产出"},{prop:"IncomeMaterialBad",label:"来料不良"},
					{prop:"Chip",label:"碎片"},{prop:"Reprocess",label:"不良"},
					{prop:"WIP",label:"WIP"},{prop:"Num",label:"隔离"},
					{prop:"WorkOrderBookStatus",label:"报工状态"}],
				workOrderBookDetailColumns:[{prop:"Shift",label:"班组"},{prop:"MachineName",label:"机器名称"},
					{prop:"IncomeMaterial",label:"来料"},{prop:"Input",label:"投入"},
					{prop:"Product",label:"产出"},{prop:"Chip",label:"碎片"},
					{prop:"Reprocess",label:"不良"},{prop:"BookDate",label:"报工时间",type:"datetime"}],
				workOrderBookData:[],
				sizeBookData:[],
				sizeBookColumns:[{prop:"InternalPartNo",label:"物料编码"},{prop:"PartLotNumber",label:"物料批次"},
					{prop:"Unit",label:"单位"},{prop:"UseQuantity",label:"总消耗量"},
					{prop:"PartKind",label:"物料类型"}],
				sizeBookDetailColumns:[{prop:"PartDesc",label:"物料名称"},{prop:"BatchNo",label:"物料标签"},
					{prop:"Supplier",label:"供应商"},{prop:"Unit",label:"单位"},
					{prop:"Quantity",label:"初始重量"},{prop:"AfterQuantity",label:"当前重量"},
					{prop:"UseQuantity",label:"消耗量"},{prop:"Flag",label:"当前状态"}],
				workOrderFrozenDialogVisible:false,
				workOrderFrozenTableData:[],
				workOrderFrozenColumns:[{prop:"WorkOrderNO",label:"工单号"},{prop:"Target",label:"目标数量"},
					{prop:"Category",label:"类别"},{prop:"ProductName",label:"成品料号"},
					{prop:"WorkOrderStatus",label:"工单状态"},{prop:"FrozenDate",label:"冻结日期",type:"datetime"},],
				frozenTypeData:[{ id: 1, name: '减少数量' }],
			}
		},
		asyncComputed:{
			async getWorkOrderData() {
				this.workOrderPartTableData=[];
				this.workCenterTableData=[];
				let fd = new FormData();
				fd.set('flag', 'getWorkOrderList');
				fd.set('routeId',this.workOrderQueryFormData.RouteID);
				fd.set('workorderNo',this.workOrderQueryFormData.WorkOrderNO);
				fd.set('beginTime',this.common.datetimeFormat(this.workOrderQueryFormData.BeginTime));
				fd.set('endTime',this.common.datetimeFormat(this.workOrderQueryFormData.EndTime));
				fd.set('workOrderStatus',this.workOrderQueryFormData.WorkOrderStatus);
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				return (await this.$axios.post('/mes/Service/WorkOrderService.ashx', fd)).data;
			},
			async getSapSwitchValue(){
				let fd = new FormData();
				fd.set('flag', 'getSapSwitchValue');
				return (await this.$axios.post('/mes/Service/WorkOrderService.ashx', fd)).data;
			}
		},
		created(){
			this.getRouteData();
			this.getProductLineData();
			this.getMachineWorkOrderStatusData();
			this.getBindMachineData();
		},
		methods:{
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
			getMachineWorkOrderStatusData(){
				let fd = new FormData();
				fd.set('flag', 'getMachineWorkOrderStatusList');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					this.machineWorkOrderStatusList=res.data;
				});
			},
			getBindMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkMachineListByWorkCellTypeId');
				fd.set('areaId','[]');
				fd.set('lineId','[]');
				fd.set('workCellTypeId','8');
				fd.set('machineType','1');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.bindMachineList=res.data;
				});
			},

			handleSwitchChange(val){
				let fd = new FormData();
				fd.set('flag', 'saveSapSwitch');
				fd.set('switchValue',val);
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.$asyncComputed.getSapSwitchValue.update();
						this.$message({
							type: 'success',
							message: '切换成功！'
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
			workOrderDownload(){
				if(!this.workOrderQueryFormData.BeginTime){
					this.$message({
						type: 'warning',
						message: '请选择开始时间！'
					});
					return;
				}
				if(!this.workOrderQueryFormData.EndTime){
					this.$message({
						type: 'warning',
						message: '请选择结束时间！'
					});
					return;
				}
				let fd = new FormData();
				fd.set('flag', 'workOrderDownload');
				fd.set('beginTime',this.common.datetimeFormat(this.workOrderQueryFormData.BeginTime));
				fd.set('endTime',this.common.datetimeFormat(this.workOrderQueryFormData.EndTime));
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data.key===0){
						this.$asyncComputed.getWorkOrderData.update();
						this.$message({
							type: 'success',
							message: res.data.Result,
						});
					}else {
						this.$message({
							type: 'error',
							message: res.data.Result,
							showClose: true,
						});
					}
				})
			},
			getProgressDetailData(){
				let row= this.$refs.workOrderTable.currentRow;
				if (row && row.WorkOrderNO){
					this.progressDetailDialogVisible=true;
					this.progressDetailTitle='工单'+row.WorkOrderNO+'进度详情';
					let fd = new FormData();
					fd.set('flag', 'getWorkOrderDifference');
					fd.set('workOrderNo',row.WorkOrderNO);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						this.progressDetailData=res.data;
					});
				} else{
					this.$message({
						type: 'warning',
						message: '请选择具体工单！'
					});
				}
			},
			workOrderInput(){
				let row= this.$refs.workOrderTable.currentRow;
				if (row && row.WorkOrderNO){
					if (row.WorkOrderState !== 0) {
						this.$message({
							type: 'error',
							message: '工单已投产、已删除或已强制关闭，不可操作！'
						});
						return;
					}
					this.workOrderInputFormData.WorkOrderID=row.WorkOrderID;
					let fd = new FormData();
					fd.set('flag', 'getProductRouteIdByProductName');
					fd.set('productName',row.ProductName);
					fd.set('lineId',row.InputMachine);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						this.$set(this.workOrderInputFormData,'RouteID',res.data);
						this.workOrderInputDialogVisible=true;
					});
				} else{
					this.$message({
						type: 'warning',
						message: '请选择具体工单！'
					});
				}
			},
			workOrderInputSave(){
				let fd = new FormData();
				fd.set('flag', 'inputWorkOrder');
				fd.set('workOrderId',this.workOrderInputFormData.WorkOrderID);
				fd.set('routeId',this.workOrderInputFormData.RouteID);
				fd.set('userId','');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data.key===0){
						this.workOrderInputCancel();
						this.$asyncComputed.getWorkOrderData.update();
						this.$message({
							type: 'success',
							message: res.data.Result,
						});
					}else {
						this.$message({
							type: 'error',
							message: res.data.Result,
							showClose: true,
						});
					}
				})
			},
			workOrderInputCancel(){
				this.workOrderInputFormData={};
				this.workOrderInputDialogVisible=false;
			},
			workOrderBook() {
				let row = this.$refs.workOrderTable.currentRow;
				if (row && row.WorkOrderNO) {
					if ((row.WorkOrderState >= 300 && row.WorkOrderState < 400) || row.WorkOrderState === 2) {
						this.$message({
							type: 'error',
							message: '工单已删除或已强制关闭，不可操作！'
						});
						return;
					}
					this.selectWorkOrderNO=row.WorkOrderNO;
					this.workOrderBookDialogVisible=true;
					this.getWorkOrderBookData();
					this.getSizeBookData();
				} else {
					this.$message({
						type: 'warning',
						message: '请选择具体工单！'
					});
				}
			},
			getWorkOrderBookData(){
				let row = this.$refs.workOrderTable.currentRow;
				if (row ){
					let fd = new FormData();
					fd.set('flag', 'getWorkOrderBookListByWorkOrderId');
					fd.set('workOrderId',row.WorkOrderID);
					fd.set('isAutoBook',false);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						this.workOrderBookData=res.data;
					});
				} else {
					this.workOrderBookData=[];
				}
			},
			getSizeBookData(){
				let row = this.$refs.workOrderTable.currentRow;
				if (row){
					let fd = new FormData();
					fd.set('flag', 'getSizeBookListByWorkOrder');
					fd.set('workOrderNo',row.WorkOrderNO);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						this.sizeBookData=res.data;
					});
				} else {
					this.sizeBookData=[];
				}
			},
			sapWorkCellRefresh(){
				let fd = new FormData();
				fd.set('flag', 'saveSapWorkCell');
				fd.set('workOrderNo',this.selectWorkOrderNO);
				fd.set('isAutoBook',false);
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.$message({
							type: 'success',
							message: res.data,
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
			workOrderBookSave(){
				let fd = new FormData();
				fd.set('flag', 'saveWorkOrderBookFlag');
				fd.set('workOrderNo',this.selectWorkOrderNO);
				fd.set('revocationStatus',0);
				fd.set('isAutoBook',false);
				fd.set('userId','');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data.Key===0){
						this.$message({
							type: 'success',
							message: res.data.Result,
						});
					}else {
						this.$message({
							type: 'error',
							message: res.data.Result,
							showClose: true,
						});
					}
				})
			},
			workOrderBookDiscard(){
				let table=this.$refs.workOrderBookDetailTable;
				if(table){
					let row = this.$refs.workOrderBookDetailTable.currentRow;
					if (row){
						let fd = new FormData();
						fd.set('flag', 'discardWorkOrderBookFlag');
						fd.set('workOrderBookId',row.ID);
						fd.set('isAutoBook',false);
						fd.set('userId','');
						this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
							if (res.data.Key===0){
								this.$message({
									type: 'success',
									message: res.data.Result,
								});
							}else {
								this.$message({
									type: 'error',
									message: res.data.Result,
									showClose: true,
								});
							}
						})
					} else{
						this.$message({
							type: 'warning',
							message: '请选择具体要撤销的数据！'
						});
					}
				}
				else {
					this.$message({
						type: 'warning',
						message: '请选择具体要撤销的数据！'
					});
				}
			},
			workOrderFrozen(){
				let row= this.$refs.workOrderTable.currentRow;
				if (row && row.WorkOrderNO){
					if ((row.WorkOrderState >= 300 && row.WorkOrderState < 400) || row.WorkOrderState === 2) {
						this.$message({
							type: 'error',
							message: '工单已删除或已强制关闭，不可操作！'
						});
						return;
					}
					//1已冻结、4已投产、5已完成 workOrderState
					if ((row.WorkOrderState < 4 && row.WorkOrderState === 0) || row.WorkOrderState == 5 && row.WorkOrderState >= 60) {
						this.$message({
							type: 'error',
							message: '不可冻结！'
						});
						return;
					}
					this.workOrderFrozenDialogVisible=true;
					this.getWorkOrderFrozenData();

				} else{
					this.$message({
						type: 'warning',
						message: '请选择具体工单！'
					});
				}
			},
			getWorkOrderFrozenData(){
				let row = this.$refs.workOrderTable.currentRow;
				if (row){
					let fd = new FormData();
					fd.set('flag', 'getWorkOrderFrozen');
					fd.set('workOrderId',row.WorkOrderID);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						this.workOrderFrozenTableData=res.data;
					});
				} else {
					this.workOrderFrozenTableData=[];
				}
			},
			workOrderFrozenEdit(row){
				row.editable=true;
			},
			workOrderFrozenEditSave(row){
				let fd = new FormData();
				fd.set('flag', 'saveWorkOrderFrozenInfo');
				fd.set('workOrderId',row.WorkOrderID);
				fd.set('workOrderFrozenId',row.WorkOrderFrozenID);
				fd.set('frozenType',row.FrozenType);
				fd.set('frozenQuantity',row.FrozenQuantity);
				fd.set('userId','');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.getWorkOrderFrozenData();
						this.$message({
							type: 'success',
							message: "修改成功",
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
			workOrderFrozenEditCancel(){
				this.getWorkOrderFrozenData();
			},
			checkResultRefresh(){
				let fd = new FormData();
				fd.set('flag', 'saveCheckResult');
				fd.set('workOrderId',this.$refs.workOrderTable.currentRow.WorkOrderID);
				fd.set('userId','');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.getWorkOrderFrozenData();
						this.$message({
							type: 'success',
							message: res.data,
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
			workOrderFrozenSave(){
				let fd = new FormData();
				fd.set('flag', 'saveWorkOrderStatus');
				fd.set('workOrderId',this.$refs.workOrderTable.currentRow.WorkOrderID);
				fd.set('userId','');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.getWorkOrderFrozenData();
						this.$message({
							type: 'success',
							message: res.data,
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
			workOrderForzenUploadSAP(){
				let fd = new FormData();
				fd.set('flag', 'workOrderForzen');
				fd.set('workOrderId',this.$refs.workOrderTable.currentRow.WorkOrderID);
				fd.set('userId','');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data.key===0){
						this.$message({
							type: 'success',
							message: res.data.Result,
						});
					}else {
						this.$message({
							type: 'error',
							message: res.data.Result,
							showClose: true,
						});
					}
				})
			},
			workOrderEnable(){
				let row= this.$refs.workOrderTable.currentRow;
				if (row && row.WorkOrderNO){
					if ((row.WorkOrderState >= 300 && row.WorkOrderState < 400) || row.WorkOrderState === 2) {
						this.$message({
							type: 'error',
							message: '工单已删除或已强制关闭，不可操作！'
						});
						return;
					}
					let fd = new FormData();
					fd.set('flag', 'enableWorkOrderStatus');
					fd.set('workOrderId',row.WorkOrderID);
					fd.set('userId','');
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						if (res.data==='success'){
							this.$asyncComputed.getWorkOrderData.update();
							this.$message({
								type: 'success',
								message: '启用成功',
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data,
								showClose: true,
							});
						}
					});
				} else{
					this.$message({
						type: 'warning',
						message: '请选择具体工单！'
					});
				}
			},
			workOrderFinish(){
				let row= this.$refs.workOrderTable.currentRow;
				if (row && row.WorkOrderNO){
					if ((row.WorkOrderState >= 300 && row.WorkOrderState < 400) || row.WorkOrderState === 2) {
						this.$message({
							type: 'error',
							message: '工单已删除或已强制关闭，不可操作！'
						});
						return;
					}
					let fd = new FormData();
					fd.set('flag', 'checkWorkOrderFinishStatus');
					fd.set('workOrderId',row.WorkOrderID);
					fd.set('isAutoBook',false);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						if(res.data.Result){
							let fd = new FormData();
							fd.set('flag', 'saveWorkOrderStatusFinish');
							fd.set('workOrderId',row.WorkOrderID);
							fd.set('userId','');
							fd.set('isAutoBook',false);
							this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
								if (res.data==='success'){
									this.$asyncComputed.getWorkOrderData.update();
									this.$message({
										type: 'success',
										message: '工单完成成功！'
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
						else {
							this.$confirm(res.data.Message+'；您确定要完成工单吗？', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
							}).then(()=>{
								let fd = new FormData();
								fd.set('flag', 'saveWorkOrderStatusFinish');
								fd.set('workOrderId',row.WorkOrderID);
								fd.set('userId','');
								fd.set('isAutoBook',false);
								this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
									if (res.data==='success'){
										this.$asyncComputed.getWorkOrderData.update();
										this.$message({
											type: 'success',
											message: '工单完成成功！'
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
						}
					});
				} else{
					this.$message({
						type: 'warning',
						message: '请选择具体工单！'
					});
				}
			},
			workOrderForcedClose(){
				let row= this.$refs.workOrderTable.currentRow;
				if (row && row.WorkOrderNO){
					if ((row.WorkOrderState >= 300 && row.WorkOrderState < 400) || row.WorkOrderState === 2) {
						this.$message({
							type: 'error',
							message: '工单已删除或已强制关闭，不可操作！'
						});
						return;
					}
					this.$confirm('强制关闭后不可恢复，您确定要强制关闭该工单吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(()=>{
						let fd = new FormData();
						fd.set('flag', 'saveWorkOrderStatusClose');
						fd.set('workOrderId',row.WorkOrderID);
						fd.set('userId','');
						this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
							if (res.data==='success'){
								this.$asyncComputed.getWorkOrderData.update();
								this.$message({
									type: 'success',
									message: '强制关闭成功！'
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

				} else{
					this.$message({
						type: 'warning',
						message: '请选择具体工单！'
					});
				}
			},

			attachmentUpdate(row){
				this.attachmentEditVisible=true;
				this.attachmentFormData=row;
			},
			attachmentEditSave(){
				let fd = new FormData();
				fd.set('flag', 'savePriority');
				fd.set('workOrderId',this.attachmentFormData.WorkOrderID);
				fd.set('priority',this.attachmentFormData.Priority);
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.attachmentEditCancel();
						this.$asyncComputed.getWorkOrderData.update();
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
			attachmentEditCancel(){
				this.attachmentEditVisible=false;
				this.attachmentFormData={};
			},
			handleWorkOrderRowClick(row){
				this.getWorkOrderPartData();
				this.getWorkCenterData();
				this.getCheckWorkCenter();
			},
			getWorkOrderPartData(){
				let row= this.$refs.workOrderTable.currentRow;
				if(row){
					let fd = new FormData();
					fd.set('flag', 'getWorkOrderPartList');
					fd.set('workOrderId',row.WorkOrderID);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						this.workOrderPartTableData=res.data;
					});
				}else {
					this.workOrderPartTableData=[];
				}
			},
			workOrderPartMachineAdd(workOrderPartId){
				this.workOrderPartMachineEditVisible=true;
				this.workOrderPartMachineFormData={WorkOrderPartID:workOrderPartId};
			},
			workOrderPartMachineEditSave(){
				let fd = new FormData();
				fd.set('flag', 'saveWorkOrderPartMachine');
				fd.set('workOrderPartId',this.workOrderPartMachineFormData.WorkOrderPartID);
				fd.set('workMachineId',this.workOrderPartMachineFormData.WorkMachineID);
				fd.set('userId','');
				this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
					if (res.data==='success'){
						this.workOrderPartMachineEditCancel();
						this.getWorkOrderPartData();
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
			workOrderPartMachineEditCancel(){
				this.workOrderPartMachineEditVisible=false;
				this.workOrderPartMachineFormData={};
			},
			workOrderPartMachineDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteWorkOrderPartMachine');
					fd.set('workOrderPartMachineId',row.Id);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						if (res.data==='success'){
							this.getWorkOrderPartData();
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
			getWorkCenterData(){
				let row= this.$refs.workOrderTable.currentRow;
				if(row){
					let fd = new FormData();
					fd.set('flag', 'getWorkCenterList');
					fd.set('workOrderNo',row.WorkOrderNO);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						this.workCenterTableData=res.data;
					});
				}else {
					this.workCenterTableData=[];
				}
			},
			getCheckWorkCenter(){
				let row= this.$refs.workOrderTable.currentRow;
				if(row){
					let fd = new FormData();
					fd.set('flag', 'getCheckWorkCenter');
					fd.set('workOrderId',row.WorkOrderID);
					this.$axios.post('/mes/Service/WorkOrderService.ashx', fd).then(res => {
						if (res.data.Key !== 0){
							this.$message({
								type: 'error',
								message: res.data.Result,
								showClose: true,
							});
						}
					})
				}
			},
		}
	}
</script>

<style scoped>

</style>