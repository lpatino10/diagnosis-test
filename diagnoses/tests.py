from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Diagnosis


class ListSymptomsTest(APITestCase):
    """
    Test module for the GET /api/symptoms endpoint.
    """

    def setUp(self):
        # Clear pre-initialized values
        Diagnosis.objects.all().delete()

    def test_list_symptoms_empty(self):
        """
        Ensure nothing breaks if there are no symptoms.
        """
        url = reverse('list_symptoms')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_list_symptoms(self):
        """
        Test the basic case of returning symptoms.
        """
        Diagnosis.objects.create(
            name='common cold', symptom='sore throat', selection_count=0)
        Diagnosis.objects.create(
            name='common cold', symptom='runny nose', selection_count=0)

        url = reverse('list_symptoms')
        response = self.client.get(url)
        self.assertEqual(len(response.data), 2)

    def test_list_symptoms_ignore_duplicate(self):
        """
        Test that duplicate symptoms are filtered out.
        """
        Diagnosis.objects.create(
            name='common cold', symptom='sore throat', selection_count=0)
        Diagnosis.objects.create(
            name='common cold', symptom='runny nose', selection_count=0)
        Diagnosis.objects.create(
            name='strep throat', symptom='sore throat', selection_count=0)

        url = reverse('list_symptoms')
        response = self.client.get(url)
        self.assertEqual(len(response.data), 2)


class UpdateDiagnosisSelectionCountTest(APITestCase):
    """
    Test module for the POST /api/diagnosis endpoint.
    """

    def setUp(self):
        # Clear pre-initialized values
        Diagnosis.objects.all().delete()

        Diagnosis.objects.create(
            name='common cold', symptom='sore throat', selection_count=0)

    def test_update_count_success(self):
        """
        Test a successful update.
        """
        original_count = Diagnosis.objects.get(
            name='common cold', symptom='sore throat').selection_count
        url = reverse('update_diagnosis_selection_count')
        data = {'name': 'common cold', 'symptom': 'sore throat'}

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        new_count = Diagnosis.objects.get(
            name='common cold', symptom='sore throat').selection_count
        self.assertEqual(original_count + 1, new_count)

    def test_update_count_bad_input(self):
        """
        Test an expected failure if the diagnosis cannot be found.
        """
        url = reverse('update_diagnosis_selection_count')
        data = {'name': 'common', 'symptom': 'sore throat'}

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class GetDiagnosesOrderedBySelectionCountTest(APITestCase):
    """
    Test module for the GET /api/symptoms/<symptom>/diagnoses endpoint.
    """

    def setUp(self):
        # Clear pre-initialized values
        Diagnosis.objects.all().delete()

    def test_get_ordered_diagnoses_empty(self):
        """
        Ensure nothing breaks if there are no diagnoses.
        """
        url = reverse('get_diagnoses_ordered_by_selection_count', args=['sore-throat'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_ordered_diagnoses(self):
        """
        Test that the list is ordered correctly.
        """
        Diagnosis.objects.create(
            name='Common cold', symptom='Sore throat', selection_count=4)
        Diagnosis.objects.create(
            name='Seasonal allergies', symptom='Sore throat', selection_count=0)
        Diagnosis.objects.create(
            name='Bronchitis', symptom='Sore throat', selection_count=5)
        Diagnosis.objects.create(
            name='Middle ear infection', symptom='Sore throat', selection_count=2)
        Diagnosis.objects.create(
            name='Acid reflux disease', symptom='Sore throat', selection_count=2)

        url = reverse('get_diagnoses_ordered_by_selection_count', args=['sore-throat'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)

        previous_selection_count = response.data[0].get('selection_count')
        for i in range(1, 5):
            current_selection_count = response.data[i].get('selection_count')
            self.assertTrue(previous_selection_count >= current_selection_count)
            previous_selection_count = current_selection_count
