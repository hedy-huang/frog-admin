<template>
	<div class="common-table">
		<el-button v-if="allowAdding" icon="el-icon-plus" size="small" style="float: right" slot="reference" @click="handleAdd"></el-button>
		<el-table :data="showData">
			<el-table-column v-for="column in columns" :prop="column.prop" :label="column.label"
											 :formatter="column.type?(column.type=='datetime'?columnDateTimeFormat:(column.type=='time'?columnTimeFormat:columnDefault)):columnDefault">
			</el-table-column>
			<el-table-column v-if="allowUpdating&&allowDeleting" align="right">
				<template slot-scope="scope">
					<el-button v-if="allowUpdating"
							size="mini"
							@click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
					<el-button v-if="allowDeleting"
							size="mini"
							type="danger"
							@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination v-if="pagination" :total="data?data.length:0"
									 @current-change="currentChange"
									 :current-page.sync="currentPage"
									 layout="total, prev, pager, next" :hide-on-single-page=true>
		</el-pagination>

		<el-dialog  :visible.sync="editVisible" :before-close="handleEditCancel">
			<el-form ref="formData" :model="formData" label-position="left" label-width="100px" style="width: 95%">
				<el-form-item v-for="item in editFormItems" :label="item.label" >
					<el-input v-if="!item.type" v-model="formData[item.prop]"></el-input>
					<el-time-picker v-if="item.type=='time'" v-model="formData[item.prop]" value-format="HH:mm" style="width: 100%"></el-time-picker>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleEditSave">保存</el-button>
					<el-button @click="handleEditCancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "commonTable",
		props: {
			data: {
				required: true,
			},
			formData:{
				type: Object,
				required: true
			},
			columns: {
				type: Array,
				default: () => {
					return [];
				}
			},
			allowAdding:Boolean,
			allowUpdating:Boolean,
			allowDeleting:Boolean,
			pageSize: {
				type: Number,
				default: 10,
			},
			pagination: Boolean,
		},
		data(){
			return{
				currentPage: 1,
				editVisible:false,
				editFormItems:[],
			}
		},
		computed: {
			showData() {
				return this.pagination ? (this.data ? this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) : []) : this.data;
			}
		},
		methods:{
			currentChange(currentPage) {
				this.currentPage = currentPage;
			},
			columnDateTimeFormat(row, column, cellValue) {
				return this.common.datetimeFormat(cellValue);
			},
			columnTimeFormat(row, column, cellValue) {
				return this.common.timeFormat(cellValue);
			},
			columnDefault(row, column, cellValue) {
				return cellValue;
			},
			handleAdd(){
				this.editVisible=true;
				this.editFormItems=this.columns.filter(function (item) {
					if (item.editable!=false) {return item;}
				});
			},
			handleUpdate(index,row){
				this.editVisible=true;
				this.editFormItems=this.columns.filter(function (item) {
					if (item.editable!=false) {return item;}
				});
				this.formData=row;
			//	this.$emit('update',row);
			},
			handleDelete(index,row){
				this.$emit('delete',row);
			},
			handleEditSave(){
				this.$emit('edit',this.formData);
			},
			handleEditCancel(){
				this.editVisible=false;
				this.formData={};
			},
		}
	}
</script>

<style scoped>

</style>