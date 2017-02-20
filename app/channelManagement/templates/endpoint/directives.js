app.directive("matchDataSwitcherHeight", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(document).ready(function () {
                var self = $("#endpointDashboardCasesFilter")
                var dataSwitcher = $("#CMDataSwitcher")
                var div2Match = $("#endpointDashboardTopUsers")
                var lowerSelf = $("#endpointDashboardCasesFilterLower")
                self.innerHeight(dataSwitcher.innerHeight())
                lowerSelf.height(div2Match.height())
            })
        }
    }
})

app.directive("toggleBlockedFiles", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                var self = $(this)
            })
        }
    }
})

app.directive("blockedProcessedToggler", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var self = $(this);
            var blocked = $(".blocked")
            var processed = $(".processed")
            var toRecompile = $(".toRecompile")

            blocked.click(function () {

                if (processed.hasClass("active")) {
                    processed.removeClass("active");
                    blocked.addClass("active")
                    toRecompile.css("background-color", "red")
                    scope.$apply(function () {
                        scope.ctrl.isBlocked = true
                    })
                } else {

                    blocked.addClass("active");
                    scope.$apply(function () {
                        scope.ctrl.isBlocked = true
                    })


                }
            })

            processed.click(function () {

                if (blocked.hasClass("active")) {
                    blocked.removeClass("active")
                    processed.addClass("active")
                    scope.$apply(function () {
                        scope.ctrl.isBlocked = false
                    })


                } else {

                    processed.addClass("active")
                    scope.$apply(function () {
                        scope.ctrl.isBlocked = false
                    })


                }
            })
        }
    }
})


