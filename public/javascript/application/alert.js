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