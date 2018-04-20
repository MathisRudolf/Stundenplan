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