"use strict";

let templates = require('./templates');

let classes = {
    Dashboard: require('./dashboard'),
    TimeLine: require('./timeline'),
    Calendar: require('./calendar')
}
let APP = {};


$(document).ready(function() {

    $('#toggle-test').on("click", function(e){
        e.preventDefault();
        $('main').append(templates.timeline.widget({}));
    });

    $('#calendar').datepicker({});

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

});