
const {PASSWD_FILE_PATH} = require('../config/config');
const {parseUsers} = require('../util/file-parser');

module.exports.getAllUsers = async () => {
    return await parseUsers(PASSWD_FILE_PATH);
};