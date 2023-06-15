const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const RegularClass = require("../models/regular_class.model");
const Department = require("../models/department.model");

class RegularClassService {
    async findRegularClassByDepartmentId(regularClassId, departmentId) {
        try {
            const regularClass = await RegularClass.findOne({
                where: {
                    id: regularClassId,
                    status: EnumServerDefinitions.STATUS.ACTIVE,
                }, include: [{
                    model: Department,
                    where: {
                        id: departmentId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    }
                }]
            });
            return regularClass;
        } catch (error) {
            throw error;
        }
    }
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
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new RegularClassService;