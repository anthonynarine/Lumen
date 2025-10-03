# reports/serializers/exam_base_serializer.py

from rest_framework import serializers
from reports.models import Exam


class ExamBaseSerializer(serializers.ModelSerializer):
    """
    Base serializer for all vascular exams (arterial + venous).
    Provides universal exam metadata:
      - Patient demographics
      - Exam classification (type, scope, extent, codes)
      - Workflow metadata (created_by, reading_physician, status, source)
      - Timestamps

    Segment/measurement data is NOT included here;
    that is layered in by modality-specific serializers
    (e.g., CarotidExamSerializer, RenalExamSerializer).
    """

    class Meta:
        model = Exam
        fields = [
            # Identifiers
            "id",
            "patient_name",
            "mrn",
            "dob",
            "accession",

            # Exam metadata
            "exam_date",
            "exam_type",
            "exam_scope",
            "exam_extent",
            "cpt_code",
            "technique",
            "operative_history",
            "indication_code",
            "history",

            # Workflow
            "created_by",
            "reading_physician",
            "status",
            "source",

            # Audit
            "created_at",
            "updated_at",
        ]
