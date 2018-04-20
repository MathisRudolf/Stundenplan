let Nav = class {
    constructor (selector, config){
        if(selector == undefined) return;
        this.NavDomObject = $(selector);
        this.NavDomObject.on('click', $.proxy(function(e){
            this.click_event_handler(e);
        },this));
    }

    click_event_handler(event) {
        event.preventDefault();
        let target = $($(event.target));
        if(target.is('a')){
            APP.content.set(target.data('href'));
            console.log(target.data('href'))
        }
    }

}
module.exports = Nav;