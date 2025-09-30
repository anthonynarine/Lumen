# reports/serializers/base_serializer.py

from rest_framework import serializers
from reports.models import Exam, Segment, Measurement

class MeasurementSerializer(serializers.ModelSerializer):
    """
    Values stored for a single segment. Field names match Measurement model,
    but we alias plaque_type → plaqueMorphology for frontend consistency.
    """
    plaqueMorphology = serializers.CharField(
        source="plaque_type", allow_blank=True, required=False
    )

    class Meta:
        model = Measurement
        fields = [
            "psv",
            "edv",
            "ica_cca_ratio",
            "plaqueMorphology",  # alias for plaque_type
            "direction",
            "waveform",
            "stenosis_category",
            "additional_data",
            "calculated_fields",
        ]


class SegmentSerializer(serializers.ModelSerializer):
    """
    A segment can have one (usual) or more measurements; expose them read-only here.
    """
    measurements = MeasurementSerializer(many=True, read_only=True)

    class Meta:
        model = Segment
        fields = ["name", "side", "artery", "measurements"]


class ExamBaseSerializer(serializers.ModelSerializer):
    """
    Base exam serializer with core fields used across all exam types.
    Child serializers (e.g., CarotidExamSerializer) should subclass this.
    """
    segments = SegmentSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = [
            "id",
            "patient_name",
            "mrn",
            "dob",
            "accession",
            "exam_type",
            "exam_scope",
            "exam_extent",
            "cpt_code",
            "technique",
            "operative_history",
            "indication_code",
            "history",       # 👈 new field exposed here
            "created_by",
            "status",
            "created_at",
            "updated_at",
            "segments",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "segments"]
