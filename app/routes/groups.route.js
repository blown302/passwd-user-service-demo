const {Router} = require('express');
const {getAllGroups} = require('../repositories/group.repository');

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

module.exports = router;