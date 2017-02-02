app.controller("reports_emails", function($scope, emails_factory){

    $scope.email_query = {
        order: 'Time',
        PageSize: 10,
        PageIndex: 1
    }
    
    $scope.get_data = function () {
        emails_factory.get_emails($scope.email_query.PageIndex, $scope.email_query.PageSize, $scope.email_query.order).then(function (answer) {
            $scope.data = answer.data
            $scope.total_length = answer.data.Total
        })
    }
    $scope.$watchGroup(['$scope.email_query.PageIndex', '$scope.email_query.PageSize', '$scope.email_query.order'], function (newValues, oldValues, scope) {
        $scope.email_query.PageIndex = newValues[0]
        $scope.email_query.PageSize = newValues[1]
        $scope.email_query.order = newValues[2]
        $scope.get_data()
    });
    //filter dialog
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
    
})