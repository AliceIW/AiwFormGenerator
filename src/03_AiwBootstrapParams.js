/*
 * @author AliceIw
 */
aiwModule.factory('AiwBootstrapParams',['AiwFormParams', function (AiwFormParams) {
    var AiwBootstrapParams = function (formName) {
        var self = this;
        self.init = function () {
            AiwParams.setValidationClass('label-important')
            AiwParams.setView('view/aiwFormGeneratorBootstrap');
            return AiwParams;
        };

        var AiwParams = new AiwFormParams(formName);
        
        AiwParams.getAutocomplete = function (source, term) {
            var elements = AiwParams.getSource(source);
            var tmp = [];
            angular.forEach(elements, function (current) {
                var re = new RegExp('(' + term + ')', 'mi');
                if (re.exec(current.label) != null) {
                    tmp.push(current);
                }
            });
            return tmp;
        }
        
        AiwParams.addDatePicker = function (fieldSettings, fieldsProperty, groupName) {
            fieldSettings["type"] = "text";
            fieldsProperty["ng-click"] = "data.isOpen = true";
            fieldsProperty["is-open"] = "data.isOpen";
            fieldsProperty["datepicker-popup"] = "dd-MMMM-yyyy";
            AiwParams.addField(fieldSettings, fieldsProperty, groupName);
            return AiwParams;
        };
        AiwParams.addTimePicker = function (fieldSettings, fieldsProperty, groupName) {
            fieldSettings["type"] = "timePicker";
            fieldsProperty["hour-step"] = "1";
            fieldsProperty["minute-step"] = "5";
            fieldsProperty["show-meridian"] = true;
            AiwParams.addField(fieldSettings, fieldsProperty, groupName);
            return AiwParams;
        };
        
        AiwParams.addRating= function(fieldSettings, fieldsProperty, groupName){
             fieldSettings["type"] = "rating";
             fieldsProperty["max"] = 10;
             fieldsProperty["readonly"] =false;
             fieldsProperty["on-hover"] ="hoveringOver(value)";
             fieldsProperty["on-leave"]="overStar = null";
             AiwParams.addField(fieldSettings, fieldsProperty, groupName);
            return AiwParams;
        };
        
        AiwParams.addAutocomplete = function (fieldSettings, fieldsProperty, groupName) {
            fieldSettings["type"] = "text";
            fieldsProperty["typeahead-min-length"] = "2";
            fieldsProperty["typeahead-wait-ms"] = "300";
            var label = fieldSettings['sourceLabel'] || 'obj.label';
            if (fieldSettings.static) {
                fieldsProperty["typeahead"] = label+ " for obj in formParams.getAutocomplete('" + fieldSettings.source + "',ngModel." + fieldSettings.fieldName + ")";
            } else {
                fieldsProperty["typeahead"] = label+ " for obj in execute('"+fieldSettings.source+"',"+fieldSettings.sourceParams+")";
            }

            AiwParams.addField(fieldSettings, fieldsProperty, groupName);
            return AiwParams;
        };


    };
    return AiwBootstrapParams;
}]);