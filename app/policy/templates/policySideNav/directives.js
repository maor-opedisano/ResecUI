app.directive("policyListHover", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.hover(function () {
                var self = $(this);
                self.toggleClass("policyListHover")
                self.toggleClass("md-whiteframe-12dp")
            })
        }
    }
})
app.directive("initNewPolicyModal", function ($mdDialog) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                scope.ctrl.new_policy_title = "";
                $mdDialog.show({
                    controller: "policy",
                    controllerAs: "ctrl",
                    scope: scope.$new(),
                    clickOutsideToClose: true,
                    templateUrl: "app/policy/templates/policySideNav/new_policy_modal.tmpl.html",
                    parent: angular.element(document).find("body")
                })
            })
        }
    }
})

app.directive("cancelPolicyCreation", function ($mdDialog) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.bind("click", function () {
                    $mdDialog.cancel()
                })
            }
        }
    })
    //create policy call from controller

app.directive("renamePolicy", function () {
    return {
        restrict: "A",

        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this)
                var index = Boolean(self.attr("index"))
                var PolicyName = self.siblings(".policyName")
                var PolicyId = self.attr("policy-id")
                if (index = false) {
                    index = true;
                    PolicyName.addClass("name-in-edition")
                } else {
                    PolicyName.removeClass("name-in-edition")
                    index = false;
                    console.log(index)

                }
            })
        }
    }
})




app.directive("toggleNewPolicyEditableMode", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var icon = $(this).find("md-icon")
                var policyName = $(".newPolicyName")
                if (!scope.ctrl.isEditable) {
                    icon.html("done");
                    policyName.css("color", "orange");
                    policyName.addClass("animated flash")
                    scope.ctrl.isEditable = true;
                } else {
                    icon.html("edit");
                    policyName.removeClass("animated flash")
                    policyName.css("color", "white")
                    scope.ctrl.isEditable = false;
                }
            })

        }
    }
})

app.directive("deletePolicy", ["policyData", "$timeout", function (policyData, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this);
                var cell = self.parents("md-list-item");
                var id = parseInt(cell.attr("policy-id"));
                cell.addClass("animated bounceOutRight");
                $timeout(function () {
                    cell.addClass("hidden")
                }, 500)
                policyData.deletePolicy(id)
                scope.$apply()
            })
        }
    }
}])

app.directive("initiateApiCallWithId", ["policyData", "$mdSidenav", function (policyData, $mdSidenav) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this);
                scope.$apply(function () {
                    scope.ctrl.policyId = parseInt(self.attr("policy-id"));
                })
            })
        }
    }
}])

app.directive("editPolicySidenav", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                if (!scope.ctrl.sidenav_edit_mode) {
                    scope.ctrl.sidenav_edit_mode = true
                } else {
                    scope.ctrl.sidenav_edit_mode = false
                }
            })
        }
    }
})