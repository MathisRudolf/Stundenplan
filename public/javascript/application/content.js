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

    setTab(data){
        console.log('SetTab');

        //Falls name nicht in classes vorhanden
        if (classes[data.name] == undefined) return false;

        if(this.content == APP.tabs[data.name]){
            return true;
        }
        this.home.hide();
        this.content.hide();

        if(APP.tabs[data.name] == undefined){
            this.content = new classes[data.name]();
            this.content.render(this.DomObject);
            APP.tabs[data.name] = this.content;
        }else{
            this.content = APP.tabs[data.name];
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
                    self[data.method](data);
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