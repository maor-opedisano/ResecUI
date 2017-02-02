app.controller("reports_jobs", function ($scope, jobs_factory, computer_list, active_users, active_agents, sanitization_status) {

    $scope.jobs_query = {
        SortField: 'Time',
        PageSize: 5,
        PageIndex: 1
    };
    $scope.get_data = function () {
        jobs_factory.get_jobs($scope.jobs_query).then(function (answer) {
            $scope.data = answer.data
            $scope.total_length = answer.data.Total
        })
    }
    $scope.get_data()
    $scope.$watchGroup(['$scope.jobs_query.PageIndex', '$scope.jobs_query.PageSize', '$scope.jobs_query.SortField'], function (newValues, oldValues, scope) {
        $scope.jobs_query.PageIndex = newValues[0]
        $scope.jobs_query.PageSize = newValues[1]
        $scope.jobs_query.SortField = newValues[2]
        $scope.get_data()
    });
    $scope.limitOptions = $scope.limitOptions ? undefined : [10, 25, 50, 100];
    $scope.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true
    }
    computer_list.get_computers().then(function (answer) {
        $scope.computer_list = answer.data
    })
    active_users.get_users().then(function (answer) {
        $scope.users = answer.data
    })
    active_agents.get_agents().then(function (answer) {
        $scope.active_agents = answer.data
    })
    sanitization_status.get_status_list().then(function(answer){
        $scope.sanitization_status = answer.data
    })

})