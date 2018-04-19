$(document).ready(function () {
    $("#login-form").validate({
        rules: {
            name: {
                required: true
            },
            password: {
                required: true
            }
        },
        submitHandler: function (form) {
            form.preventDefault();
        }
    });
});