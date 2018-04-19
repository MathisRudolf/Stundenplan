"use strict";

let APP = {};
APP.templates = {
    calender_widget: require("../../views/calendar_widget.jade"),
    timeline_widget: require("../../views/timeline_widget.jade")
}

$(document).ready(function() {

    console.log($('#toggle-test'));
    $('#toggle-test').on("click", function(e){
        let template = require("../../views/calendar_widget.jade");
        console.log(APP)
        e.preventDefault();
        $('main').append(APP.templates.timeline_widget({}));
    });

    $('#calendar').datepicker({});

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

});