CreateWidget = {
    getValue: function(choice) {
        var value = choice.data('value');

        if (value == 'create') {
            choice.html(this.input.val())

            $.ajax(this.autocomplete.url, {
                async: false,
                type: 'post',
                data: {
                    'name': this.input.val(),
                },
                success: function(text, jqXHR, textStatus) {
                    value = text;
                },
                error: function() {
                    value = 0;
                    choice.remove();
                }
            });
            choice.data('value', value);
        }

        return value;
    }
}

$(document).bind('yourlabsWidgetReady', function() {
    $('body').on('initialize', '.autocomplete-light-widget[data-widget-bootstrap=vinyl-author-widget], \
                 .autocomplete-light-widget[data-widget-bootstrap=vinyl-label-widget],\
                 .autocomplete-light-widget[data-widget-bootstrap=vinyl-styles-widget]', function() {
        $(this).yourlabsWidget(CreateWidget);
    });
});
