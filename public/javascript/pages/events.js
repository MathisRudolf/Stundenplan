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