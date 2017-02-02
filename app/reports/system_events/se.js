app.controller("system_events", function ($scope, system_events_factory) {

  $scope.se_query = {
    order: 'StartTime',
    PageSize: 10,
    PageIndex: 1
  };
  //paging the data 
  $scope.get_data = function () {
    system_events_factory.get_system_events($scope.se_query.PageIndex, $scope.se_query.PageSize, $scope.se_query.order).then(function (answer) {
      $scope.data = answer.data
      $scope.total_length = $scope.data.Total
    })
  }
  $scope.$watchGroup(['se_query.PageIndex', 'se_query.PageSize', 'se_query.order'], function (newValues, oldValues, scope) {
    $scope.se_query.PageIndex = newValues[0]
    $scope.se_query.PageSize = newValues[1]
    $scope.se_query.order = newValues[2]
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
  };
  $scope.filter = {}

})