from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework.routers import SimpleRouter
from store.views import VinylViewSet, VinylAuthorViewSet, VinylLabelViewSet

router = SimpleRouter()
router.register(r'vinyl', VinylViewSet)
router.register(r'authors', VinylAuthorViewSet)
router.register(r'labels', VinylLabelViewSet)

urlpatterns = patterns(
    'store.views',
)

urlpatterns += router.urls
