const assert = require('assert');
const path = require('path');
const {Readable} = require('stream');
const proxyquire = require('proxyquire').noCallThru();


const proxyStub = {};
const parser = proxyquire('../../app/util/file-parser', {fs: proxyStub});




describe('file parsers tests', () => {
    let readStreamMock;
    beforeEach(() => {
        readStreamMock = new Readable();
        readStreamMock._read = size => {};

        proxyStub.createReadStream = _ => readStreamMock;
    });
    describe('given valid passwd file', () => {
        it('should return mapped values', async () => {
            const usersPromise = parser.parseUsers('');
            readStreamMock.emit('data', 'root:x:0:0:root:/root:/bin/bash\n');
            readStreamMock.emit('end');
            const users = await usersPromise;
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
        it('should return mapped values with members', async () => {
            const groupsPromise = parser.parseGroups('');
            readStreamMock.emit('data', 'users:x:100:node\n');
            readStreamMock.emit('end');
            const groups = await groupsPromise;
            assert(groups.length > 0, 'groups should not be empty');
            const firstGroup = groups[0];
            const expectedGroup = { name: 'users', gid: 100, members: ['node'] };
            assert.deepStrictEqual(firstGroup, expectedGroup);
        });

        it('should return mapped values no members', async () => {
            const groupsPromise = parser.parseGroups('');
            readStreamMock.emit('data', 'users:x:100:\n');
            readStreamMock.emit('end');
            const groups = await groupsPromise;
            assert(groups.length > 0, 'groups should not be empty');
            const firstGroup = groups[0];
            const expectedGroup = { name: 'users', gid: 100, members: [] };
            assert.deepStrictEqual(firstGroup, expectedGroup);
        });
    });

    describe('given passwd file has comments', () => {
        it('should ignore comments and process valid lines', async () => {
            const usersPromise = parser.parseUsers('');
            readStreamMock.emit('data', '#\n');
            readStreamMock.emit('data', 'root:x:0:0:root:/root:/bin/bash\n');
            readStreamMock.emit('end');
            const users = await usersPromise;
            assert.strictEqual(users.length, 1);
        });
    });

    describe('given groups file has comments', () => {
        it('should ignore comments and process valid lines', async () => {
            const groupsPromise = parser.parseGroups('');
            readStreamMock.emit('data', '#\n');
            readStreamMock.emit('data', 'users:x:100:node\n');
            readStreamMock.emit('end');
            const groups = await groupsPromise;
            assert.strictEqual(groups.length, 1);
        });
    });

    describe('given passwd file has invalid data', () => {
        it('should throw an error when length is less than 7', async () => {
            const usersPromise = assert.rejects(parser.parseUsers(''));
            readStreamMock.emit('data', 'users:x:100:node\n');
            readStreamMock.emit('end');
            await usersPromise;
        });

        it('should throw an error when length is more than 7', async () => {
            const usersPromise = assert.rejects(parser.parseUsers(''));
            readStreamMock.emit('data', 'root:x:0:0:root:/root:/bin/bash:152\n');
            readStreamMock.emit('end');
            await usersPromise;
        });
    });

    describe('given group file has invalid data', () => {
        it('should throw an error when length is less than 4', async () => {
            const usersPromise = assert.rejects(parser.parseUsers(''));
            readStreamMock.emit('data', 'users:x:100\n');
            readStreamMock.emit('end');
            await usersPromise;
        });

        it('should throw an error when length is more than 7', async () => {
            const usersPromise = assert.rejects(parser.parseUsers(''));
            readStreamMock.emit('data', 'root:x:0:0:root:/root:/bin/bash:152    \n');
            readStreamMock.emit('end');
            await usersPromise;
        });
    });

    describe('given file does not exist', () => {
        it('should reject when open fails', async () => {
            const usersPromise = assert.rejects(parser.parseUsers(''));
            readStreamMock.emit('error', 'file does not exist');
            await usersPromise;
        });
    })
});
