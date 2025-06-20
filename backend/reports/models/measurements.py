from django.db import models
from .segment import Segment


class Measurement(models.Model):
    """
    Stores clinical data collected for a specific anatomical segment in a vascular exam.

    Each `Measurement` is tied to a `Segment` (e.g., "mid_ica_right") and contains
    relevant velocity and plaque information for that point in the exam.

    Most segments will have only one Measurement record, but the model allows for
    flexibility if you ever want to support repeat entries or revisions.

    ✅ Example Use Case:
        Segment: "proximal_ica_right"
        Measurement:
            - PSV = 300
            - EDV = 95
            - Plaque = "calcified"
            - ICA/CCA Ratio = 4.3

    ✅ Clinical Logic Support:
        - PSV/EDV used for stenosis classification
        - Plaque type supports morphology-based interpretation
        - ICA/CCA ratio used to refine stenosis range (esp. 60–79%)
        - Waveform/direction may indicate occlusion, reversal, or subclavian steal

    This model enables:
        - Velocity-based calculators
        - Structured PDF report tables
        - HL7 OBX segment population
    """

    segment = models.ForeignKey(
        Segment,
        on_delete=models.CASCADE,
        related_name="measurements",
        help_text="The anatomical segment this measurement is tied to."
    )

    psv = models.FloatField(
        null=True, blank=True,
        help_text="Peak Systolic Velocity (cm/s). Required for stenosis calculation."
    )

    edv = models.FloatField(
        null=True, blank=True,
        help_text="End Diastolic Velocity (cm/s). Used in high-grade stenosis calculation."
    )

    ica_cca_ratio = models.FloatField(
        null=True, blank=True,
        help_text="ICA/CCA PSV Ratio. Used for determining 60–79% stenosis zone."
    )

    plaque_type = models.CharField(
        max_length=64,
        blank=True,
        help_text="Morphological classification of plaque (e.g. calcified, soft, heterogeneous)."
    )

    direction = models.CharField(
        max_length=32,
        blank=True,
        help_text="Flow direction (e.g. antegrade, retrograde). Important for vertebral/subclavian analysis."
    )

    waveform = models.CharField(
        max_length=64,
        blank=True,
        help_text="Waveform pattern (e.g. triphasic, monophasic). Used in qualitative flow assessment."
    )

    stenosis_category = models.CharField(
        max_length=64,
        blank=True,
        help_text="Optional derived field showing interpreted stenosis severity (e.g. '60–79%')."
    )
    additional_data = models.JSONField(default=dict, blank=True, help_text="Custom or extra measurements not modeled explicitly.")


    def __str__(self):
        return f"{self.segment.name} – PSV: {self.psv or 'N/A'}"
