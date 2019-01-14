/**
 * Express router for /users requests.
 */

const {Router} = require('express');
const {getAllUsers, getUserById, queryUsers, getUserGroups} = require('../repositories/user.repository');

const router =  Router();

router.route('/')
    .get(async (req, res, next) => {
        let users;
        try {
            users = await getAllUsers();
        } catch (e) {
            return next(e);
        }

        res.json(users);
    });

router.route('/:id(\\d+)/groups')
    .get(async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            res.json(await getUserGroups(id));
        } catch (e) {
            return next(e);
        }
    });

router.route('/:id(\\d+)')
    .get(async (req, res, next) => {
        const id = parseInt(req.params.id);

        let user;
        try {
            user = await getUserById(id);
        } catch (e) {
            return next(e);
        }

        if (!user) return res.status(404).end();

        res.json(user);
    });

router.route('/query')
    .get(async (req, res, next) => {
        try {
            res.json(await queryUsers(getQuery(req.query)));
        } catch (e) {
            next(e);
        }
    });

/**
 * Creates a parameter object to query users from the user repository.
 *
 * @param query Express query parameters captured from request.
 * @returns {Object} mapped query parameters to query the user repository.
 */
function getQuery(query) {
    const params = {};
    if (query.name) params.name = query.name;
    if (query.gid) params.gid = parseInt(query.gid);
    if (query.uid) params.uid = parseInt(query.uid);
    if (query.comment) params.comment = query.comment;
    if (query.home) params.home = query.home;
    if (query.shell) params.shell = query.shell;

    return params;
}

module.exports = router;
