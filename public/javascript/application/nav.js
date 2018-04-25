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