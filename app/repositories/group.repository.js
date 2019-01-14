/**
 * Group repository that parses a Unix style groups file and performs filtering operations.
 */

const {GROUP_FILE_PATH} = require('../config/config');
const {parseGroups} = require('../util/file-parser');

/**
 * Gets all groups in the parsed groups file.
 *
 * @returns {Promise<Array<Object>>} represents a list of groups.
 */
async function getAllGroups() {
    return await parseGroups(GROUP_FILE_PATH);
}


/**
 * Gets a group with the provided id.
 *
 * @param id The identifier of a group.
 * @returns {Promise<Object>} A promise of a Group object.
 */
async function getGroupById(id) {
    const groups = await getAllGroups();
    return groups.find(g => g.gid === id);
}

/**
 * Gets an {Array<Object>>} representing groups based on exact match parameters.
 * - String name
 * - {int} gid
 * - {Array<String>} members -- can be a subset to match
 *
 * If anything doesn't match the record will be filtered out. The members param only needed to be a subset.
 * However, if any one of the members doesn't exist in the record it will be filtered out.
 *
 * @param params The constraints for filtering.
 * @returns {Promise<Array<Object>>} A promise that represents a list of groups.
 */
async function queryGroups(params) {
    // create predicate including params as the filtering constraints.
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

// export for public functions.
module.exports.getAllGroups = getAllGroups;
module.exports.getGroupById = getGroupById;
module.exports.queryGroups = queryGroups;
