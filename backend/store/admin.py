import autocomplete_light
from django import forms
from django.db import models
from django.contrib.admin.widgets import AdminFileWidget
from django.utils.safestring import mark_safe
from django.contrib import admin
from store.models import Vinyl, VinylAuthor, VinylLabel, VinylStyle, VinylCatalog, VinylTrack


class AdminImageWidget(AdminFileWidget):
    def render(self, name, value, attrs=None):
        output = []
        if value:
            output.append('<img src="/media/{}" style="max-width: 200px; max-height: 200px">' . format(value))
        output.append(super(AdminFileWidget, self).render(name, value, attrs))
        return mark_safe(u''.join(output))


class VinylLabelAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', )
    search_fields = ('name', )
admin.site.register(VinylLabel, VinylLabelAdmin)


class VinylAuthorAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', )
    search_fields = ('name', )
admin.site.register(VinylAuthor, VinylAuthorAdmin)


class VinylStyleAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', )
    search_fields = ('name', )
admin.site.register(VinylStyle, VinylStyleAdmin)


class VinylCatalogAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', )
    search_fields = ('name', )
admin.site.register(VinylCatalog, VinylCatalogAdmin)


class VinylTrackInline(admin.TabularInline):
    model = VinylTrack
    extra = 1


class VinylTrackAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', )
    search_fields = ('name', )
admin.site.register(VinylTrack, VinylTrackAdmin)


class VinylAuthorForm(autocomplete_light.ModelForm):
    class Meta:
        model = Vinyl
        exclude = []
        widgets = {
            'authors': autocomplete_light.widgets.MultipleChoiceWidget('VinylAuthorAutoComplete',
                widget_attrs={'data-widget-bootstrap': 'vinyl-author-widget'},
            ),
            'label': autocomplete_light.widgets.ChoiceWidget('VinylLabelAutoComplete',
                widget_attrs={'data-widget-bootstrap': 'vinyl-label-widget'}
            ),
            'styles': autocomplete_light.widgets.MultipleChoiceWidget('VinylStyleAutoComplete',
                widget_attrs={'data-widget-bootstrap': 'vinyl-styles-widget'}
            ),
            # 'release_date': DateWidget(usel10n=True, bootstrap_version=3),
            'image' : AdminImageWidget,
        }


class VinylAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', 'slug', 'price', 'active', )
    search_fields = ('name', 'authors__name', )
    form = VinylAuthorForm
    inlines = [
        VinylTrackInline,
    ]
admin.site.register(Vinyl, VinylAdmin)
