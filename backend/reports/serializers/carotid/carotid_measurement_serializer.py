# reports/serializers/carotid/measurement_serializer.py

from rest_framework import serializers
from reports.models import Measurement
from reports.serializers.base_arterial_serializer import ArterialMeasurementSerializer


class CarotidMeasurementSerializer(ArterialMeasurementSerializer):
    """
    Carotid-specific measurement serializer.
    Extends the ArterialMeasurementSerializer with ICA/CCA ratio and direction.
    """

    icaCcaRatio = serializers.FloatField(
        source="ica_cca_ratio", required=False, allow_null=True
    )
    direction = serializers.CharField(
        required=False, allow_blank=True
    )

    class Meta(ArterialMeasurementSerializer.Meta):
        model = Measurement
        fields = ArterialMeasurementSerializer.Meta.fields + [
            "icaCcaRatio",
            "direction",
        ]
