"use strict";

window.APP = {};


window.templates = require('./templates');

window.classes = {
    Dashboard: require('./dashboard'),
    TimeLine: require('./timeline'),
    Calendar: require('./calendar'),
    Menu: require('./menu'),
    Login: require('./login'),
    Nav: require('./nav'),
    content: require('./content')
}

APP.tabs = {

}



$(document).ready(function() {
    console.log(classes);
    console.log(document.location.pathname);

    if (document.location.pathname != '/'){
        APP.login = new classes.Login('#login-form', {});
        return;
    }

    APP.content = new classes.content('main', {});
    APP.menu = new classes.Nav('nav', {});



});