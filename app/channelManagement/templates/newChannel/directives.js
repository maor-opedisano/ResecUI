app.directive("saveInfoGetId", function (channelData, $state, $stateParams) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.click(function () {
                var channelType = $(".ncTypesHover").find(".ncTypeTitle").html()
                var NewChannelParam = {
                    "GeneralInformations": {
                        "Name": scope.ctrl.channelName,
                        "ChannelTypeName": channelType,
                        "Description": scope.ctrl.channelDescription
                    }
                }
                scope.ctrl.gen_info = NewChannelParam

                channelData.createChannel(NewChannelParam)

                .then(function (answer) {


                        $state.go('app.channelManagement.endpoint.sources', {

                            ChannelId: answer.data.Id

                        }, {

                            reload: true

                        });

                        console.log("transitioned")

                    },

                    function (error) {

                        alert("there was an error : " + error.data.Message)

                    })
            })
        }
    }
})