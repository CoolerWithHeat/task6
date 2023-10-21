from rest_framework import serializers
from .models import LinePatterns

class ThreadsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinePatterns
        fields = ['id', 'related_thread']