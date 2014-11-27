aiwModule.directive('aiwFormGenerator', ['AiwFormGeneratorService', 'AiwValidationService', '$compile', function (aiwFGService, aiwValidation, $compile) {
    return {
        restrict: 'A',
        replace: true,
        priority: 10,
        link: function ($scope, element, attr) {
            var $directive = $scope.$new(true);
            var formName = $scope[attr['formParams']].formName + 'Form';
            var validationService = new aiwValidation($scope[attr['formParams']].validationMessage, $scope[attr['formParams']].getValidationClass());

            $directive.formParams = $scope[attr['formParams']];
            $directive.ngModel = $scope[attr['ngModel']];
            $directive.formError = {};

            this.initNgModel = function () {
                $directive.ngModel = $directive.ngModel || {};

                angular.forEach($directive.formParams.fields, function (fieldConf) {
                    //$scope[formName][fieldConf.fieldName] = {};
                    if (!angular.isDefined($directive.ngModel[fieldConf.fieldName])) {
                        if (!angular.isDefined(fieldConf.maxChoices) || fieldConf.maxChoices == 1) {
                            $directive.ngModel[fieldConf.fieldName] = '';
                        } else {
                            $directive.ngModel[fieldConf.fieldName] = [];
                        }
                    }
                });
            };

            this.initNgModel();

            aiwFGService.loadFieldsTemplate($directive.formParams.getView(), function (response) {
                var transclude = element.html();
                return aiwFGService.replaceTagInTemplate($directive.formParams, response.data, transclude);
            }).then(function (template) {
                element.html(template);

                $compile(element.contents())($directive);
                $compile(element.contents())($scope);
            });

            $directive.returnType = function (type, value) {
                return aiwFGService.typeExist(value, type);
            }

            $directive.ngModel.formIsValid = function () {
                if (!angular.isDefined($scope[formName])) {
                    return false;
                }
                return $scope[formName].$valid;
            }

            $directive.$watch('ngModel', function (newValue) {
                angular.forEach(newValue, function (currentField, fieldName) {
                    var fieldConf = $directive.formParams.getField(fieldName);

                    if (fieldConf.required == true || angular.isFunction(fieldConf.required)) {
                        var requiredSatisfied = validationService.checkRequired(fieldConf, $directive.ngModel[fieldName]);
                        console.log('hihih');
                        $scope[formName][fieldName].$setValidity(fieldName, requiredSatisfied)
                    }
                    if (angular.isDefined(fieldConf.validation)) {
                        var validationResult = validationService.validation(fieldName, fieldConf, currentField);
                        $directive.formError[fieldName] = validationResult;
                        if(angular.isDefined($scope[formName])) {
                            console.log('im defined');
                            $scope[formName][fieldName].$error = {"required":true}
                        }

                    }

                });
            }, true);

        }
    };
}])


//aiwModule.directive('aiwFormGenerator', ['aiwFormGeneratorService', '$compile', function (aiwFGService, $compile) {
//        return {
//            restrict: 'A',
//            replace: true,
//            priority: 0,
//            scope: {
//                ngModel: '=',
//                formParams: '='
//            },
//            link: function ($scope, element) {
//                var template;
//                aiwFGService.loadFieldsTemplate($scope.formParams.getView(), function (response) {
//                    var transclude = angular.copy(element.html());
//                    template = aiwFGService.replaceTagInTemplate($scope.formParams, response.data, transclude);
//                }).then(function () {
//                    element.html(template);
//                    $compile(element.contents())($scope);
//                });
//                if (!angular.isDefined($scope.ngModel)) {
//                    $scope.ngModel = {};
//                }
//
//                $scope.initNgModel();
//
//                $scope.$watch('ngModel', function (newValue, oldValue) {
//                    angular.forEach(newValue, function (currentField, fieldName) {
//                        var fieldConf = $scope.formParams.getField(fieldName);
//                        if (fieldConf.required == true || angular.isFunction(fieldConf.required)) {
//                            $scope.checkRequired(fieldConf);
//                        } else if (angular.isDefined(fieldConf.validation)) {
//                            $scope.validation(fieldName, fieldConf.label, currentField, fieldConf.validation);
//                        }
//                    });
//                }, true);
//            },
//            controller: function ($scope) {
//                $scope.initNgModel = function () {
//                    angular.forEach($scope.formParams.fields, function (fieldConf) {
//                        if (!angular.isDefined($scope.ngModel[fieldConf.fieldName])) {
//                            if (!angular.isDefined(fieldConf.maxChoices) || fieldConf.maxChoices == 1) {
//                                $scope.ngModel[fieldConf.fieldName] = '';
//                            } else {
//                                $scope.ngModel[fieldConf.fieldName] = [];
//                            }
//
//
//                        }
//                    });
//                };
//                $scope.pushValue = function (fieldName, value, sourceName, index) {
//                    var fieldProperties = $scope.formParams.getProperties(fieldName);
//                    if (value === false || value == fieldProperties['ng-false-value']) {
//                        var trueValue = $scope.formParams.getSource(sourceName)[index].value;
//                        var index = $scope.ngModel[fieldName].indexOf(trueValue);
//                        $scope.ngModel[fieldName].splice(index, 1);
//                        return;
//                    }
//                    $scope.ngModel[fieldName].push(value);
//                }
//
//                $scope.returnType = function (type, value) {
//                    if (value.indexOf(type) != -1) {
//                        return true;
//                    }
//                    return false;
//
//                }
//
//                $scope.$ce = function (fnName, params) {
//                   return $scope.$parent[fnName](params);
//                };
//                $scope.formError = {};
//                $scope.checkRequired = function (field) {
//                    var compare = field.required;
//                    if (angular.isFunction(field.required)) {
//                        compare = field.required();
//                    }
//                    if (compare && ($scope.ngModel[field.fieldName] == null || $scope.ngModel[field.fieldName].length == 0)) {
//                        $scope.formError[field.fieldName] = {error: true, message: field.label + ' is required', class: $scope.formParams.getValidationClass()};
//                        return;
//                    }
//                    $scope.formError[field.fieldName] = {error: false, message: ''};
//
//                };
//                $scope.validation = function (fieldName, label, value, validation) {
//                    if (!angular.isObject(validation)) {
//                        $scope.formError[fieldName] = $scope.customValidation(validation, value);
//                        return;
//                    }
//                    switch (validation.type) {
//                        case 'numeric':
//                            $scope.formError[fieldName] = $scope.isANumber(value, validation.min, validation.max, label);
//                            break;
//                        case 'length':
//                            $scope.formError[fieldName] = $scope.isANumber(value.length, validation.min, validation.max, label, $scope.formParams.validationMessage.length);
//                            break;
//                        case 'string':
//                            $scope.formError[fieldName] = $scope.isAString(value, validation.min, validation.max, label);
//                            break;
//                    }
//                };
//
//                $scope.customValidation = function (validation, value) {
//                    var validationResult = validation(value);
//                    if (validationResult === undefined) {
//                        validationResult = {
//                            error: false,
//                            message: ''
//                        };
//                    }
//                    return validationResult;
//                };
//
//                $scope.isANumber = function (value, minDef, maxDef, label, message) {
//                    var min = minDef || null;
//                    var max = maxDef || null;
//                    var displayMessage = message || $scope.formParams.validationMessage.number;
//                    var num = parseInt(value) || null;
//
//                    if (num === null && value != 0) {
//                        return {error: true, message: label + ' ' + displayMessage.notANumber, class: $scope.formParams.getValidationClass()};
//                    }
//                    if (min != null && num < min) {
//                        return {error: true, message: label + ' ' + displayMessage.tooShort, class: $scope.formParams.getValidationClass()};
//                    }
//                    if (max != null && num > max) {
//                        return {error: true, message: label + ' ' + displayMessage.tooLong, class: $scope.formParams.getValidationClass()};
//                    }
//                    return {error: false, message: ''}
//
//                };
//                $scope.isAString = function (value, min, max, label) {
//                    var reg = new RegExp('\\d');
//                    var result = reg.test(value);
//                    if (result) {
//                        return {error: true, message: label + ' ' + $scope.formParams.validationMessage.string.notAString, class: $scope.formParams.getValidationClass()};
//                    } else {
//                        return $scope.isANumber(value.length, min, max, label, $scope.formParams.validationMessage.string);
//                    }
//                };
//                 $scope.ngModel.formIsValid=function(){
//                    var isValid = true;        
//                    angular.forEach($scope.formError,function(current){
//                        console.log(current);
//                        if(current.error == true){
//                            isValid =false;
//                            return;
//                        }
//                    });
//                    return isValid;
//                };
//            }
//        }
//        ;
//    }]);