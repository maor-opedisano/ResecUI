app.directive("dInputsByChannel", function () {
    return {
        restrict: "E",
        templateUrl: "app/dashboard/templates/inputsByChannel/inputsByChannel.html",
        replace: false
    }
})

app.directive("dResecTable", function () {
    return {
        restrict: "E",
        templateUrl: "app/dashboard/templates/resecTable/resecTable.html",
        replace: false
    }
})
app.directive("dCasesSidebar", function(){
    return {
        restrict: "E",
        templateUrl: "app/dashboard/templates/sidenavCases/casesSidebar.html",
        replace: false
    }
})


app.directive('resecTable', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/dashboard/templates/resecTable/resecTable.html',
        replace: false
    }
})


app.directive('outputByChannel', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/dashboard/templates/outputByChannel/outputByChannel.html',
        replace: false
    }
})


app.directive('toolbarTop', function () {
    return {
        restrict: 'AECM',
        templateUrl: 'app/dashboard/templates/toolbarTop/toolbarTop.html',
        replace: false
    }
})

app.directive("getHeight", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.ready(function () {
                scope.ctrl.height = $(document).find(".dOutputDataContainer").prop('offsetHeight');
                scope.ctrl.inputTable = $(document).find(".dInputDataContainer");
                scope.ctrl.inputTable.css("height", scope.ctrl.height)
            })

        }
    }
})


app.directive("syncScroll", function(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            $(document).ready(function(){
                $(document).find("md-virtual-repeat-container").children().bind("scroll", function(){
                    var sibling = $(document).find("md-virtual-repeat-container").children();
                    sibling.scrollTop($(this).scrollTop());
                })
            })
        }
    }
})

