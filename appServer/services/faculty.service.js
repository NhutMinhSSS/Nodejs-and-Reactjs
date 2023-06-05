const EnumServerDefinitions = require('../common/enums/enum_server_definitions');
const Faculty = require('../models/faculty.model');

class FacultyService {
    async findFacultyByName(facultyName) {
        try {
            const faculty = await Faculty.findOne({
                where: {
                    faculty_name: facultyName,
                    status: EnumServerDefinitions.STATUS
                }
            });
            return !!faculty;
        } catch (error) {
            throw error;
        }
    }
    async addFaculty(facultyName) {
        try {
            // const checkExist = await this.findFacultyByName(facultyName);
            // if (checkExist) {
            //     throw new Error('Faculty name exits')
            // }
            const newFaculty = await Faculty.create({
                faculty_name: facultyName
            });
            return newFaculty;
        } catch(error) {
            throw error;
        }
    }
}

module.exports = new FacultyService;