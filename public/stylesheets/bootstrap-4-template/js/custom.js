$(document).ready(function() {

    $('#calendar').datepicker({});

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

});