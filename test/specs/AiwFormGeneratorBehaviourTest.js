describe('Module', function () {
    var app;
    beforeEach(function () {
        app = module('AiwFormGeneratorModule');
    });
    describe("AiwFormGeneratorDirective", function () {
        var tpl;
        var $mockScope;
        var $directiveScope;
        var $httpBackend;
        var $compile;

        var mockService;
        var elements;
        var domUtility;

        beforeEach(inject(function (_$compile_, _$rootScope_, $http, _$httpBackend_, _$templateCache_, _$sniffer_) {
            loadFixtures("../../lib/view/aiwFormGenerator.html");
            _$templateCache_.put(currentScriptPath.replace('aiwFormGenerator.js', 'view/aiwFormGenerator.html'), $('#jasmine-fixtures').html());
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $mockScope = _$rootScope_;
            domUtility = jasmine.Aiwutility(_$sniffer_, $mockScope);

        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.resetExpectations();
        });

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
        describe('Init', function () {

            it('should load the original template', inject(function (AiwFormParams) {
                $mockScope.demoFormParams = new AiwFormParams('TestForm');
                compileDirective();
                expect(tpl.html()).toEqual('<form class="ng-scope ng-pristine ng-valid" name="TestForm"><!-- ngRepeat: field in formParams.getFields() --><br><br>[|buttons|]</form>');
            }));
            it('should load the custom template', inject(function (AiwFormParams) {
                $mockScope.demoFormParams = new AiwFormParams('TestForm');
                $mockScope.demoFormParams.setTemplate('<div [|loop|]>[|fields|]</div><div>[|buttons|]</div>[|transclude|]');
                compileDirective();
                expect(tpl.html().normalizeHtml()).toEqual('<!-- ngRepeat: field in formParams.getFields() --><div class="ng-scope">[|buttons|]</div>');
            }));
        });
        describe('HTML', function () {
            beforeEach(inject(function (AiwFormParams) {
                $mockScope.demoFormParams = new AiwFormParams('TestForm');
            }));
            it('should render the <input/>  like tag', function () {
                $mockScope.demoFormParams.addField({type: 'text', fieldName: 'test'});
                compileDirective();
                loadFixtures("../fixture/inputTagFixture.html");
                expect(tpl.html().normalizeHtml()).toEqual($('#jasmine-fixtures').html().normalizeHtml());
            });
            it('should render the <select/>   tag', function () {

                $mockScope.demoFormParams.addSource('test', [{label: 'hiii', value: '1'}]);
                $mockScope.demoFormParams.addSelect({type: 'select', fieldName: 'test', label: 'Test', source: 'test'}, {});
                compileDirective();
                loadFixtures("../fixture/selectTagFixture.html");
                expect(tpl.html().normalizeHtml()).toEqual($('#jasmine-fixtures').html().normalizeHtml());
            });
            it('should render the <textarea/>   tag', function () {
                $mockScope.demoFormParams.addField({type: 'textarea', fieldName: 'test', label: 'Test'});
                compileDirective();
                loadFixtures("../fixture/textareaTagFixture.html");
                expect(tpl.html().normalizeHtml()).toEqual($('#jasmine-fixtures').html().normalizeHtml());
            });
            it('should render the <radio/>   tag', function () {
                $mockScope.demoFormParams.addSource('test', [{label: 'hiii', value: '1'}, {label: 'Goodmornig Sir.', value: '2'}]);
                $mockScope.demoFormParams.addField({type: 'radio', fieldName: 'test', label: 'Test', source: 'test'});
                compileDirective();
                loadFixtures("../fixture/radioTagFixture.html");
                expect(tpl.html().normalizeHtml()).toEqual($('#jasmine-fixtures').html().normalizeHtml());
            });
            it('should render the <radio/>   tag', function () {
                $mockScope.demoFormParams.addSource('test', [{label: 'hiii', value: '1'}, {label: 'Goodmornig Sir.', value: '2'}]);
                $mockScope.demoFormParams.addField({type: 'checkbox', fieldName: 'test', label: 'Test', source: 'test'});
                compileDirective();
                loadFixtures("../fixture/checkboxTagFixture.html");
                expect(tpl.html().normalizeHtml()).toEqual($('#jasmine-fixtures').html().normalizeHtml());
            });
        });
        describe('behaviour', function () {
            beforeEach(inject(function (AiwFormParams) {
                $mockScope.demoFormParams = new AiwFormParams('TestForm');
            }));
            describe('ngModel', function () {
                it('it should update the ng-model on type', function () {
                    $mockScope.demoFormParams.addField({type: 'text', fieldName: 'test'});
                    compileDirective();
                    domUtility.changeInputValueTo(elements, '65');
                    expect($mockScope.result).toEqual({test: '65'});
                });
            });
            
        });

    });
});