<template>
	<div class="time-query-form">
		<el-form :inline="true" :model="queryFormData">
			<el-form-item label="开始时间">
				<el-date-picker v-model="queryFormData.BeginTime" type="datetime" placeholder="选择开始时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间">
				<el-date-picker v-model="queryFormData.EndTime" type="datetime" placeholder="选择结束时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="handleSearch">搜索</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: "timeQueryForm",
		props:{
			queryFormData:{BeginTime:"",EndTime:""},
		},
		data(){
			return {
			}
		},
		methods:{
			handleSearch(){
				if (!this.queryFormData.BeginTime){
					this.$message({
						type: 'warning',
						message: '请选择开始时间！'
					});
					return;
				}
				if (!this.queryFormData.EndTime){
					this.$message({
						type: 'warning',
						message: '请选择结束时间！'
					});
					return;
				}
				this.$emit('query', this.queryFormData);
			},
		}
	}
</script>

<style scoped>

</style>