#!/usr/bin/env python
# -*- coding: utf-8 -*-

import autocomplete_light
from django import http
from store.models import VinylAuthor, VinylLabel, VinylStyle


class VinylFieldAutoCompleteBase(autocomplete_light.AutocompleteModelBase):
    def autocomplete_html(self):
        html = super(VinylFieldAutoCompleteBase, self).autocomplete_html()
        html += u'<span data-value="create">Добавить</span>'
        return html

    def post(self, request, *args, **kwargs):
        try:
            author_id = self.model.objects.create(name=request.POST['name']).pk
        except:
            return http.HttpResponseBadRequest()
        return http.HttpResponse(author_id)


class VinylAuthorAutoComplete(VinylFieldAutoCompleteBase):
    model = VinylAuthor
autocomplete_light.register(VinylAuthorAutoComplete)


class VinylLabelAutoComplete(VinylFieldAutoCompleteBase):
    model = VinylLabel
autocomplete_light.register(VinylLabelAutoComplete)


class VinylStyleAutoComplete(VinylFieldAutoCompleteBase):
    model = VinylStyle
autocomplete_light.register(VinylStyleAutoComplete)
