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