<template>
	<div class="time-query-form">
		<el-form :inline="true" :model="queryFormData">
			<el-form-item label="开始时间">
				<el-date-picker v-model="queryFormData.BeginTime" type="datetime" :clearable="clearable" placeholder="选择开始时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间">
				<el-date-picker v-model="queryFormData.EndTime" type="datetime" :clearable="clearable" placeholder="选择结束时间">
				</el-date-picker>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: "timeQueryForm",
		props:{
			queryFormData:{BeginTime:"",EndTime:""},
			clearable:{
				type:Boolean,
				default: true
			}
		},
		data(){
			return {
			}
		},
	}
</script>

<style scoped>

</style>