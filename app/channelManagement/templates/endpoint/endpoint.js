app.controller("channels", ["channelData", "$scope", "$mdDialog", "$state", "FacetFormatter", "$q",
    function (channelData, $scope, $mdDialog, $state, FacetFormatter, $q) {

        var self = this;
        self.timeReferences = ['Real Time', '1 hour', '1 week', '2 weeks', '3 weeks', '1 month'];
        //setting switcher function to switch templates
        self.TemplateConditions = {};
        self.TemplateSwitcher = function (ChannelType, channelInfo) {
                switch (ChannelType) {
                    // endpoint

                    case 2:
                        self.TemplateConditions.isDirWatcher = false;
                        self.TemplateConditions.isEndpoint = true;
                        self.EndpointSourcesAreEditable = false;
                        self.TemplateConditions.isAPI = false;

                        self.InputConfiguration = channelInfo.InputConfiguration || {};
                        self.ismbList = self.InputConfiguration.IoSmbConfiguration || [];
                        self.OutputConfiguration = channelInfo.OutputConfiguration || {};
                        self.osmbList = self.OutputConfiguration.IoSmbConfiguration || [];
                        self.NullStoreName = self.OutputConfiguration.NullStoreName ;
                        self.NumberOFiSMBs = self.ismbList.length || 0;
                        self.NumberOFoSMBs = self.osmbList.length || 0;


                        break;

                    case 1:
                        self.TemplateConditions.isDirWatcher = false;
                        self.TemplateConditions.isEndpoint = true;
                        self.EndpointSourcesAreEditable = false;
                        self.TemplateConditions.isAPI = false;

                        self.InputConfiguration = channelInfo.InputConfiguration || {};
                        self.ismbList = self.InputConfiguration.IoSmbConfiguration || [];

                        self.OutputConfiguration = channelInfo.OutputConfiguration || {};
                        self.osmbList = self.OutputConfiguration.IoSmbConfiguration || [];
                        self.NullStoreName = self.OutputConfiguration.NullStoreName;


                        self.NumberOFiSMBs = self.ismbList.length || 0;
                        self.NumberOFoSMBs = self.osmbList.length || 0;


                        break;
                        //case is dirwatcher
                    case 3:

                        self.TemplateConditions.isDirWatcher = true;
                        self.TemplateConditions.isEndpoint = false;
                        self.TemplateConditions.isAPI = false;
                        self.DWSourcesAreEditable = false;
                        self.DW.Sources = channelInfo.DirWatcherConfigurations || [];


                        break;
                    case 100:

                        self.TemplateConditions.isAPI = true;
                        self.TemplateConditions.isDirWatcher = false;
                        self.TemplateConditions.isEndpoint = false;

                }
            }
            //__________________DirWatchers ______________________

        self.DW = {
            "Sources": []
        };
        //add an entry to dir watcher sources
        self.CreateNewDirWatcherSourcesEntry = function () {
            self.DW.Sources.push({})
        };
        //remove entry from dirwatcher sources
        self.RemoveDirWatcherSourcesEntry = function (index) {
            self.DW.Sources.splice(index, 1);
        };

        //__________________End of DirWatchers ______________________

        //init the settings table as non editable by default 

        self.AreSettingsEditable = false;

        //dialogs to show for error and success
        self.HTTP_Dialogs = {

            ShowSuccessDialog: function () {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Success')
                    .textContent('Your changes were successfully saved.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                )
            },
            ShowErrorDialog: function (ErrorMessage) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error')
                    .textContent('An error occured while updating the changes you made : ' + ErrorMessage)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                )
            }
        }

        /*--------------------  Watching for changes in channel ID --------------------*/
        if (!self.NoChannelExists) {
            self.UpdateChannelData = function (newVal) {
                channelData.get_channel(newVal).then(answer => {
                    var deferred = $q.defer();
                    var $q2 = channelData.ChannelFacets();

                    $q.all({
                        $q2
                    }).then(data => {
                        self.channel_data = answer.data;
                        self.ChannelFacets = (jQuery.isEmptyObject(self.channel_data.ChannelFacets)) ? {} : self.channel_data.ChannelFacets;
                        var ChannelInfo = self.channel_data.ChannelInfo;
                        self.ServerFacetTemplates = {};
                        var AgentType = self.channel_data.AgentType;
                        self.TemplateSwitcher(AgentType, ChannelInfo);
                        self.ChannelConfiguration = ChannelInfo.ChannelConfiguration;
                        self.generalInformations = ChannelInfo.GeneralInformations;
                        self.ServerFacetTemplates = data.$q2.data;
                        self.whoData = FacetFormatter.FormatFacetTemplates(self.ServerFacetTemplates);
                        var facetsVm = FacetFormatter.InitFacets(self.whoData, self.ChannelFacets);
                        deferred.resolve(facetsVm)
                    });
                    return deferred.promise;
                }).then(res => {
                    self.ChannelFacets = res.EntityFacets
                })
            }
        };
        $scope.$watch(angular.bind(this, function () {
            return this.rootId;
        }), function (newValue) {
            self.UpdateChannelData(newValue)
        });
        //default view for dashboard is blocked
        self.isBlocked = true;
        channelData.getChannelDashboard(self.rootId).then(function (answer1) {
            self.channelDashboard = answer1.data
        })


        /*--------------------  Channel Input and Output --------------------*/

        self.are_outputs_and_outputs_editable = false;
        channelData.get_input_output_list().then(function (answer) {
            self.all_inputs = answer.data[0].inputs
            self.is_input_selected = false;
        })

        self.EditNullOption = () => {
            self.NullOptionIsEditable = (self.NullOptionIsEditable) ? false : true;
        };

        self.DataUnits = ["KB", "MB", "GB", "TB"];
        self.FolderPermissions = ["Read", "Write", "Read & Write"]

        self.addISMB = function () {
            var iSMB = {}
            self.ismbList.push(iSMB)
            self.NumberOFiSMBs++;
        }
        self.addOSMB = function () {
            var oSMB = {}
            self.osmbList.push(oSMB);
            self.NumberOFoSMBs++;
        }

        self.deleteISMB = function (ISMB) {
            var index = self.ismbList.indexOf(ISMB)
            self.ismbList.splice(index, 1);
            self.NumberOFiSMBs--;
        }
        self.deleteOSMB = function (OSMB) {
            var index = self.osmbList.indexOf(OSMB)
            self.osmbList.splice(index, 1);
            self.NumberOFoSMBs--;
        }


        self.PolicyFacets = {}

        /*--------------------  who is using this channel --------------------*/

        self.is_who_screen_editable = false;

        self.AddIPToChannel = (IP) => {
            var IpArray = self.ChannelFacets['Channel Usage Settings'].Values["StrPropType_ChannelIpsSelection"];
            var IsValidIp = (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(IP)) ? true : false;
            if (!IpArray.includes(IP) && IsValidIp) {
                IpArray.push(IP);
            } else {
                alert("This IP Adress is not valid or may already be used in this Channel");
            }
        }

        /*--------------------  New Channel --------------------*/

        self.ChannelCreationHasRequiredFields = false;
        self.useAsRelay = false;
        self.channel = {};
        channelData.getIcons().then(function (response) {
            self.channelIcons = response.data
            self.ncTypeWidth = (100 / self.channelIcons.length);
        })

        /*-------------------- Sidebar ----------------------*/

        self.channel_list = []
        self.is_edit_mode_on = false;
        self.LoadSidenav = function () {
            channelData.getchannelList().then(function (answer) {
                self.menuItems = answer.data;
                if (self.menuItems.length > 0) {
                    self.NoChannelExists = false;
                    //retrieving the first ID of the list if not already defined
                    self.rootId = $state.params.ChannelId || self.menuItems[0].Id
                    var ChannelType = self.menuItems[0].AgentType
                    for (i = 0; i < self.menuItems.length; i++) {
                        self.channel_list.push(self.menuItems[i])
                    }
                    //self.TemplateSwitcher(self.channel_list[0].AgentType);
                } else {
                    self.NoChannelExists = true;
                }

            })
        }
        self.LoadSidenav()

        self.onDropComplete = function (index, obj, evt) {
                var otherObj = self.channel_list[index];
                var otherIndex = self.channel_list.indexOf(obj);
                self.channel_list[index] = obj;
                self.channel_list[otherIndex] = otherObj;
            }
            //making channelNm non editable by default
        self.is_channelName_editable = false;

        /*-------------------- Formatting facets before POST ----------------------*/

        self.FormatChannelFacetsBeforePOST = function () {
            var Facets2POST = FacetFormatter.FormatForPOST(self, "ChannelFacets", "ServerFacetTemplates");
            return Facets2POST;
        };

        self.ToBoolean = function (value) {
            var bool;
            for (i in value) {
                bool = value[i] === "True";
            }
            return bool
        };
    }
])


app.filter("ReturnPolicyName", () => {
    return (Policy, DefaultKey) => {
        for (i in Policy) {
            if (Policy[i].Key === DefaultKey) {
                return Policy[i].Value;
            }
        }
    }
})