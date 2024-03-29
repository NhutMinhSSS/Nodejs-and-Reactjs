const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const RegularClass = require("../models/regular_class.model");
const Department = require("../models/department.model");
const Classroom = require("../models/classroom.model");
const FormatUtils = require("../common/utils/format.utils");
const Student = require("../models/student.model");
const { Op } = require('sequelize');

class RegularClassService {
    async findAllRegularClass() {
        try {
            const regularClass = await RegularClass.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id', 'class_name', 'department_id'],
                order: [['class_name', 'ASC']]
            });
            return regularClass;
        } catch (error) {
            throw error;
        }
    }
    async findAllRegularClassAndStudentQuantity() {
        try {
            const regularClass = await RegularClass.findAll({
                where: {
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                include: [{
                    model: Department,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: ['department_name']
                }, {
                    model: Student,
                    required: false,
                    where: {
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    },
                    attributes: []
                }],
                attributes: ['id', 'class_name',
                    [RegularClass.sequelize.literal(`(SELECT COUNT(*) FROM students WHERE students.regular_class_id = Department.id and students.status = ${EnumServerDefinitions.STATUS.ACTIVE})`),
                        'student_quantity']]
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
    async findRegularClassById(regularClassId) {
        try {
            const regularClass = await RegularClass.findOne({
                where: {
                    id: regularClassId,
                    status: EnumServerDefinitions.STATUS.ACTIVE,
                },
                attributes: ['id', 'class_name', 'department_id'], /* include: [{
                    model: Department,
                    where: {
                        id: departmentId,
                        status: EnumServerDefinitions.STATUS.ACTIVE
                    }
                }] */
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
    async checkRegularClassExist(id) {
        try {
            const regularClass = await RegularClass.findOne({
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                },
                attributes: ['id']
            });
            return !!regularClass;
        } catch (error) {
            throw error;
        }
    }
    async updateRegularClass(id, className) {
        try {
            const isUpdate = await RegularClass.update({
                class_name: className,
            }, {
                where: {
                    id: id,
                    status: { [Op.in]: [EnumServerDefinitions.STATUS.ACTIVE, EnumServerDefinitions.STATUS.CLOSE] }
                }
            });
            return isUpdate > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async deleteRegularClass(regularClassId, transaction) {
        try {
            // await Student.update({
            //     status: EnumServerDefinitions.STATUS.NO_ACTIVE
            // }, {
            //     where: {
            //         regular_class_id: regularClassId,
            //         status: EnumServerDefinitions.STATUS.ACTIVE
            //     }, transaction
            // });
            await Classroom.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    regular_class_id: regularClassId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            const isDelete = await RegularClass.update({
                status: EnumServerDefinitions.STATUS.NO_ACTIVE
            }, {
                where: {
                    id: regularClassId,
                    status: EnumServerDefinitions.STATUS.ACTIVE
                }, transaction
            });
            return isDelete > EnumServerDefinitions.EMPTY;
        } catch (error) {
            throw error;
        }
    }
    async activeRegularClass(id, className, departmentId) {
        try {
            //const dateNow = FormatUtils.formatDateNow();
            const isActive = await RegularClass.update({
                class_name: className,
                create_date: dateNow,
                department_id: departmentId,
                status: EnumServerDefinitions.STATUS.ACTIVE,
                // created_at: dateNow,
                // updated_at: dateNow
            }, {
                where: {
                    id: id,
                    status: EnumServerDefinitions.STATUS.NO_ACTIVE
                }
            });
            return isActive > EnumServerDefinitions.EMPTY;
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