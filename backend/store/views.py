from rest_framework import viewsets, generics, filters
from rest_framework.response import Response
from api.permissions import IsAdminOrReadOnly
from api.pagination import StandardResultsSetPagination
from store.models import Vinyl, VinylAuthor, VinylLabel, VinylCatalog
from store.serializers import VinylSerializer, VinylAuthorSerializer, VinylLabelSerializer, VinylCatalogSerializer


class VinylViewSet(viewsets.ModelViewSet):
    queryset = Vinyl.objects.all()
    serializer_class = VinylSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('authors__slug', 'label__slug', 'catalog__slug', )
    pagination_class = StandardResultsSetPagination


class VinylAuthorViewSet(viewsets.ModelViewSet):
    queryset = VinylAuthor.objects.all()
    serializer_class = VinylAuthorSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class VinylLabelViewSet(viewsets.ModelViewSet):
    queryset = VinylLabel.objects.all()
    serializer_class = VinylLabelSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class VinylCatalogViewSet(viewsets.ModelViewSet):
    queryset = VinylCatalog.objects.all()
    serializer_class = VinylCatalogSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
