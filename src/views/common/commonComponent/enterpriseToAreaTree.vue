<template>
	<div class="enterprise-to-area-tree">
		<el-tree :data="getEnterpriseToAreaTreeData" :props="defaultProps" highlight-current
						 :default-expand-all="expandAll"
						 @node-click="handleNodeClick" v-on="$listeners"
						 v-loading="this.$asyncComputed.getEnterpriseToAreaTreeData.updating"></el-tree>
	</div>
</template>

<script>
	export default {
		name: "enterpriseToAreaTree",
		props:{
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
			async getEnterpriseToAreaTreeData() {
				let fd = new FormData();
				fd.set('flag', 'getWorkcellTree');
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