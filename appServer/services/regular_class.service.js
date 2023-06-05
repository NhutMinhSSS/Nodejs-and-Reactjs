const RegularClass = require("../models/regular_class.model");

class RegularClassService {
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