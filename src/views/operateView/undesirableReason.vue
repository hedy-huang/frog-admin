<template>
	<div>
		<common-table :data="getUndesirableReasonData" :show-header="false"
									:pagination="true"
									:allow-adding="true" @add="reasonAdd"
									:show.sync="reasonEditVisible"
									v-loading="this.$asyncComputed.getUndesirableReasonData.updating"
									@dialogClose="reasonEditCancel">
			<el-table-column slot="expand" type="expand">
				<template slot-scope="scope">
					<common-table :data="scope.row.List":show-header="false">
						<el-table-column slot="expand" type="expand">
							<template slot-scope="scope">
						<common-table :data="scope.row.List" :columns="reasonColumns"
													:pagination="true"
													:allow-deleting="true" @delete="reasonDelete">
						</common-table>
							</template>
						</el-table-column>
						<el-table-column slot="columnL" prop="CodeKind">
							<template slot-scope="scope">
								原因类别：{{scope.row.CodeKind|displayFilter(reasonCategoryList,"name","text")}}
							</template>
						</el-table-column>
					</common-table>
				</template>
			</el-table-column>
			<el-table-column slot="columnL" prop="WorkCellId">
				<template slot-scope="scope">
					工艺段：{{scope.row.WorkCellId|displayFilter(workCellList,"WorkCellID","DisplayName")}}
				</template>
			</el-table-column>
			<div slot="dialog">
				<el-form :model="reasonFormData" ref="reasonForm" :rules="reasonFormRules"
								 label-width="100px" style="width: 95%">
					<el-form-item label="工艺段" prop="WorkCellId">
						<el-select v-model="reasonFormData.WorkCellId" style="width: 100%">
							<el-option v-if="workCellList.length>0"
												 v-for="item in workCellList"
												 :key="item.WorkCellID" :label="item.DisplayName" :value="item.WorkCellID">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="原因类别" prop="CodeKind">
						<el-select v-model="reasonFormData.CodeKind" style="width: 100%">
							<el-option v-if="reasonCategoryList.length>0"
												 v-for="item in reasonCategoryList"
												 :key="item.name" :label="item.text" :value="item.name">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="原因名称" prop="CodeDesc">
						<el-input v-model="reasonFormData.CodeDesc"></el-input>
					</el-form-item>
					<el-form-item label="原因编码" prop="CodeNum">
						<el-input v-model="reasonFormData.CodeNum"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="reasonEditSave">保存</el-button>
						<el-button @click="reasonEditCancel">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</common-table>
	</div>
</template>

<script>
	import CommonTable from "../common/commonComponent/commonTable";
	import {displayFilter} from "../common/commonFunction/displayFilter";
	export default {
		name: "undesirableReason",
		components: {CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			return {
				workCellList:[],
				reasonCategoryList: [{name: "Debris", text: '碎片' }, {name: "Bad", text: '不良' },
					{name: "Abnormal", text: '异常' }, {name: "Scraped", text: '报废' }],
				reasonColumns:[{prop:"CodeDesc",label:"原因名称"},{prop:"CodeNum",label:"原因编码"}],
				reasonEditVisible:false,
				reasonFormData:{},
				reasonFormRules:{
					WorkCellId: [
						{required: true, message: '请选择工艺段', trigger: 'change'},
					],
					CodeKind: [
						{required: true, message: '请选择原因类别', trigger: 'change'},
					],
					CodeNum: [
						{required: true, message: '请输入原因编码', trigger: 'blur'},
					],
					CodeDesc: [
						{required: true, message: '请输入原因名称', trigger: 'blur'},
					],
				},
			}
		},
		asyncComputed:{
			async getUndesirableReasonData(){
				let fd = new FormData();
				fd.set('flag', 'getUndesirableReason');
				fd.set('workCellTypeId','');
				let reasonList= (await this.$axios.post('/mes/Service/SystemCodeInfoService.ashx', fd)).data;
				let cellList = this.common.groupData(reasonList,'WorkCellId');
				if (cellList.length>0){
					let temp=[];
					for (let i=0;i<cellList.length;i++){
						temp.push({WorkCellId:cellList[i].WorkCellId,List:this.common.groupData(cellList[i].List,'CodeKind')});
					}
					return temp;
				}
				return [];
			},
		},
		created(){
			this.getWorkCellData();
		},
		methods:{
			getWorkCellData(){
				let fd = new FormData();
				fd.set('flag', 'getWorkCellListByWorkCellType');
				this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd).then(res => {
					this.workCellList=res.data;
				});
			},

			reasonAdd(){
				this.reasonFormData={};
				this.reasonEditVisible=true;
			},
			reasonEditSave(){
				this.$refs['reasonForm'].validate((valid) => {
					if (valid) {
						let fd = new FormData();
						fd.set('flag', 'addUndesirableReason');
						fd.set('reasonData',JSON.stringify(this.reasonFormData));
						this.$axios.post('/mes/Service/SystemCodeInfoService.ashx', fd).then(res => {
							if (res.data==="success"){
								this.reasonEditCancel();
								this.$asyncComputed.getUndesirableReasonData.update();
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
					} else {
						return false;
					}
				});
			},
			reasonEditCancel(){
				this.reasonEditVisible=false;
				this.reasonFormData = {};
				this.$refs['reasonForm'].resetFields();
			},
			reasonDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'deleteUndesirableReason');
					fd.set('codeId',row.CodeID);
					this.$axios.post('/mes/Service/SystemCodeInfoService.ashx', fd).then(res => {
						if (res.data==="success"){
							this.$asyncComputed.getUndesirableReasonData.update();
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
		}
	}
</script>

<style scoped>

</style>