const EnumServerDefinitions = require("../common/enums/enum_server_definitions");
const Department = require("../models/department.model");
const Subject = require("../models/subject.model");


class DepartmentService {
    async addDepartment(departmentName, facultyId) {
       try {
        const newDepartment = Department.create({
            department_name: departmentName,
            faculty_id: facultyId
        });
        return newDepartment;
       } catch(error) {
        throw error;
       }
    }
}

module.exports = new DepartmentService;