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

            //first format facets from string to objects representation type
            //format facets by its properties type
            //for property type of 'FacetPropertyType_MultiChoice' we will get string with '|' and maybe ':' so we need to convert from string to array of objects 
            var formattedFacets = {};
            angular.forEach(RetrievedData, function(L0Value, L0Key) {
                //L0Key='Policy CDR Settings' for example
                formattedFacets[L0Key] = {
                    "Properties": {},
                    "ConflictsWith": L0Value.ConflictsWith,
                    "Description": L0Value.Description,
                    "IsHidden": L0Value.IsHidden,
                    "IsRequired": L0Value.IsRequired,
                    "IsUnique": L0Value.IsUnique,
                    "Name": L0Value.Name
                }
                angular.forEach(L0Value.Properties, function(value, key) {
                    //parse properties 
                    //L0Key is property name 
                    //value is all property Template with following object keys:{Type,AdditionalInfo,AdditionalInfoType,AllowedValues,DefaultValue,Description,DisplayName,InternalName,IsHidden,PropagateToAgent,TreeTemplateValue}
                    //each property type contain other parsing optionallity
                    //we convert it to slim object with following keys: Type,AvailableValues,DefaultValues,Description,DisplayName,IntenalName,IsHidden
                    var type = value.Type;
                    formattedFacets[L0Key].Properties[key] = { "Type": "", "AvailableValues": null, "DefaultValues": null, "Description": "", "IntenalName": "", "IsHidden": false };
                    formattedFacets[L0Key].Properties[key]["Description"] = value.Description;
                    formattedFacets[L0Key].Properties[key]["DisplayName"] = value.DisplayName;
                    formattedFacets[L0Key].Properties[key]["InternalName"] = value.InternalName;
                    formattedFacets[L0Key].Properties[key]["IsHidden"] = value.IsHidden;
                    formattedFacets[L0Key].Properties[key]["Type"] = type;
                    //start parse by type
                    if (type.includes("FacetPropertyType_MultiChoice")) {
                        //multichoice so split string from property["AdditionalInfo"]
                        var availableValues = null;
                        var defaultValues = {};

                        //handle defaults
                        var defaultsSplittedByPipe = value["DefaultValue"].split('|');
                        for (item in defaultsSplittedByPipe) {
                            var itemStr = defaultsSplittedByPipe[item];
                            if (itemStr !== undefined && itemStr !== null) {
                                //handle default string: convert A:B:C:D=True|E:F:G:H=False=>{"A:B:C:D":true,"E:F:G:H":false}
                                var splittedByEqual = itemStr.split('=');
                                var boolValue = splittedByEqual.length != 2 ? false : splittedByEqual[1] === "True";
                                defaultValues[splittedByEqual[0]] = boolValue;
                            }
                        }
                        formattedFacets[L0Key].Properties[key]["DefaultValues"] = defaultValues;

                        //handle available values
                        var splittedByPipe = value["AdditionalInfo"].split('|');
                        if (!value["AdditionalInfo"].includes(':')) {
                            availableValues = splittedByPipe;
                        } else {
                            availableValues = {};
                            for (item in splittedByPipe) {
                                var itemStr = splittedByPipe[item];
                                if (itemStr !== undefined && itemStr !== null)

                                //special parsing if each splitted string contain ':'- convert from A:B:C:D=>[A,B,C,D]
                                    var specialObj = {};
                                var splittedByDots = itemStr.split(':');
                                specialObj["Key"] = itemStr;
                                specialObj["Value"] = splittedByDots;
                                availableValues[itemStr] = splittedByDots;


                            }
                        }


                        formattedFacets[L0Key].Properties[key]["AvailableValues"] = availableValues;
                    } else if (type.includes("FacetPropertyType_SingleChoice")) {

                        var availableValues = [];
                        //default values 
                        var defaultValue = value["DefaultValue"];

                        formattedFacets[L0Key].Properties[key]["DefaultValues"] = defaultValue;


                        //avaialable values
                        var splittedByPipe = value["AllowedValues"].split('|');
                        for (item in splittedByPipe) {
                            var itemStr = splittedByPipe[item];
                            if (itemStr !== undefined && itemStr !== null)
                                if (itemStr.includes(':')) {
                                    //special parsing if each splitted string contain ':'- convert from A:B:C:D=>[A,B,C,D] 
                                    //special case for example get policyId:PolicyName
                                    var splittedByDots = itemStr.split(':');
                                    availableValues.push((splittedByDots.length == 2) ?
                                        //have only key and value
                                        { "Key": splittedByDots[0], "Value": splittedByDots[1] } : splittedByDots);
                                } else {
                                    //normal string
                                    availableValues.push(itemStr)
                                }


                        }
                        formattedFacets[L0Key].Properties[key]["AvailableValues"] = availableValues;
                    } else if (type.includes("FacetPropertyType_Bool")) {
                        var parsedBool = value["DefaultValue"] === "True" ? true : false;
                        formattedFacets[L0Key].Properties[key]["DefaultValues"] = parsedBool;
                    } else if (type.includes("FacetPropertyType_Int")) {
                        var parsedInt = !isNaN(value["DefaultValue"]) ? parseInt(value["DefaultValue"]) : null;
                        formattedFacets[L0Key].Properties[key]["DefaultValues"] = parsedInt;
                    } else {
                        //other tpes: multiline_string, string annd more

                        formattedFacets[L0Key].Properties[key]["DefaultValues"] = value["DefaultValue"];
                    }

                })
            })
            return formattedFacets;

        }

        //RetrievedData= FacetsTemplates from server after parsing and formatting them
        //EntityFacets= all entity(policy or channel) facets contains Raw data
        self.InitFacets = function(newRetrievedData, EntityFacets) {

            //after format facetTemplates we need to set policyFacets values=> default values if facet not exist inside entity
            var EntityParsedFacets = {};
            if (EntityFacets == null) {
                //return model
                var result = { FacetTemplateContainer: newRetrievedData, EntityFacets: null };
                //finally return new facettemplates and entity facets
                return result;

            }
            //iterate over facets templates and check if entity contain data. if not init with defaults. if yes than parse correctley from string and by type
            angular.forEach(newRetrievedData, function(L0Value, L0Key) {
                //first level=> get facet name
                //init parsed object 
                EntityParsedFacets[L0Key] = {
                    "Template": L0Value,
                    "Description": L0Key,
                    "Values": {
                        //should have Key value paires where value need to be handled according to property type which defined in facet template container

                    }
                }

                //check if entity facet contain definition for this facet
                if (!(L0Key in EntityFacets)) {
                    //facet definition not exist in entity so init EntityParsedFacets from template
                    //run over parsed template and take defaults=> iterate over L0Value which is parsed template
                    //create values dictionary
                    var values = {};
                    // continue;
                    //angular.forEach(L0Value.Properties, function(propVal, propKey) {

                    //   values[propKey] = propVal.DefaultValues;
                    // })
                    //  EntityParsedFacets[L0Key]["Values"] = values;

                } else {
                    //facet is exit but need to be parsed
                    //dive in and parse facet values
                    var EntityParsedValues = {}
                    angular.forEach(EntityFacets[L0Key].Values, function(EntityL0Value, EntityL0Key) {
                        //get type of property from EntityFacets[L0Key]["Template"]["Properties"][EntityL0Key]["Type"]
                        //parse by type
                        var parsedValue = null;
                        var type = EntityFacets[L0Key]["Template"]["Properties"][EntityL0Key]["Type"];
                        if (type.includes("FacetPropertyType_MultiChoice")) {
                            //need to parse by splitting '|' and then by ':' if exist
                            var splittedByPipe = EntityL0Value.split('|');
                            /* if (EntityL0Value.includes(':')) {
                                 //if contain ':' than must be tree type. in the future we should parse tree type.
                                 //for now create array of it(must be cdr action or policy)
                                 var returnedArr = [];
                                 for (x in splittedByPipe) {
                                     var strItem = splittedByPipe[x];
                                     returnedArr.push(strItem);
                                 }
                                 parsedValue = returnedArr
                             } else
                             */
                            if (EntityL0Value.includes('=')) {
                                //case Cuckoo1=True|Cuckoo2=True
                                var retObj = {};
                                for (x in splittedByPipe) {

                                    var strItem = splittedByPipe[x];
                                    var keyValObj = strItem.split('=');
                                    retObj[keyValObj[0]] = keyValObj[1] === "True" ? true : false;

                                }
                                parsedValue = retObj;

                            } else {
                                //take just string
                                parsedValue = splittedByPipe;
                            }

                        } else if (type.includes("FacetPropertyType_Int") || type === "FacetPropertyType_SingleChoice") {
                            //int type or single choice with int
                            parsedValue = (!isNaN(EntityL0Value) ? parseInt(EntityL0Value) : "");

                        } else if (type === "FacetPropertyType_Bool") {
                            //boolean
                            parsedValue = (EntityL0Value === "True" ? true : false);
                        } else {
                            //all other types
                            parsedValue = EntityL0Value;
                        }


                        EntityParsedValues[EntityL0Key] = parsedValue

                    })
                    EntityParsedFacets[L0Key]["Values"] = EntityParsedValues;
                }
            })

            //return model
            var result = { FacetTemplateContainer: newRetrievedData, EntityFacets: EntityParsedFacets };

            //finally return new facettemplates and entity facets
            return result;

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