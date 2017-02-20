app.directive("toggleCdrEdition", function (policyData, $mdDialog) {

    return {
        restrict: "A",
        scope: {
            bindedValue: "="
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

app.directive("toggleRegexEdition", () => {
    return {
        restrict: "A",
        link: (scope, element, attrs) => {
            element.click(() => {
                scope.ctrl.CDRHyperLinkEditable = (!scope.ctrl.CDRHyperLinkEditable) ? true : false;
            })
        }
    }
})
app.directive("toggleCdrFailActionsEdition", () => {
    return {
        restrict: "A",
        link: (scope, element, attrs) => {
            element.click( () => {
                scope.ctrl.CDRFailActionsEditable = (!scope.ctrl.CDRFailActionsEditable) ? true : false;
            })
        }
    }
})