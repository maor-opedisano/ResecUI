app.directive("editChannelSettings", function (channelData, $mdDialog, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this)
                if (!scope.ctrl.AreSettingsEditable) {
                    scope.ctrl.AreSettingsEditable = true
                } else {
                    scope.ctrl.FormatChannelFacetsBeforePOST()
                    $timeout(function () {
                        channelData.updateWhoIsUsing(scope.ctrl.rootId, scope.ctrl.FacetsToPost).then(function (success) {
                            scope.ctrl.HTTP_Dialogs.ShowSuccessDialog()
                            scope.ctrl.UpdateChannelData(success.data.Id)

                        }, function (error) {
                            scope.ctrl.HTTP_Dialogs.ShowErrorDialog(error.data.Message)
                        })
                    })
                    scope.ctrl.AreSettingsEditable = false
                }
            })
        }
    }
})