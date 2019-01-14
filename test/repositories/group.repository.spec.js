const assert = require('assert');
const proxyQuire = require('proxyquire').noCallThru();

const proxyStub = {};

describe('group repository tests', () => {
    describe('given queryGroups is called', () => {
        const allGroups = [
            {name: 'root', gid: 0, members: ['root']},
            {name: 'docker', gid: 3, members: ['docker']},
            {name: '_analyticsusers', gid: 250, 'members': ['_analyticsd','_networkd','_timed']}
        ];

        proxyStub.parseGroups = () => allGroups;

        const {queryGroups} = proxyQuire('../../app/repositories/group.repository', {'../util/file-parser': proxyStub});

        it('should return all groups when params is empty', async () => {
            const groups = await queryGroups({});

            assert.deepStrictEqual(groups, allGroups);
        });

        it('should return root when gid 0 is passed', async () => {
            const groups = await queryGroups({gid: 0});

            assert.deepStrictEqual(groups, allGroups.slice(0, 1));
        });

        it('should return root when name root and gid 0 is passed', async () => {
            const groups = await queryGroups({gid: 0, name: 'root'});

            assert.deepStrictEqual(groups, allGroups.slice(0, 1));
        });

        it('should return empty when name docker and gid 0 is passed', async () => {
            const groups = await queryGroups({gid: 0, name: 'docker'});

            assert.deepStrictEqual(groups, []);
        });

        it('should return empty when only one of 2 members are matched', async () => {
            const groups = await queryGroups({members: ['docker', '_networkd']});

            assert.deepStrictEqual(groups, []);
        });

        it('should return _analyticsusers when all members in params are matched', async () => {
            const groups = await queryGroups({members: ['_analyticsd', '_networkd']});

            assert.deepStrictEqual(groups, allGroups.slice(2, 3));
        });


    })
});