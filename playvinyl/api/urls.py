from django.conf.urls import patterns, include, url
from django.contrib import admin
from playvinyl.views import FixedPasswordReset, FixedPasswordResetConfirm


urlpatterns = patterns(
    'api.views',
    url(r'^rest-auth/password/reset/$', FixedPasswordReset.as_view()),
    url(r'^rest-auth/password/reset/confirm/$',
        FixedPasswordResetConfirm.as_view()),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
)
