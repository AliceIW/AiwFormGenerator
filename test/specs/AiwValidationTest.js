describe('Module', function () {
    var app;
    beforeEach(function () {
        app = module('AiwFormGeneratorModule');
    });
    describe("AiwFormGeneratorDirective", function () {
        var tpl;
        var $mockScope;
        var $directiveScope;
        var $compile;
        var elements;
        var domUtility;

        beforeEach(inject(function (_$compile_, _$rootScope_, _$templateCache_, _$sniffer_) {
            loadFixtures("../../lib/view/aiwFormGenerator.html");
            _$templateCache_.put(currentScriptPath.replace('aiwFormGenerator.js', 'view/aiwFormGenerator.html'), $('#jasmine-fixtures').html());
            $compile = _$compile_;

            $mockScope = _$rootScope_;
            domUtility = jasmine.Aiwutility(_$sniffer_, $mockScope);

        }));
        function compileDirective(ctpl) {
            if (angular.isDefined(ctpl)) {
                tpl = angular.element(ctpl);
            } else {
                tpl = angular.element('<div aiw-form-generator form-params="demoFormParams" ng-model="result"></div>');
            }

            elements = $compile(tpl)($mockScope);
            $mockScope.$digest();
            $directiveScope = tpl.isolateScope();
        }

        describe('Validation', function () {
            beforeEach(inject(function (AiwFormParams) {
                $mockScope.demoFormParams = new AiwFormParams('TestForm');
            }));
            it('should return error if required', function () {
                $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', required: true});
                compileDirective();
                expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is required', class: 'label-important'});
            });
            describe('String', function () {
                it('string too short', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: {type: 'string', min: 10}});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, 'i wrote');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is too short!', class: 'label-important'});
                });
                it('string too long', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: {type: 'string', max: 3}});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, 'i wrote');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is too long!', class: 'label-important'});
                });
                it('no a string', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: {type: 'string', max: 3}});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, 'i 2wrote');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is not a string!', class: 'label-important'});
                });
            });
            describe('Numeric', function () {
                it('too low', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: {type: 'numeric', min: 10}});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, '8');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is too low!', class: 'label-important'});
                });
                it('string too long', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: {type: 'numeric', max: 3}});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, '8');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is too high!', class: 'label-important'});
                });
                it('not a number!', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: {type: 'numeric', min: 10}});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, 'i wrote');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is not a number!', class: 'label-important'});
                });
            });
            describe('Length', function () {
                it('too low', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: {type: 'length', min: 10}});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, 'asd 5d ');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is too short!', class: 'label-important'});
                });
                it('string too long', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: {type: 'length', max: 3}});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, 'asd 5d asd d');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'sss is too long!', class: 'label-important'});
                });
            });
            describe('CustomValidaiton', function () {
                it('should call the customValidation if exist', function () {
                    var testfunction = function (curValue) {
                        if (curValue != 'pass') {
                            return  {error: true, message: 'i dont like you', class: 'label-important'}
                        }
                    }
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'sssss', label: 'sss', validation: function (curValue) {
                            return testfunction(curValue)
                        }});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, 'i wrote');
                    expect($directiveScope.formError.sssss).toEqual({error: true, message: 'i dont like you', class: 'label-important'});
                });

            });
        });
    });
});