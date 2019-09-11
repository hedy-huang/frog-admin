<template>
	<div>
		<production-page cell-type="BT" :first-route="true"></production-page>
	</div>
</template>

<script>
	import ProductionPage from "../common/commonComponent/productionPage";
	export default {
		name: "texture",
		components: {ProductionPage},
	}
</script>

<style scoped>

</style>