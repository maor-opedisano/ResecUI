app.directive("dwSources", function(){
    return{
        restrict: "E",
        templateUrl: "app/channelManagement/templates/endpoint/innerView/sources/templates/exceptions-template/DW/dw.html",
        replace: false
    }
})

app.directive("dwSmb", function(){
    return{
        restrict: "E",
        templateUrl: "app/channelManagement/templates/endpoint/innerView/sources/templates/exceptions-template/DW/smb/smb.html",
        replace: false
    }
})

