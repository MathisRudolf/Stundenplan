let Content = class {

    constructor(selector, config) {
        if (selector == undefined) return;
        this.ContentDomObject = $(selector);

        if(config){

        }
    }

    set(name){
        console.log(name);
        //Falls name nicht in classes vorhanden
        if (classes[name] == undefined) return false;
        console.log('test1');

        //Falls content leer ist
        if (this.content == undefined){
            console.log('test11');

            this.content = new classes[name]();
            this.content.render();
            APP.tabs[name] = this.content;
            return true;
        }
        console.log('test2');

        //Falls content nicht leer und seite noch nicht bekannt
        if (APP.tabs[name] == undefined){
            console.log('test21');

            this.content.stash();

            this.content = new classes[name]();
            this.content.render();
            APP.tabs[name] = this.content;
            return true;
        }
        console.log('test3');

        //Falls content nicht leer und seite schon mal geladen
        this.content.stash();

        this.content =  APP.tabs[name];
        this.content.render();
        APP.tabs[name] = this.content;
        return true;
    }
}
module.exports = Content