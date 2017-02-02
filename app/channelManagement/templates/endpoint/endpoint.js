app.controller("channels", ["C2CData", "channelData", "$scope", "$mdDialog", "$state", "FacetFormatter",
    function(C2CData, channelData, $scope, $mdDialog, $state, FacetFormatter) {

        var self = this;
        self.timeReferences = ['Real Time', '1 hour', '1 week', '2 weeks', '3 weeks', '1 month'];
        //setting switcher function to switch templates
        self.TemplateConditions = {};
        self.TemplateSwitcher = function(ChannelType, channelInfo) {
            switch (ChannelType) {
                // endpoint

                case 2:
                    self.TemplateConditions.isDirWatcher = false;
                    self.TemplateConditions.isEndpoint = true;
                    self.EndpointSourcesAreEditable = false;
                    self.InputConfiguration = (channelInfo.InputConfiguration == null) ? {} : channelInfo.InputConfiguration;
                    self.ismbList = (self.InputConfiguration.IoSmbConfiguration == null) ? [] : self.InputConfiguration.IoSmbConfiguration;
                    self.OutputConfiguration = (channelInfo.OutputConfiguration == null) ? {} : channelInfo.OutputConfiguration;
                    self.osmbList = (self.OutputConfiguration.IoSmbConfiguration == null) ? [] : self.OutputConfiguration.IoSmbConfiguration;

                    console.log("inside switcher")
                    console.log(ChannelType)
                    break;
                    //case is dirwatcher
                case 3:
                    self.TemplateConditions.isDirWatcher = true;
                    self.TemplateConditions.isEndpoint = false;
                    self.DWSourcesAreEditable = false;
                    self.DW.Sources = channelInfo.DirWatcherConfigurations || [];
                    console.log("inside switcher")
                    console.log(ChannelType)
                    break;
            }
        }

        //__________________DirWatchers ______________________

        self.DW = {
            "Sources": []
        };
        //add an entry to dir watcher sources
        self.CreateNewDirWatcherSourcesEntry = function() {
            self.DW.Sources.push({})
        };
        //remove entry from dirwatcher sources
        self.RemoveDirWatcherSourcesEntry = function(index) {
            self.DW.Sources.splice(index, 1);
        };

        //__________________End of DirWatchers ______________________

        //init the settings table as non editable by default 

        self.AreSettingsEditable = false;

        //dialogs to show for error and success
        self.HTTP_Dialogs = {

            ShowSuccessDialog: function() {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Success')
                    .textContent('Your changes were successfully saved.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                )
            },
            ShowErrorDialog: function(ErrorMessage) {
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

        /*--------------------  Init FacetContainer --------------------*/

        self.InitFacets = function(FacetContainer) {
            angular.forEach(FacetContainer, function(L0Value, L0Key) {
                //self.ChannelFacets = (self.channel_data.ChannelFacets.hasOwnProperty(L0Key)) ? self.channel_data.ChannelFacets : {[L0Key]: { "Values": {} }};
                self.ChannelFacets = self.channel_data.ChannelFacets || {}
                self.ChannelFacets[L0Key] = self.channel_data.ChannelFacets[L0Key] || {
                    "Values": {}
                };
                angular.forEach(FacetContainer[L0Key].Properties, function(value, key) {
                    if (self.ChannelFacets[L0Key].Values[key] == undefined || self.ChannelFacets[L0Key].Values[key] == "") {

                        if (value.Type !== "FacetPropertyType_SingleChoice" || value.Type !== "FacetPropertyType_MultiChoice") {

                            self.ChannelFacets[L0Key].Values[key] = value.DefaultValue


                        } else {
                            var arr = [];
                            angular.forEach(value.DefaultValue, function(v, k) {
                                arr.push(v)
                            }, arr)
                            self.ChannelFacets[L0Key].Values[key] = arr
                        }
                    } else {
                        self.ChannelFacets[L0Key].Values[key] = self.ChannelFacets[L0Key].Values[key].split("|")
                    }
                })
            })
        }

        /*--------------------  Watching for changes in channel ID --------------------*/

        self.UpdateChannelData = function(newVal) {
            channelData.get_channel(newVal).then(function(answer) {
                self.channel_data = answer.data
                var channelInfo = answer.data.ChannelInfo
                self.ServerFacetTemplates = {}
                self.TemplateSwitcher(answer.data.AgentType, channelInfo);
                self.ChannelConfiguration = channelInfo.ChannelConfiguration;
                self.generalInformations = channelInfo.GeneralInformations;
                channelData.ChannelFacets().then(function(answer) {
                    self.ServerFacetTemplates = answer.data;
                    self.whoData = FacetFormatter.FormatFacetTemplates(answer.data);

                    var facetsVm = FacetFormatter.InitFacets(self.whoData, self.ChannelFacets);
                    self.ChannelFacets = facetsVm.EntityFacets
                })

            })
        }
        $scope.$watch(angular.bind(this, function() {
            return this.rootId;
        }), function(newValue) {
            self.UpdateChannelData(newValue)
            console.log("new id for channel from $watch " + newValue)
        });
        //default view for dashboard is blocked
        self.isBlocked = true;
        channelData.getChannelDashboard(self.rootId).then(function(answer1) {
            self.channelDashboard = answer1.data
        })

        /*--------------------  Channel Input and Output --------------------*/

        self.are_outputs_and_outputs_editable = false;
        channelData.get_input_output_list().then(function(answer) {
            self.all_inputs = answer.data[0].inputs
            self.is_input_selected = false;
        })

        self.DataUnits = ["KB", "MB", "GB", "TB"]
        self.FolderPermissions = ["Read", "Write", "Read & Write"]

        self.addISMB = function() {
            var iSMB = {}
            self.ismbList.push(iSMB)
        }
        self.addOSMB = function() {
            var oSMB = {}
            self.osmbList.push(oSMB)
        }

        self.deleteISMB = function(ISMB) {
            var index = self.ismbList.indexOf(ISMB)
            self.ismbList.splice(index, 1);
        }
        self.deleteOSMB = function(OSMB) {
            var index = self.osmbList.indexOf(OSMB)
            self.osmbList.splice(index, 1);
        }
        self.PolicyFacets = {}

        /*--------------------  who is using this channel --------------------*/

        self.is_who_screen_editable = false;

        /*--------------------  New Channel --------------------*/

        self.ChannelCreationHasRequiredFields = false;
        self.useAsRelay = false;
        self.channel = {};
        channelData.getIcons().then(function(response) {
            self.channelIcons = response.data
            self.ncTypeWidth = (100 / self.channelIcons.length);
        })

        /*-------------------- Sidebar ----------------------*/

        self.channel_list = []
        self.is_edit_mode_on = false;
        self.LoadSidenav = function() {
            channelData.getchannelList().then(function(answer) {
                self.menuItems = answer.data;
                if (self.menuItems.length > 0) {
                    self.NoChannelExists = false;
                    //retrieving the first ID of the list if not already defined
                    self.rootId = $state.params.ChannelId || self.menuItems[0].Id
                    var ChannelType = self.menuItems[0].AgentType
                    console.log(ChannelType)
                    for (i = 0; i < self.menuItems.length; i++) {
                        self.channel_list.push(self.menuItems[i])
                    }
                    //self.TemplateSwitcher(self.channel_list[0].AgentType)

                } else {
                    self.NoChannelExists = true;
                }

            })
        }
        self.LoadSidenav()
        console.log(self.channel_list)

        self.onDropComplete = function(index, obj, evt) {
                var otherObj = self.channel_list[index];
                var otherIndex = self.channel_list.indexOf(obj);
                self.channel_list[index] = obj;
                self.channel_list[otherIndex] = otherObj;
            }
            //making channelNm non editable by default
        self.is_channelName_editable = false;

        /*-------------------- Formatting facets before POST ----------------------*/

        self.FormatChannelFacetsBeforePOST = function() {

            self.FacetsToPost = FacetFormatter.FormatForPOST(self, "ChannelFacets", "ServerFacetTemplates");
            var ChannelUsageObject = {}
            var ChannelSettingsObject = {}

            angular.forEach(self.ChannelFacets, function(L1Value, L1Key) {
                var facet = { Description: "", Values: {} };
                //L1Key = Channel Usage Settings || Agent Settings
                facet.Description = L1Key;
                angular.forEach(L1Value.Values, function(L2Value, L2Key) {

                        if (!Array.isArray(L2Value)) {
                            //L2Key === "StrPropType_ChannelPolicyToUse" || L2Key === "StrPropType_DetailsMessage"
                            facet.Values[L2Key] = L2Value;
                            //                        (L1Key === "Channel Usage Settings") ? ChannelUsageObject[L2Key] = L2Value: ChannelSettingsObject[L2Key] = L2Value

                        } else {
                            var str = "";
                            angular.forEach(L2Value, function(L3Value, L3Key) {
                                str += L3Value + "|";
                            })
                            str = str.slice(0, str.lastIndexOf("|"));
                            //(L1Key === "Channel Usage Settings") ? ChannelUsageObject[L2Key] = str: ChannelSettingsObject[L2Key] = str
                            facet.Values[L2Key] = str;

                            //L1object[L2Key] = str
                        }
                    })
                    /*self.FacetsToPost[0] = {
                        "Description": "Channel Usage Settings",
                        "Values": ChannelUsageObject
                    }
                    self.FacetsToPost[1] = {
                        "Description": "Agent Settings",
                        "Values": ChannelSettingsObject
                    }*/
                self.FacetsToPost.push(facet)
            })
            console.log(self.FacetsToPost)
        }
        self.ToBoolean = function(value) {
            var bool;
            for (i in value) {
                console.log(value[i])
                bool = value[i] === "True";
            }
            console.log(bool)
            return bool
        }

    }
])