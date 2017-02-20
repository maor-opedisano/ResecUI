app.controller("login", ["$rootScope", "authService", "$state", "$window", "HTTPHeaders", "$cookies",

    function ($rootScope, authService, $state, $window, HTTPHeaders, $cookies) {

        var self = this;

        self.CheckIfCookies = function () {
            var CookieStorage = {
                servername: $cookies.get('serverName'),
                username: $cookies.get('UserName'),
                password: $cookies.get('Password')
            };
           
        };

        self.is_login_nahon = true;

        //password = "P04531418";
        self.srv = localStorage.getItem("serverName");

        self.LogUserInOnEnter = function ($event, $http) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                var serverName = self.serverName;
                var username = $("#username");
                var password = $("#password");
                if (self.IsRememberMe) {
                    $cookies.put('serverName', serverName);
                    $cookies.put('UserName', self.UserName);
                    $cookies.put('Password', self.Password);
                };
                authService.checkLogin(serverName, self.UserName, self.Password)
                    .then((header) => {
                        console.log(header);
                        $state.go("app.dashboard");
                    })
                    .catch((error) => {
                        self.is_login_nahon = false;
                    })
            };
        };

        self.requireMatch = false;

        self.searchQueries = [];

        self.displayAnswer = function () {

            var answer;
            self.queryArray = [];

            for (i in self.searchQueries) {
                answer = self.searchQueries[i].answer
            }
            self.queryArray.push(answer)
        }

        self.ChangeToken = () =>{
            console.log(window.localStorage);
            console.log($window);

           // localStorage.setItem("serverName", self.serverName);
        };
    }
])

app.run(["$rootScope", "$state", function ($rootScope, $state) {

    $rootScope.$state = $state


}])