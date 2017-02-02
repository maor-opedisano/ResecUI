app.factory("FacetFormatter", function() {
    return {
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