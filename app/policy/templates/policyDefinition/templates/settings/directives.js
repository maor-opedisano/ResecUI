app.directive("savePolicySettings", function(FacetFormatter, policyData) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.bind("click", function() {
                var self = $(this)
                var settingsDOMElement = $("#policySettingsContainer")
                if (!scope.ctrl.areSettingsEditable) {
                    self.html("SAVE")
                    scope.ctrl.areSettingsEditable = true
                    settingsDOMElement.removeClass("not-editable")
                } else {
                    self.html("EDIT")
                    settingsDOMElement.addClass("not-editable")
                    scope.ctrl.FormatForPOST();
                    self.areSettingsEditable = false;
                }
            })
        }
    }
})