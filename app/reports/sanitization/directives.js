app.directive("closeSanitizationDetails", function ($mdDialog) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                $mdDialog.cancel()
            })
        }
    }
})
