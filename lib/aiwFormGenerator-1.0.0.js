
var aiwModule = angular.module('AiwFormGeneratorModule', []);
aiwModule.factory('AiwFormParams', ['aiwFormGeneratorService', function (aiwFGService) {
        var AiwFormParams = function (formName) {
            var self = this;
            self.view = 'view/aiwFormGenerator';
            self.privateTemplate = '<form name="' + formName + '"><div [|loop|]><label>[|label|]</label>[|fields|]</div><br/><br/>[|buttons|]</form>';
            self.fields = [];
            self.properties = {};
            self.groups = {};
            self.sources = {};
            self.validationClass = 'alert';
            self.validationMessage = {
                string: {notAString: 'is not a string!', tooShort: 'is too short!', tooLong: 'is too long!', class: 'label-important'},
                number: {notANumber: 'is not a number!', tooShort: 'is too low!', tooLong: 'is too high!', class: 'label-important'},
                length: {tooShort: "is too short!", tooLong: "is too long!"},
            };
            this.addGroup = function (groupName, newHtml) {
                var html = newHtml || '<div ng-switch on="field.type" ng-repeat="field in formParams.getFields(\'' + groupName + '\')">[|fields|]</div>';
                self.groups['[|' + groupName + '|]'] = html;

                return this;
            };
            this.getGroups = function () {
                return self.groups;
            };
            this.setView = function (view) {
                self.view = view;
                return this;
            };
            this.getView = function () {
                return self.view;
            };
            this.getTemplate = function () {
                return self.privateTemplate;
            };
            this.setTemplate = function (template) {
                self.privateTemplate = template;
                return this;
            };
            this.addField = function (fieldSettings, fieldsProperty, groupName) {
                var name = groupName || 'fields';
                fieldSettings['group'] = name;
                self.fields.push(fieldSettings);
                self.properties[fieldSettings.fieldName] = fieldsProperty;
                return this;
            };
            this.addSelect = function (fieldSettings, fieldsProperty, groupName) {
                fieldSettings['type'] = 'select';
                fieldsProperty['ng-options'] = "obj as obj.label for obj in formParams.getSource('" + fieldSettings.source + "')";
                this.addField(fieldSettings, fieldsProperty, groupName);
                return this;
            };
            this.addCheckbox = function (fieldSettings, fieldsProperty, groupName) {
                fieldSettings['type'] = 'checkbox';
                fieldSettings['maxChoices'] = 65535;
                fieldsProperty['ng-change'] = "pushValue('" + fieldSettings.fieldName + "',singleCheckbox,'" + fieldSettings.source + "',$index)";
                this.addField(fieldSettings, fieldsProperty, groupName);
                return this;
            };
            this.getFields = function (groupName) {
                var name = groupName || 'fields';
                var result = [];
                angular.forEach(self.fields, function (curValue) {
                    if (curValue.group == name) {
                        result.push(curValue);
                    }
                });
                return result;
            };
            this.setSource = function (sourceName, sourceArray) {
                self.sources[sourceName] = sourceArray;
                return this;
            };
            this.getSource = function (sourceName, params) {
                if (angular.isDefined(params) && params.isFunction == true) {
                    return self.sources[sourceName](params);
                }
                return self.sources[sourceName];
            };
            this.getField = function (fieldName, groupName) {
                var name = groupName || 'fields';
                return aiwFGService.getObjectFromField(self.fields, fieldName, 'fieldName');
            };
            this.getProperties = function (field) {
                return self.properties[field];
            };
            this.setValidationClass = function (className) {
                self.validationClass = className;
                return this;
            };
            this.getValidationClass = function () {
                return  self.validationClass;
            };
            this.setValidationMessage = function (validationType, parameter, newValue) {
                self.validationMessage[validationType][parameter] = newValue;
            };
        };
        return AiwFormParams;
    }]);
aiwModule.factory('AiwBootstrapParams',['AiwFormParams', function (AiwFormParams) {
    var AiwBootstrapParams = function (formName) {
        var self = this;
        self.init = function () {
            AiwParams.setValidationClass('label-important')
            AiwParams.setView('view/aiwFormGeneratorBootstrap');
            return AiwParams;
        };

        var AiwParams = new AiwFormParams(formName);
        
        AiwParams.getAutocomplete = function (source, term) {
            var elements = AiwParams.getSource(source);
            var tmp = [];
            angular.forEach(elements, function (current) {
                var re = new RegExp('(' + term + ')', 'mi');
                if (re.exec(current.label) != null) {
                    tmp.push(current);
                }
            });
            return tmp;
        }
        
        AiwParams.addDatePicker = function (fieldSettings, fieldsProperty, groupName) {
            fieldSettings["type"] = "text";
            fieldsProperty["ng-click"] = "data.isOpen = true";
            fieldsProperty["is-open"] = "data.isOpen";
            fieldsProperty["datepicker-popup"] = "dd-MMMM-yyyy";
            AiwParams.addField(fieldSettings, fieldsProperty, groupName);
            return AiwParams;
        };
        AiwParams.addTimePicker = function (fieldSettings, fieldsProperty, groupName) {
            fieldSettings["type"] = "timePicker";
            fieldsProperty["hour-step"] = "1";
            fieldsProperty["minute-step"] = "5";
            fieldsProperty["show-meridian"] = true;
            AiwParams.addField(fieldSettings, fieldsProperty, groupName);
            return AiwParams;
        };
        
        AiwParams.addRating= function(fieldSettings, fieldsProperty, groupName){
             fieldSettings["type"] = "rating";
             fieldsProperty["max"] = 10;
             fieldsProperty["readonly"] =false;
             fieldsProperty["on-hover"] ="hoveringOver(value)";
             fieldsProperty["on-leave"]="overStar = null";
             AiwParams.addField(fieldSettings, fieldsProperty, groupName);
            return AiwParams;
        };
        
        AiwParams.addAutocomplete = function (fieldSettings, fieldsProperty, groupName) {
            fieldSettings["type"] = "text";
            fieldsProperty["typeahead-min-length"] = "2";
            fieldsProperty["typeahead-wait-ms"] = "300";
            var label = fieldSettings['sourceLabel'] || 'obj.label';
            if (fieldSettings.static) {
                fieldsProperty["typeahead"] = label+ " for obj in formParams.getAutocomplete('" + fieldSettings.source + "',ngModel." + fieldSettings.fieldName + ")";
            } else {
                fieldsProperty["typeahead"] = label+ " for obj in execute('"+fieldSettings.source+"',"+fieldSettings.sourceParams+")";
            }

            AiwParams.addField(fieldSettings, fieldsProperty, groupName);
            return AiwParams;
        };


    };
    return AiwBootstrapParams;
}]);
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
            loadFieldsTemplate: function (view,callback) {
                return  $http.get(view+'.html', {cache: $templateCache}).then(callback);
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

aiwModule.directive('updateAttr', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            priority:10,
            link: function (scope, elem, attrs) {
                if (angular.isDefined(attrs['property']) && attrs['property'].length != 0) {
                    var json = JSON.parse(attrs['property']);
                    angular.forEach(json, function (value, key) {
                        elem.attr(key, value);
                    });
                    elem.removeAttr('property');
                    var $e = $compile(elem[0].outerHTML)(scope);
                    elem.replaceWith($e);
                }
            }
        };
    }]);
aiwModule.directive('aiwFormGenerator', ['aiwFormGeneratorService', '$compile', function (aiwFGService, $compile) {
        return {
            restrict: 'A',
            replace: true,
            priority: 0,
            scope: {
                ngModel: '=',
                formParams: '='
            },
            link: function ($scope, element) {
                var template;
                aiwFGService.loadFieldsTemplate($scope.formParams.getView(), function (response) {
                    var transclude = angular.copy(element.html());
                    template = aiwFGService.replaceTagInTemplate($scope.formParams, response.data, transclude);
                }).then(function () {
                    element.html(template);
                    $compile(element.contents())($scope);
                });
                if (!angular.isDefined($scope.ngModel)) {
                    $scope.ngModel = {};
                }

                $scope.initNgModel();

                $scope.$watch('ngModel', function (newValue, oldValue) {
                    angular.forEach(newValue, function (currentField, fieldName) {
                        var fieldConf = $scope.formParams.getField(fieldName);
                        if (fieldConf.required == true) {
                            $scope.checkRequired(fieldConf);
                        } else if (angular.isDefined(fieldConf.validation)) {
                            $scope.validation(fieldName, fieldConf.label, currentField, fieldConf.validation);
                        }
                    });
                }, true);
            },
            controller: function ($scope) {
                $scope.initNgModel = function () {
                    angular.forEach($scope.formParams.fields, function (fieldConf) {
                        if (!angular.isDefined($scope.ngModel[fieldConf.fieldName])) {
                            if (!angular.isDefined(fieldConf.maxChoices) || fieldConf.maxChoices == 1) {
                                $scope.ngModel[fieldConf.fieldName] = '';
                            } else {
                                $scope.ngModel[fieldConf.fieldName] = [];
                            }


                        }
                    });
                };
                $scope.pushValue = function (fieldName, value, sourceName, index) {
                    var fieldProperties = $scope.formParams.getProperties(fieldName);
                    if (value === false || value == fieldProperties['ng-false-value']) {
                        var trueValue = $scope.formParams.getSource(sourceName)[index].value;
                        var index = $scope.ngModel[fieldName].indexOf(trueValue);
                        $scope.ngModel[fieldName].splice(index, 1);
                        return;
                    }
                    $scope.ngModel[fieldName].push(value);
                }

                $scope.returnType = function (type, value) {
                    if (value.indexOf(type) != -1) {
                        return true;
                    }
                    return false;

                }

                $scope.execute = function (fnName, params) {
                   return $scope.$parent[fnName](params);
                };
                $scope.formError = [];
                $scope.checkRequired = function (field) {
                    var compare = field.required;
                    if (angular.isFunction(field.required)) {
                        compare = field.required();
                    }
                    if (compare && ($scope.ngModel[field.fieldName] == null || $scope.ngModel[field.fieldName].length == 0)) {
                        $scope.formError[field.fieldName] = {error: true, message: field.label + ' is required', class: $scope.formParams.getValidationClass()};
                        return;
                    }
                    $scope.formError[field.fieldName] = {error: false, message: ''};

                };
                $scope.validation = function (fieldName, label, value, validation) {
                    if (!angular.isObject(validation)) {
                        $scope.formError[fieldName] = $scope.customValidation(validation, value);
                        return;
                    }
                    switch (validation.type) {
                        case 'numeric':
                            $scope.formError[fieldName] = $scope.isANumber(value, validation.min, validation.max, label);
                            break;
                        case 'length':
                            $scope.formError[fieldName] = $scope.isANumber(value.length, validation.min, validation.max, label, $scope.formParams.validationMessage.length);
                            break;
                        case 'string':
                            $scope.formError[fieldName] = $scope.isAString(value, validation.min, validation.max, label);
                            break;
                    }
                };

                $scope.customValidation = function (validation, value) {
                    var validationResult = validation(value);
                    if (validationResult === undefined) {
                        validationResult = {
                            error: false,
                            message: ''
                        };
                    }
                    return validationResult;
                };

                $scope.isANumber = function (value, minDef, maxDef, label, message) {
                    var min = minDef || null;
                    var max = maxDef || null;
                    var displayMessage = message || $scope.formParams.validationMessage.number;
                    var num = parseInt(value) || null;

                    if (num === null && value != 0) {
                        return {error: true, message: label + ' ' + displayMessage.notANumber, class: $scope.formParams.getValidationClass()};
                    }
                    if (min != null && num < min) {
                        return {error: true, message: label + ' ' + displayMessage.tooShort, class: $scope.formParams.getValidationClass()};
                    }
                    if (max != null && num > max) {
                        return {error: true, message: label + ' ' + displayMessage.tooLong, class: $scope.formParams.getValidationClass()};
                    }
                    return {error: false, message: ''}

                };
                $scope.isAString = function (value, min, max, label) {
                    var reg = new RegExp('\\d');
                    var result = reg.test(value);
                    if (result) {
                        return {error: true, message: label + ' ' + $scope.formParams.validationMessage.string.notAString, class: $scope.formParams.getValidationClass()};
                    } else {
                        return $scope.isANumber(value.length, min, max, label, $scope.formParams.validationMessage.string);
                    }
                };
            }
        }
        ;
    }]);