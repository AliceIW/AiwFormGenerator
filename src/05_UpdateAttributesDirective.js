
/* 
 * @author AliceIw
 */
aiwModule.directive('updateAttr', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            priority: 10,
            link: function (scope, elem, attrs) {
                if (angular.isDefined(attrs['property']) && attrs['property'].length != 0) {
                    var json = JSON.parse(attrs['property']);
                    angular.forEach(json, function (value, key) {
                        var current = elem.attr(key);
                        if (angular.isDefined(current)) {
                            value = current + ' ' + value;
                        }

                        elem.attr(key, value);
                    });
                    elem.removeAttr('property');
                    var $e = $compile(elem[0].outerHTML)(scope);
                    elem.replaceWith($e);
                }
            }
        };
    }]);