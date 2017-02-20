app.directive("savePolicySettings", function (FacetFormatter, policyData) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this)
                if (!scope.ctrl.areSettingsEditable) {
                    scope.ctrl.areSettingsEditable = true
                } else {
                    scope.ctrl.FormatForPOST();
                    scope.ctrl.areSettingsEditable = false;
                }
            })
        }
    }
})
app.directive('toHtml', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

            //format text going to user (model to view)
            ngModel.$formatters.push(function (value) {
                return value.match(/<p>(.*)<\/p>/).pop();
            });
            //format text from the user (view to model)
            ngModel.$parsers.push(function (value) {
                var formatted = "<html><head></head><body><p>" + value + "</p></body></html>";
                console.log(formatted)
                return formatted
            });
        }
    }
});

app.directive("compileEmailHtml", ($compile) => {
    return {
        restrict: "E",
        link: (scope, element, attrs) => {
            element.ready(() => {
                var template = scope.template;
                var destination = $("#destination");
                scope.$watch(scope.template, (newValue, oldValue) => {
                    var compiled = $compile(newValue)(scope);
                    scope.compiled = compiled;
                    destination.append(compiled)
                })

            })
        }
    }
})