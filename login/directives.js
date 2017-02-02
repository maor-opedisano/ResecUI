app.directive("checkCredentials", ["authService", "$state", "$cookies",
    function (authService, $state, $cookies) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {

                element.bind("click", function () {


                    var serverName = document.getElementById("ServerName").value;

                    var username = $("#username");

                    var password = $("#password");

                    if (scope.ctrl.IsRememberMe) {

                        $cookies.put('serverName', scope.ctrl.serverName);

                        $cookies.put('UserName', scope.ctrl.UserName);

                        $cookies.put('Password', scope.ctrl.Password);

                    }

                    authService.checkLogin(serverName, scope.ctrl.UserName, scope.ctrl.Password).then(function (answer) {

                        var token = "Bearer " + answer.data.AccessToken

                        localStorage.setItem("serverName", serverName)

                        localStorage.setItem("token", token) 

                        $state.go("app.dashboard")


                    }, function (error) {

                        scope.ctrl.is_login_nahon = false

                    })
                })

            }
        }
    }
]);