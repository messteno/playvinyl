'use strict';

/**
 * @ngInject
 */
var app = angular.module('playvinyl');
app.service('Validate', function() {
    return {
        'message': {
            'minlength': 'Слишком короткое значение.',
            'maxlength': 'Слишком длинное значение.',
            'email': 'Некорректный email адрес.',
            'required': 'Обязательное поле.'
        },
        'moreMessages': {
        },
        'checkMoreMessages': function(name, error){
            return (this.moreMessages[name] || [])[error] || null;
        },
        'validationMessages': function(field, form, errorBin){
            var messages = [];
            for (var e in form[field].$error) {
                if (form[field].$error[e]) {
                    var specialMessage = this.checkMoreMessages(field, e);
                    if (specialMessage) {
                        messages.push(specialMessage);
                    } else if(this.message[e]) {
                        messages.push(this.message[e]);
                    } else {
                        messages.push('Error: ' + e);
                    }
                }
            }
            var dedupedMessages = [];
            angular.forEach(messages, function(el) {
                if (dedupedMessages.indexOf(el) === -1) {
                    dedupedMessages.push(el);
                }
            });
            if (errorBin) {
                errorBin[field] = dedupedMessages;
            }
        },
        'formValidation': function(form, errorBin){
            for (var field in form) {
                if (field.substr(0, 1) !== '$') {
                    this.validationMessages(field, form, errorBin);
                }
            }
        }
    };
});
