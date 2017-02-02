app.directive("postPolicy", ["addPolicy", function(addPolicy){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            element.bind("click", function(){
                scope.ctrl.Policy.FileTypesConfigurrations = null;
                scope.ctrl.Policy.FileDetectionConfigurrations = null;
                var data = scope.ctrl.Policy
                addPolicy.add(data)
            })
           
        }
    }
}])