from rest_framework import viewsets, generics, filters
from rest_framework.response import Response
from api.permissions import IsAdminOrReadOnly
from store.models import Vinyl, VinylAuthor, VinylLabel
from store.serializers import VinylSerializer, VinylAuthorSerializer, VinylLabelSerializer


class VinylViewSet(viewsets.ModelViewSet):
    queryset = Vinyl.objects.all()
    serializer_class = VinylSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('authors__slug', 'label__slug', )


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
