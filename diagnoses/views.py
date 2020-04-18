from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Diagnosis
from .serializers import DiagnosisSerializer

def api_name_to_display_name(api_name):
    return api_name.capitalize().replace('-', ' ')

@api_view(['GET'])
def list_symptoms(request):
    """
    Lists all possible unique symptoms.

    returns: a list of all possible symptoms to choose from
    """
    data = Diagnosis.objects.all()
    symptoms = {diagnosis.symptom for diagnosis in data}
    return Response(symptoms)


@api_view(['POST'])
def update_diagnosis_selection_count(request):
    """
    Updates the selection count of the matching diagnosis entry by 1.

    :param name: the name of the diagnosis to be updated
    :param symptom: the name of the symptom associated with the diagnosis being updated
    :returns: 200 if the diagnosis count was updated or 400 if there was an error
    """
    diagnosis = request.data.get('name')
    symptom = request.data.get('symptom')
    existing_diagnosis = Diagnosis.objects.filter(
        name=diagnosis, symptom=symptom).first()

    if existing_diagnosis is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    current_count = existing_diagnosis.selection_count

    updated_data = {'name': diagnosis, 'symptom': symptom, 'selection_count': current_count + 1}
    serializer = DiagnosisSerializer(existing_diagnosis, data=updated_data)

    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_diagnoses_ordered_by_selection_count(request, symptom):
    """
    Lists all diagnoses associated with the supplied symptom in descending order of selection count.

    :param symptom: name of the symptom whose diagnoses will be returned
    :returns: ordered list of diagnoses, descending by selection count
    """
    symptom_display_name = api_name_to_display_name(symptom)
    data = Diagnosis.objects.filter(
        symptom=symptom_display_name).order_by('-selection_count')
    serializer = DiagnosisSerializer(
        data, context={'request': request}, many=True)
    return Response(serializer.data)
