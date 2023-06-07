const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const RegularClass = require("../models/regular_class.model");

class RegularClassService {
    async findAllRegularClassByDepartmentId(departmentId) {
        try {
            const listRegularClass = await RegularClass.findAll({
                where: {
                    department_id: departmentId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return listRegularClass;
        } catch (error) {
            throw error;
        }
    }
    async createRegularClass(className, departmentId) {
        try {
            const newClass = await RegularClass.create({
                class_name: className,
                department_id: departmentId
            });
            return newClass;
        } catch(error) {
            throw error;
        }
    }
}

module.exports = new RegularClassService;