app.factory('dataFactory', ['$http', function($http) {

    var urlBase = '../../JSON/userList.json';
    var dataFactory = {};

    dataFactory.getData = function () {
        return $http.get(urlBase);
    };

    return dataFactory;
    
}])


