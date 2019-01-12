
const {Router} = require('express');
const {getAllUsers} = require('../repositories/user.repository');

const router =  Router();

router.route('/')
    .get(async (req, res, next) => {
        const users = await getAllUsers();

        res.json(users);
    });

module.exports = router;
