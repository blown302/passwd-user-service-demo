
const {Router} = require('express');


const router =  Router();

router.route('/')
    .get((req, res, next) => {



        res.json([]);
    });


module.exports = router;
