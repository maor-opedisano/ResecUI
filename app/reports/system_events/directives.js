app.directive("openSystemEventsFilters", function ($mdDialog, notification_types) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                notification_types.get_notifications_types().then(function (answer) {
                    scope.notification_types = answer.data
                    $mdDialog.show({
                        controller: "system_events",
                        scope: scope.$new(),
                        clickOutsideToClose: true,
                        templateUrl: "app/reports/system_events/filter/filter_modal.html",
                        parent: angular.element(document).find("body")
                    })
                })
            })
        }
    }
})

app.directive("closeSystemEventsFilter", function ($mdDialog) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                $mdDialog.cancel()
            })
        }
    }
})

app.directive("confirmSystemEventsFilter", function (system_events_factory, $mdDialog) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                system_events_factory.get_filter_results(scope.se_query).then(function (answer) {
                    console.log(answer)
                    console.log(scope.se_query)
                    //scope.data = answer.data
                }, function (error) {})
                scope.$apply()
                $mdDialog.hide();
            })
        }
    }
})