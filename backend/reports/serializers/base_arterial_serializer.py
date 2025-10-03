# reports/serializers/arterial_serializers/base_arterial_serializer.py

from rest_framework import serializers
from reports.models import Measurement


class ArterialMeasurementSerializer(serializers.ModelSerializer):
    """
    Base serializer for arterial measurements.
    Shared across carotid, renal, mesenteric, aorto-iliac, and other arterial exams.

    Includes:
      - Core velocities (PSV, EDV)
      - Plaque morphology
      - Aneurysm dimensions (diameter, AP/TR, longitudinal)
      - Waveform classification
      - Stenosis category
      - Flexible storage via additional_data + calculated_fields
    """

    # Alias for DB field plaque_type → frontend-friendly name
    plaqueMorphology = serializers.CharField(
        source="plaque_type", allow_blank=True, required=False
    )

    # JSON-backed aneurysm measurements
    arteryDiameter = serializers.FloatField(
        source="additional_data.artery_diameter", required=False, allow_null=True
    )
    apTr = serializers.FloatField(
        source="additional_data.ap_tr", required=False, allow_null=True
    )
    longitudinal = serializers.FloatField(
        source="additional_data.longitudinal", required=False, allow_null=True
    )

    class Meta:
        model = Measurement
        fields = [
            # Core
            "psv",
            "edv",

            # Morphology
            "plaqueMorphology",

            # Dimensions
            "arteryDiameter",
            "apTr",
            "longitudinal",

            # Hemodynamics
            "waveform",
            "stenosis_category",

            # Flexible storage
            "additional_data",
            "calculated_fields",
        ]
