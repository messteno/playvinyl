from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView


urlpatterns = patterns(
    '',
    url(r'^api/', include('api.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

urlpatterns += (
    url(r'^.*$', TemplateView.as_view(template_name="index.html"), name='index'),
)
