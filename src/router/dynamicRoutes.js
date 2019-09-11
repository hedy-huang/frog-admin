import configuration from './configuration'
import productionManagement from './productionManagement'
import baseSetting from './baseSetting'
import processMonitor from './processManagement'
import traceability from './traceability'
import equipmentManagement from "./equipmentManagement";
import factoryMonitor from "./factoryMonitor";

const dynamicRoutes = [
	configuration,
	productionManagement,
	baseSetting,
	processMonitor,
	traceability,
	equipmentManagement,
	factoryMonitor
];

export default dynamicRoutes;
