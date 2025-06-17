from django.db import models
from .exam import Exam

class PreliminaryReport(models.Model):
    """
    Editable clinical summary generated after measurement input.

    This is seeded automatically by the calculator and manually edited by the technologist.
    It represents the preliminary interpretation prior to physician sign-off.
    """
    exam = models.OneToOneField(Exam, on_delete=models.CASCADE, related_name="preliminary")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preliminary for {self.exam}"
