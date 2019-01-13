
const {PASSWD_FILE_PATH} = require('../config/config');
const {parseUsers} = require('../util/file-parser');
const {queryGroups} = require('./group.repository');

const supportedFilterProps = ['name', 'uid', 'gid', 'comment', 'home', 'shell'];

async function getAllUsers() {
    return await parseUsers(PASSWD_FILE_PATH);
}

async function getUserById(id) {
    const users = await module.exports.getAllUsers();

    return users.find(user => user.uid === id);
}

async function getUserGroups(id) {
    const user = await getUserById(id);
    return await queryGroups({members: [user.name]})
}

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