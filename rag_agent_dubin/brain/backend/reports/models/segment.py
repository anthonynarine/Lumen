from django.db import models
from .exam import Exam


class Segment(models.Model):
    """
    Represents a named anatomical vessel segment in a vascular ultrasound exam.

    Each `Segment` belongs to an `Exam` (e.g., Carotid, Renal) and defines a specific
    portion of a vessel, such as:
        - "proximal_ica_right"
        - "mid_cca_left"
        - "distal_renal_artery_right"

    Segments are used to organize measurements by anatomical location. A single exam
    will typically contain multiple segments, each with one or more measurements.

    These segments are defined either:
        1. Dynamically from a template (e.g., `carotid.json`)
        2. Or manually via admin/dev setup

    ✅ Example Use Case:
        A Carotid exam with `exam_type = "carotid"` and `exam_scope = "bilateral"`
        might auto-generate 16 segments:
        - proximal_cca_right, mid_cca_right, distal_cca_right, bifurcation_right,
        - proximal_ica_right, mid_ica_right, distal_ica_right, eca_right,
        - ... plus left side versions

    The `Segment` model allows you to:
        - Group measurements by anatomical location
        - Power the UI grid layout
        - Drive calculator logic (e.g., stenosis per segment)
    """

    SIDE_CHOICES = [
        ("right", "Right"),
        ("left", "Left"),
        ("n/a", "Not Applicable"),  # e.g., aorta, IVC (midline structures)
    ]

    ARTERY_CHOICES = [
        ("ica", "Internal Carotid Artery"),
        ("cca", "Common Carotid Artery"),
        ("eca", "External Carotid Artery"),
        ("vertebral", "Vertebral Artery"),
        ("subclavian", "Subclavian Artery"),
        ("aorta", "Aorta"),
        ("ivc", "IVC"),
        # Add more as needed for other modalities
    ]

    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="segments",
        help_text="Parent exam this segment belongs to."
    )

    name = models.CharField(
        max_length=100,
        help_text="Unique name for the segment, e.g. 'mid_ica_right'. Used in template mapping."
    )

    artery = models.CharField(
        max_length=32,
        choices=ARTERY_CHOICES,
        help_text="Clinical vessel type (ICA, CCA, etc.). Used in calculations and grouping."
    )

    side = models.CharField(
        max_length=8,
        choices=SIDE_CHOICES,
        default="n/a",
        help_text="Side of the body this segment belongs to (right/left/n/a)."
    )

    def __str__(self):
        return f"{self.exam.exam_type} – {self.name}"

