app.controller("dashboard", [ "dashboardData", function (dashboardData) {

    var self = this;


    self.purpleInt = '40';
    self.timeReferences = ['Real Time', '1 hour', '1 week', '2 weeks', '3 weeks', '1 month'];

    dashboardData.getInput().then(function (response) {
        self.input = response.data
    })
    dashboardData.getTotalInput().then(function (response) {
        self.totalInputs = response.data;
    })

    dashboardData.getOutput().then(function (response) {
        self.output = response.data;
    })
    dashboardData.getCasesSidebar().then(function (answer) {
        self.casesInfo = answer.data;
        self.totalCases = self.casesInfo.length;
    })

}])