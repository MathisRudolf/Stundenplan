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