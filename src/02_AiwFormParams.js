/* 
 * @author AliceIw
 */
aiwModule.factory('AiwFormParams', ['aiwFormGeneratorService', function (aiwFGService) {
        var AiwFormParams = function (formName) {
            var self = this;
            self.formName = formName;
            self.view = 'view/aiwFormGenerator';
            self.privateTemplate = '<form name="' + formName + 'Form"><div [|loop|]><label>[|label|]</label>[|fields|]</div><br/><br/>[|buttons|]</form>';
            self.fields = [];
            self.properties = {};
            self.groups = {};
            self.sources = {};
            self.validationHtml = '<span class="label {{formError[field.fieldName].class}}" ng-show="formError[field.fieldName].error || formError[field.fieldName].show " >{{formError[field.fieldName].message}} </span>';
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
                return this;
                self.validationMessage[validationType][parameter] = newValue;
            };
            this.setValidationHtml = function (newValue) {
                self.validationHtml = newValue;
                return this;
            };
        };
        return AiwFormParams;
    }]);