app.directive("channelSidebar", function () {
    return {
        restrict: 'E',
        templateUrl: 'app/channelManagement/templates/sidebar/sidebar.html',
        replace: false
    }
})

app.directive("infoTopBar", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/infoTopBar/infoTopBar.html",
        replace: false
    }
})
app.directive("innerNav", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerNav/innerNav.html",
        replace: false
    }
})
app.directive("innerView", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerView/innerView.html",
        replace: false
    }
})
app.directive("channelDashboardDataSwitcher", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerView/dashboard/templates/dataSwitcher/dataSwitcher.html",
        replace: false
    }
})
app.directive("endpointDashboardTopFiles", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerView/dashboard/templates/topFiles/topFiles.html",
        replace: false
    }
})
app.directive("endpointDashboardTopUsers", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerView/dashboard/templates/topUsers/topUsers.html",
        replace: false
    }
})
app.directive("endpointDashboardCasesFilter", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerView/dashboard/templates/casesFilter/casesFilter.html",
        replace: false
    }
})

app.directive("endpointSourcesChannelType", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerView/sources/templates/channelType/channelType.html",
        replace: false
    }
})

app.directive("endpointSourcesChannelDescriptionBlock", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerView/sources/templates/descriptionBlock/descriptionBlock.html",
        replace: false
    }
})

app.directive("endpointSourcesChannelSettingsBlock", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/endpoint/innerView/sources/templates/settingsBlock/settingsBlock.html",
        replace: false
    }
})

app.directive("ncTopbar", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/newChannel/templates/step1/topBar/topbar.html",
        replace: false
    }
})

app.directive("ncChannelName", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/newChannel/templates/step1/channelName/channelName.html",
        replace: false
    }
})

app.directive("ncDescription", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/newChannel/templates/step1/description/description.html",
        replace: false
    }
})

app.directive("ncChannelType", function () {
    return {
        restrict: 'E',
        templateUrl: "app/channelManagement/templates/newChannel/templates/step1/channelType/channelType.html",
        replace: false
    }
})


app.directive("editName", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var textArea = $(document).find("#nameTXTArea");
                var conf = $(document).find("#confName")
                textArea.removeAttr("disabled");
                textArea.addClass("activeTextArea");
                conf.removeClass("hidden");
            })
        }
    }
})

app.directive("confName", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var textArea = $(document).find("#nameTXTArea");
                var conf = $(document).find("#confName")
                textArea.attr("disabled", true);
                textArea.removeClass("activeTextArea");
                conf.addClass("hidden");
            })
        }
    }
})

app.directive("editDesc", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var textArea = $(document).find("#descTXTArea");
                var conf = $(document).find("#confDesc")
                textArea.removeAttr("disabled");
                textArea.addClass("activeTextArea");
                conf.removeClass("hidden");
            })
        }
    }
})

app.directive("confDesc", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var textArea = $(document).find("#descTXTArea");
                var conf = $(document).find("#confDesc")
                textArea.attr("disabled", true);
                textArea.removeClass("activeTextArea");
                conf.addClass("hidden");
            })
        }
    }
})

app.directive("ncTypeSelectable", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("click", function () {
                var siblings = $(this).siblings(".ncTypesItems")
                var channelName = scope.ctrl.channelName
                var channelType = $("#NewChannelType").html()
                if (channelName !== undefined && channelType !== ""){
                    scope.ctrl.ChannelCreationHasRequiredFields = true
                }else{
                    scope.ctrl.ChannelCreationHasRequiredFields = false
                }
                siblings.removeClass("ncTypesHover")
                siblings.find("g").removeClass("hoveredIcon")
                siblings.find("md-content").removeClass("ncTypesHoverTitle")
                scope.$apply(function () {
                    scope.ctrl.isNextButtonDisabled = false
                })
                $(this).each(function () {
                    $(this).addClass("ncTypesHover")
                    $(this).find("g").addClass("hoveredIcon")
                    $(this).find("md-content").addClass("ncTypesHoverTitle")
                    scope.ctrl.selected = $(this).find("md-content").html().toLowerCase();
                    scope.ctrl.selectedIconSrc = $(this).find("md-icon").attr("md-svg-src")
                })

            })
        }
    }
})

