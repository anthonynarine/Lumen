# reports/serializers/carotid/exam_serializer.py

from rest_framework import serializers
from reports.models import Exam
from reports.serializers.exam_base_serializer import ExamBaseSerializer
from .carotid_measurement_serializer import CarotidMeasurementSerializer


class CarotidExamSerializer(ExamBaseSerializer):
    """
    Carotid exam serializer.
    Inherits universal exam fields from ExamBaseSerializer
    and nests carotid-specific measurements by segment.
    """

    segments = serializers.SerializerMethodField()

    class Meta(ExamBaseSerializer.Meta):
        model = Exam
        fields = ExamBaseSerializer.Meta.fields + ["segments"]

    def get_segments(self, obj):
        """
        Return each segment with nested CarotidMeasurementSerializer data.
        """
        segments = obj.segments.all().prefetch_related("measurements")
        return [
            {
                "name": seg.name,
                "artery": seg.artery,
                "side": seg.side,
                "measurements": CarotidMeasurementSerializer(
                    seg.measurements.all(), many=True
                ).data,
            }
            for seg in segments
        ]
