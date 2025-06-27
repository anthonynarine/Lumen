from rest_framework import serializers
from reports.models import Exam, Segment, Measurement

class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = [
            "psv", "edv", "direction", "waveform", "cca_psv",
            "morphology", "plaque_description", "calculated_fields"
        ]
        
class SegmentSerializer(serializers.ModelSerializer):
    measurement = MeasurementSerializer()

    class Meta:
        model = Segment
        fields = [
            "name", "side", "artery", "measurement"
        ]
        
class ExamBaseSerializer(serializers.ModelSerializer):
    """
    Base exam serializer with core fields used across all exam types.
    Child serializers (e.g., CarotidExamSerializer) should subclass this.
    """
    segments = SegmentSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = [
            "id", "patient_name", "mrn", "dob", "accession",
            "exam_type", "exam_scope", "exam_extent", "cpt_code",
            "technique", "operative_history", "indication_code",
            "created_by", "status", "created_at", "updated_at",
            "segments"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "segments"]