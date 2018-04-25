let templates = {
    dashboard: {
        page: require("../../../views/dashboard/dashboard.jade")
    },
    events:{
        page: require("../../../views/events/page.jade")
    },
    calendar:{
        widget: require("../../../views/calendar/widget.jade")
    },
    timeline:{
        widget: require("../../../views/timeline/widget.jade")
    },
    timetable:{
        page: require("../../../views/timetable/timetable.jade")
    },
    alert:{
        success: require("../../../views/alert/success.jade"),
        danger: require("../../../views/alert/danger.jade"),
        info: require("../../../views/alert/info.jade"),
        primary: require("../../../views/alert/primary.jade"),
        warning: require("../../../views/alert/warning.jade"),
    },
    layout:{
        nav_items: require('../../../views/layout/nav_items.jade')
    }
}

module.exports = templates;