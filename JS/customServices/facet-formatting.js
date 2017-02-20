app.factory("FacetFormatter", function () {
    var ParseDefaultValues = function (EntityValues, Template) {
        var EntityParsedValues = {}
        angular.forEach(EntityValues, function (EntityL0Value, EntityL0Key) {
            //get type of property from EntityFacets[L0Key]["Template"]["Properties"][EntityL0Key]["Type"]
            //parse by type
            var parsedValue = null;
            var type = Template["Properties"][EntityL0Key]["Type"];
            if (type.includes("FacetPropertyType_MultiChoice")) {
                //need to parse by splitting '|' and then by ':' if exist

                if (EntityL0Value != null) {
                        var splittedByPipe = EntityL0Value.split('|');
                    
                    if (EntityL0Value.includes('=')) {
                        //case Cuckoo1=True|Cuckoo2=True

                        var retObj = (type === "FacetPropertyType_MultiChoice") ? [] : {};


                        for (x in splittedByPipe) {
                            var strItem = splittedByPipe[x];
                            var keyValObj = strItem.split('=');
                            if (type === "FacetPropertyType_String, FacetPropertyType_MultiChoice") {
                                retObj[keyValObj[0]] = keyValObj[1]
                            } else if (type === "FacetPropertyType_MultiChoice") {
                                if (keyValObj[0] !== "") {
                                    retObj.push(keyValObj[0])
                                }
                            } else {
                                retObj[keyValObj[0]] = keyValObj[1] === "True" ? true : false;
                            }
                        }
                        parsedValue = retObj;

                    } else {
                        //take just string
                        parsedValue = splittedByPipe;
                    }
                } else {
                    parsedValue = null;

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
        return EntityParsedValues;

    }
    return {
        FormatFacetTemplates: function (RetrievedData) {
            //first format facets from string to objects representation type
            //format facets by its properties type
            //for property type of 'FacetPropertyType_MultiChoice' we will get string with '|' and maybe ':' so we need to convert from string to array of objects 
            var formattedFacets = {};
            angular.forEach(RetrievedData, function (L0Value, L0Key) {
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
                angular.forEach(L0Value.Properties, function (value, key) {
                    //parse properties 
                    //L0Key is property name 
                    //value is all property Template with following object keys:{Type,AdditionalInfo,AdditionalInfoType,AllowedValues,DefaultValue,Description,DisplayName,InternalName,IsHidden,PropagateToAgent,TreeTemplateValue}
                    //each property type contain other parsing optionallity
                    //we convert it to slim object with following keys: Type,AvailableValues,DefaultValues,Description,DisplayName,IntenalName,IsHidden
                    var type = value.Type;
                    formattedFacets[L0Key].Properties[key] = {
                        "Type": "",
                        "AvailableValues": null,
                        "DefaultValues": null,
                        "Description": "",
                        "IntenalName": "",
                        "IsHidden": false
                    };

                    formattedFacets[L0Key].Properties[key]["Description"] = value.Description;
                    formattedFacets[L0Key].Properties[key]["DisplayName"] = value.DisplayName;
                    formattedFacets[L0Key].Properties[key]["InternalName"] = value.InternalName;
                    formattedFacets[L0Key].Properties[key]["IsHidden"] = value.IsHidden;
                    formattedFacets[L0Key].Properties[key]["Type"] = type;
                    //start parse by type
                    if (type.includes("FacetPropertyType_MultiChoice")) {

                        var availableValues = null;
                        var defaultValues = (type === "FacetPropertyType_MultiChoice") ? [] : {};

                        //handle defaults
                        if (value["DefaultValue"] != null && value["DefaultValue"] !== "") {
                            var defaultsSplittedByPipe = value["DefaultValue"].split('|');
                            for (item in defaultsSplittedByPipe) {
                                var itemStr = defaultsSplittedByPipe[item];
                                if (itemStr !== undefined && itemStr !== null) {
                                    //handle default string: convert A:B:C:D=True|E:F:G:H=False=>{"A:B:C:D":true,"E:F:G:H":false}
                                    var splittedByEqual = itemStr.split('=');
                                    if (type === "FacetPropertyType_String, FacetPropertyType_MultiChoice") {
                                        var boolValue = splittedByEqual[1];
                                        defaultValues[splittedByEqual[0]] = boolValue;
                                    } else if (type === " FacetPropertyType_MultiChoice") {
                                        console.log("coucou")
                                        defaultValue.push(itemStr)
                                        console.log(defaultValue)
                                    } else {
                                        var boolValue = splittedByEqual.length != 2 ? false : splittedByEqual[1] === "True";
                                        defaultValues[splittedByEqual[0]] = boolValue;
                                    }

                                }
                            }
                        }
                        formattedFacets[L0Key].Properties[key]["DefaultValues"] = defaultValues;

                        //handle available values
                        if (value["AdditionalInfo"] != null) {
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
                        }
                        formattedFacets[L0Key].Properties[key]["AvailableValues"] = availableValues;
                    } else if (type.includes("FacetPropertyType_SingleChoice")) {

                        var availableValues = [];
                        //default values 
                        var defaultValue = value["DefaultValue"];

                        formattedFacets[L0Key].Properties[key]["DefaultValues"] = defaultValue;


                        //avaialable values
                        var dataKey = type === "FacetPropertyType_Bool, FacetPropertyType_SingleChoice" ? "AdditionalInfo" : "AllowedValues";
                        var splittedByPipe = value[dataKey].split('|');
                        for (item in splittedByPipe) {
                            var itemStr = splittedByPipe[item];
                            if (itemStr !== undefined && itemStr !== null)
                                if (itemStr.includes(':')) {
                                    //special parsing if each splitted string contain ':'- convert from A:B:C:D=>[A,B,C,D] 
                                    //special case for example get policyId:PolicyName
                                    var splittedByDots = itemStr.split(':');
                                    availableValues.push((splittedByDots.length == 2) ?
                                        //have only key and value
                                        {
                                            "Key": splittedByDots[0],
                                            "Value": splittedByDots[1]
                                        } : splittedByDots);
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

        },
        InitFacets: function (newRetrievedData, EntityFacets) {

            //after format facetTemplates we need to set policyFacets values => default values if facet not exist inside entity
            var EntityParsedFacets = {};
            if (EntityFacets == null) {
                //return model
                var result = {
                    FacetTemplateContainer: newRetrievedData,
                    EntityFacets: null
                };
                //finally return new facettemplates and entity facets
                return result;

            }
            //iterate over facets templates and check if entity contain data. if not init with defaults. if yes then parse correctly from string and by type
            angular.forEach(newRetrievedData, function (L0Value, L0Key) {
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
                    //facet definition does not exist in entity so init EntityParsedFacets from template
                    //run over parsed template and take defaults => iterate over L0Value which is parsed template
                    //create values dictionary
                    var values = {};

                    angular.forEach(L0Value.Properties, function (propVal, propKey) {

                        values[propKey] = propVal.DefaultValues;
                    })
                    EntityParsedFacets[L0Key]["Values"] = values;

                } else {
                    //facet is exit but need to be parsed
                    //dive in and parse facet values 
                    var EntityParsedValues = ParseDefaultValues(EntityFacets[L0Key].Values, EntityFacets[L0Key]["Template"]);
                    EntityParsedFacets[L0Key]["Values"] = EntityParsedValues;
                }
            })

            //return model
            var result = {
                FacetTemplateContainer: newRetrievedData,
                EntityFacets: EntityParsedFacets
            };

            //finally return new facettemplates and entity facets
            return result;

        },
        FormatForPOST: function (controllerData, EntityFacetsFieldName, ServerFacetTemplatesFieldName) {
            var Facets2POST = [];
            angular.forEach(controllerData[EntityFacetsFieldName], function (L0Value, L0Key) {
                var NewFacet = {
                    "Template": controllerData[ServerFacetTemplatesFieldName][L0Key],
                    "Description": L0Key,
                    "Values": {}
                };
                //create formatted facet list before post to server
                //steps:
                //1-go over entity facets
                //2- for each facet go over facet values. compare to template values collection. if not exist then add default.
                //3- if value exist then reformat to server format by it is type.
                //first verify all values in L0Value.Values existed as should by going over facetTemplate which located in current facet(L0Value.Template)
                angular.forEach(L0Value.Template.Properties, function (propVal, propKey) {
                    //L0Value.Template.Properties=> all properties definitions for current facet. 
                    if (!(propKey in L0Value.Values)) {
                        //not exist so add default
                        L0Value.Values[propKey] = propVal.DefaultValues;
                    }
                });
                angular.forEach(L0Value.Values, function (L1Value, L1Key) {
                    //L0Value.Values => all values in current facet. L1Key is property name(InternalName)
                    var type = L0Value.Template.Properties[L1Key]["Type"];
                    var formattedStr = "";
                    ///start reformat by type               
                    if (type.includes("FacetPropertyType_MultiChoice")) {
                        //multichoice
                        //convert from {"A:B:C:D":true,"E:F:G:H":false} to "A:B:C:D=True|E:F:G:H=False"
                        var currentValue = L1Value;
                        var isFirst = true;
                        for (objkey in currentValue) {
                            if (type === "FacetPropertyType_String, FacetPropertyType_MultiChoice") {
                                formattedStr += (isFirst ? "" : "|") + objkey + "=" + currentValue[objkey];
                            } else if (type === "FacetPropertyType_MultiChoice") {
                                if (currentValue !== "") {
                                    var PipedString = ""
                                    for (i in currentValue) {
                                        PipedString += (currentValue[i] + "|");
                                    }
                                    PipedString = PipedString.slice(1, -1);
                                    console.log(PipedString)
                                    formattedStr = PipedString;
                                }
                            } else {
                                formattedStr += (isFirst ? "" : "|") + objkey + "=" + (currentValue[objkey] ? "True" : "False");
                            }
                            isFirst = false;
                        }

                    } else if (type.includes("FacetPropertyType_Int") || type === "FacetPropertyType_SingleChoice") {
                        //int type or single choice with int 
                        formattedStr = "" + L1Value + "";
                    } else if (type === "FacetPropertyType_Bool") {
                        //boolean 
                        formattedStr = (L1Value ? "True" : "False");
                    } else {
                        //all other types 
                        formattedStr = L1Value;
                    }
                    NewFacet.Values[L1Key] = formattedStr;

                });
                Facets2POST.push(NewFacet);
            })
            return Facets2POST;
        }

    }

})