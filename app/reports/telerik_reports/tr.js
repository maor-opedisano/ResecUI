app.controller("telerik_reports", function (telerik_reports_factory) {
    var self = this;
    self.allReports = [];
    telerik_reports_factory.get_report_info().then(function (answer) {
        //self.allReports = answer.data;
        for (var i = 0; i < answer.data.length; i++) {
            var item = answer.data[i];
            var reportDetail = item.ReportDetails;
            self.allReports.push(reportDetail);
        }
    });
    self.show_report = function () {
        var reportViewer = $("#reportViewer1").data("telerik_ReportViewer");
        if (reportViewer === undefined) {
            $("#reportViewer1")
                .telerik_ReportViewer({
                    serviceUrl: "http://jdev01:4580/api/reports/",
                    templateUrl: 'ReportViewer/templates/telerikReportViewerTemplate-FA.html',
                    //ReportSource - report description
                    reportSource: {
                        // The report can be set to a report file name (.trdx or .trdp report definition)
                        // or CLR type name (report class definition).
                        report: self.selectedReport,
                        // Parameters name value dictionary
                        parameters: {}
                    },
                    viewMode: telerikReportViewer.ViewModes.INTERACTIVE,
                    scaleMode: telerikReportViewer.ScaleModes.SPECIFIC,
                    scale: 1.0,
                });
            return;
        } else {
            var reportViewer = $("#reportViewer1").data("telerik_ReportViewer");
            reportViewer.reportSource({
                report: self.selectedReport,
                parameters: {},
            });
            reportViewer.refreshReport();
        }
        /*reportViewer.reportSource({
            report: self.selectedReport,
            parameters: {},
        });*/
    }
})