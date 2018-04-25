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
},{"./application/classes":5,"./application/notify":10,"./application/templates":11}],4:[function(require,module,exports){
let Alert = class {

    constructor(selector, config){
        if (config){

        }
        this.DomObject = $(selector);
    }
    success(text){
        this.DomObject.html(templates.alert.success({text: text}));
        this.set_remove_event();
    }
    warning(text){
        this.DomObject.html(templates.alert.warning({text: text}));
        this.set_remove_event();
    }
    info(text){
        this.DomObject.html(templates.alert.info({text: text}));
        this.set_remove_event();
    }
    danger(text){
        this.DomObject.html(templates.alert.danger({text: text}));
        this.set_remove_event();
    }
    primary(text){
        this.DomObject.html(templates.alert.primary({text: text}));
        this.set_remove_event();
    }
    set_remove_event(){
        this.DomObject.find('a.remove').on('click', function(event){
            event.preventDefault();
            $(this).parent().remove();
        });
    }
}

module.exports = Alert;
},{}],5:[function(require,module,exports){
let classes = {
    Dashboard: require('../pages/dashboard'),
    TimeLine: require('../pages/timeline'),
    Calendar: require('../pages/calendar'),
    Menu: require('./menu'),
    Login: require('../pages/login'),
    Nav: require('./nav'),
    Content: require('./content'),
    Timetable: require('../pages/timetable'),
    Alert: require('./alert'),
    EventService: require('./eventservice'),
    Events: require('../pages/events')
}
module.exports = classes
},{"../pages/calendar":12,"../pages/dashboard":13,"../pages/events":14,"../pages/login":15,"../pages/timeline":16,"../pages/timetable":17,"./alert":4,"./content":6,"./eventservice":7,"./menu":8,"./nav":9}],6:[function(require,module,exports){
let Content = class {

    constructor(selector, config) {
        this.DomObject = $(selector);

        console.log(config);
        if(config){
            if(config.home){
                console.log('test');
                this.home = new classes[config.home]();
                this.content = this.home;
                this.home.render(this.DomObject);

            }
        }


        APP.eventservice.subscribe(this, 'content')
    }

    showHome(){
        this.content.hide();
        this.home.show()
    }

    setTab(name){
        console.log('SetTab');

        //Falls name nicht in classes vorhanden
        if (classes[name] == undefined) return false;

        if(this.content == APP.tabs[name]){
            return true;
        }
        this.home.hide();
        this.content.hide();

        if(APP.tabs[name] == undefined){
            this.content = new classes[name]();
            this.content.render(this.DomObject);
            APP.tabs[name] = this.content;
        }else{
            this.content = APP.tabs[name];
            this.content.show();
        }

    }

    destroyTab(name){
        if(APP.tabs[name] != undefined){
            if(APP.tabs[name] == this.content){
                this.content = this.home;
                this.content.show()
            }
            APP.tabs[name].destroy();
            APP.tabs[name] = undefined;
        }
    }

    notify(self, message, data) {
        switch (message) {
            case 'content':
                if (self[data.method] != undefined) {
                    self[data.method](data.name);
                    return;
                }
                console.warn('Falsche parameter: ' + message + ':');
                console.log(data);
                break;
            default:
                console.warn('Unbekannte Notification: ' + message);
                break;
        }
    }
}
module.exports = Content
},{}],7:[function(require,module,exports){
//------------------------------------------------------------------------------
// Event-Service: asynchroner Nachrichtenaustausch
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
let EventService = class {
//------------------------------------------------------------------------------
    constructor () {
        this.queue      = [];
        this.Subscriber = {};
        window.onhashchange = this.send.bind(this);
    }
    send (event) {
        // der hash-Wert interessiert hier nicht
        // gibt es Elemente in der queue?
        if (this.queue.length > 0) {
            let qentry = this.queue[0];
            qentry[0].notify.apply(qentry[0], [qentry[0], qentry[1], qentry[2]]);
            this.queue.shift();
        }
        if (this.queue.length > 0) {
            let d_o = new Date();
            window.location.hash = d_o.getTime();
        }
        event.preventDefault();
        return false;
    }
    subscribe (Subscriber, Message) {
        if (Message in this.Subscriber) {
            // Message bekannt, Liste der Subscriber untersuchen
            if (this.Subscriber[Message].indexOf(Subscriber) == -1) {
                this.Subscriber[Message].push(Subscriber);
            }
        } else {
            // Message noch nicht vorhanden, neu eintragen
            this.Subscriber[Message] = [Subscriber];
        }
    }
    unSubscribe (Subscriber, Message) {
        if (Message in this.Subscriber) {
            // Message bekannt, Liste der Subscriber untersuchen
            let Entry_a = this.Subscriber[Message];
            let index_i = Entry_a.indexOf(Subscriber);
            if (index_i >= 0) {
                // Eintrag entfernen
                Entry_a[index_i] = null;
                Entry_a = this.compact(Entry_a); // compact liefert Kopie!
                if (Entry_a.length == 0) {
                    // keine Subscriber mehr, kann entfernt werden
                    delete this.Subscriber[Message];
                }
            }
        } else {
            // Message nicht vorhanden, falsche Anforderung
        }
    }
    publish (Message, Data) {
        let data = "<null>";
        if ((Data != undefined) && (Data != null)) {
            data = Data.toString();
        }
        console.info('es - publish ' + Message + ' :');
        console.log(Data);
        let that = this;
        this.each(this.Subscriber, function (value, key) {
                // geliefert wird jeweils ein Wert, hier ein Array, und der Key
                if (key == Message) {
                    // an alle Subscriber weitergeben
                    this.each(value, function (entry, index) {
                            // geliefert wird hier das Element und der Index
                            that.queue.push([entry, Message, Data]);
                            let date = new Date();
                            window.location.hash = date.getTime();
                        }, this
                    );
                }
            }, this
        )
    }

    each(object, iterator, context) {
        for (let key in object) {
            iterator.call(context, object[key], key);
        }
    }

    findAll(object, iterator, context) {
        let results = [];
        this.each(object, function(value, index) {
            if (iterator.call(context, value, index))
                results.push(value);
        });
        return results;
    }

    compact(object) {
        return this.findAll(object, function(value_opl) {
            return value_opl != null;
        });
    }


}

module.exports = EventService;
},{}],8:[function(require,module,exports){
let Menu = class {

    constructor(selector, config) {

        if (config) {
            this.HeadingDomObject = $(config.HeadingSelector);
        }

        this.DomObject = $(selector);
        this.DomObject.on('click', $.proxy(function (e) {
            this.click_event_handler(e)
        }, this));

        $("#menu-toggle").click(function (e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });

        APP.eventservice.subscribe(this, 'menu');
    }

    click_event_handler(event) {
        event.preventDefault();
    }

    changeHeading(heading) {
        this.HeadingDomObject.html(heading);
    }

    notify(self, message, data) {
        switch (message) {
            case 'menu':
                if (self[data.method] != undefined && typeof data.text === 'string') {
                    self[data.method](data.text);
                    return;
                }
                console.warn('Falsche parameter: ' + message + ':');
                console.log(data);

                break;
            default:
                console.warn('Unbekannte Notification: ' + message);
                break;
        }
    }
}

module.exports = Menu;
},{}],9:[function(require,module,exports){
let Nav = class {
    constructor(selector, config) {
        if (selector == undefined) return;
        this.DomObject = $(selector);
        this.DomObject.on('click', $.proxy(function (e) {
            this.click_event_handler(e);
        }, this));
    }

    click_event_handler(event) {

        event.preventDefault();
        let target = $(event.target);

        if (target.is('a')) {
            APP.eventservice.publish('content', {
                method: 'setTab',
                name: target.data('href')
            });
            target.find('em.close-tab').show();
        }

        if (target.is('em.close-tab')) {
            let em = target;
            target = target.parent();

            APP.eventservice.publish('content', {
                method: 'destroyTab',
                name: target.data('href')
            });

            em.hide()
        }
    }

}
module.exports = Nav;
},{}],10:[function(require,module,exports){
let notify = function (self, message, data){
    switch (message_spl) {
//----------------------------------------------------------------------------------------------------------------------
        case 'app':
            switch (data_apl[0]) {
                case 'init':
                    APP.tm_o = new TemplateManager_cl();
                    break;

                default:
                    console.warn('Unbekannte app-Notification: ' + data_apl[0]);
                    break;
            }
            break;
//----------------------------------------------------------------------------------------------------------------------
        default:
            console.warn('Unbekannte Notification: ' + message_spl);
            break;
    }

}
},{}],11:[function(require,module,exports){
let templates = {
    dashboard: {
        page: require("../../../views/dashboard/dashboard.jade")
    },
    events:{
        page: require("../../../views/events/page.jade")
    },
    calendar:{
        widget: require("../../../views/calendar/widget.jade")
    },
    timeline:{
        widget: require("../../../views/timeline/widget.jade")
    },
    timetable:{
        page: require("../../../views/timetable/timetable.jade")
    },
    alert:{
        success: require("../../../views/alert/success.jade"),
        danger: require("../../../views/alert/danger.jade"),
        info: require("../../../views/alert/info.jade"),
        primary: require("../../../views/alert/primary.jade"),
        warning: require("../../../views/alert/warning.jade"),
    },
    layout:{
        nav_items: require('../../../views/layout/nav_items.jade')
    }
}

module.exports = templates;
},{"../../../views/alert/danger.jade":18,"../../../views/alert/info.jade":19,"../../../views/alert/primary.jade":20,"../../../views/alert/success.jade":21,"../../../views/alert/warning.jade":22,"../../../views/calendar/widget.jade":23,"../../../views/dashboard/dashboard.jade":24,"../../../views/events/page.jade":25,"../../../views/layout/nav_items.jade":26,"../../../views/timeline/widget.jade":27,"../../../views/timetable/timetable.jade":28}],12:[function(require,module,exports){
let Calendar = class {

}

module.exports = Calendar;
},{}],13:[function(require,module,exports){
let Dashboard = class {
    constructor(selector, config){
        this.title = 'Dashboard'
    }

    hide(){
        this.DomObject.hide()
    }

    show(){
        this.DomObject.show();
        this.set_heading();
    }

    render(target){
        target.append(templates.dashboard.page({}));
        this.DomObject = $('#dashboard');
        this.set_heading();
    }
    set_heading(){
        APP.eventservice.publish('menu', {
            method: 'change_heading',
            text: this.title
        });
    }
    destroy(){
        this.DomObject.remove();
    }
}

module.exports = Dashboard;
},{}],14:[function(require,module,exports){
let Events = class {
    constructor(selector, config){
        this.title = 'Termine'
    }

    hide(){
        this.DomObject.hide()
    }

    show(){
        this.DomObject.show();
        this.set_heading();
    }

    render(target){
        target.append(templates.events.page({}));
        this.DomObject = $('#events');
        this.set_heading();
    }
    set_heading(){
        APP.eventservice.publish('menu', {
            method: 'change_heading',
            text: this.title
        });
    }
    destroy(){
        this.DomObject.remove();
    }
}

module.exports = Events;
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
let TimeLine = class {

}

module.exports = TimeLine;
},{}],17:[function(require,module,exports){
let Timetable = class {
    constructor(selector, config){

        this.title = "Stundenpläne"
    }

    set_heading(){
        APP.eventservice.publish('menu', {
            method: 'change_heading',
            text: this.title
        });
    }

    hide(){
        this.DomObject.hide()
    }

    show(){
        this.DomObject.show();
        this.set_heading();

    }
    render(target){
        target.append(templates.timetable.page({}));
        this.DomObject = $('#timetable');
        this.set_heading();
    }
    destroy(){
        this.DomObject.remove();
    }
}

module.exports = Timetable;
},{}],18:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (text) {
buf.push("<div role=\"alert\" class=\"alert bg-danger\"><em class=\"fa fa-minus-circle mr-2\"></em>" + (jade.escape((jade_interp = text) == null ? '' : jade_interp)) + "<a href=\"#\" class=\"remove float-right\"><em class=\"fa fa-remove\"></em></a></div>");}.call(this,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined));;return buf.join("");
};
},{"jade/runtime":2}],19:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (text) {
buf.push("<div role=\"alert\" class=\"alert bg-info\"><em class=\"fa fa-tag mr-2\"></em>" + (jade.escape((jade_interp = text) == null ? '' : jade_interp)) + "<a href=\"#\" class=\"remove float-right\"><em class=\"fa fa-remove\"></em></a></div>");}.call(this,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined));;return buf.join("");
};
},{"jade/runtime":2}],20:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (text) {
buf.push("<div role=\"alert\" class=\"alert bg-primary\"><em class=\"fa fa-comment mr-2\"></em>" + (jade.escape((jade_interp = text) == null ? '' : jade_interp)) + "<a href=\"#\" class=\"remove float-right\"><em class=\"fa fa-remove\"></em></a></div>");}.call(this,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined));;return buf.join("");
};
},{"jade/runtime":2}],21:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (text) {
buf.push("<div role=\"alert\" class=\"alert bg-success\"><em class=\"fa fa-check-circle mr-2\"></em>" + (jade.escape((jade_interp = text) == null ? '' : jade_interp)) + "<a href=\"#\" class=\"remove float-right\"><em class=\"fa fa-remove\"></em></a></div>");}.call(this,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined));;return buf.join("");
};
},{"jade/runtime":2}],22:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (text) {
buf.push("<div role=\"alert\" class=\"alert bg-warning\"><em class=\"fa fa-exclamation-triangle mr-2\"></em>" + (jade.escape((jade_interp = text) == null ? '' : jade_interp)) + "<a href=\"#\" class=\"remove float-right\"><em class=\"fa fa-remove\"></em></a></div>");}.call(this,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined));;return buf.join("");
};
},{"jade/runtime":2}],23:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"col-sm-12 col-md-6 \"><div class=\"card mb-4\"><div class=\"card-block\"><h3 class=\"card-title\">Kalender</h3><div class=\"dropdown card-title-btn-container\"><button type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-sm btn-subtle dropdown-toggle\"><em class=\"fa fa-cog\"></em></button><div aria-labelledby=\"dropdownMenuButton\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-search mr-1\"></em><text>Informationen</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-remove mr-1\"></em><text>Fenster schließen</text></a></div></div><h6 class=\"card-subtitle mb-2 text-muted\">Termine und Veranstaltungen</h6><div id=\"calendar\"></div></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],24:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<section id=\"dashboard\" class=\"row\"><div class=\"col-sm-12 col-md-6 \"><div class=\"card mb-4\"><div class=\"card-block\"><h3 class=\"card-title\">Kalender</h3><div class=\"dropdown card-title-btn-container\"><button type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-sm btn-subtle dropdown-toggle\"><em class=\"fa fa-cog\"></em></button><div aria-labelledby=\"dropdownMenuButton\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-search mr-1\"></em><text>Informationen</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-remove mr-1\"></em><text>Fenster schließen</text></a></div></div><h6 class=\"card-subtitle mb-2 text-muted\">Termine und Veranstaltungen</h6><div id=\"calendar\"></div></div></div></div><div class=\"col-sm-12 col-md-6 \"><div class=\"card mb-4\"><div class=\"card-block\"><h3 class=\"card-title\">Timeline</h3><div class=\"dropdown card-title-btn-container\"><button type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-sm btn-subtle dropdown-toggle\"><em class=\"fa fa-cog\"></em></button><div aria-labelledby=\"dropdownMenuButton\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-search mr-1\"></em><text>Informationen</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-remove mr-1\"></em><text>Fenster schließen</text></a></div></div><h6 class=\"card-subtitle mb-2 text-muted\">Termine und Veranstaltungen</h6><ul class=\"timeline\"><li><div class=\"timeline-badge\"><em class=\"fa fa-camera\"></em></div><div class=\"timeline-panel\"><div class=\"timeline-heading\"><h5 class=\"timeline-title mt-2\">Titel hier einfügen</h5></div><div class=\"timeline-body\"><p>Variable hier einfügen</p></div></div></li></ul></div></div></div></section>");;return buf.join("");
};
},{"jade/runtime":2}],25:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<section id=\"events\" class=\"row\"><div class=\"col-sm-12 col-md-6 \"><span>Termine und Event</span></div></section>");;return buf.join("");
};
},{"jade/runtime":2}],26:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (nav, undefined) {
// iterate nav
;(function(){
  var $$obj = nav;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var e = $$obj[$index];

buf.push("<li class=\"nav-item\"><a" + (jade.attr("data-href", "" + (e.href) + "", true, false)) + (jade.attr("data-heading", "" + (e.name) + "", true, false)) + " class=\"nav-link active\"><em" + (jade.cls(["fa " + (e.icon) + ""], [true])) + "></em>" + (jade.escape((jade_interp = e.name) == null ? '' : jade_interp)) + "<em style=\"display: none;\" class=\"close-tab pull-right fa fa-times\"></em></a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var e = $$obj[$index];

buf.push("<li class=\"nav-item\"><a" + (jade.attr("data-href", "" + (e.href) + "", true, false)) + (jade.attr("data-heading", "" + (e.name) + "", true, false)) + " class=\"nav-link active\"><em" + (jade.cls(["fa " + (e.icon) + ""], [true])) + "></em>" + (jade.escape((jade_interp = e.name) == null ? '' : jade_interp)) + "<em style=\"display: none;\" class=\"close-tab pull-right fa fa-times\"></em></a></li>");
    }

  }
}).call(this);
}.call(this,"nav" in locals_for_with?locals_for_with.nav:typeof nav!=="undefined"?nav:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":2}],27:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"col-sm-12 col-md-6 \"><div class=\"card mb-4\"><div class=\"card-block\"><h3 class=\"card-title\">Timeline</h3><div class=\"dropdown card-title-btn-container\"><button type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-sm btn-subtle dropdown-toggle\"><em class=\"fa fa-cog\"></em></button><div aria-labelledby=\"dropdownMenuButton\" class=\"dropdown-menu dropdown-menu-right\"><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-search mr-1\"></em><text>Informationen</text></a><a href=\"#\" class=\"dropdown-item\"><em class=\"fa fa-remove mr-1\"></em><text>Fenster schließen</text></a></div></div><h6 class=\"card-subtitle mb-2 text-muted\">Termine und Veranstaltungen</h6><ul class=\"timeline\"><li><div class=\"timeline-badge\"><em class=\"fa fa-camera\"></em></div><div class=\"timeline-panel\"><div class=\"timeline-heading\"><h5 class=\"timeline-title mt-2\">Titel hier einfügen</h5></div><div class=\"timeline-body\"><p>Variable hier einfügen</p></div></div></li></ul></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],28:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<section id=\"timetable\" class=\"row\"><div id=\"timetable-menu\" class=\"col col-12\"><div class=\"input-group col col-12\"><input id=\"name\" name=\"name\" type=\"text\" placeholder=\"\" class=\"form-control input-md\"/><span class=\"input-group-btn\"><button button=\"button\" id=\"btn-todo\" class=\"btn btn-primary btn-md\"><em style=\"font-size: 20px\" class=\"fa fa-plus\"></em></button></span></div></div></section>");;return buf.join("");
};
},{"jade/runtime":2}]},{},[3]);
