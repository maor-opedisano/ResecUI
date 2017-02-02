app.controller('settings', function (system_properties, $scope, $mdDialog) {

  var self = this;

  self.allProps = [];
  system_properties.get_properties().success(function (answer) {
    self.allProps = answer;

  });

  self.SaveSettings = function () {
    system_properties.UpdateSettings(self.allProps).success(function (answer) {
      self.allProps = answer;
      $mdDialog.show(
        $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('success')
        .textContent('Settings were successfully updated')
        .ariaLabel('Alert Dialog Demo')
        .ok('OKAY!')
      );
    }).error(function (err) {
      $mdDialog.show(
        $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Error')
        .textContent('Settings could not be updated : ' + error.data.Message)
        .ariaLabel('Alert Dialog Demo')
        .ok('OK!')
      );

    })
  }
  self.sortType = function (propType) {
    switch (propType) {
      case "text":
        return "text"
        break;

      case "datetime":
        return "date"
        break;
      case "password":
        return "password"
        break;
      case "checkbox":
        return "checkbox"
        break;
      default:
        return "text"
        break;
    }
  }

})

//data size filter 

app.directive("formatter", function ($timeout) {
  return {
    restrict: 'A',
    require: "ngModel",
    link: function (scope, element, attr, ngModel) {
      var el = element
      ngModel.$formatters.push(function (value) {
        var parsed = parseInt(value.replace(/\D/g, ''));
        if (ngModel.$$rawModelValue.match(/[a-z]/i)) {
          var str = value.match(/[0-9]/)
        }
        return parsed
      })

    }
  }
})

app.directive('stringToDate', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {

      function hasNumbers(t) {
        return /\d/.test(t);
      }

      function isDate(number) {
        Date.parse(number)
        if (isNaN(number))
          return false
        else
          return true

      }

      /*ngModel.$parsers.push(function (value) {
        return value.toUTCString();
      });*/
      ngModel.$formatters.push(function (value) {
        if (hasNumbers(ngModel.$$rawModelValue) && isDate(ngModel.$$rawModelValue)) {
          return value
        }
      });
    }
  };
});