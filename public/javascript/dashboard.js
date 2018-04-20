let Dashboard = class {
    constructor(selector, config){
        if(selector == undefined) return;
    }

    stash(){
        this.stash = this.DashboardDomObject.html()
        this.DashboardDomObject = undefined
    }

    restore(){
        this.DashboardDomObject.html(this.stash);
        this.DashboardDomObject = $('#dashboard');
    }
    render(){
        APP.content.ContentDomObject.html(templates.dashboard.page({}));
        this.DashboardDomObject = $('#dashboard');
    }
}

module.exports = Dashboard;