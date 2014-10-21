String.prototype.normalizeHtml = function () {
    return  this.replace(/(\n|\r|\t|\s\s+)/gm, "").trim();
};

jasmine.Aiwutility = function ($sniffer, $scope) {
    var service = {
        findInput: function (element) {
            return element.find('input');
        },
        triggerKeyDown: function (element, keyCode) {
            var e = $.Event("keydown");
            e.which = keyCode;
            element.trigger(e);
        },
        changeInputValueTo: function (element, value) {
            var inputEl = service.findInput(element);
            inputEl.val(value);
            inputEl.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
            $scope.$digest();
        }
    };
    return service;
};