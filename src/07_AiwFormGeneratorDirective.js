aiwModule.directive('aiwFormGenerator', ['AiwFormGeneratorService', 'AiwValidationService', '$compile', function (aiwFGService, aiwValidation, $compile) {

    return {
        restrict: 'A',
        replace: true,
        priority: 5,
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
            this.applyClasses = function (value, fieldName) {
                var classAttribute = 'aiw-invalid';
                if (value == true) {
                    classAttribute = 'aiw-valid';
                }
                var curElement = angular.element(element[0].querySelectorAll('.aiw-' + $directive.formParams.formName + '-' + fieldName));
                curElement.removeClass('aiw-valid');
                curElement.removeClass('aiw-invalid');
                curElement.addClass(classAttribute);
            }

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
                    var valid = [true, true];
                    var fieldConf = $directive.formParams.getField(fieldName);
                    if (angular.isDefined(fieldConf.validation)) {
                        var validationResult = validationService.validation(fieldName, fieldConf, currentField);
                        $directive.formError[fieldName] = validationResult;
                        valid[0] = !validationResult.error;
                    }
                    if (fieldConf.required == true || angular.isFunction(fieldConf.required)) {
                        valid[1] = !validationService.checkRequired(fieldConf, $directive.ngModel[fieldName]);
                    }
                    setTimeout(function () {
                        this.applyClasses(valid[0] && valid[1], fieldName);
                    }, 0);

                });
            }, true);

        }

    };
}])