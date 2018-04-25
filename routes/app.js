var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('layout/layout', {
        nav:[
            {
                name: 'Stundenpläne',
                href: 'Timetable',
                icon: 'fa-table'
            },
            {
                name: 'Aufgabe/Termine',
                href: 'Events',
                icon: 'fa-dashboard'
            }
        ]
    });
});

module.exports = router;