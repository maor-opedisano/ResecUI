app.directive("openJobsFilter", function ($mdDialog) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                $mdDialog.show({
                    controller: "reports_jobs",
                    scope: scope.$new(),
                    clickOutsideToClose: true,
                    templateUrl: "app/reports/jobs/filter/filter.html",
                    parent: angular.element(document).find("body")
                })
            })
        }
    }
})
app.directive("closeJobsFilter", function ($mdDialog) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                $mdDialog.cancel()
            })
        }
    }
})
app.directive("filterJobs", function (jobs_factory) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                jobs_factory.get_filter_results(scope.jobs_query).then(function (answer) {
                })
            })
        }
    }
})


