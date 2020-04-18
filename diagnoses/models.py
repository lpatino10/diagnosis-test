from django.db import models

class Diagnosis(models.Model):
    name = models.CharField(max_length=40)
    symptom = models.CharField(max_length=40)
    selection_count = models.IntegerField()

    def __str__(self):
        return self.name
