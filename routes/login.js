var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/login');
});

router.post('/', function(req, res, next) {
    res.method = "get";
    res.redirect('/');
});

module.exports = router;
