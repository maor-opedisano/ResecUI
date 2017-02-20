// ROUTES

app.config(function ($stateProvider, $urlRouterProvider) {


    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'login/login.html',
            controller: 'login',
            controllerAs: 'ctrl'


        })

    .state('app', {
        url: '/app',
        templateUrl: 'app/common/common.html',
        controller: 'common',
        controllerAs: 'ctrl',
       // abstract: true,
      /*  resolve: {
            HeaderHasToken: function ($http) {
                var token = localStorage.getItem("token");
                var serverName = localStorage.getItem("serverName");
                $http.defaults.headers.common.Authorization = token;
                return $http.defaults.headers.common.Authorization;
            }
        }*/

    })

    .state('app.testPage', {
        url: '/app',
        templateUrl: 'app/cases/test.html',
        controller: 'cases',
        controllerAs: 'ctrl'

    })

    .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'dashboard',
        controllerAs: "ctrl",
        displayName: "Dashboard"
    })

    .state('app.channelManagement', {
        url: '/channelManagement',
        templateUrl: 'app/channelManagement/channelManagement.html',
        controller: 'channels',
        controllerAs: 'ctrl',
        displayName: "Channel Management",
        classSelector: "channel"

    })


    .state('app.channelManagement.endpoint', {
        url: '/channelManagementEndpoint',
        //parent: "app.channelManagement",
        templateUrl: 'app/channelManagement/templates/endpoint/endpoint.html',
        displayName: "Channel Management",
        classSelector: "channel"

    })

    .state('app.channelManagement.endpoint.dashboard', {
            url: '/CMEndpointDashboard',
            //parent: "app.channelManagement",
            templateUrl: 'app/channelManagement/templates/endpoint/innerView/dashboard/dashboard.html',
            displayName: "Channel Management",
            classSelector: "channel",
            ParentID: "ChannelDashboard"



        })
        .state('app.channelManagement.endpoint.sources', {
            url: '/CMEndpointSources',
            // parent: "app.channelManagement",
            templateUrl: 'app/channelManagement/templates/endpoint/innerView/sources/sources.html',
            displayName: "Channel Management > Inputs and Outputs",
            params: {
                ChannelId: null
            },
            classSelector: "channel",
            ParentID: "ChannelSources"




        })

    .state('app.channelManagement.endpoint.settings', {
            url: '/CMEndpointTargets',
            //parent: "app.channelManagement",
            templateUrl: 'app/channelManagement/templates/endpoint/innerView/settings/settings.html',
            displayName: "Channel Management > Settings",
            classSelector: "channel",
            ParentID: "ChannelSettings"



        })
        .state('app.channelManagement.endpoint.who', {
            url: '/channelWho',
            //parent: "app.channelManagement",
            templateUrl: 'app/channelManagement/templates/endpoint/innerView/who/who.html',
            displayName: "Channel Management > Who Uses This Channel",
            classSelector: "channel",
            ParentID: "ChannelUsage"



        })


    /*.state('app.channelManagement.newChannel', {
            url: '/channelManagementNewChannel',
            templateUrl: 'app/channelManagement/templates/newChannel/common/common.html',
            controller: 'ncCommon',
            controllerAs: 'ctrl',
            displayName: "New Channel",
            classSelector: "channel"


        })*/
        
        .state('app.channelManagement.newChannel', {
            url: '/channelManagementNewChannelS1',
            templateUrl: 'app/channelManagement/templates/newChannel/templates/step1/step1.html',
            //controller: 'endpo',
            //controllerAs: 'ctrl',
            displayName: "New Channel",
            classSelector: "channel"

        })
        .state('app.channelManagement.newChannel.SInputs', {
            url: '/channelManagementNewChannelS2SeparatedInputs',
            templateUrl: 'app/channelManagement/templates/newChannel/templates/step2/separated/inputs/inputs.html',
            controller: 'separated.inputs',
            controllerAs: 'ctrl',
            displayName: "New Channel"
        })

    .state('app.channelManagement.newChannel.SSettings', {
        url: '/channelManagementNewChannelS2SeparatedSettings',
        templateUrl: 'app/channelManagement/templates/newChannel/templates/step2/separated/settings/settings.html',
        controller: 'separated.settings',
        controllerAs: 'ctrl',
        displayName: "New Channel"

    })

    .state('app.channelManagement.newChannel.ncStep2Mixed', {
        url: '/channelManagementNewChannelS2Mixed',
        templateUrl: 'app/channelManagement/templates/newChannel/templates/step2/mixed/step2.html',
        controller: 'ncStep2Mixed',
        controllerAs: 'ctrl',
        displayName: "New Channel"

    })


    .state('app.clusterManagement', {
            url: '/clusterManagement',
            templateUrl: 'app/topology/cluster/cluster.tmpl.html',
            controller: 'cluster',
            controllerAs: 'ctrl',
            displayName: "Cluster Management",
            classSelector: "cluster"

        })
        .state('app.agentManagement', {
            url: '/agentManagement',
            templateUrl: 'app/topology/agent/agent.tmpl.html',
            controller: 'agent',
            controllerAs: 'ctrl',
            displayName: "Cluster Management"

        })

    .state('app.policy', {
            url: '/policy',
            templateUrl: 'app/policy/policy.html',
            controller: 'policy',
            controllerAs: "ctrl",
            classSelector: "policy"
        })
        .state('app.policy.dashboard', {
            url: '/policyDashboard',
            templateUrl: 'app/policy/templates/policyDashboardTab/policyDashboardTab.html',
            displayName: "Policy",            
            classSelector: "policy"

        })
        .state('app.policy.definition', {
            url: '/policyDefinition',
            templateUrl: 'app/policy/templates/policyDefinition/policyDefinition.html',
            displayName: "Policy",
            params: {
                PolicyID: null
            },
            classSelector: "policy",
            ParentID: "PolicyDefinition"



        })
        .state('app.policy.definition.fileType', {
            url: '/policyDefinitionFT',
            templateUrl: 'app/policy/templates/policyDefinition/templates/fileType/fileType.html',
            displayName: "Policy > Filetype Settings",
            classSelector: "policy",
            ParentID: "PolicyDefinition"


        })
        .state('app.policy.definition.detection', {
            url: '/policyDefinitionDetect',
            templateUrl: 'app/policy/templates/policyDefinition/templates/detection/detection.html',
            displayName: "Policy > Detection Settings",
            classSelector: "policy",
            ParentID: "PolicyDefinition"

        })
        .state('app.policy.definition.cdr', {
            url: '/policyCDR',
            classSelector: "policy",
            templateUrl: 'app/policy/templates/policyDefinition/templates/cdr/cdr.html',
            displayName: "Policy > CDR Settings",
            classSelector: "policy",
            ParentID: "PolicyDefinition"

        })
        .state('app.policy.definition.settings', {
            url: '/policyDefinitionSettings',
            templateUrl: 'app/policy/templates/policyDefinition/templates/settings/settings.html',
            displayName: "Policy > Settings",
            classSelector: "policy",
            ParentID: "PolicyDefinition"
        })

    .state('app.reports', {
            url: '/reports',
            templateUrl: 'app/reports/reports.html',
            controller: 'reports',
            controllerAs: 'ctrl',
            displayName: "System Status"

        })
        .state('app.sanitization', {
            url: '/sanitization',
            templateUrl: 'app/reports/sanitization/sanitization.html',
            controller: 'sanitization',
            // controllerAs: 'ctrl',
            displayName: "Sanitization",
            parentUrl: "app.reports",
            parentName: "System Status >"
        })
        .state('app.telerik_reports', {
            url: '/telerik_reports',
            templateUrl: 'app/reports/telerik_reports/tr.html',
            controller: 'telerik_reports',
            controllerAs: 'ctrl',
            displayName: "Reports Services",
            parentUrl: "app.reports",
            parentName: "System Status >"

        })
        .state('app.system_events', {
            url: '/system_events',
            templateUrl: 'app/reports/system_events/se.html',
            controller: 'system_events',
            displayName: "System Events",
            parentUrl: "app.reports",
            parentName: "System Status >"

        })
        .state('app.reports_jobs', {
            url: '/jobs',
            templateUrl: 'app/reports/jobs/jobs.html',
            controller: 'reports_jobs',
            displayName: "Jobs",
            parentUrl: "app.reports",
            parentName: "System Status >"

        })
        .state('app.reports_emails', {
            url: '/emails',
            templateUrl: 'app/reports/email/email.html',
            controller: 'reports_emails',
            displayName: "Emails",
            parentUrl: "app.reports",
            parentName: "System Status >"

        })

        .state('app.reports_scanners', {
            url: '/scannerreports',
            templateUrl: 'app/reports/scanners/scanners.html',
            controller: 'reports_scanners',
            displayName: "Scanners",
            parentUrl: "app.reports",
            parentName: "System Status >"

        })

    .state('app.settings', {
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'settings',
        controllerAs: 'ctrl',
        displayName: "Settings"

    })

});