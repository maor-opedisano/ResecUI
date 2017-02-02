app.controller('policy', ["$scope", "$mdSidenav", "policyData", "channelData", "$state", "$http", "$mdDialog", "$timeout", '$q', "FacetFormatter",

    function($scope, $mdSidenav, policyData, channelData, $state, $http, $mdDialog, $timeout, $q, FacetFormatter) {

        var self = this;
        self.sidenav_edit_mode = false;
        self.PolicyInfo = {};
        self.newPolicy = false;
        self.isEditable = false;
        self.is_policy_sidenav_editable = false;
        self.channelIds = [];
        self.types = {};
        self.areSettingsEditable = false;
        self.allFacets = {};
        self.isChecked = function(ftypes) {
            console.log(ftypes);
            return true;
        }
        self.FiletypeInitConditions = function() {
            self.isAdvancedModeOn = false;
            self.isTableEditable = false;
        };
        self.ComputingUnits = ["Kb", "Mb", "Gb", "Tb"];
        self.show_success_dialog = function(message) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Success')
                .textContent(message)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
            );
        };
        self.show_error_dialog = function(message, errorMessage) {
            var str = message + " : " + errorMessage
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Error')
                .textContent(str)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
            );
        };
        self.RefreshSidenav = function() {
            policyData.getSidenav().then(function(answer) {
                self.sideNavList = answer.data
                if (self.sideNavList.length > 0) {
                    self.NoPolicyExists = false;
                    self.policyId = $state.params.PolicyID || self.sideNavList[0].PolicyId

                } else {
                    self.NoPolicyExists = true;
                }

            })
        }
        self.RefreshSidenav();

        //delete cdr

        self.DeleteAction = function(key, L0Key) {
            //set false
            self.PolicyFacets['Policy CDR Settings'].Values[L0Key][key] = false;

            //delete self.PolicyFacets['Policy CDR Settings'].Values[L0Key][key]
        }

        //________________________Get policy and format it's facets ___________________________

        self.getPolicyInfo = function(id) {
                var deferred = $q.defer();
                self.PolicyFacets = {}; //(jQuery.isEmptyObject(self.policy.PolicyFacets)) ? PolicyFacetsIfNull : self.policy.PolicyFacets;
                self.ServerFacetTemplates = {};
                self.ParsedPolicyFacets = {};
                self.FacetTemplatesContainer = {};
                policyData.get_policy_info(id).then(function(answer) {

                    self.Filetypes = answer.data.PolicyInfo.FileTypesActionsSettings;
                    // checking child state for "AllowOption" Property
                    angular.forEach(self.Filetypes, function(value, key) {
                        if (value.AllowOption == false) {
                            key.ChildrenAreNotAllAllowed = true;
                        } else {
                            key.ChildrenAreNotAllAllowed = false;
                        }
                    });

                    self.policy = answer.data;

                    //init PolicyFacets
                    self.PolicyFacets = (jQuery.isEmptyObject(self.policy.PolicyFacets)) ? {} : self.policy.PolicyFacets;

                    //__________________________________________file detection settings__________________________________________//

                    var q1 = policyData.get_policy_settings("PolicyFileDetectionSettings");
                    /*.then(function(answer) {
                                            var data = answer.data;
                                            self.DetectionFacets = data;

                                        });
                    */

                    /*______________________________________settings______________________________________*/
                    var q2 = policyData.get_policy_settings("PolicySettings");
                    /*.then(function(answer) {
                        var data = answer.data;
                        self.allFacets = data;
                        //  self.InitFacets(self.allFacets, self.PolicyFacets);

                    });
*/
                    //______________________________________retrieving CDR Facets__________________________________________//

                    var q3 = policyData.getCDRFacets();
                    /*.then(function(answer) {

                        self.cdrContainer = {};

                        self.cdr = answer.data;
                        // self.InitFacets(self.cdr, self.PolicyFacets);


                    })*/
                    $q.all({
                        q1,
                        q2,
                        q3
                    }).then(data => {
                        console.log('Both promises have resolved', data);
                        var detectionFacets = data.q1.data;
                        var allFacets = data.q2.data;
                        var cdr = data.q3.data;
                        //merge all facets templates into one object.
                        Object.assign(self.ServerFacetTemplates, detectionFacets, allFacets, cdr);
                        self.DetectionFacets = self.FormatFacetTemplates(detectionFacets);
                        self.allFacets = self.FormatFacetTemplates(allFacets);
                        self.cdr = self.FormatFacetTemplates(cdr);
                        Object.assign(self.FacetTemplatesContainer, self.DetectionFacets, self.allFacets, self.cdr)
                        var FacetVm = self.InitFacets(self.FacetTemplatesContainer, self.PolicyFacets);

                        deferred.resolve(FacetVm);
                    });
                    return deferred.promise;
                }).then(function(answer) {
                    console.log("FacetVm");
                    console.log(answer);
                    self.PolicyFacets = answer.EntityFacets;


                })
            }
            //watching for change//
        $scope.$watch(angular.bind(this, function() {
            return this.policyId;
        }), function(newVal) {
            self.getPolicyInfo(newVal);
        });

        //______________________________________Formatting Facets to display in DOM______________

        //______________________________________Formatting Facets to display in DOM______________
        self.FormatFacetTemplates = function(RetrievedData) {

            return FacetFormatter.FormatFacetTemplates(RetrievedData);

        }

        //RetrievedData= FacetsTemplates from server after parsing and formatting them
        //EntityFacets= all entity(policy or channel) facets contains Raw data
        self.InitFacets = function(newRetrievedData, EntityFacets) {
            return FacetFormatter.InitFacets(newRetrievedData, EntityFacets);
        };
        // ______________________________________   confirm policy creation   __________________________

        self.CreatePolicy = function() {
                policyData.create_new_policy(self.PolicyInfo)
                    .then(function(success) {
                            $mdDialog.cancel();
                            $state.go('app.policy.definition.fileType', {
                                PolicyID: success.data.Id
                            }, {
                                reload: true

                            });
                        },
                        function(error) {
                            alert("there was an error : " + error.data.Message);
                        })
            }
            // ______________________________________   format to post facets   ________________________

        self.FormatForPOST = function() {


            var Facets2POST = FacetFormatter.FormatForPOST(self, "PolicyFacets", "ServerFacetTemplates");
            var confirmPost = confirm("Post To Server?");
            if (confirmPost) {


                policyData.post_policy_settings(self.policyId, Facets2POST).then(function(success) {
                    self.show_success_dialog("Your changes were successfuly saved")
                    self.getPolicyInfo(self.policyId)
                }, function(error) {
                    self.show_error_dialog("An error occured while saving your changes : ", error.data.Message)
                })
            } else {
                console.log('bypassed post operation of object:')
                console.log(Facets2POST)
            }

        }

        //save cdr settings__________________________________________
        self.SaveFacetsInCDR = function(DOMValue) {
                if (!DOMValue) {
                    self.FormatForPOST();
                } else {
                    console.log("childrens are visible");
                    console.log(DOMValue);
                }
            }
            // ______________________________________   End Of formatting to post    __________________________
            // ______________________________________   Special filter    __________________________
        self.myFilter = function(item) {
            console.log('my filter');
            console.log(item);
            return true;
        };
    }

])

// ______________________________________   End Of controller    ______________________________________

// ______________________________________   Custom Filters    ______________________________________



app.filter('filterObject', function() {
    return function(input, search) {
        if (!input) return input;
        if (!search) return input;
        var expected = ('' + search).toLowerCase();
        var result = {};
        angular.forEach(input, function(value, key) {
            var actual = ('' + value).toLowerCase();
            if (actual.indexOf(expected) !== -1) {
                result[key] = value;
            }
        });
        return result;
    }
});
app.filter("splitter", function() {
    return function(string, char, index) {
        if (string == undefined || string === "" || string == null) {
            return;
        }
        if (!(typeof string === 'string' || string instanceof String)) return;
        var splitted = string.split(char)[index]
        string = splitted.split(/(?=[A-Z])/).join(" ");
        return string;
    }
})
app.filter('split', function() {
    return function(input, splitChar, splitIndex) {
        // do some bounds checking here to ensure it has that index
        return input.split(splitChar)[splitIndex];
    }
});