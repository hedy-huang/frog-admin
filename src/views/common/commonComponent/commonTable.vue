<template>
	<div class="common-table">
		<el-button v-if="allowAdding" icon="el-icon-plus" size="small" style="float: right" @click="handleAdd"></el-button>
		<el-table :data="showData" ref="table" :highlight-current-row="!multipleSelection"
							:show-header="showHeader" :default-expand-all="expandAll"
							@row-click="handleRowClick"  @select="handleSelect" @select-all="handleSelectAll"
							:row-key="rowKey" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
							:row-class-name="handleRowClass">
			<slot name="expand"></slot>
			<el-table-column v-if="multipleSelection" type="selection"></el-table-column>
			<slot name="columnL"></slot>
			<el-table-column v-for="column in columns" :prop="column.prop" :label="column.label"
											 :formatter="column.type?(column.type=='datetime'?columnDateTimeFormat:(column.type=='time'?columnTimeFormat:columnDefault)):columnDefault">
			</el-table-column>
			<slot name="columnR"></slot>
			<el-table-column v-if="allowUpdating||allowDeleting" align="right" width="100px">
				<template slot-scope="scope">
					<el-button v-if="allowUpdating"
							size="small" type="text"
							@click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
					<el-button v-if="allowDeleting"
							size="small" type="text"
							@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination v-if="pagination" :total="data?data.length:0"
									 :page-size="pageSize"
									 @current-change="currentChange"
									 :current-page.sync="currentPage"
									 layout="total, prev, pager, next" :hide-on-single-page=true>
		</el-pagination>
		<el-dialog :visible.sync="editVisible" @close="$emit('update:show', false)" :show="show" :before-close="handleEditCancel" append-to-body>
			<slot name="dialog"/>
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
			columns: {
				type: Array,
				default: () => {
					return [];
				}
			},
			show: {
				type: Boolean,
				default: false
			},
			allowAdding: {
				type: Boolean,
				default: false
			},
			allowUpdating: {
				type: Boolean,
				default: false
			},
			allowDeleting: {
				type: Boolean,
				default: false
			},
			pageSize: {
				type: Number,
				default: 10,
			},
			pagination: {
				type: Boolean,
				default: false
			},
			multipleSelection:{
				type:Boolean,
				default:false
			},
			rowKey:{
				type:String,
			},
			showHeader:{
				type:Boolean,
				default:true,
			},
			expandAll:{
				type:Boolean,
				default:false,
			}
		},
		watch:{
			show() {
				this.editVisible = this.show;
			}
		},
		data(){
			return{
				currentPage: 1,
				editVisible:this.show,
				currentRow:{},
				multipleSelectionAll:[],
			}
		},
		computed: {
			showData() {
				return this.data?(this.pagination?this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize):this.data):[];
			}
		},
		methods:{
			currentChange(currentPage) {
				this.currentPage = currentPage;
				if (this.multipleSelection){
					this.multipleSelectionChangePage();
				}
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
				this.$emit('add');
			},
			handleUpdate(index,row){
				this.editVisible=true;
				this.$emit('update',row);
			},
			handleDelete(index,row){
				this.$emit('delete',row);
			},
			handleEditCancel(){
				this.editVisible=false;
				this.$emit('dialogClose');
			},
			handleRowClick(row, column, event){
				this.currentRow=row;
				this.$emit('rowClick',row);
			},
			handleRowClass({row, rowIndex}){
				this.$emit('rowClass',row);
			},
      handleSelect(selection, row) {
				if (selection.indexOf(row)===-1) {
					this.multipleSelectionAll.splice(this.multipleSelectionAll.indexOf(row),1);
				}else{
					this.multipleSelectionAll.push(row);
				}
			},
			handleSelectAll(selection){
				if (selection.length==0){
					this.multipleSelectionAll=[];
				} else {
					this.multipleSelectionAll=this.data;
				}
			},
			multipleSelectionChangePage(){
				if (this.multipleSelectionAll.length>0) {
				 let currentPageData=	this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
				 for (let i =0;i<currentPageData.length;i++){
				 	let row = currentPageData[i];
				 	if (this.multipleSelectionAll.indexOf(row)===-1) {
				 		this.$refs.table.toggleRowSelection(row,false);
					}else {
						this.$refs.table.toggleRowSelection(row,true);
					}
				 }
				}
			},
			clearMultipleSelection(){
				this.multipleSelectionAll=[];
				this.$refs.table.clearSelection();
			},
		}
	}
</script>

<style scoped>
</style>