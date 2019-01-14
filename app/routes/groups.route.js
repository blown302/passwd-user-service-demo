/**
 * Express router for /groups requests.
 */

const {Router} = require('express');
const {getAllGroups, getGroupById, queryGroups} = require('../repositories/group.repository');

const router =  Router();

router.route('/')
    .get(async (req, res, next) => {
        let groups;
        try {
            groups = await getAllGroups();
        } catch (e) {
            console.log(e);
            return next(e);
        }

        res.json(groups);
    });

router.route('/:id(\\d+)')
    .get(async (req, res, next) => {
        const id = parseInt(req.params.id);

        let group;
        try {
            group = await getGroupById(id);
        } catch (e) {
            return next(e);
        }

        if (!group) return res.status(404).end();

        res.json(group);
    });

router.route('/query')
    .get(async (req, res, next) => {
        try {
            res.json(await queryGroups(getQuery(req.query)));
        } catch (e) {
            next(e);
        }
    });

/**
 * Creates a parameter object to query groups from the group repository.
 *
 * @param query Express query parameters captured from request.
 * @returns {Object} mapped query parameters to query the group repository.
 */
function getQuery(query) {
    const params = {};
    if (query.name) params.name = query.name;
    if (query.gid) params.gid = parseInt(query.gid);
    if (query.member) {
        if (typeof query.member === "string") params.members = Array(query.member);
        else params.members = query.member;
    }

    return params;
}

module.exports = router;