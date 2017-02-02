app.controller("cluster", ["$cluster", "$scope", function ($cluster, $scope) {

    var self = this

    self.EndDate = Math.floor(Date.now() / 60000);
    self.StartDate = self.EndDate - 5;
    self.DynamicLabels = new Array(5);
    //watching any change in StartDate and EndDate and then trigger $cluster call

    $scope.$watch(angular.bind(this, function () {
        return this.selectedTime;
    }), function (NewValue) {
        self.data = {}
        switch (NewValue) {

            case "5 Minutes":
                self.StartDate = self.EndDate - 5
                self.DynamicLabels = new Array(5);

                break;
            case "30 Minutes":
                self.StartDate = self.EndDate - 30
                self.DynamicLabels = new Array(15);

                break;
            case "1 Hour":
                self.StartDate = self.EndDate - 60
                self.DynamicLabels = new Array(15);

                break;
            case "90 Minutes":
                self.StartDate = self.EndDate - 90
                self.DynamicLabels = new Array(15);

                break;
            case "2 Hours":
                self.StartDate = self.EndDate - 120
                self.DynamicLabels = new Array(15);

                break;
        }

        $cluster.GetClusterData(self.StartDate, self.EndDate)
            .then(function (answer) {
                var status = answer.data.ClusterStatusInfo.Status
                var CpuMeasurementList = answer.data.CpuMeasurementList
                self.ClusterData = []
                var cpus = []
                var currentLow = []
                var currentHigh = []
                var currentMany = []
                var currentJobsMeasures = []

                angular.forEach(CpuMeasurementList, function (value, key) {
                    var data = {}
                    data.Label = key
                    data.ClusterStatus = status
                    data.JobType = "Missing Info";

                    angular.forEach(value, function (v, k) {

                        currentHigh.push(v.HighComplexityRunningSanitizations)
                        currentLow.push(v.LowComplexityRunningSanitizations)
                        currentMany.push(v.ManyComplexityRunningSanitizations)
                        cpus.push(v.CpuLoad)
                        data.JobType

                    })

                    currentJobsMeasures.push(currentHigh)
                    currentJobsMeasures.push(currentMany)
                    currentJobsMeasures.push(currentLow)
                    data.currentJobs = currentJobsMeasures
                    data.cpu = cpus

                    self.ClusterData.push(data)
                    
                })


            })
    });

}]);