app.directive("getMyId", ["$state", "C2CData", "channelData", function ($state, C2CData, channelData) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this);
                //C2CData.set(scope.ctrl.rootId)
                
                console.log("pressed")
                scope.$apply(function () {
                    scope.ctrl.rootId = parseInt(self.attr("channel-id"));
                })
            })
        }
    }
}])


app.directive("goToChannelCreation", function($state){
    return{
        restrict: "A",
        link: function(scope, element, attrs){
            element.bind("click", function(){
                $state.go("app.channelManagement.newChannel.step1");
            })
        }
    }
})


app.directive("deleteChannel", function ($mdDialog, channelData, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this)
                var channel_id = self.attr("channel-id")
                var cell = self.closest("md-list-item")
                var channel_name = self.attr("channel-name")
                var confirm = $mdDialog.confirm()
                    .title('You are about to delete a channel')
                    .textContent('You are about to delete the channel ' + channel_name)
                    .ariaLabel('delete channel')
                    .ok('Yes, delete this channel')
                    .cancel('Cancel deletion');
                $mdDialog.show(confirm).then(function () {
                    channelData.delete_channel(channel_id).then(function (answer) {
                        cell.addClass("animated fadeOutRight")
                        $timeout(function () {
                            cell.addClass("hidden")

                        }, 700)
                    });
                }, function () {});
            })
        }
    }
})

app.directive("channelSidenavEditMode", function (channelData, $mdDialog) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {

                var editIcon = $("#reorder_channels_icon")
                var channels = $(".channelSidenavItems")

                if (!scope.ctrl.is_edit_mode_on) {
                    scope.ctrl.is_edit_mode_on = true
                    editIcon.addClass("editOn")
                } else {
                    scope.ctrl.is_edit_mode_on = false
                    var channelsOrder = []
                    channels.each(function () {
                        var channelID = parseInt($(this).attr("channel-id"))
                        channelsOrder.push(channelID)
                    })
                    channelData.reorder_channel_priority(channelsOrder).then(function (success) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('CONGRATS!')
                            .textContent('The ne priorities were successfully saved')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('AWSOME!')
                        );
                    }, function (error) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('OOPS, ERROR')
                            .textContent('There was an error while updating the priorities : ' + error.data.Message)
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                        );
                    })
                    editIcon.removeClass("editOn")
                }
            })
        }
    }
})

app.directive("renameChannel", function (channelData, $mdDialog) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var self = $(this)
                var channel_name = self.parents("md-list-item").find("a")
                var editIcon = self.find("md-icon")
                var channelID = self.attr("channel-id")

                if (!scope.ctrl.is_channelName_editable) {
                    channel_name.addClass("edit-name")
                    editIcon.addClass("icon-edit-name-active")
                    scope.ctrl.is_channelName_editable = true
                } else {
                    var newChannelName = channel_name.html()
                    if (newChannelName.length < 1) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Invalid Format')
                            .textContent('You must pick a valid name')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                        );
                    } else {
                        channelData.updateChannelName(channelID, newChannelName).then(function (success) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Name successfully updated')
                                .textContent('Your channel name was successfully updated to : ' + newChannelName)
                                .ariaLabel('Alert Dialog Demo')
                                .ok('COOL!')
                            );
                        }, function (error) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Critical Error')
                                .textContent('An error occured while updating the channel name : ' + error.data.Message)
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OKAY!')
                            );
                        })
                        scope.ctrl.is_channelName_editable = false
                        channel_name.removeClass("edit-name")
                        editIcon.removeClass("icon-edit-name-active")
                    }

                }
            })
        }
    }
})