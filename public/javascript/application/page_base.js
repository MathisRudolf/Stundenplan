let PageBase = class {
    constructor(selector, config){
        this.selector = selector;
        this.title = config.titel;
        this.template = config.template;
    }

    hide(){
        this.DomObject.hide()
    }

    show(){
        this.DomObject.show();
        this.setHeading();
    }

    render(target){
        target.append(templates.dashboard.page({}));
        this.DomObject = $(this.selector);
        this.setHeading();
    }
    setHeading(){
        APP.eventservice.publish('menu', {
            method: 'changeHeading',
            text: this.title
        });
    }
    destroy(){
        this.DomObject.remove();
    }
}

module.exports = PageBase;