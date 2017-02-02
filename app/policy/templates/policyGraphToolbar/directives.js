app.directive("matchTopBarHeight", function(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            element.ready(function(){
                var topbar = $("#toolbar2Policy") ;
                var childrenDivs = topbar.find(".topBarChild")
                childrenDivs.css("height", "20%")
            })
        }
    }
})
