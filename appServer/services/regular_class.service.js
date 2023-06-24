const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const RegularClass = require("../models/regular_class.model");
const Department = require("../models/department.model");
const Classroom = require("../models/classroom.model");
const moment = require('moment-timezone');
const SystemConst = require("../common/consts/system_const");

class RegularClassService {
    async findAllRegularClass() {
        try {
            const regularClass = await RegularClass.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'class_name', 'department_id']
            });
            return regularClass;
        } catch (error) {
            throw error;
        }
    }
    async findRegularClassByName(regularClassName) {
        try {
            const regularClass = await RegularClass.findOne({
                where: {
                    class_name: regularClassName
                }
            });
            return regularClass;
        } catch (error) {
            throw error;
        }
    }
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
                },
                attributes: ['id', 'class_name', 'create_date', 'department_id'],
                order: [
                    ['created_at', 'ASC'],
                    ['updated_at', 'ASC']
                ]
            });
            return faculty;
        } catch (error) {
            throw error;
        }
    }
    async updateRegularClass(id, className, departmentId) {
        try {
            const regularClass = await RegularClass.update({
                class_name: className,
                department_id: departmentId
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }
            });
            return !!regularClass;
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
            const regularClass = await RegularClass.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return !!regularClass;
        } catch (error) {
            throw error;
        }
    }
    async activeRegularClass(id, departmentId) {
        try {
            const createDate = moment.tz(SystemConst.TIME_ZONE).toDate();
            const regularClass = await RegularClass.update({
                create_date: createDate,
                department_id: departmentId,
                status: EnumServerDefinitions.STATUS.ACTIVE
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }
            });
            return !!regularClass;
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