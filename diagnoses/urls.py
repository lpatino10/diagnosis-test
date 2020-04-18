from django.urls import path
from . import views

urlpatterns = [
    path('symptoms', views.list_symptoms, name='list_symptoms'),
    path('diagnosis', views.update_diagnosis_selection_count,
         name='update_diagnosis_selection_count'),
    path('symptoms/<symptom>/diagnoses', views.get_diagnoses_ordered_by_selection_count,
         name='get_diagnoses_ordered_by_selection_count'),
]
