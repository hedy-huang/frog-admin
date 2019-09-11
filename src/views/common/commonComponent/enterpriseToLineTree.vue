<template>
	<div class="enterprise-to-line-tree">
		<el-tree :data="getEnterpriseToLineTreeData" :props="defaultProps" highlight-current
						 :default-expand-all="expandAll"
						 @node-click="handleNodeClick" v-on="$listeners"
						 v-loading="this.$asyncComputed.getEnterpriseToLineTreeData.updating"></el-tree>
	</div>
</template>

<script>
	export default {
		name: "enterpriseToLineTree",
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
			async getEnterpriseToLineTreeData() {
				let fd = new FormData();
				fd.set('flag', 'getLineWorkmachineTree');
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
										let lines= list.filter((item)=>{ if (item.parentId==areas[k].id){return item;}});
										if (lines){
											areas[k].children=lines;
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