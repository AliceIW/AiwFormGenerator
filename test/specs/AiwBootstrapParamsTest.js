describe('Module', function () {
    var $mockScope;
    var app;
    beforeEach(function () {
        app = module('AiwFormGeneratorModule');
    });
    describe('AiwParams', function () {
    
        beforeEach(inject(function (AiwFormParams,_$rootScope_) {
            $mockScope = _$rootScope_;
            $mockScope.demoFormParams = new AiwFormParams('TestForm');
        }));
        describe('addGroup/GetGroup', function () {
            it('should add a new group with default HTML', function () {
                $mockScope.demoFormParams.addGroup('buttons');
                expect($mockScope.demoFormParams.getGroups()).toEqual({'[|buttons|]': '<div ng-switch on="field.type" ng-repeat="field in formParams.getFields(\'buttons\')">[|fields|]</div>'});
            });
            it('should add a new group with custom HTML', function () {
                $mockScope.demoFormParams.addGroup('buttons', '<div>test:[|fields|]</div>');
                expect($mockScope.demoFormParams.getGroups()).toEqual({'[|buttons|]': '<div>test:[|fields|]</div>'});
            });
        })
        describe('addField/GetFields', function () {
            it('should add correctly the new form field', function () {
                $mockScope.demoFormParams.addField({type: 'text', fieldName: 'input', label: 'some label'});
                expect($mockScope.demoFormParams.getFields()).toEqual([{type: 'text', fieldName: 'input', label: 'some label', group: 'fields'}]);
            });
        });
        describe('getField', function () {
            it('should retrieve the configuration of a specified field', function () {
                $mockScope.demoFormParams.addField({type: 'text', fieldName: 'input', label: 'some label'});
                expect($mockScope.demoFormParams.getField('input')).toEqual({type: 'text', fieldName: 'input', label: 'some label', group: 'fields'});
            });
        })
        describe('getProperties', function () {
            it('should return the property of the specified field', function () {
                $mockScope.demoFormParams.addField({type: 'text', fieldName: 'ses', label: 'ss', required: true}, {"style": "width:30px;float:left;", "ng-click": "execute('test',[])"});
                expect($mockScope.demoFormParams.getProperties('ses')).toEqual({"style": "width:30px;float:left;", "ng-click": "execute('test',[])"});
            });
        });
        describe('setValidationMessage', function () {
            it('should customize the validation message', function () {
                expect($mockScope.demoFormParams.validationMessage.string.notAString).toEqual('is not a string!');
                $mockScope.demoFormParams.setValidationMessage('string', 'notAString', 'i changed it');
                expect($mockScope.demoFormParams.validationMessage.string.notAString).toEqual('i changed it');
            });
        });
    });


});