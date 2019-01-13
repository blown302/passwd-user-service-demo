const {GROUP_FILE_PATH} = require('../config/config');
const {parseGroups} = require('../util/file-parser');

async function getAllGroups() {
    return await parseGroups(GROUP_FILE_PATH);
}

async function getGroupById(id) {
    const groups = await getAllGroups();
    return groups.find(g => g.gid === id);
}

async function queryGroups(params) {
    const filterPredicate = (group) => {
        let includeRecord = true;

        if (params.name !== undefined && params.name !== group.name) includeRecord = false;
        if (params.gid !== undefined && params.gid !== group.gid) includeRecord = false;
        if (params.members !==undefined
            && !params.members.every(pm => group.members.some(gm => pm === gm)))
            includeRecord = false;

        return includeRecord;
    };

    const groups = await getAllGroups();

    return groups.filter(filterPredicate);
}

module.exports.getAllGroups = getAllGroups;
module.exports.getGroupById = getGroupById;
module.exports.queryGroups = queryGroups;
