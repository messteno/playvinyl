from rest_framework import serializers
from store.models import Vinyl, VinylLabel, VinylStyle, VinylAuthor, VinylCatalog, VinylTrack


class VinylTrackSerializer(serializers.ModelSerializer):

    class Meta:
        model = VinylTrack


class VinylCatalogSerializer(serializers.ModelSerializer):

    class Meta:
        model = VinylCatalog


class VinylAuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = VinylAuthor


class VinylStyleSerializer(serializers.ModelSerializer):

    class Meta:
        model = VinylStyle


class VinylLabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = VinylLabel


class VinylSerializer(serializers.ModelSerializer):
    label = VinylLabelSerializer(many=False)
    authors = VinylAuthorSerializer(many=True)
    catalog = VinylCatalogSerializer(many=False)
    styles = VinylStyleSerializer(many=True)
    tracks = VinylTrackSerializer(many=True)

    class Meta:
        model = Vinyl
