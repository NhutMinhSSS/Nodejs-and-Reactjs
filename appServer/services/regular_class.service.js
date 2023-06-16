const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const RegularClass = require("../models/regular_class.model");
const Department = require("../models/department.model");
const Classroom = require("../models/classroom.model");

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
    async findAllRegularClass() {
        try {
            const faculty = await RegularClass.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return faculty;
        } catch (error) {
            throw error;
        }
    }
    async updateRegularClass(id, className, departmentId) {
        try {
            return await RegularClass.update( {
                class_name: className,
                department_id: departmentId
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            } );
        } catch (error) {
            throw error;
        }
    }
    async deleteRegularClass(id, transaction) {
        try {
            await Classroom.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    regular_class_id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return await RegularClass.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
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