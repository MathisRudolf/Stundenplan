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