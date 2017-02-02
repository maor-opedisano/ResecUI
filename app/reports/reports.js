app.controller("reports", function(reports_factory){
    var self = this;
    reports_factory.get_menu().then(function(answer){
        self.menu = answer.data
    })
})
// url to insert app.reports_scanners