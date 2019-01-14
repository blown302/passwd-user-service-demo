/**
 * user repository that parses a Unix style passwd file and performs filtering operations.
 */

const {PASSWD_FILE_PATH} = require('../config/config');
const {parseUsers} = require('../util/file-parser');
const {queryGroups} = require('./group.repository');

const supportedFilterProps = ['name', 'uid', 'gid', 'comment', 'home', 'shell'];

/**
 * Gets all users in the parsed file.
 *
 * @returns {Promise<Array<Object>>} represents a list of users.
 */
async function getAllUsers() {
    return await parseUsers(PASSWD_FILE_PATH);
}

/**
 * Gets the user with the provided uid.
 *
 * @param id The uid of the user record ot find.
 * @returns {Promise<Object>} represents a user.
 */
async function getUserById(id) {
    const users = await module.exports.getAllUsers();

    return users.find(user => user.uid === id);
}

/**
 * Get the groups a user is a member of.
 *
 * @param id The uid of the user.
 * @returns {Promise<Array<Object>>} represents a list of groups the user is part of.
 */
async function getUserGroups(id) {
    const user = await getUserById(id);
    return await queryGroups({members: [user.name]})
}

/**
 * Gets users that meet query criteria. Assumes an exact match and all provided criteria must match.
 *
 * - name
 * - uid
 * - gid
 * - comment
 * - home
 * - shell
 *
 * @param params The query criteria to exact match.
 * @returns {Promise<Object[]>}
 */
async function queryUsers(params) {
    const filterPredicate = user => {
        return supportedFilterProps.every(prop => {
            return params[prop] === undefined || params[prop] === user[prop];
        });
    };

    const users = await getAllUsers();
    return users.filter(filterPredicate);
}

module.exports.getAllUsers = getAllUsers;
module.exports.getUserById = getUserById;
module.exports.getUserGroups = getUserGroups;
module.exports.queryUsers = queryUsers;