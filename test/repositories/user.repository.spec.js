const assert = require('assert');
const proxyQuire = require('proxyquire').noCallThru();

const proxyStub = {};

describe('user repository tests', () => {
    describe('given queryUsers is called', () => {
        const allUsers = [
            {name: 'root', uid: 0, gid: 0, comment: 'root', home: '/root', 'shell': "/bin/bash"},
            {name: 'tom', uid: 2, gid: 2, comment: 'tom', home: '/home/tom', 'shell': "/bin/bash"},
            {name: 'docker', uid: 3, gid: 3, comment: 'docker', home: '/home/docker', 'shell': "/bin/bash"},
        ];

        proxyStub.parseUsers = () => allUsers;

        const {queryUsers} = proxyQuire('../../app/repositories/user.repository', {'../util/file-parser': proxyStub});


        it('should return all results with empty params', async () => {
            const users = await queryUsers({});

            assert.deepStrictEqual(users, allUsers);
        });

        it('should return tom with uid 2 results with uid filer', async () => {
            const users = await queryUsers({uid: 2});

            assert.deepStrictEqual(users, allUsers.slice(1, 2));
        });

        it('should return docker results with uid and name filter', async () => {
            const users = await queryUsers({uid: 3, name: 'docker'});

            assert.deepStrictEqual(users, allUsers.slice(2, 3));
        });
    });
});