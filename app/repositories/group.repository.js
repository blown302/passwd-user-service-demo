const {GROUP_FILE_PATH} = require('../config/config');
const {parseGroups} = require('../util/file-parser');

module.exports.getAllGroups = async () => {
    let groups;
    try {
        groups = await parseGroups(GROUP_FILE_PATH);
    } catch (e) {
        console.log(e);
        throw e;
    }
    return groups;
};