app.directive('policySidenav', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/policySidenav/policySidenav.html',
        replace: true
    }
})

app.directive('topToolbar', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/topToolbar/topToolbar.html',
        replace: false
    }
})
app.directive('policyGraphToolbar', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/policyGraphToolbar/policyGraphToolbar.html',
        replace: false
    }
})

app.directive('policyDashboardTab', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/policyDashboardTab/policyDashboardTab.html',
        replace: false
    }
})

app.directive('policyDefinition', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/policyDefinition/policyDefinition.html',
        replace: false
    }
})

app.directive('who', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/who/who.html',
        replace: false
    }
})

app.directive('fileType', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/policyDefinition/fileType/fileType.html',
        replace: false
    }
})


app.directive('customTable', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/customTable/customTable.html',
        replace: false

    }
})

app.directive('exceptionRow', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/policy/templates/exceptionRow/exceptionRow.html',
        replace: true

    }
})


app.directive('detection', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/policy/templates/policyDefinition/detection/detection.html',
        replace: true
    }
})


app.directive('policySettings', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/policy/templates/policyDefinition/settings/settings.html',
        replace: false
    }
})

app.directive("policyDefinitionSwitcher", function () {
    return {
        restrict: 'E',
        templateUrl: 'app/policy/templates/policyDefinition/switcher/switcher.html',
        replace: false
    }
})
app.directive("policyDefinitionCollapseTable", function () {
    return {
        restrict: "E",
        templateUrl: "app/policy/templates/policyDefinition/templates/fileType/collapseTable/collapseTable.html",
        replace: false
    }
})


app.directive("policyDashboardTopFiles", function(){
    return {
        restrict: "E",
        templateUrl: "app/policy/templates/policyDashboardTab/templates/topFiles.html",
        replace: false
    }
})
app.directive("policyDashboardTopUsers", function(){
    return {
        restrict: "E",
        templateUrl: "app/policy/templates/policyDashboardTab/templates/topUsers.html",
        replace: false
    }
})
app.directive("treeValueModal", function(){
    return {
        restrict: "E",
        templateUrl: "app/policy/templates/policyDefinition/templates/settings/tree_values/tree_values.html",
        replace: false
    }
})

app.directive('stringToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                var floated = parseFloat(value)
                var str = ""
                str = +floated
                return str;
            });
        }
    };
});

app.directive('numberToString', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                var str = ""
                str = +value
                return str;
            });
        }
    };
});

app.directive('stringToCdrObject', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                console.log(value)

            });
        }
    };
});