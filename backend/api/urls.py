from django.conf.urls import patterns, include, url
from django.views.defaults import page_not_found
from django.contrib import admin
from playvinyl.views import FixedPasswordReset, FixedPasswordResetConfirm
from api.views import ProfileView


urlpatterns = patterns(
    'api.views',

    url(r'^autocomplete/', include('autocomplete_light.urls')),

    url(r'^rest-auth/password/reset/$', FixedPasswordReset.as_view()),
    url(r'^rest-auth/password/reset/confirm/$',
        FixedPasswordResetConfirm.as_view()),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/profile/', ProfileView.as_view()),

    url(r'^store/', include('store.urls')),

    url(r'^.*$', page_not_found),
)
