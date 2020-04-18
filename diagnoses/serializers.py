from rest_framework import serializers
from .models import Diagnosis

class DiagnosisSerializer(serializers.ModelSerializer):

    class Meta:
        model = Diagnosis
        fields = ('name', 'symptom', 'selection_count')
