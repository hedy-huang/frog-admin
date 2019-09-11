<template>
	<div class="enterprise-to-workcell-tree">
		<el-tree :data="getEnterpriseToWorkcellTreeData" :props="defaultProps" highlight-current
						 :default-expand-all="expandAll"
						 @node-click="handleNodeClick" v-on="$listeners"
						 v-loading="this.$asyncComputed.getEnterpriseToWorkcellTreeData.updating"></el-tree>
	</div>
</template>

<script>
	export default {
		name: "enterpriseToWorkcellTree",
		props: {
			expandAll: {
				type: Boolean,
				default: false,
			},
		},
		data(){
			return {
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				currentNode:{},
			}
		},
		asyncComputed:{
			async getEnterpriseToWorkcellTreeData() {
				let fd = new FormData();
				fd.set('flag', 'getWorkmachineTree');
				let list = (await this.$axios.post('/mes/Service/FactoryConfigService.ashx', fd)).data;
				let tree=[];
				let enterprises= list.filter((item)=>{ if (item.parentId==null){return item;}});
				if (enterprises){
					for (let i=0;i<enterprises.length;i++){
						let sites= list.filter((item)=>{ if (item.parentId==enterprises[i].id){return item;}});
						if (sites){
							for (let j=0;j<sites.length;j++){
								let areas= list.filter((item)=>{ if (item.parentId==sites[j].id){return item;}});
								if (areas){
									for (let k=0;k<areas.length;k++){
										let cells= list.filter((item)=>{ if (item.parentId==areas[k].id){return item;}});
										if (cells){
											areas[k].children=cells;
										}
									}
									sites[j].children=areas;
								}
							}
							enterprises[i].children=sites;
						}
						tree.push(enterprises[i]);
					}
				}
				return tree;
			}
		},
		methods:{
			handleNodeClick(data){
				this.currentNode=data;
				this.$emit('nodeClick',data);
			},
		}
	}
</script>

<style scoped>

</style>