app.controller('policy', ["$scope", "$mdSidenav", "policyData", "channelData", "$state", "$http", "$mdDialog", "$timeout", '$q', "FacetFormatter",

    function ($scope, $mdSidenav, policyData, channelData, $state, $http, $mdDialog, $timeout, $q, FacetFormatter) {

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
        self.PolicyIsInCreation = false;
        self.isChecked = function (ftypes) {
            return true;
        }
        self.FiletypeInitConditions = function () {
            self.isAdvancedModeOn = false;
            self.isTableEditable = false;
        };
        self.ComputingUnits = ["Kb", "Mb", "Gb", "Tb"];
        self.show_success_dialog = function (message) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Success')
                .textContent(message)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
            );
        };
        self.show_error_dialog = function (message, errorMessage) {
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
        self.RefreshSidenav = function () {
            policyData.getSidenav().then(function (answer) {
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

        self.DeleteAction = function (key, L0Key) {
                self.PolicyFacets['Policy CDR Settings'].Values[L0Key][key] = false;
            }
            //__________________________Filetypes children check __________________________
        self.CheckAllExtensions = (ModelState, Parent, Property) => {
            for (var i = 0, len = Parent.length; i < len; i++) {
                if (Parent[i][Property] !== null) {
                    Parent[i][Property] = (!ModelState) ? false : true;
                }
            }
        };
        self.ChildrenState = (ModelState, Parent, Property) => {
            var TrueElements = [];
            for (var i = 0, len = Parent.length; i < len; i++) {
                if (Parent[i][Property] == true) {
                    TrueElements.push("1");
                }
            }
            ModelState = (TrueElements.length === Parent.length) ? true : false;
            return ModelState;
        };
        self.IsIndeterminate = (Parent, Property) => {
            var ModelState = false;
            var ar = [];
            var x = Parent.every(x => {
                if (x[Property] !== null) {
                    ar.push("2")
                }
                return ar;
            })

            var TrueElements = [];
            var ParentLen = ar.length;
            for (var i = 0, len = Parent.length; i < len; i++) {
                if (Parent[i][Property] == true) {
                    TrueElements.push("1");
                }
            }
            var len = TrueElements.length;
            ModelState = (len < ParentLen && len > 0) ? true : false;
            return ModelState;
        };
        self.DisplayGlobalCheckbox = (Parent, Property) => {
            var testArr = [];
            var willDisplay;
            for (var i = 0, len = Parent.length; i < len; i++) {
                if (Parent[i][Property] !== null){
                    testArr.push(Parent[i]);
                };
            };

            willDisplay = (testArr.length > 0) ? true : false;
           
            return willDisplay;
        };
        //________________________Get policy and format it's facets ___________________________

        self.getPolicyInfo = (id) => {

                //LoadFacetTemplate: Boolean;
                var deferred = $q.defer();
                self.PolicyFacets = {};
                self.ServerFacetTemplates = {};
                self.ParsedPolicyFacets = {};
                self.FacetTemplatesContainer = {};
                //   if (LoadFacetTemplate) {
                policyData.get_policy_info(id).then(function (answer) {

                    self.Filetypes = answer.data.PolicyInfo.FileTypesActionsSettings;
                    // checking child state for "AllowOption" Property
                    angular.forEach(self.Filetypes, function (value, key) {
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

                    self.OpenEmailTemplate = () => {
                        $mdDialog.show({
                                controller: "EmailNotificationTemplateController",
                                templateUrl: 'app/policy/templates/policyDefinition/templates/settings/email.template.html',
                                parent: angular.element(document.body),
                                clickOutsideToClose: true,
                            })
                            .then((answer) => {
                                $scope.status = 'You said the information was "' + answer + '".';
                            }, () => {
                                $scope.status = 'You cancelled the dialog.';
                            });
                    }

                    /*______________________________________settings______________________________________*/
                    var q2 = policyData.get_policy_settings("PolicySettings");

                    //______________________________________retrieving CDR Facets__________________________________________//

                    var q3 = policyData.getCDRFacets();

                    $q.all({
                        q1,
                        q2,
                        q3
                    }).then(data => {
                        self.RawData = data;
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
                }).then(function (answer) {

                    self.PolicyFacets = answer.EntityFacets;
                })

            }
            //watching for change//
        $scope.$watch(angular.bind(this, () => {
            return this.policyId;
        }), function (newVal) {
            self.getPolicyInfo(newVal);
        });


        //______________________________________Formatting Facets to display in DOM______________
        self.FormatFacetTemplates = (RetrievedData) => {

            return FacetFormatter.FormatFacetTemplates(RetrievedData);

        }

        //RetrievedData= FacetsTemplates from server after parsing and formatting them
        //EntityFacets= all entity(policy or channel) facets contains Raw data
        self.InitFacets = (newRetrievedData, EntityFacets) => {
            return FacetFormatter.InitFacets(newRetrievedData, EntityFacets);
        };
        // ______________________________________   confirm policy creation   __________________________

        self.CreatePolicy = () => {
                self.PolicyIsInCreation = true;
                policyData.create_new_policy(self.PolicyInfo).then((success) => {
                        $mdDialog.cancel();
                        $state.go('app.policy.definition.fileType', {
                            PolicyID: success.data.Id
                        }, {
                            reload: true
                        });
                    },
                    (error) => {
                        alert("there was an error : " + error.data.Message);
                    })
            }
            // ______________________________________   format to post facets   ________________________

        self.FormatForPOST = () => {


            var Facets2POST = FacetFormatter.FormatForPOST(self, "PolicyFacets", "ServerFacetTemplates");


            policyData.post_policy_settings(self.policyId, Facets2POST).then((success) => {
                self.show_success_dialog("Your changes were successfuly saved")
                var deferred = $q.defer();
                var $cdr = policyData.getCDRFacets();
                $q.all({
                    $cdr
                }).then(data => {
                    self.cdr = self.FormatFacetTemplates(data.$cdr.data);
                    Object.assign(self.FacetTemplatesContainer, self.DetectionFacets, self.allFacets, self.cdr)
                    var FacetVm = self.InitFacets(self.FacetTemplatesContainer, self.PolicyFacets);
                    deferred.resolve(FacetVm);
                });
                return deferred.promise;
            }).then((answer) => {

                self.PolicyFacets = answer.EntityFacets;


            }, (error) => {
                self.show_error_dialog("An error occured while saving your changes : ", error.data.Message)
            })


        }

        //save cdr settings__________________________________________
        self.SaveFacetsInCDR = (DOMValue) => {
                if (!DOMValue) {
                    self.FormatForPOST();
                }
            }
            // ______________________________________   End Of formatting to post    __________________________
            // ______________________________________   Special filter    __________________________
        self.myFilter = (item) => {

            return true;
        };


    }

])

// ______________________________________   End Of controller    ______________________________________

// ______________________________________   Custom Filters    ______________________________________



app.filter("splitter", function () {
    return function (string, char, index) {
        if (string == undefined || string === "" || string == null) {
            return;
        }
        if (!(typeof string === 'string' || string instanceof String)) return;
        var splitted = string.split(char)[index]
        string = splitted.split(/(?=[A-Z])/).join(" ");
        return string;
    }
});
app.filter('split', function () {
    return function (input, splitChar, splitIndex) {
        // do some bounds checking here to ensure it has that index
        return input.split(splitChar)[splitIndex];
    }
});

app.filter("GetValueFromIndex", function () {
    return (index) => {
        return 1;
    }
})