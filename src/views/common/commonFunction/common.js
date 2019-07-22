export default {
	datetimeFormat(formatDatetime) {
		if (formatDatetime == null || formatDatetime == "") return "";
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
		if (formatTime == null || formatTime == "") return "";
		let date = new Date(formatTime);
		let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
		let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		return h + ":" + m;
	},
}