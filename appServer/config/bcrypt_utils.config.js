const bcrypt = require('bcrypt');
const SystemConst = require('../common/consts/system_const');
const EnumMessage = require('../common/enums/enum_message');

class BcryptUtils {
    constructor() {
        this.saltRounds = SystemConst.SALT_ROUNDS;
    }
    async hashPassword(plaintextPassword) {
        try {
            const hashedPassword = await bcrypt.hash(plaintextPassword, this.saltRounds);
            return hashedPassword;
        } catch (error) {
            throw new Error(EnumMessage.ERROR_HASHING_PASSWORD);
        }
    }
    async comparePassword(plaintextPassword, hashedPassword) {
        try {
            const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
            return isMatch;
        } catch(error) {
            throw new Error(EnumMessage.ERROR_COMPARING_PASSWORDS);
        }
    }
}

module.exports = new BcryptUtils;
