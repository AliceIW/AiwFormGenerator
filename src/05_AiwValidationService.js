aiwModule.factory('AiwValidationService', function () {
    var aiwValidationService = function (validationMessage, validationClass) {
        this.validationMessage = validationMessage;
        this.validationClass = validationClass;


        this.checkRequired = function (field, ngModel) {
            var compare = field.required;
            if (angular.isFunction(field.required)) {
                compare = field.required();
            }
            if (compare && (ngModel == null || ngModel.length == 0)) {
                return true;
            }
            return false;
        };
        this.validation = function (fieldName, fieldConf, value) {
            var validation = fieldConf.validation || {};

            if (angular.isFunction(validation)) {
                console.log('custom validation');
                //$scope.formError[fieldName] = aiwValidationService.customValidation(fieldConf.validation, value);
                return;
            }
            switch (validation.type) {
                case 'numeric':
                    return this.isANumber(value, validation.min, validation.max, fieldConf.label);
                    break;
                case 'length':
                    return this.isANumber(value.length, validation.min, validation.max, fieldConf.label, this.validationMessage.length);
                    break;
                case 'string':
                    return this.isAString(value, validation.min, validation.max, fieldConf.label);
                    break;
            }
        };
        this.customValidation = function (validation, value) {
            var validationResult = validation(value);
            if (validationResult === undefined) {
                validationResult = {
                    error: false,
                    message: ''
                };
            }
            return validationResult;
        };
        this.isANumber = function (value, minDef, maxDef, label, message) {
            var min = minDef || null;
            var max = maxDef || null;
            var displayMessage = message || this.validationMessage.number;
            var num = parseInt(value) || null;

            if (num === null && value != 0) {
                return {
                    error: true,
                    message: label + ' ' + displayMessage.notANumber,
                    class: this.validationClass
                };
            }
            if (min != null && num < min) {
                return {
                    error: true,
                    message: label + ' ' + displayMessage.tooShort,
                    class: this.validationClass
                };
            }
            if (max != null && num > max) {
                return {
                    error: true,
                    message: label + ' ' + displayMessage.tooLong,
                    class: this.validationClass
                };
            }
            return {error: false, message: ''}

        };
        this.isAString = function (value, min, max, label) {
            var reg = new RegExp('\\d');
            var result = reg.test(value);
            if (result) {
                return {
                    error: true,
                    message: label + ' ' + this.validationMessage.string.notAString,
                    class: this.validationClass
                };
            } else {
                return this.isANumber(value.length, min, max, label, this.validationMessage.string);
            }
        };

    };

    return aiwValidationService;
})
