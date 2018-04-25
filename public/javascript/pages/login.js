let Login = class {
    constructor (selector, config) {
        this.LoginDomObject = $(selector);

        this.LoginDomObject.validate({
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
    }
}
module.exports = Login;