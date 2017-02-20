app.directive("editDwSources", function (channelData) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                if (!scope.ctrl.DWSourcesAreEditable) {
                    scope.ctrl.DWSourcesAreEditable = true;
                } else {

                    //checking if each value is unique 

                    var TestObject = [];
                    TestObject[0] = [];
                    TestObject[1] = [];
                    TestObject[2] = [];
                    TestObject[3] = [];
                    TestObject[4] = [];
                    TestObject[5] = [];
                    TestObject[6] = [];

                    var DWLen = scope.ctrl.DW.Sources;
                    console.log(DWLen)
                    for (i in DWLen) {
                        TestObject[0].push(DWLen[i]["InputFolder"]);
                        TestObject[1].push(DWLen[i]["OutputFolder"]);
                        TestObject[2].push(DWLen[i]["RejectedFolder"]);
                        TestObject[3].push(DWLen[i]["TemporaryFolder"]);
                        TestObject[4].push(DWLen[i]["RelayName"]);
                        TestObject[5].push(DWLen[i]["IncludeFolderMask"]);
                        TestObject[6].push(DWLen[i]["ExcludeFolderMask"]);
                    }

                    var x = TestObject.every(a => {                    
                        return _.uniq(a).length == a.length;
                    });
                    
                    if (x){
                    scope.ctrl.DWSourcesAreEditable = false;
                    channelData.update_inputs_outputs(scope.ctrl.rootId, scope.ctrl.DW).then( (success) => {
                        scope.ctrl.HTTP_Dialogs.ShowSuccessDialog()
                        scope.ctrl.UpdateChannelData(success.data.Id)
                    },  (error) => {
                        scope.ctrl.HTTP_Dialogs.ShowErrorDialog(error.data.Message)
                    })

                    } else {
                        alert("please provide unique values");
                    }

                }
            })
        }
    }
})