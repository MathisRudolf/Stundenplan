(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":1}],3:[function(require,module,exports){
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
},{"./calendar":4,"./content":5,"./dashboard":6,"./login":7,"./menu":8,"./nav":9,"./templates":10,"./timeline":11}],4:[function(require,module,exports){
let Calendar = class {

}

module.exports = Calendar;
},{}],5:[function(require,module,exports){
let Content = class {

    constructor(selector, config) {
        if (selector == undefined) return;
        this.ContentDomObject = $(selector);

        if(config){

        }
    }

    set(name){
        console.log(name);
        //Falls name nicht in classes vorhanden
        if (classes[name] == undefined) return false;
        console.log('test1');

        //Falls content leer ist
        if (this.content == undefined){
            console.log('test11');

            this.content = new classes[name]();
            this.content.render();
            APP.tabs[name] = this.content;
            return true;
        }
        console.log('test2');

        //Falls content nicht leer und seite noch nicht bekannt
        if (APP.tabs[name] == undefined){
            console.log('test21');

            this.content.stash();

            this.content = new classes[name]();
            this.content.render();
            APP.tabs[name] = this.content;
            return true;
        }
        console.log('test3');

        //Falls content nicht leer und seite schon mal geladen
        this.content.stash();

        this.content =  APP.tabs[name];
        this.content.render();
        APP.tabs[name] = this.content;
        return true;
    }
}
module.exports = Content
},{}],6:[function(require,module,exports){
let Dashboard = class {
    constructor(selector, config){
        if(selector == undefined) return;
    }

    stash(){
        this.stash = this.DashboardDomObject.html()
        this.DashboardDomObject = undefined
    }

    restore(){
        this.DashboardDomObject.html(this.stash);
        this.DashboardDomObject = $('#dashboard');
    }
    render(){
        APP.content.ContentDomObject.html(templates.dashboard.page({}));
        this.DashboardDomObject = $('#dashboard');
    }
}

module.exports = Dashboard;
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
let Menu = class {

    constructor(selector, config){

        if (config){

        }

        this.MenuDomObject = $(selector);
        this.MenuDomObject.click(this.click_event_handler());
    }

    click_event_handler(e){
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }
}

module.exports = Menu;
},{}],9:[function(require,module,exports){
let Nav = class {
    constructor (selector, config){
        if(selector == undefined) return;
        this.NavDomObject = $(selector);
        this.NavDomObject.on('click', $.proxy(function(e){
            this.click_event_handler(e);
        },this));
    }

    click_event_handler(event) {
        event.preventDefault();
        let target = $($(event.target));
        if(target.is('a')){
            APP.content.set(target.data('href'));
            console.log(target.data('href'))
        }
    }

}
module.exports = Nav;
},{}],10:[function(require,module,exports){
let templates = {
    dashboard: {
        page: require("../../views/dashboard/dashboard.jade")
    },
    calendar:{
        widget: require("../../views/calendar/widget.jade")
    },
    timeline:{
        widget: require("../../views/timeline/widget.jade")
    },
    timetable:{
        page: require("../../views/timetable/timetable.jade")
    }
}

module.exports = templates;
},{"../../views/calendar/widget.jade":12,"../../views/dashboard/dashboard.jade":13,"../../views/timeline/widget.jade":14,"../../views/timetable/timetable.jade":15}],11:[function(require,module,exports){
let TimeLine = class {

}

module.exports = TimeLine;
},{}],12:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"col-sm-12 col-md-6 \"><div class=\"card mb-4\"><div class=\"card-block\"><h3 class=\"card-title\">Kalender</h3><div class=\"dropdown card-title-btn-container\"><button type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-sm btn-subtle dropdown-toggle\"><em class=\"fa fa-cog\"></em></button><div aria-labelledby=\"dropdownMenuButton\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-search mr-1\"></em><text>Informationen</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-remove mr-1\"></em><text>Fenster schließen</text></a></div></div><h6 class=\"card-subtitle mb-2 text-muted\">Termine und Veranstaltungen</h6><div id=\"calendar\"></div></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],13:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<header class=\"page-header row justify-center\"><div class=\"col-md-6 col-lg-8\"><h1 class=\"float-left text-center text-md-left\">Dashboard</h1></div><div class=\"dropdown user-dropdown col-md-6 col-lg-4 text-center text-md-right\"><a href=\"https://example.com\" id=\"dropdownMenuLink\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-stripped dropdown-toggle\"><!--img(src=\"images/profile-pic.jpg\"\nalt=\"profile photo\"\nclass=\"circle float-left profile-photo\"\nwidth=\"50\"\nheight=\"auto\")\n--><div class=\"username mt-1\"><h4 class=\"mb-1\">Username</h4><h6 calss=\"text-muted\">Super Admin</h6></div></a><div style=\"margin-right: 1.5rem;\" aria-labelledby=\"dropdownMenuLink\" id=\"toggle-test\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-user-circle mr-1\"></em><text>View Profile</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-sliders mr-1\"></em><text>Calendar</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-sliders mr-1\"></em><text>Logout</text></a></div></div><div class=\"clear\"></div></header><section id=\"dashboard\" class=\"row\"><div class=\"col-sm-12 col-md-6 \"><div class=\"card mb-4\"><div class=\"card-block\"><h3 class=\"card-title\">Kalender</h3><div class=\"dropdown card-title-btn-container\"><button type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-sm btn-subtle dropdown-toggle\"><em class=\"fa fa-cog\"></em></button><div aria-labelledby=\"dropdownMenuButton\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-search mr-1\"></em><text>Informationen</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-remove mr-1\"></em><text>Fenster schließen</text></a></div></div><h6 class=\"card-subtitle mb-2 text-muted\">Termine und Veranstaltungen</h6><div id=\"calendar\"></div></div></div></div><div class=\"col-sm-12 col-md-6 \"><div class=\"card mb-4\"><div class=\"card-block\"><h3 class=\"card-title\">Timeline</h3><div class=\"dropdown card-title-btn-container\"><button type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-sm btn-subtle dropdown-toggle\"><em class=\"fa fa-cog\"></em></button><div aria-labelledby=\"dropdownMenuButton\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-search mr-1\"></em><text>Informationen</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-remove mr-1\"></em><text>Fenster schließen</text></a></div></div><h6 class=\"card-subtitle mb-2 text-muted\">Termine und Veranstaltungen</h6><ul class=\"timeline\"><li><div class=\"timeline-badge\"><em class=\"fa fa-camera\"></em></div><div class=\"timeline-panel\"><div class=\"timeline-heading\"><h5 class=\"timeline-title mt-2\">Titel hier einfügen</h5></div><div class=\"timeline-body\"><p>Variable hier einfügen</p></div></div></li></ul></div></div></div></section>");;return buf.join("");
};
},{"jade/runtime":2}],14:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"col-sm-12 col-md-6 \"><div class=\"card mb-4\"><div class=\"card-block\"><h3 class=\"card-title\">Timeline</h3><div class=\"dropdown card-title-btn-container\"><button type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-sm btn-subtle dropdown-toggle\"><em class=\"fa fa-cog\"></em></button><div aria-labelledby=\"dropdownMenuButton\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-search mr-1\"></em><text>Informationen</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-remove mr-1\"></em><text>Fenster schließen</text></a></div></div><h6 class=\"card-subtitle mb-2 text-muted\">Termine und Veranstaltungen</h6><ul class=\"timeline\"><li><div class=\"timeline-badge\"><em class=\"fa fa-camera\"></em></div><div class=\"timeline-panel\"><div class=\"timeline-heading\"><h5 class=\"timeline-title mt-2\">Titel hier einfügen</h5></div><div class=\"timeline-body\"><p>Variable hier einfügen</p></div></div></li></ul></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],15:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<section id=\"timetable\" class=\"row\"><header class=\"page-header row justify-center\"><div class=\"col-md-6 col-lg-8\"><h1 class=\"float-left text-center text-md-left\">Dashboard</h1></div><div class=\"dropdown user-dropdown col-md-6 col-lg-4 text-center text-md-right\"><a href=\"https://example.com\" id=\"dropdownMenuLink\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-stripped dropdown-toggle\"><!--img(src=\"images/profile-pic.jpg\"\nalt=\"profile photo\"\nclass=\"circle float-left profile-photo\"\nwidth=\"50\"\nheight=\"auto\")\n--><div class=\"username mt-1\"><h4 class=\"mb-1\">Username</h4><h6 calss=\"text-muted\">Super Admin</h6></div></a><div style=\"margin-right: 1.5rem;\" aria-labelledby=\"dropdownMenuLink\" id=\"toggle-test\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-user-circle mr-1\"></em><text>View Profile</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-sliders mr-1\"></em><text>Calendar</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-sliders mr-1\"></em><text>Logout</text></a></div></div><div class=\"clear\"></div></header><p>STUNDENPLAN</p></section>");;return buf.join("");
};
},{"jade/runtime":2}]},{},[3]);
