<template>
	<div>
		<el-tabs type="border-card" v-model="tabName">
			<el-tab-pane label="集团" name="enterprise">
				<div>
					<common-table :data="getEnterpriseData" :columns="enterpriseColumns"
												:allowAdding="true" :allow-updating="true" :allow-deleting="true"
												@add="enterpriseUpdate({})" @update="enterpriseUpdate" @delete="enterpriseDelete"
												:show.sync="enterpriseEditVisible"
												@dialogClose="enterpriseEditCancel">
						<el-table-column type="expand" slot="expand">
							<template slot-scope="scope">
								<common-table :data="scope.row.Sites" :columns="siteColumns"
															:allowAdding="true" :allow-updating="true" :allow-deleting="true"
															@add="siteAdd(scope.row.EnterpriseID)" @update="siteUpdate" @delete="siteDelete"
															:show.sync="siteEditVisible"
															@dialogClose="siteEditCancel">
									<el-table-column type="expand" slot="expand">
										<template slot-scope="scope">
											<common-table :data="scope.row.Areas" :columns="areaColumns"
																		:allowAdding="true" :allow-updating="true" :allow-deleting="true"
																		@add="areaAdd(scope.row.SiteID)" @update="areaUpdate" @delete="areaDelete"
																		:show.sync="areaEditVisible"
																		@dialogClose="areaEditCancel">
												<div slot="dialog">
													<el-form :model="areaFormData" ref="areaForm" :rules="areaFormRules"
																	 label-width="100px" style="width: 95%">
														<el-form-item label="车间名称" prop="AreaName">
															<el-input v-model="areaFormData.AreaName"></el-input>
														</el-form-item>
														<el-form-item label="车间编码" prop="AreaCode">
															<el-input v-model="areaFormData.AreaCode"></el-input>
														</el-form-item>
														<el-form-item label="车间描述">
															<el-input v-model="areaFormData.Desc"></el-input>
														</el-form-item>
														<el-form-item>
															<el-button @click="areaEditSave">保存</el-button>
															<el-button @click="areaEditCancel">取消</el-button>
														</el-form-item>
													</el-form>
												</div>
											</common-table>
										</template>
									</el-table-column>
									<div slot="dialog">
										<el-form :model="siteFormData" ref="siteForm" :rules="siteFormRules"
														 label-width="100px" style="width: 95%">
											<el-form-item label="公司名称" prop="SiteName">
												<el-input v-model="siteFormData.SiteName"></el-input>
											</el-form-item>
											<el-form-item label="公司编码" prop="SiteCode">
												<el-input v-model="siteFormData.SiteCode"></el-input>
											</el-form-item>
											<el-form-item label="公司描述">
												<el-input v-model="siteFormData.Desc"></el-input>
											</el-form-item>
											<el-form-item>
												<el-button @click="siteEditSave">保存</el-button>
												<el-button @click="siteEditCancel">取消</el-button>
											</el-form-item>
										</el-form>
									</div>
								</common-table>
							</template>
						</el-table-column>
						<div slot="dialog" >
							<el-form :model="enterpriseFormData" ref="enterpriseForm" :rules="enterpriseFormRules"
											 label-width="100px" style="width: 95%">
								<el-form-item label="集团名称" prop="EnterpriseName">
									<el-input v-model="enterpriseFormData.EnterpriseName"></el-input>
								</el-form-item>
								<el-form-item label="集团编码" prop="EnterpriseCode">
									<el-input v-model="enterpriseFormData.EnterpriseCode"></el-input>
								</el-form-item>
								<el-form-item label="集团描述">
									<el-input v-model="enterpriseFormData.Desc"></el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="enterpriseEditSave">保存</el-button>
									<el-button @click="enterpriseEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</div>
			</el-tab-pane>
			<el-tab-pane label="工艺段" name="workCell">
				<div>
					<el-row :gutter="20">
						<el-col :span="6">
							<enterprise-to-area-tree ref="workcelltree" :expand-all="true" @nodeClick="getWorkCellListByAreaID"></enterprise-to-area-tree>
						</el-col>
						<el-col :span="18">
							<common-table :data="workCellTableData" :columns="workCellColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="workCellAdd" @update="workCellUpdate" @delete="workCellDelete"
														:show.sync="workCellEditVisible"
														@dialogClose="workCellEditCancel">
								<div slot="dialog">
									<el-form :model="workCellFormData" ref="workCellForm" :rules="workCellFormRules"
													 label-width="100px" style="width: 95%">
										<el-form-item label="工艺段名称" prop="WorkCellName">
											<el-input v-model="workCellFormData.WorkCellName"></el-input>
										</el-form-item>
										<el-form-item label="工艺段编码" prop="WorkCellCode">
											<el-input v-model="workCellFormData.WorkCellCode"></el-input>
										</el-form-item>
										<el-form-item label="工艺段类型" prop="WorkCellType">
										<el-select v-model="workCellFormData.WorkCellType" placeholder="请选择" style="width:100%">
											<el-option v-if="workCellTypeData.length>0"
													v-for="item in workCellTypeData"
													:key="item.id" :label="item.name" :value="item.id">
											</el-option>
										</el-select>
									</el-form-item>
										<el-form-item label="工艺段描述">
											<el-input v-model="workCellFormData.Desc"></el-input>
										</el-form-item>
										<el-form-item label="工艺段序列" prop="CellPosition">
											<el-input-number  v-model="workCellFormData.CellPosition" style="width:100%"></el-input-number>
										</el-form-item>
										<el-form-item>
											<el-button @click="workCellEditSave">保存</el-button>
											<el-button @click="workCellEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="机器" name="workMachine">
				<div>
					<el-row :gutter="20">
						<el-col :span="6">
							<enterprise-to-workcell-tree ref="workmachinetree" @nodeClick="getWorkMachineListByWorkCellID"></enterprise-to-workcell-tree>
						</el-col>
						<el-col :span="18">
							<common-table :data="workMachineTableData" :columns="workMachineColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="workMachineAdd" @update="workMachineUpdate" @delete="workMachineDelete"
														:show.sync="workMachineEditVisible"
														@dialogClose="workMachineEditCancel">
									<el-table-column slot="columnR" prop="MachineTypeID" label="机器类型">
										<template slot-scope="scope">
											{{scope.row.MachineTypeID|displayFilter(machineTypeData,"value","text")}}
										</template>
									</el-table-column>
								<div slot="dialog">
									<el-form :model="workMachineFormData" ref="workMachineForm" :rules="workMachineFormRules"
													 label-width="100px" style="width: 95%">
										<el-form-item label="机器名称" prop="MachineName">
											<el-input v-model="workMachineFormData.MachineName"></el-input>
										</el-form-item>
										<el-form-item label="机器编码" prop="MachineCode">
											<el-input v-model="workMachineFormData.MachineCode"></el-input>
										</el-form-item>
										<el-form-item label="机器类型" prop="MachineTypeID">
											<el-select v-model="workMachineFormData.MachineTypeID" style="width: 100%">
												<el-option v-if="machineTypeData.length>0"
																	 v-for="item in machineTypeData"
																	 :key="item.value" :label="item.text" :value="item.value">
												</el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="机器编号" prop="MachineID">
											<el-input v-model="workMachineFormData.MachineID"></el-input>
										</el-form-item>
										<el-form-item label="机器序列" prop="MachinePosition">
											<el-input-number v-model="workMachineFormData.MachinePosition" style="width: 100%"></el-input-number>
										</el-form-item>
										<el-form-item label="铭牌号">
											<el-input v-model="workMachineFormData.SerialNumber"></el-input>
										</el-form-item>
										<el-form-item label="机器描述">
											<el-input v-model="workMachineFormData.Desc"></el-input>
										</el-form-item>
										<el-form-item label="工艺类型" prop="WorkCellTypeID">
											<el-select v-model="workMachineFormData.WorkCellTypeID" style="width: 100%">
												<el-option v-if="workCellTypeData.length>0"
																	 v-for="item in workCellTypeData"
																	 :key="item.id" :label="item.name" :value="item.id">
												</el-option>
											</el-select>
										</el-form-item>
										<el-form-item>
											<el-button @click="workMachineEditSave">保存</el-button>
											<el-button @click="workMachineEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="管道" name="workTube">
				<div>
					<el-row :gutter="20">
						<el-col :span="6">
							<enterprise-to-workmachine-tree ref="worktubetree" machine-type="1" @nodeClick="getWorkTubeListByWorkMachineID"></enterprise-to-workmachine-tree>
						</el-col>
						<el-col :span="18">
							<common-table :data="workTubeTableData" :columns="workTubeColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="workTubeAdd" @update="workTubeUpdate" @delete="workTubeDelete"
														:show.sync="workTubeEditVisible"
														@dialogClose="workTubeEditCancel">
								<div slot="dialog">
									<el-form :model="workTubeFormData" ref="workTubeForm" :rules="workTubeFormRules"
													 label-width="100px" style="width: 95%">
										<el-form-item label="管道名称" prop="TubeName">
											<el-input v-model="workTubeFormData.TubeName"></el-input>
										</el-form-item>
										<el-form-item label="管道序列" prop="TubePosition">
											<el-input-number v-model="workTubeFormData.TubePosition" style="width: 100%"></el-input-number>
										</el-form-item>
										<el-form-item label="管道描述">
											<el-input v-model="workTubeFormData.Desc"></el-input>
										</el-form-item>
										<el-form-item>
											<el-button @click="workTubeEditSave">保存</el-button>
											<el-button @click="workTubeEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="产线" name="productLine">
				<div>
					<el-row :gutter="20">
						<el-col :span="6">
							<enterprise-to-area-tree ref="productlinetree" :expand-all="true" @nodeClick="getProductLineListByAreaID"></enterprise-to-area-tree>
						</el-col>
						<el-col :span="18">
							<common-table :data="productLineTableData" :columns="productLineColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="productLineAdd" @update="productLineUpdate" @delete="productLineDelete"
														:show.sync="productLineEditVisible"
														@dialogClose="productLineEditCancel">
								<el-table-column slot="columnR" prop="Flag" label="状态">
									<template slot-scope="scope">
										<el-checkbox :value="scope.row.Flag"></el-checkbox>
									</template>
								</el-table-column>
								<div slot="dialog">
									<el-form :model="productLineFormData" ref="productLineForm" :rules="productLineFormRules"
													 label-width="100px" style="width: 95%">
										<el-form-item label="产线名称" prop="LineName">
											<el-input v-model="productLineFormData.LineName"></el-input>
										</el-form-item>
										<el-form-item label="产线编码" prop="LineCode">
											<el-input v-model="productLineFormData.LineCode"></el-input>
										</el-form-item>
										<el-form-item label="状态">
											<el-checkbox  v-model="productLineFormData.Flag" style="width:100%"></el-checkbox>
										</el-form-item>
										<el-form-item>
											<el-button @click="productLineEditSave">保存</el-button>
											<el-button @click="productLineEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="产线机器" name="lineWorkMachine">
				<div>
					<el-row :gutter="20">
						<el-col :span="6">
							<enterprise-to-line-tree ref="linemachinetree" @nodeClick="getLineMachineListByLineID"></enterprise-to-line-tree>
						</el-col>
						<el-col :span="18">
							<el-button-group style="float: right">
								<el-button size="small" icon="el-icon-plus" @click="lineMachineAdd">添加机器</el-button>
								<el-button size="small" icon="el-icon-close" @click="lineMachineDelete">删除机器</el-button>
							</el-button-group>
							<common-table ref="linemachinetable" :data="lineMachineTableData" :columns="lineMachineColumns"
														:pagination="true" :multiple-selection="true">
								<el-table-column slot="columnR" prop="MachineTypeID" label="机器类型">
									<template slot-scope="scope">
										{{scope.row.MachineTypeID|displayFilter(machineTypeData,"value","text")}}
									</template>
								</el-table-column>
							</common-table>
							<el-dialog :visible.sync="lineMachineEditVisible" :before-close="lineMachineAddCancel" append-to-body>
								<common-table ref="selectlinemachinetable" :data="machineByAreaData" :columns="selectMachineColumns" style="width: 95%"
															:pagination="true" :multiple-selection="true">
								</common-table>
								<el-button size="small" @click="lineMachineAddSave">提交</el-button>
							</el-dialog>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="工艺段-产线" name="workCellLine">
				<div>
					<el-row :gutter="20">
						<el-col :span="6">
							<enterprise-to-workcell-tree ref="workcelllinetree" @nodeClick="getWorkCellLineListByWorkCellID">
							</enterprise-to-workcell-tree>
						</el-col>
						<el-col :span="18">
							<common-table :data="workCellLineTableData" :columns="workCellLineColumns"
														:pagination="true"
														:allow-adding="true" :allow-updating="true" :allow-deleting="true"
														@add="workCellLineAdd" @update="workCellLineUpdate" @delete="workCellLineDelete"
														:show.sync="workCellLineEditVisible"
														@dialogClose="workCellLineEditCancel">
								<el-table-column slot="columnL" prop="LineID" label="产线名称">
									<template slot-scope="scope">
										{{scope.row.LineID| displayFilter(productLineByAreaData,"LineID","LineName")}}
									</template>
								</el-table-column>
								<el-table-column slot="columnR" prop="Flag" label="状态">
									<template slot-scope="scope">
										<el-checkbox :value="scope.row.Flag"></el-checkbox>
									</template>
								</el-table-column>
								<div slot="dialog">
									<el-form :model="workCellLineFormData" ref="workCellLineForm" :rules="workCellLineFormRules"
													 label-width="100px" style="width: 95%">
										<el-form-item label="产线名称" prop="LineID">
											<el-select v-model="workCellLineFormData.LineID" style="width: 100%">
												<el-option v-if="productLineByAreaData.length>0"
																	 v-for="item in productLineByAreaData"
																	 :key="item.LineID" :label="item.LineName" :value="item.LineID">
												</el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="工作中心ID" prop="WorkCenterID">
											<el-input v-model="workCellLineFormData.WorkCenterID"></el-input>
										</el-form-item>
										<el-form-item label="状态">
											<el-checkbox v-model="workCellLineFormData.Flag"></el-checkbox>
										</el-form-item>
										<el-form-item>
											<el-button @click="workCellLineEditSave">保存</el-button>
											<el-button @click="workCellLineEditCancel">取消</el-button>
										</el-form-item>
									</el-form>
								</div>
							</common-table>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="设备信息同步" name="geMachineInfoSync">
				<div>
					<el-button size="small" @click="getAddGeMachineData">更新</el-button>
					<common-table :data="getAddMachineHistoryData" :columns="geMachineColumns"
												:pagination="true"
												:allow-updating="true" @update="geMachineUpdate"
												:show.sync="geMachineEditVisible">
						<div slot="dialog">
							<el-form :model="geMachineFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="车间">
									<el-input v-model="geMachineFormData.AreaName" :disabled="true"></el-input>
								</el-form-item>
								<el-form-item label="工艺段">
									<el-input v-model="geMachineFormData.WorkCellName" :disabled="true"></el-input>
								</el-form-item>
								<el-form-item label="机器名称">
									<el-input v-model="geMachineFormData.MachineName"></el-input>
								</el-form-item>
								<el-form-item label="机器编码">
									<el-input v-model="geMachineFormData.MachineCode" :disabled="true"></el-input>
								</el-form-item>
								<el-form-item label="机器类型">
									<el-select v-model="geMachineFormData.MachineTypeID" style="width: 100%">
										<el-option v-if="machineTypeData.length>0"
															 v-for="item in machineTypeData"
															 :key="item.value" :label="item.text" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="机器编号">
									<el-input v-model="geMachineFormData.MachineID"></el-input>
								</el-form-item>
								<el-form-item label="机器序列">
									<el-input-number v-model="geMachineFormData.MachinePosition" style="width: 100%"></el-input-number>
								</el-form-item>
								<el-form-item label="铭牌号">
									<el-input v-model="geMachineFormData.SerialNumber"></el-input>
								</el-form-item>
								<el-form-item label="机器描述">
									<el-input v-model="geMachineFormData.Desc"></el-input>
								</el-form-item>
								<el-form-item label="工艺类型">
									<el-select v-model="geMachineFormData.WorkCellTypeID" style="width: 100%">
										<el-option v-if="workCellTypeData.length>0"
															 v-for="item in workCellTypeData"
															 :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button @click="geMachineEditSave">保存</el-button>
									<el-button @click="geMachineEditCancel">取消</el-button>
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
	import EnterpriseToAreaTree from "../common/commonComponent/enterpriseToAreaTree";
	import EnterpriseToWorkcellTree from "../common/commonComponent/enterpriseToWorkcellTree";
	import {displayFilter} from '../common/commonFunction/displayFilter'
	import EnterpriseToWorkmachineTree from "../common/commonComponent/enterpriseToWorkmachineTree";
	import EnterpriseToLineTree from "../common/commonComponent/enterpriseToLineTree";
	export default {
		name: "factoryConfig",
		components: {
			EnterpriseToLineTree, EnterpriseToWorkmachineTree,
			EnterpriseToWorkcellTree, EnterpriseToAreaTree,
			CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			return {
				tabName:'enterprise',

				workCellTypeData:[],
				machineTypeData:[{"text": "自动化机器","value": 0},{"text": "工艺机器","value": 1},
					{"text": "测试机器","value": 2},{"text": "Buffer","value": 4}],

				enterpriseColumns:[{prop:"EnterpriseName",label:"集团名称"},
					{prop:"EnterpriseCode",label:"集团编码"},{prop:"Desc",label:"集团描述"}],
        siteColumns:[{prop:"SiteName",label:"公司名称"},{prop:"SiteCode",label:"公司编码"},
					{prop:"Desc",label:"公司描述"},{prop:"CreateDate",label:"创建时间",type:"datetime"}],
				areaColumns:[{prop:"AreaName",label:"车间名称"},{prop:"AreaCode",label:"车间编码"},
					{prop:"Desc",label:"车间描述"},{prop:"CreateDate",label:"创建时间",type:"datetime"}],
				enterpriseEditVisible:false,
				siteEditVisible:false,
				areaEditVisible:false,
				enterpriseFormData:{},
				siteFormData:{},
				areaFormData:{},
				enterpriseFormRules:{
					EnterpriseName:[
						{ required: true, message: '请输入集团名称', trigger: 'blur' },
					],
					EnterpriseCode:[
						{ required: true, message: '请输入集团编码', trigger: 'blur' },
					],
				},
				siteFormRules:{
					SiteName:[
						{ required: true, message: '请输入公司名称', trigger: 'blur' },
					],
					SiteCode:[
						{ required: true, message: '请输入公司编码', trigger: 'blur' },
					],
				},
				areaFormRules:{
					AreaName:[
						{ required: true, message: '请输入车间名称', trigger: 'blur' },
					],
					AreaCode:[
						{ required: true, message: '请输入车间编码', trigger: 'blur' },
					],
				},

				workCellTableData:[],
				workCellColumns:[{prop:"WorkCellName",label:"工艺段名称"},{prop:"WorkCellCode",label:"工艺段编码"},
					{prop:"Desc",label:"工艺段描述"},{prop:"CellPosition",label:"工艺段序列"}],
				workCellEditVisible:false,
				workCellFormData:{},
				workCellFormRules:{
					WorkCellName:[
						{ required: true, message: '请输入工艺段名称', trigger: 'blur' },
					],
					WorkCellCode:[
						{ required: true, message: '请输入工艺段编码', trigger: 'blur' },
					],
					WorkCellType:[
						{ required: true, message: '请选择工艺段类型', trigger: 'change' },
					],
					CellPosition:[
						{ required: true, message: '请选择工艺段序列', trigger: 'change' },
					],
				},

				workMachineTableData:[],
				workMachineColumns:[{prop:"MachineName",label:"机器名称"},{prop:"MachineCode",label:"机器编码"},
					{prop:"MachineID",label:"机器编号"}, {prop:"MachinePosition",label:"机器序列"},
					{prop:"SerialNumber",label:"铭牌号"},{prop:"Desc",label:"机器描述"}],
				workMachineEditVisible:false,
				workMachineFormData:{},
				workMachineFormRules: {
					MachineName: [
						{required: true, message: '请输入机器名称', trigger: 'blur'},
					],
					MachineCode: [
						{required: true, message: '请输入机器编码', trigger: 'blur'},
					],
					MachineTypeID:[
						{required: true, message: '请选择机器类型', trigger: 'change'},
					],
					MachineID: [
						{required: true, message: '请输入机器编号', trigger: 'blur'},
					],
					MachinePosition: [
						{required: true, message: '请选择机器序列', trigger: 'change'},
					],
					WorkCellTypeID:[
						{required: true, message: '请选择工艺类型', trigger: 'change'},
					],
				},

				workTubeTableData:[],
				workTubeColumns:[{prop:"TubeName",label:"管道名称"},{prop:"TubePosition",label:"管道序列"},
					{prop:"Desc",label:"管道描述"}],
				workTubeEditVisible:false,
				workTubeFormData:{},
				workTubeFormRules:{
					TubeName: [
						{required: true, message: '请输入管道名称', trigger: 'blur'},
					],
					TubePosition: [
						{required: true, message: '请选择管道序列', trigger: 'change'},
					],
				},

				productLineTableData:[],
				productLineColumns:[{prop:"LineName",label:"产线名称"},{prop:"LineCode",label:"产线编码"}],
				productLineEditVisible:false,
				productLineFormData:{},
				productLineFormRules:{
					LineName: [
						{required: true, message: '请输入产线名称', trigger: 'blur'},
					],
					LineCode: [
						{required: true, message: '请输入产线编码', trigger: 'blur'},
					],
				},

				lineMachineTableData:[],
				lineMachineColumns:[{prop:"WorkCellName",label:"工艺段"},{prop:"MachineName",label:"机器名称"},
					{prop:"MachineCode",label:"机器编码"},
					{prop:"MachineID",label:"机器编号"},{prop:"MachinePosition",label:"机器序列"},
					{prop:"SerialNumber",label:"铭牌号"},{prop:"Desc",label:"机器描述"}],
				lineMachineEditVisible:false,
				machineByAreaData:[],
				selectMachineColumns:[{prop:"MachineName",label:"机器名称"}],

				workCellLineTableData:[],
				workCellLineColumns:[{prop:"WorkCenterID",label:"工作中心ID"}],
				workCellLineEditVisible:false,
				workCellLineFormData:{},
				productLineByAreaData:[],
				workCellLineFormRules:{
					LineID: [
						{required: true, message: '请选择产线', trigger: 'change'},
					],
					WorkCenterID: [
						{required: true, message: '请输入工作中心ID', trigger: 'blur'},
					],
				},

				geMachineColumns:[{prop:"MachineName",label:"机器名称"},{prop:"MachineCode",label:"机器编码"},
					{prop:"WorkCellName",label:"工艺段"},{prop:"AreaName",label:"车间"}],
				geMachineEditVisible:false,
				geMachineFormData:{},
			}
		},
		asyncComputed: {
			async getEnterpriseData() {
				let fd = new FormData();
				fd.set('flag', 'allEnterprise');
				let data=(await this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd)).data;
				if (data){
					return data;
				}
				return [];
			},
			async getAddMachineHistoryData(){
				let fd = new FormData();
				fd.set('flag', 'getAddMachineHistory');
				let data=(await this.$axios.post('/mes/Service/GeService.ashx', fd)).data;
				if (data){
					return data;
				}
				return [];
			},
		},
		created(){
			this.getWorkCellTypeList();
		},
		methods: {
			getWorkCellTypeList(){
				let fd = new FormData();
				fd.set('flag', 'getWorkCellTypeList');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.workCellTypeData=res.data;
				});
			},

			enterpriseUpdate(row){
				this.enterpriseFormData=row;
				this.enterpriseEditVisible=true;
			},
			enterpriseEditSave(){
				this.$refs['enterpriseForm'].validate((valid) => {
					if (valid) {
						if (this.enterpriseFormData.EnterpriseID) {
							let fd = new FormData();
							fd.set('flag', 'EnterpriseEdit');
							fd.set('EnterpriseID',this.enterpriseFormData.EnterpriseID);
							fd.set('EnterpriseName',this.enterpriseFormData.EnterpriseName);
							fd.set('EnterpriseCode',this.enterpriseFormData.EnterpriseCode);
							fd.set('Desc',this.enterpriseFormData.Desc);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.enterpriseEditCancel();
									this.enterpriseRefresh();
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
							fd.set('flag', 'EnterpriseInsert');
							fd.set('EnterpriseName',this.enterpriseFormData.EnterpriseName);
							fd.set('EnterpriseCode',this.enterpriseFormData.EnterpriseCode);
							fd.set('Desc',this.enterpriseFormData.Desc);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.enterpriseEditCancel();
									this.enterpriseRefresh();
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
					} else {
						return false;
					}
				});
			},
			enterpriseEditCancel(){
				this.enterpriseEditVisible=false;
				this.enterpriseFormData = {};
				this.$refs['enterpriseForm'].resetFields();
			},
			enterpriseDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'EnterpriseDel');
					fd.set('EnterpriseID',row.EnterpriseID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.enterpriseRefresh();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
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
			siteAdd(enterpriseID){
				this.siteFormData={"EnterpriseID":enterpriseID};
				this.siteEditVisible=true;
			},
			siteUpdate(row){
				this.siteFormData=row;
				this.siteEditVisible=true;
			},
			siteEditSave(){
				this.$refs['siteForm'].validate((valid) => {
					if (valid) {
						if (this.siteFormData.SiteID) {
							let fd = new FormData();
							fd.set('flag', 'SiteEdit');
							fd.set('EnterpriseID',this.siteFormData.EnterpriseID);
							fd.set('SiteID',this.siteFormData.SiteID);
							fd.set('SiteName',this.siteFormData.SiteName);
							fd.set('SiteCode',this.siteFormData.SiteCode);
							fd.set('Desc',this.siteFormData.Desc);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.siteEditCancel();
									this.enterpriseRefresh();
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
							fd.set('flag', 'SiteInsert');
							fd.set('EnterpriseID',this.siteFormData.EnterpriseID);
							fd.set('SiteName',this.siteFormData.SiteName);
							fd.set('SiteCode',this.siteFormData.SiteCode);
							fd.set('Desc',this.siteFormData.Desc);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.siteEditCancel();
									this.enterpriseRefresh();
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
					} else {
						return false;
					}
				});
			},
			siteEditCancel(){
				this.siteEditVisible=false;
				this.siteFormData = {};
				this.$refs['siteForm'].resetFields();
			},
			siteDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'SiteDel');
					fd.set('SiteID',row.SiteID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.enterpriseRefresh();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
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
			areaAdd(siteID){
				this.areaFormData={"SiteID":siteID};
				this.areaEditVisible=true;
			},
			areaUpdate(row){
				this.areaFormData=row;
				this.areaEditVisible=true;
			},
			areaEditSave(){
				this.$refs['areaForm'].validate((valid) => {
					if (valid) {
						if (this.areaFormData.AreaID) {
							let fd = new FormData();
							fd.set('flag', 'AreaEdit');
							fd.set('SiteID',this.areaFormData.SiteID);
							fd.set('AreaID',this.areaFormData.AreaID);
							fd.set('AreaName',this.areaFormData.AreaName);
							fd.set('AreaCode',this.areaFormData.AreaCode);
							fd.set('Desc',this.areaFormData.Desc);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.areaEditCancel();
									this.enterpriseRefresh();
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
							fd.set('flag', 'AreaInsert');
							fd.set('SiteID',this.areaFormData.SiteID);
							fd.set('AreaName',this.areaFormData.AreaName);
							fd.set('AreaCode',this.areaFormData.AreaCode);
							fd.set('Desc',this.areaFormData.Desc);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.areaEditCancel();
									this.enterpriseRefresh();
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
					} else {
						return false;
					}
				});
			},
			areaEditCancel(){
				this.areaEditVisible=false;
				this.areaFormData = {};
				this.$refs['areaForm'].resetFields();
			},
			areaDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'AreaDel');
					fd.set('AreaID',row.AreaID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.enterpriseRefresh();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
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

			enterpriseRefresh(){
				this.$asyncComputed.getEnterpriseData.update();
				this.$refs.workcelltree.$asyncComputed.getEnterpriseToAreaTreeData.update();
				this.$refs.workmachinetree.$asyncComputed.getEnterpriseToWorkcellTreeData.update();
				this.$refs.worktubetree.$asyncComputed.getEnterpriseToWorkmachineTreeData.update();
				this.$refs.productlinetree.$asyncComputed.getEnterpriseToAreaTreeData.update();
				this.$refs.linemachinetree.$asyncComputed.getEnterpriseToLineTreeData.update();
				this.$refs.workcelllinetree.$asyncComputed.getEnterpriseToWorkcellTreeData.update();
			},

			getWorkCellListByAreaID(){
				let node = this.$refs.workcelltree.currentNode;
				if (node.Type===2) {
					let fd = new FormData();
					fd.set('flag', 'getWorkcellByAreaId');
					fd.set('areaId',node.id);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.workCellTableData=res.data;
					});
				}else {
					this.workCellTableData=[];
				}
			},
			workCellAdd(){
				this.workCellFormData={};
				this.workCellEditVisible=true;
				let node = this.$refs.workcelltree.currentNode;
				if (node && node.Type===2){
					this.workCellFormData.AreaID= node.ID;
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体车间！'
					});
				}
			},
			workCellUpdate(row){
				this.workCellFormData=row;
				this.workCellEditVisible=true;
			},
			workCellEditSave(){
				this.$refs['workCellForm'].validate((valid) => {
					if (valid) {
						if (this.workCellFormData.WorkCellID) {
							let fd = new FormData();
							fd.set('flag', 'WorkCellEdit');
							fd.set('AreaID',this.workCellFormData.AreaID);
							fd.set('WorkCellName',this.workCellFormData.WorkCellName);
							fd.set('WorkCellCode',this.workCellFormData.WorkCellCode);
							fd.set('WorkCellType',this.workCellFormData.WorkCellType);
							fd.set('Desc',this.workCellFormData.Desc);
							fd.set('WorkCenter',this.workCellFormData.WorkCenter);
							fd.set('WorkCellID',this.workCellFormData.WorkCellID);
							fd.set('CellPosition', (this.workCellFormData.CellPosition == null || this.workCellFormData.CellPosition === "undefined" || this.workCellFormData.CellPosition === "") ? 0 : this.workCellFormData.CellPosition);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.workCellEditCancel();
									this.workCellRefresh();
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
							if (this.workCellFormData.AreaID) {
								let fd = new FormData();
								fd.set('flag', 'WorkCellInsert');
								fd.set('AreaID',this.workCellFormData.AreaID);
								fd.set('WorkCellName',this.workCellFormData.WorkCellName);
								fd.set('WorkCellCode',this.workCellFormData.WorkCellCode);
								fd.set('WorkCellType',this.workCellFormData.WorkCellType);
								fd.set('Desc',this.workCellFormData.Desc);
								fd.set('WorkCenter',this.workCellFormData.WorkCenter);
								fd.set('CellPosition',(this.workCellFormData.CellPosition == null || this.workCellFormData.CellPosition === "undefined" || this.workCellFormData.CellPosition === "") ? 0 : this.workCellFormData.CellPosition);
								this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
									if (res.data.Result){
										this.workCellEditCancel();
										this.workCellRefresh();
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
							}else {
								this.workCellEditCancel();
								this.$message({
									type: 'warning',
									message: '请选择具体车间！'
								});
							}
						}
					} else {
						return false;
					}
				});
			},
			workCellEditCancel(){
				this.workCellFormData={};
				this.workCellEditVisible=false;
				this.$refs['workCellForm'].resetFields();
			},
			workCellDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'WorkCellDel');
					fd.set('WorkCellID',row.WorkCellID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.workCellRefresh();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
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

			workCellRefresh(){
				this.getWorkCellListByAreaID();
				this.$refs.workmachinetree.$asyncComputed.getEnterpriseToWorkcellTreeData.update();
				this.$refs.worktubetree.$asyncComputed.getEnterpriseToWorkmachineTreeData.update();
				this.$refs.workcelllinetree.$asyncComputed.getEnterpriseToWorkcellTreeData.update();
			},

			getWorkMachineListByWorkCellID(){
				let node = this.$refs.workmachinetree.currentNode;
				if (node.Type===4) {
					let fd = new FormData();
					fd.set('flag', 'getWorkmachineByWorkcellId');
					fd.set('workcellId',node.id);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.workMachineTableData=res.data;
					});
				}else {
					this.workMachineTableData=[];
				}
			},
			workMachineAdd(){
				this.workMachineFormData={};
				this.workMachineEditVisible=true;
				let node = this.$refs.workmachinetree.currentNode;
				if (node && node.Type===4){
					this.workMachineFormData.WorkCellID= node.ID;
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体工艺段！'
					});
				}
			},
			workMachineUpdate(row){
				this.workMachineFormData=row;
				this.workMachineEditVisible=true;
			},
			workMachineEditSave(){
				this.$refs['workMachineForm'].validate((valid) => {
					if (valid) {
						if (this.workMachineFormData.WorkMachineID) {
							let fd = new FormData();
							fd.set('flag', 'WorkMachineEdit');
							fd.set('WorkCellID',this.workMachineFormData.WorkCellID);
							fd.set('MachineName',this.workMachineFormData.MachineName);
							fd.set('MachineType',this.workMachineFormData.MachineTypeID);
							fd.set('MachineID',this.workMachineFormData.MachineID);
							fd.set('Desc',this.workMachineFormData.Desc);
							fd.set('WorkMachineID',this.workMachineFormData.WorkMachineID);
							fd.set('MachineCode',this.workMachineFormData.MachineCode);
							fd.set('serialNumber',this.workMachineFormData.SerialNumber);
							fd.set('workcellTypeId',this.workMachineFormData.WorkCellTypeID);
							fd.set('MachinePosition', (this.workMachineFormData.MachinePosition == null || this.workMachineFormData.MachinePosition === "undefined" || this.workMachineFormData.MachinePosition === "") ? 0 : this.workMachineFormData.MachinePosition);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.workMachineEditCancel();
									this.workMachineRefresh();
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
							if (this.workMachineFormData.WorkCellID) {
								let fd = new FormData();
								fd.set('flag', 'WorkMachineInsert');
								fd.set('WorkCellID',this.workMachineFormData.WorkCellID);
								fd.set('MachineName',this.workMachineFormData.MachineName);
								fd.set('MachineType',this.workMachineFormData.MachineTypeID);
								fd.set('MachineID',this.workMachineFormData.MachineID);
								fd.set('Desc',this.workMachineFormData.Desc);
								fd.set('MachineCode',this.workMachineFormData.MachineCode);
								fd.set('serialNumber',this.workMachineFormData.SerialNumber);
								fd.set('workcellTypeId',this.workMachineFormData.WorkCellTypeID);
								fd.set('MachinePosition', (this.workMachineFormData.MachinePosition == null || this.workMachineFormData.MachinePosition === "undefined" || this.workMachineFormData.MachinePosition === "") ? 0 : this.workMachineFormData.MachinePosition);
								this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
									if (res.data.Result){
										this.workMachineEditCancel();
										this.workMachineRefresh();
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
							}else {
								this.workMachineEditCancel();
								this.$message({
									type: 'warning',
									message: '请选择具体工艺段！'
								});
							}
						}
					} else {
						return false;
					}
				});

			},
			workMachineEditCancel(){
				this.workMachineFormData={};
				this.workMachineEditVisible=false;
				this.$refs['workMachineForm'].resetFields();
			},
			workMachineDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'WorkMachineDel');
					fd.set('WorkMachineID',row.WorkMachineID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.workMachineRefresh();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
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

			workMachineRefresh(){
				this.getWorkMachineListByWorkCellID();
				this.$refs.worktubetree.$asyncComputed.getEnterpriseToWorkmachineTreeData.update();
			},

			getWorkTubeListByWorkMachineID(){
				let node = this.$refs.worktubetree.currentNode;
				if (node.Type===5) {
					let fd = new FormData();
					fd.set('flag', 'getWorkTubeByWorkmachineId');
					fd.set('workmachineId',node.id);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.workTubeTableData=res.data;
					});
				}else {
					this.workTubeTableData=[];
				}
			},
			workTubeAdd(){
				this.workTubeFormData={};
				this.workTubeEditVisible=true;
				let node = this.$refs.worktubetree.currentNode;
				if (node && node.Type===5){
					this.workTubeFormData.WorkMachineID= node.ID;
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体工艺机器！'
					});
				}
			},
			workTubeUpdate(row){
				this.workTubeFormData=row;
				this.workTubeEditVisible=true;
			},
			workTubeEditSave(){
				this.$refs['workTubeForm'].validate((valid) => {
					if (valid) {
						if (this.workTubeFormData.TubeID) {
							let fd = new FormData();
							fd.set('flag', 'WorkTubeEdit');
							fd.set('TubeName',this.workTubeFormData.TubeName);
							fd.set('TubePosition',this.workTubeFormData.TubePosition);
							fd.set('WorkMachineID',this.workTubeFormData.WorkMachineID);
							fd.set('Desc',this.workTubeFormData.Desc===undefined?'':this.workTubeFormData.Desc);
							fd.set('WorkTubeID',this.workTubeFormData.TubeID);
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.workTubeEditCancel();
									this.getWorkTubeListByWorkMachineID();
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
							if (this.workTubeFormData.WorkMachineID) {
								let fd = new FormData();
								fd.set('flag', 'WorkTubeInsert');
								fd.set('TubeName',this.workTubeFormData.TubeName);
								fd.set('TubePosition',this.workTubeFormData.TubePosition);
								fd.set('WorkMachineID',this.workTubeFormData.WorkMachineID);
								fd.set('Desc',this.workTubeFormData.Desc===undefined?'':this.workTubeFormData.Desc);
								this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
									if (res.data.Result){
										this.workTubeEditCancel();
										this.getWorkTubeListByWorkMachineID();
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
							}else {
								this.workTubeEditCancel();
								this.$message({
									type: 'warning',
									message: '请选择具体工艺机器！'
								});
							}
						}
					} else {
						return false;
					}
				});
			},
			workTubeEditCancel(){
				this.workTubeFormData={};
				this.workTubeEditVisible=false;
				this.$refs['workTubeForm'].resetFields();
			},
			workTubeDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'WorkTubeDel');
					fd.set('WorkTubeID',row.TubeID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getWorkTubeListByWorkMachineID();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
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

			getProductLineListByAreaID(){
				let node = this.$refs.productlinetree.currentNode;
				if (node.Type===2) {
					let fd = new FormData();
					fd.set('flag', 'getProductLineByAreaId');
					fd.set('areaId',node.id);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.productLineTableData=res.data;
					});
				}else {
					this.productLineTableData=[];
				}
			},
			productLineAdd(){
				this.productLineFormData={Flag:true};
				this.productLineEditVisible=true;
				let node = this.$refs.productlinetree.currentNode;
				if (node && node.Type===2){
					this.productLineFormData.AreaID= node.ID;
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体车间！'
					});
				}
			},
			productLineUpdate(row){
				this.productLineFormData=row;
				this.productLineEditVisible=true;
			},
			productLineEditSave(){
				this.$refs['productLineForm'].validate((valid) => {
					if (valid) {
						if (this.productLineFormData.LineID) {
							let fd = new FormData();
							fd.set('flag', 'editProductLine');
							fd.set('productLineData',JSON.stringify(this.productLineFormData));
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.productLineEditCancel();
									this.productLineRefresh();
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
							if (this.productLineFormData.AreaID) {
								let fd = new FormData();
								fd.set('flag', 'insertProductLine');
								fd.set('productLineData',JSON.stringify(this.productLineFormData));
								this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
									if (res.data.Result){
										this.productLineEditCancel();
										this.productLineRefresh();
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
							}else {
								this.productLineEditCancel();
								this.$message({
									type: 'warning',
									message: '请选择具体车间！'
								});
							}
						}
					} else {
						return false;
					}
				});
			},
			productLineEditCancel(){
				this.productLineFormData={};
				this.productLineEditVisible=false;
				this.$refs['productLineForm'].resetFields();
			},
			productLineDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteProductLine');
					fd.set('productLineId',row.LineID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.productLineRefresh();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
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

			productLineRefresh(){
				this.getProductLineListByAreaID();
				this.$refs.linemachinetree.$asyncComputed.getEnterpriseToLineTreeData.update();
			},

			getLineMachineListByLineID(){
				this.$refs.linemachinetable.clearMultipleSelection();
				let node = this.$refs.linemachinetree.currentNode;
				if (node.Type===3) {
					let fd = new FormData();
					fd.set('flag', 'getWorkmacineByProductLineId');
					fd.set('productLineId',node.id);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
							this.lineMachineTableData=res.data ;
					});

					let pfd = new FormData();
					pfd.set('flag', 'getProductLineByAreaId');
					pfd.set('areaId',node.parentId);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', pfd).then(res => {
						this.productLineByAreaData=res.data;
					});
				}else {
					this.lineMachineTableData=[];
				}
			},
			lineMachineAdd(){
				let node = this.$refs.linemachinetree.currentNode;
				if (node.Type===3){
					let fd = new FormData();
					fd.set('flag', 'getMachineByAreaId');
					fd.set('areaId',node.ParentID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.machineByAreaData=res.data;
					});
					this.lineMachineEditVisible=true;
				} else {
					this.$message({
						type: 'warning',
						message: '请选择具体产线！'
					});
				}
			},
			lineMachineAddSave(){
				let selectMachines= this.$refs.selectlinemachinetable.multipleSelectionAll;
				if (selectMachines.length>0){
					let machineIds = selectMachines.map((item)=>{return item.WorkMachineID;});
					let fd = new FormData();
					fd.set('flag', 'addLineMachines');
					fd.set('lineId',this.$refs.linemachinetree.currentNode.id);
					fd.set('machineIdList',JSON.stringify(machineIds));
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.lineMachineAddCancel();
							this.getLineMachineListByLineID();
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
				} else {
					this.$message({
						type: 'warning',
						message: '请选择具体机器！'
					});
				}
			},
			lineMachineAddCancel(){
				this.lineMachineEditVisible=false;
				this.$refs.selectlinemachinetable.clearMultipleSelection();
			},
			lineMachineDelete(){
				let lineMachines=this.$refs.linemachinetable.multipleSelectionAll;
				if (lineMachines.length>0){
					let machineIds = lineMachines.map((item)=>{return item.WorkMachineID;});
					let fd = new FormData();
					fd.set('flag', 'deleteMachineRelation');
					fd.set('lineId',this.$refs.linemachinetree.currentNode.id);
					fd.set('machineIdList',JSON.stringify(machineIds));
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getLineMachineListByLineID();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
						}else {
							this.$message({
								type: 'error',
								message: res.data.Message,
								showClose: true,
							});
						}
					})
				} else {
					this.$message({
						type: 'warning',
						message: '请选择具体机器！'
					});
				}
			},

			getWorkCellLineListByWorkCellID(){
				let node = this.$refs.workcelllinetree.currentNode;
				if (node.Type===4) {
					let fd = new FormData();
					fd.set('flag', 'getLineByWorkcellId');
					fd.set('workcellId',node.id);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						this.workCellLineTableData=res.data;
					});


					let pfd = new FormData();
					pfd.set('flag', 'getProductLineByAreaId');
					pfd.set('areaId',node.parentId);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', pfd).then(res => {
						this.productLineByAreaData=res.data;
					});
				}else {
					this.workCellLineTableData=[];
					this.productLineByAreaData=[];
				}
			},
			workCellLineAdd(){
				this.workCellLineFormData={};
				this.workCellLineEditVisible=true;
				let node = this.$refs.workcelllinetree.currentNode;
				if (node && node.Type===4){
					this.workCellLineFormData.WorkCellID= node.ID;
					this.workCellLineFormData.LongWorkCellID=node.id;
				}else {
					this.$message({
						type: 'warning',
						message: '请选择具体工艺段！'
					});
				}
			},
			workCellLineUpdate(row){
				this.workCellLineFormData=row;
				this.workCellLineEditVisible=true;
			},
			workCellLineEditSave(){
				this.$refs['workCellLineForm'].validate((valid) => {
					if (valid) {
						if (this.workCellLineFormData.LineCellID) {
							let fd = new FormData();
							fd.set('flag', 'updateLineCell');
							fd.set('lineCellInfo',JSON.stringify(this.workCellLineFormData));
							this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
								if (res.data.Result){
									this.workCellLineEditCancel();
									this.getWorkCellLineListByWorkCellID();
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
							if (this.workCellLineFormData.WorkCellID) {
								let fd = new FormData();
								fd.set('flag', 'addLineCell');
								fd.set('lineCellInfo',JSON.stringify(this.workCellLineFormData));
								this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
									if (res.data.Result){
										this.workCellLineEditCancel();
										this.getWorkCellLineListByWorkCellID();
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
							}else {
								this.workCellLineEditCancel();
								this.$message({
									type: 'warning',
									message: '请选择具体工艺段！'
								});
							}
						}
					} else {
						return false;
					}
				});
			},
			workCellLineEditCancel(){
				this.workCellLineFormData={};
				this.workCellLineEditVisible=false;
				this.$refs['workCellLineForm'].resetFields();
			},
			workCellLineDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteLineCell');
					fd.set('lineCellId',row.LineCellID);
					this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
						if (res.data.Result){
							this.getWorkCellLineListByWorkCellID();
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
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

			getAddGeMachineData(){
				let fd = new FormData();
				fd.set('flag', 'getAddGeMachineData');
				this.$axios.post('/mes/Service/GeService.ashx', fd).then(res => {
					if (res.data==="success"){
						this.$message({
							type: 'success',
							message: '更新成功！'
						});
						this.$asyncComputed.getAddMachineHistoryData.update();
					}else {
						this.$message({
							type: 'error',
							message: res.data,
							showClose: true,
						});
					}
				});
			},
			geMachineUpdate(row){
				this.geMachineFormData=row;
				this.geMachineEditVisible=true;
			},
			geMachineEditSave() {
				let fd = new FormData();
				fd.set('flag', 'syncWorkMachine');
				fd.set('id', this.geMachineFormData.ID);
				fd.set('MachineName', this.geMachineFormData.MachineName);
				fd.set('MachineType', this.geMachineFormData.MachineTypeID);
				fd.set('MachinePosition', this.geMachineFormData.MachinePosition);
				fd.set('MachineID', this.geMachineFormData.MachineID);
				fd.set('Desc', this.geMachineFormData.Desc);
				fd.set('serialNumber', this.geMachineFormData.SerialNumber);
				fd.set('workcellTypeId', this.geMachineFormData.WorkCellTypeID);
				this.$axios.post('/mes/Service/GeService.ashx', fd).then(res => {
					if (res.data === 'success') {
						this.geMachineEditCancel();
						this.$asyncComputed.getAddMachineHistoryData.update();
						this.$message({
							type: 'success',
							message: '同步成功！'
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
			geMachineEditCancel(){
				this.geMachineEditVisible=false;
				this.geMachineFormData = {};
			},
		}
	}
</script>

<style scoped>

</style>