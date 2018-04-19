"use strict";

let APP = {};
let templates = {
    dashboard:{

    },
    calendar:{
        widget: require("../../views/calendar/widget.jade")
    },
    timeline:{
        widget: require("../../views/timeline/widget.jade")
    }
}

$(document).ready(function() {

    console.log($('#toggle-test'));
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