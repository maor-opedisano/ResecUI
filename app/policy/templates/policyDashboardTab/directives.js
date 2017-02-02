//empty for now//
app.directive("toUppercase", function(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            element.ready(function(){
                var extension = $(".extensionName").html();
                extension.toUpperCase()
            })
        }
    }
})