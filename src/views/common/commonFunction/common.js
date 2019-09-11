export default {
	datetimeFormat(formatDatetime) {
		if (formatDatetime == null || formatDatetime == ""||formatDatetime===undefined) return "";
		let date = new Date(formatDatetime);
		let Y = date.getFullYear();
		let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
		let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
	},
	timeFormat(formatTime) {
		if (formatTime == null || formatTime == ""||formatTime===undefined) return "";
		let date = new Date(formatTime);
		let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		return h + ":" + m;
	},
	groupData(source,groupName){
		if (source && source.length>0){
			let groupSource=[];
			let groupNames= [];
			for (let i=0;i<source.length;i++){
				if (groupNames.indexOf(source[i][groupName])===-1){
					groupNames.push(source[i][groupName]);
				}
			}
			for (let j=0;j<groupNames.length;j++) {
				let listTemp=source.filter((item)=>{return item[groupName]===groupNames[j];});
				if (listTemp.length>0){
					let temp={};
					temp[groupName]=groupNames[j];
					temp['List']=listTemp;
					groupSource.push(temp);
				}
			}
			return groupSource;
		}
		return [];
	},
}