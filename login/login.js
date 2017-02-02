app.controller("login", ["$rootScope", "authService", "$state", "$timeout", "HTTPHeaders", "$cookies",

    function ($rootScope, authService, $state, $timeout, HTTPHeaders, $cookies) {

        var self = this;

        self.CheckIfCookies = function () {

            var CookieStorage = {
                servername: $cookies.get('serverName'),
                username: $cookies.get('UserName'),
                password: $cookies.get('Password')
            }

            self.serverName = CookieStorage.servername || "";
            self.UserName = CookieStorage.UserName || "";
            self.Password = CookieStorage.Password || "";

            self.IsRememberMe = (CookieStorage.servername !== "" && CookieStorage.UserName !== "" && CookieStorage.Password !== "") ? true : false;

        }

        self.is_login_nahon = true;

        var token = localStorage.getItem("token")

        var ServerName = localStorage.getItem("serverName")
            //password = "P04531418";
        self.LogUserInOnEnter = function ($event, $http) {

            var keyCode = $event.which || $event.keyCode;

            if (keyCode === 13) {

                var serverName = document.getElementById("ServerName").value

                var username = $("#username")

                var password = $("#password")

                if (self.IsRememberMe) {

                    $cookies.put('serverName', self.serverName);

                    $cookies.put('UserName', self.UserName);

                    $cookies.put('Password', self.Password);

                }

                authService.checkLogin(serverName, self.UserName, self.Password).then(function (answer) {

                    var token = "Bearer " + answer.data.AccessToken

                    localStorage.setItem("serverName", serverName)

                    localStorage.setItem("token", token)

                    $state.go("app.dashboard")


                }, function (error) {

                    self.is_login_nahon = false;

                })
            }
        }
    }
])


app.config(["$httpProvider", function ($httpProvider) {

    $httpProvider.defaults.cache = false

}])

app.run(["$rootScope", "$state", function ($rootScope, $state) {

    $rootScope.$state = $state


}])