app.directive("saveFiletypes", function (policyData) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                if (!scope.ctrl.isFiletypeEditable) {
                    scope.ctrl.isFiletypeEditable = true
                } else {
                    scope.ctrl.isFiletypeEditable = false;
                    policyData.postFiletype(scope.ctrl.policyId, scope.ctrl.Filetypes).then(function (success) {
                        scope.ctrl.show_success_dialog("Your changes were sucessfully saved")
                        scope.ctrl.getPolicyInfo(scope.ctrl.policyId)
                    }, function (error) {
                        scope.ctrl.show_error_dialog("An error occured", error.data.Message)
                    })
                }
            })
        }
    }
})
app.directive("tableIsDisabledModal", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                console.log("clicked")
                if (scope.ctrl.isFiletypeEditable = false) {
                    scope.ctrl.show_error_dialog("Warning", "Make sure to click on EDIT")
                }
            })
        }
    }
})


app.directive("filterFiletypes", () => {
    return {
        restrict: "A",
        require: "ngKeyUp",
        link: (scope, element, attrs) => {
            console.log(ngKeyUp)
        }
    }
})