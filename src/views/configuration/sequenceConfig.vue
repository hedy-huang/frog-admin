<template>
	<div>
		<common-table :data="getSequenceData" :columns="noRuleColumns"
									:pagination="true"
									:allowAdding="true" :allow-updating="true" :allow-deleting="true"
									@add="noRuleUpdate({})" @update="noRuleUpdate" @delete="noRuleDelete"
									:show.sync="noRuleEditVisible">
			<el-table-column type="expand" slot="expand">
				<template slot-scope="scope">
					<common-table :data="scope.row.SubItem" :columns="subItemColumns"
												:pagination="true"
												:allowAdding="true" :allow-updating="true" :allow-deleting="true"
												@add="subItemAdd(scope.row.SequenceNOID)" @update="subItemUpdate" @delete="subItemDelete"
												:show.sync="subItemEditVisible">
						<el-table-column slot="columnR" prop="SubitemType" label="子类型">
							<template slot-scope="scope">
								{{scope.row.SubitemType|displayFilter(subItemTypeList,"EnumValue","Description")}}
							</template>
						</el-table-column>
						<el-table-column slot="columnR" prop="Flag" label="可见">
							<template slot-scope="scope">
								{{scope.row.Flag|displayFilter(subItemFlagList,"Value","Text")}}
							</template>
						</el-table-column>
						<el-table-column slot="columnR" prop="StaticFlag" label="是否静态值">
							<template slot-scope="scope">
								{{scope.row.StaticFlag|displayFilter(staticFlagList,"Value","Text")}}
							</template>
						</el-table-column>
						<div slot="dialog" >
							<el-form :model="subItemFormData" label-position="left" label-width="100px" style="width: 95%">
								<el-form-item label="队列">
									<el-input-number v-model="subItemFormData.OrderNo" style="width: 100%"></el-input-number>
								</el-form-item>
								<el-form-item label="长度">
									<el-input-number v-model="subItemFormData.Length" style="width: 100%"></el-input-number>
								</el-form-item>
								<el-form-item label="子类型">
									<el-select v-model="subItemFormData.SubitemType" style="width:100%">
										<el-option v-if="subItemTypeList.length>0"
															 v-for="item in subItemTypeList"
															 :key="item.EnumValue" :label="item.Description" :value="item.EnumValue">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="可用元素">
									<el-input v-model="subItemFormData.ElementList"></el-input>
								</el-form-item>
								<el-form-item label="描述">
									<el-input v-model="subItemFormData.Desc"></el-input>
								</el-form-item>
								<el-form-item label="可见">
									<el-select v-model="subItemFormData.Flag" style="width:100%">
										<el-option v-if="subItemFlagList.length>0"
															 v-for="item in subItemFlagList"
															 :key="item.Value" :label="item.Text" :value="item.Value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否静态值">
									<el-select v-model="subItemFormData.StaticFlag" style="width:100%">
										<el-option v-if="staticFlagList.length>0"
															 v-for="item in staticFlagList"
															 :key="item.Value" :label="item.Text" :value="item.Value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button @click="subItemEditSave">保存</el-button>
									<el-button @click="subItemEditCancel">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</common-table>
				</template>
			</el-table-column>
			<el-table-column slot="columnR" prop="Flag" label="状态">
				<template slot-scope="scope">
					{{scope.row.Flag|displayFilter(flagList,"Value","Text")}}
				</template>
			</el-table-column>
			<div slot="dialog" >
				<el-form :model="noRuleFormData" label-position="left" label-width="100px" style="width: 95%">
					<el-form-item label="号码组">
						<el-input v-model="noRuleFormData.SequenceNOName"></el-input>
					</el-form-item>
					<el-form-item label="描述">
						<el-input v-model="noRuleFormData.Desc"></el-input>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="noRuleFormData.Flag" style="width:100%">
							<el-option v-if="flagList.length>0"
												 v-for="item in flagList"
												 :key="item.Value" :label="item.Text" :value="item.Value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="noRuleEditSave">保存</el-button>
						<el-button @click="noRuleEditCancel">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</common-table>
	</div>
</template>

<script>
	import {displayFilter} from "../common/commonFunction/displayFilter";
	import CommonTable from "../common/commonComponent/commonTable";

	export default {
		name: "sequenceConfig",
		components: {CommonTable},
		filters:{
			displayFilter,
		},
		data(){
			return {
				flagList:[{ Text: "Enable", Value: 0 }, { Text: "Disable", Value: 1 }],
				subItemFlagList:[{ Text: '可见', Value: 0 }, { Text: '不可见', Value: 1 }],
				staticFlagList:[{ Text: '静态值', Value: true }, { Text: '动态值', Value: false }],
				subItemTypeList:[],
				noRuleColumns:[{prop:"SequenceNOName",label:"号码组"},{prop:"Desc",label:"描述"}],
				noRuleEditVisible:false,
				noRuleFormData:{},
				subItemColumns:[{prop:"OrderNo",label:"队列"},{prop:"Length",label:"长度"},
					{prop:"ElementList",label:"可用元素"},{prop:"Desc",label:"描述"}],
				subItemEditVisible:false,
				subItemFormData:{},
			}
		},
		asyncComputed:{
			async getSequenceData() {
				let fd = new FormData();
				fd.set('flag', 'LoadSequenceSource');
				return (await this.$axios.post('/mes/Service/SequenceConfig.ashx', fd)).data;
			},
		},
		created(){
			this.getSubItemTypeData();
		},
		methods:{
			getSubItemTypeData(){
				let fd = new FormData();
				fd.set('flag', 'getSequenceSubItemTypeList');
				this.$axios.post('/mes/Service/SequenceConfig.ashx', fd).then(res => {
				 this.subItemTypeList=res.data;
				})
			},
			noRuleUpdate(row){
				this.noRuleFormData=row;
				this.noRuleEditVisible=true;
			},
			noRuleEditSave(){
				if (this.noRuleFormData.SequenceNOID) {
					let fd = new FormData();
					fd.set('flag', 'UPDATE');
					fd.set('Con',JSON.stringify(this.noRuleFormData));
					this.$axios.post('/mes/Service/SequenceConfig.ashx', fd).then(res => {
						if (res.data==='success'){
							this.noRuleEditCancel();
							this.$asyncComputed.getSequenceData.update();
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
					fd.set('flag', 'INSERT');
					fd.set('Con',JSON.stringify(this.noRuleFormData));
					this.$axios.post('/mes/Service/SequenceConfig.ashx', fd).then(res => {
						if (res.data==='success'){
							this.noRuleEditCancel();
							this.$asyncComputed.getSequenceData.update();
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
			noRuleEditCancel(){
				this.noRuleEditVisible=false;
				this.noRuleFormData = {};
			},
			noRuleDelete(row){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(()=>{
					let fd = new FormData();
					fd.set('flag', 'MDELETE');
					fd.set('Key',row.SequenceNOID);
					this.$axios.post('/mes/Service/SequenceConfig.ashx', fd).then(res => {
						if (res.data==='success'){
							this.$asyncComputed.getSequenceData.update();
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

			subItemAdd(sequenceNOID){
				this.subItemEditVisible=true;
				this.subItemFormData={SequenceNOID:sequenceNOID};
			},
			subItemUpdate(row){
				this.subItemEditVisible=true;
				this.subItemFormData=row;
	},
			subItemEditSave(){
		if (this.subItemFormData.SubSequenceNOID) {
			let fd = new FormData();
			fd.set('flag', 'UPDATEDE');
			fd.set('Con',JSON.stringify(this.subItemFormData));
			this.$axios.post('/mes/Service/SequenceConfig.ashx', fd).then(res => {
				if (res.data==='success'){
					this.subItemEditCancel();
					this.$asyncComputed.getSequenceData.update();
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
			fd.set('flag', 'INSERTDE');
			fd.set('key',this.subItemFormData.SequenceNOID);
			fd.set('Con',JSON.stringify(this.subItemFormData));
			this.$axios.post('/mes/Service/SequenceConfig.ashx', fd).then(res => {
				if (res.data==='success'){
					this.subItemEditCancel();
					this.$asyncComputed.getSequenceData.update();
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
			subItemEditCancel(){
				this.subItemEditVisible=false;
				this.subItemFormData={};
	},
			subItemDelete(row){
		this.$confirm('确认删除该数据?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		}).then(()=>{
			let fd = new FormData();
			fd.set('flag', 'DELETE');
			fd.set('Key',row.SubSequenceNOID);
			this.$axios.post('/mes/Service/SequenceConfig.ashx', fd).then(res => {
				if (res.data==='success'){
					this.$asyncComputed.getSequenceData.update();
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