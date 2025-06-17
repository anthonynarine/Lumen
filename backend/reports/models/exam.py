from django.db import models


class Exam(models.Model):
    """
    Represents a single vascular ultrasound exam.

    Each Exam is created when a scheduled study is marked 'arrived' in EPIC.
    It stores:
        - Patient metadata (MRN, DOB, accession number)
        - Exam classification (carotid, renal, etc.)
        - Exam scope/extent (bilateral, limited, etc.)
        - CPT code (auto-filled based on scope/extent)
        - Clinical context (indication, operative history, technique)

    An Exam is the parent object for all associated Segment and Measurement data.
    It progresses through a clear workflow:
        1. Draft (tech fills out metadata and measurements)
        2. Signed by Technologist
        3. Finalized by Physician

    Output from an Exam includes:
        ✅ Editable clinical summary
        ✅ Structured PDF report (WeasyPrint)
        ✅ HL7 ORU message (to Mirth → EMR)
    """

    EXAM_TYPES = [
        ("carotid", "Carotid"),
        ("renal", "Renal"),
        ("ivc", "IVC"),
        ("aorta", "Aorta"),
        ("mesenteric", "Mesenteric"),
        ("le_arterial", "LE Arterial"),
        ("le_venous", "LE Venous"),
    ]

    EXAM_STATUS = [
        ("draft", "Draft"),
        ("tech_signed", "Signed by Technologist"),
        ("finalized", "Finalized by Physician"),
    ]

    # 🔹 Patient Metadata (from scheduling system or DICOM worklist)
    patient_name = models.CharField(max_length=255)
    mrn = models.CharField(max_length=64)
    dob = models.DateField(null=True, blank=True)
    accession = models.CharField(max_length=64, blank=True)
    exam_date = models.DateField(null=True, blank=True)

    # 🔹 Exam Classification
    exam_type = models.CharField(
        max_length=64,
        choices=EXAM_TYPES,
        blank=True,
        help_text="What type of study this is (e.g. carotid, renal)."
    )
    exam_scope = models.CharField(
        max_length=32,
        blank=True,
        help_text="Scope of the exam (e.g. bilateral, right, left)."
    )
    exam_extent = models.CharField(
        max_length=32,
        blank=True,
        help_text="Extent of the exam (e.g. complete, limited)."
    )
    cpt_code = models.CharField(
        max_length=32,
        blank=True,
        help_text="CPT code derived from exam_type + scope/extent."
    )

    # 🔹 Clinical Context
    technique = models.TextField(
        blank=True,
        help_text="Free-text description of imaging technique used."
    )
    operative_history = models.TextField(
        blank=True,
        help_text="Optional notes on surgical or procedural history."
    )
    indication_code = models.CharField(
        max_length=16,
        blank=True,
        help_text="ICD-10 code for indication (e.g., I73.9)."
    )

    # 🔹 User Roles and Workflow
    created_by = models.CharField(
        max_length=128,
        help_text="Technologist who performed the study. Can later become FK to user."
    )
    reading_physician = models.CharField(
        max_length=128,
        blank=True,
        help_text="MD who reviews and finalizes the report."
    )
    status = models.CharField(
        max_length=32,
        choices=EXAM_STATUS,
        default="draft",
        blank=True,
        help_text="Workflow status: draft → tech_signed → finalized."
    )

    # 🔹 Audit Trail
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    signed_by_tech = models.BooleanField(default=False)
    signed_by_physician = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.exam_type.title()} Exam for {self.patient_name} ({self.mrn})"

    class Meta:
        verbose_name = "Exam"
        verbose_name_plural = "Exams"
        ordering = ["-created_at"]
