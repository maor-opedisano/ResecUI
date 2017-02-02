app.factory("FacetFormatter", function() {
    return {
        FormatFacetTemplates: function(RetrievedData) {
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

        },
        InitFacets: function(newRetrievedData, EntityFacets) {

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

        },
        FormatForPOST: function(cotrollerData, EntityFacetsFieldName, ServerFacetTemplatesFieldName) {
                var Facets2POST = [];
                angular.forEach(cotrollerData[EntityFacetsFieldName], function(L0Value, L0Key) {
                    var NewFacet = {
                        "Template": cotrollerData[ServerFacetTemplatesFieldName][L0Key],
                        "Description": L0Key,
                        "Values": {}
                    };
                    //create formatted facet list before post to server
                    //steps:
                    //1-go over entity facets
                    //2- for each facet go over facet values. compare to template values collection. if not exist then add default.
                    //3- if value exist then reformat to server format by it is type.
                    //first verify all values in L0Value.Values existed as should by going over facetTemplate which located in current facet(L0Value.Template)
                    angular.forEach(L0Value.Template.Properties, function(propVal, propKey) {
                        //L0Value.Template.Properties=> all properties definitions for current facet. 
                        if (!(propKey in L0Value.Values)) {
                            //not exist so add default
                            L0Value.Values[propKey] = propVal.DefaultValues;
                        }
                    });


                    angular.forEach(L0Value.Values, function(L1Value, L1Key) {
                        //L0Value.Values=> all values in current facet. L1Key is property name(InternalName)
                        var type = L0Value.Template.Properties[L1Key]["Type"];
                        var formattedStr = "";
                        ///start reformat by type               
                        if (type.includes("FacetPropertyType_MultiChoice")) {
                            //multichoice
                            //convert from {"A:B:C:D":true,"E:F:G:H":false} to "A:B:C:D=True|E:F:G:H=False"
                            var currentValue = L1Value;
                            var isFirst = true;
                            for (objkey in currentValue) {
                                formattedStr += (isFirst ? "" : "|") + objkey + "=" + (currentValue[objkey] ? "True" : "False");
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
            /*FormatForPOST: function(Facet) {
            var Facets2POST = [];
            angular.forEach(Facet, function(L0Value, L0Key) {
                var NewFacet = {
                    "Description": L0Key,
                    "Values": {}
                }
                angular.forEach(L0Value.Values, function(L1Value, L1Key) {
                        if (L0Value.hasOwnProperty("Template")) {
                            var KeyType = L0Value.Template.Properties[L1Key].Type
                            if (KeyType.includes("FacetPropertyType_MultiChoice") && L1Value !== null && typeof L1Value === "object") {

                                var ObjectString = "";

                                angular.forEach(L1Value, function(MCValue, MCKey) {

                                        var PropString = "";
                                        //if is not object  then dont go into this function 

                                        angular.forEach(MCValue, function(MC1Value, MC1Key) {
                                            PropString += MC1Value + ":"
                                        })
                                        PropString = PropString.substring(0, PropString.length - 1);

                                        ObjectString += MCKey + "=" + PropString + "|"

                                    })
                                    //ObjectString = ObjectString.substring(0, ObjectString.length - 1);
                                NewFacet.Values[L1Key] = ObjectString

                            } else {

                                console.log(L1Value)
                                NewFacet.Values[L1Key] = (L1Value != null) ? L1Value.toString() : "";

                            }

                        }
                    }

                )

                Facets2POST.push(NewFacet)

                console.log(Facets2POST)
            })
            return Facets2POST;


        }
*/
    }

})