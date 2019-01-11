const assert = require('assert');
const path = require('path');
const {parseGroups, parseUsers} = require('../../app/util/file-parser');


describe('file parsers tests', () => {
    describe('given valid passwd file', () => {
        it('should return mapped values', async () => {
            const users = await parseUsers(path.join(__dirname, 'passwd'));
            assert(users.length > 0, 'users should not be empty');

            const firstUser = users[0];

            const expectedGroup = {
                name: 'root',
                uid: 0,
                gid: 0,
                comment: 'root',
                home: '/root',
                shell: '/bin/bash'
            };

            assert.deepStrictEqual(firstUser, expectedGroup);
        });
    });

    describe('given valid group file', () => {
        it('should return mapped values', async () => {
            const groups = await parseGroups(path.join(__dirname, 'group'));
            assert(groups.length > 0, 'groups should not be empty');

            const firstGroup = groups[0];
            const expectedGroup = { name: 'users', gid: 100, members: ['node'] };
            assert.deepStrictEqual(firstGroup, expectedGroup);
        });
    })
});
