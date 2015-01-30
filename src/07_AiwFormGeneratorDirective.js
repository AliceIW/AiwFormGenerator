aiwModule.directive('aiwFormGenerator', ['AiwFormGeneratorService', 'AiwValidationService', '$compile', function (aiwFGService, aiwValidation, $compile) {

        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            priority: 5,
            scope: {
                ngModel: '=',
                formParams: '='
            },
            link: function ($scope, element, attr, nullController, transcludeFn) {
                var validationService = new aiwValidation($scope.formParams.validationMessage, $scope.formParams.getValidationClass());

                $scope.formError = {};
                this.initNgModel = function () {
                    $scope.ngModel = $scope.ngModel || {};

                    angular.forEach($scope.formParams.fields, function (fieldConf) {
                        //$scope[formName][fieldConf.fieldName] = {};
                        if (!angular.isDefined($scope.ngModel[fieldConf.fieldName]) && fieldConf.type!='button') {
                            if (!angular.isDefined(fieldConf.maxChoices) || fieldConf.maxChoices == 1) {
                                $scope.ngModel[fieldConf.fieldName] = '';
                            } else {
                                $scope.ngModel[fieldConf.fieldName] = [];
                            }
                        }
                    });
                };
                $scope.applyClasses = function (value, fieldName) {
                    var classAttribute = 'aiw-invalid';
                    if (value == true) {
                        classAttribute = 'aiw-valid';
                    }
                    console.log('.aiw-' + $scope.formParams.formName + '-' + fieldName);
                    var curElement = angular.element(element[0].querySelectorAll('.aiw-' + $scope.formParams.formName + '-' + fieldName));

                    curElement.removeClass('aiw-valid');
                    curElement.removeClass('aiw-invalid');
                    curElement.addClass(classAttribute);
                }

                this.initNgModel();

                aiwFGService.loadFieldsTemplate($scope.formParams.getView(), function (response) {
                    var transclude = element.html();
                    return aiwFGService.replaceTagInTemplate($scope.formParams, response.data, transclude);
                }).then(function (template) {
                    element.html(template);
                    transcludeFn($scope.$parent, function (clone) {
                        element.after(clone);
                    });
                    $compile(element.contents())($scope);
                });

                $scope.returnType = function (type, value) {
                    return aiwFGService.typeExist(value, type);
                }

                $scope.$ce = function (fnName, params) {
                    return $scope.$parent[fnName](params);
                }

                $scope.ngModel.formIsValid = function () {
                    if (!angular.isDefined($scope[formName])) {
                        return false;
                    }
                    return $scope[formName].$valid;
                }

                $scope.$watch('ngModel', function (newValue) {
                    angular.forEach(newValue, function (currentField, fieldName) {
                        var valid = [true, true];
                        var fieldConf = $scope.formParams.getField(fieldName);
                        if (angular.isDefined(fieldConf.validation)) {
                            var validationResult = validationService.validation(fieldName, fieldConf, currentField);
                            $scope.formError[fieldName] = validationResult;
                            valid[0] = !validationResult.error;
                        }
                        if (fieldConf.required == true || angular.isFunction(fieldConf.required)) {
                            valid[1] = !validationService.checkRequired(fieldConf, $scope.ngModel[fieldName]);
                        }
                        setTimeout(function () {
                            $scope.applyClasses(valid[0] && valid[1], fieldName);
                        }, 0);

                    });
                }, true);

            }

        };
    }])