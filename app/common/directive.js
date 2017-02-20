app.directive("gTopNavbar", function () {

  return {
    restrict: "E",
    templateUrl: "app/common/templates/topBar.html",
    replace: false
  }

})

app.directive("gSidenav", function () {

  return {
    restrict: "E",
    templateUrl: "app/common/templates/sidenav.html",
    replace: false
  }

})

app.directive("logout", ($rootScope, $state, $timeout, HTTPHeaders) => {
  return {
    restrict: "A",
    link: (scope, element, attrs) => {
      element.click(() => {
        HTTPHeaders.DeleteTokenFromHeader();
        window.localStorage.removeItem("serverName");
        window.localStorage.removeItem("")
        console.log(window.localStorage);
        $timeout(function () {
          $state.go("login");
        })
      })
    }
  }
})
app.directive("refresh", function ($state) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      element.click(function () {
        $state.go($state.current, {}, {
          reload: true
        });
      })
    }
  }
})