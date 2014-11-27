/* 
 * @author AliceIw
 */
aiwModule.factory('aiwFormGeneratorService', ['$http', '$templateCache', function ($http, $templateCache) {
        return {
            isEmpty: function (obj) {
                if (obj == null)
                    return true;
                if (obj.length > 0)
                    return false;
                if (obj.length === 0)
                    return true;
                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key))
                        return false;
                }
                return true;
            },
            loadFieldsTemplate: function (view, callback) {
                return  $http.get(view + '.html', {cache: $templateCache}).then(callback);
            },
            merge: function (obj1, obj2) {
                for (var attrname in obj2) {
                    obj1[attrname] = obj2[attrname];
                }
                return obj1;
            },
            replaceTagInTemplate: function (formParams, fieldsTemplate, transclude) {
                var template = formParams.getTemplate();
                var mapObj = {
                    "[|fields|]": fieldsTemplate,
                    "[|loop|]": 'ng-switch on="field.type" ng-repeat="field in formParams.getFields()"',
                    "[|transclude|]": transclude
                };
                mapObj = this.merge(mapObj, formParams.getGroups());
                angular.forEach(mapObj, function (toReplace, Key) {
                    template = template.replace(Key, toReplace);
                });
                var re = new RegExp("(\\[\\|fields\\|\\])", 'g');
                template = template.replace(re, fieldsTemplate);
                var re = new RegExp("(\\[\\|label\\|\\])", 'g');
                template = template.replace(re, '{{field.label}}');
                //var re = new RegExp("(\\[\\|validation\\|\\])", 'g');
                //template = template.replace(re, formParams.validationHtml);
                return template;
            },
            getObjectFromField: function (haystack, needle, fieldId) {
                var idx;
                angular.forEach(haystack, function (straw, keyStraw) {
                    if (straw[fieldId] == needle) {
                        idx = keyStraw;
                        return;
                    }
                });
                if (idx !== undefined) {
                    return haystack[idx];
                }
                return false;
            }
        };
    }]);