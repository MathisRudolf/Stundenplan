let templates = {
    dashboard: {
        page: require("../../views/dashboard/dashboard.jade")
    },
    calendar:{
        widget: require("../../views/calendar/widget.jade")
    },
    timeline:{
        widget: require("../../views/timeline/widget.jade")
    },
    timetable:{
        page: require("../../views/timetable/timetable.jade")
    }
}

module.exports = templates;