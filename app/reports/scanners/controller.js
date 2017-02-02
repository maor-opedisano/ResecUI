app.controller('reports_scanners', function(scanners_factory) {
    var self = this;
    self.scanners = {};
    self.collect_updates = function() {
        scanners_factory.post_scanners_collect_updates().then(function(answer) {
            self.isRunning = answer.data;
        });

    }
    self.init = function() {
        scanners_factory.get_scanners_status().then(function(answer) {
            self.scanners = answer.data;
        });
    };
})
