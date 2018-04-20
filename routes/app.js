var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        nav:[
            {
                name: 'Dashboard',
                href: 'Dashboard',
                icon: 'fa-dashboard'
            },
            {
                name: 'Stundenplan',
                href: 'Timetable',
                icon: 'fa-table'
            },
        ]
    });
});

module.exports = router;