app.directive("gTopNavbar", function() {

    return {
        restrict: "E",
        templateUrl: "app/common/templates/topBar.html",
        replace: false
    }

})

app.directive("gSidenav", function() {

    return {
        restrict: "E",
        templateUrl: "app/common/templates/sidenav.html",
        replace: false
    }

})

app.directive("logout", function($rootScope, $state, $timeout, HTTPHeaders) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var sname = localStorage.getItem("serverName");
            element.click(function() {
                HTTPHeaders.DeleteTokenFromHeader()
                localStorage.clear()
                $timeout(function() {
                    $state.go("login")
                })
            })
        }
    }
})
app.directive("refresh", function(authService, $state, $timeout, HTTPHeaders, $cookies) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                element.click(function() {
                    var CookieStorage = {
                        servername: $cookies.get('serverName') || localStorage.getItem("serverName"),
                        username: $cookies.get('UserName') || "",
                        password: $cookies.get('Password') || ""
                    }

                    authService.checkLogin(CookieStorage.servername, CookieStorage.username, CookieStorage.password).then(function(answer) {

                        var token = "Bearer " + answer.data.AccessToken

                        localStorage.setItem("serverName", CookieStorage.servername)

                        localStorage.setItem("token", token)

                        $state.go($state.current, {}, {
                            reload: true
                        });


                    }, function(error) {

                        alert("Login failed")

                    })

                })
            }
        }
    })
    /*app.directive("refresh", function ($state) {
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
    })*/