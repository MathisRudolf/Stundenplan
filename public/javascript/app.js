"use strict";

window.APP = {};
APP.tabs = {}

window.templates = require('./application/templates');
window.classes = require('./application/classes');

APP.notify = require('./application/notify');



$(document).ready(function() {

    if (document.location.pathname != '/') {
        APP.login = new classes.Login('#login-form', {});
        return;
    }

    APP.eventservice = new classes.EventService();

    APP.menu = new classes.Menu('menu',{HeadingSelector: '#heading-text'});
    APP.alert = new classes.Alert('div#alert', {})
    APP.nav = new classes.Nav('nav', {});

    APP.content = new classes.Content('div#content', {home: 'Dashboard'});

    APP.eventservice.subscribe(APP, 'app')

});