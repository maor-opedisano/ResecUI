app.directive("toggleCdrEdition", function (policyData, $mdDialog) {

    return {
        restrict: "A",
        scope: {
            bindedValue: "=",
            value: "=value",
            policyId: "=policyId",
            key: "=",
            global: "=global"
        },
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this);
                var icon = self.find("md-icon");
                if (!scope.bindedValue) {
                    scope.$apply(function () {
                        scope.bindedValue = true;
                    })
                    icon.html("save");
                } else {
                    scope.$apply(function () {
                        scope.bindedValue = false
                    });
                    icon.html("edit");
                }
            })
        }
    }
})