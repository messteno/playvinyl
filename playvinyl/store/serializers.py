from rest_framework import serializers
from store.models import Customer


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer