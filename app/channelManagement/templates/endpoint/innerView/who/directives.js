app.directive("editWhoScreen", function (channelData, $mdDialog, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var edit_button = $("#edit-who-screen")
            element.bind("click", function () {
                if (!scope.ctrl.is_who_screen_editable) {
                    scope.ctrl.is_who_screen_editable = true
                    edit_button.html("SAVE")
                    edit_button.addClass("inEdition")
                } else {
                    scope.ctrl.is_who_screen_editable = false
                    edit_button.html("EDIT")
                    edit_button.removeClass("inEdition")
                    var postData = scope.ctrl.FormatChannelFacetsBeforePOST()
                    console.log("post data")
                    console.log(postData)
                    $timeout(function () {
                        channelData.updateWhoIsUsing(scope.ctrl.rootId, postData).then(function (success) {
                            scope.ctrl.HTTP_Dialogs.ShowSuccessDialog()
                            scope.ctrl.UpdateChannelData(success.data.Id)
                        }, function (error) {
                            scope.ctrl.HTTP_Dialogs.ShowErrorDialog(error.data.Message) //->parameter is the error message to disply inside the Dialog
                        })
                    })

                }
            })
        }
    }

})


app.directive("addIp", function () {
    return {
        restrict: "A",
        scope: {
            value: "=",
            container: "="
        },
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                console.log(scope.container)
                scope.container = (scope.container == "") ? [] : scope.container

                if (!scope.container.includes(scope.value)) {
                    scope.$apply(function () {
                        scope.container.push(scope.value)

                    })

                } else {
                    alert(scope.value + " is already in use !")
                }

            })
        }
    }
})