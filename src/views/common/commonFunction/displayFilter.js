export function displayFilter(value,source,valueExpr,displayExpr) {
	let display = "";
	if (source){
		let temp = source.find((item) => {
			return item[valueExpr] == value;
		});
		if (temp) {
			display = temp[displayExpr];
		}
	}
	return display;
}