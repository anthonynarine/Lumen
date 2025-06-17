from django.db import models

class Exam(models.Model):
    EXAM_TYPES = [
        ("carotid", "Carotid"),
        ("renal", "Renal"),
        ("ivc", "IVC"),
        ("aorta", "Aorta"),
        ("mesenteric", "Mesenteric"),
        ("le_arterial", "LE Arterial"),
        ("le_venous", "LE Venous"),
        # Add more as needed
    ]
        
    EXAM_STATUS = [
            ("draft", "Draft"),
            ("tech_signed", "Signed by Technologist"),
            ("finalized", "Finalized by Physician"),
        ]

    # ✅ Patient & metadata (from EPIC scheduling feed)
    patient_name = models.CharField(max_length=255)
    mrn = models.CharField(max_length=64)
    dob = models.DateField(null=True, blank=True)
    accession = models.CharField(max_length=64, blank=True)
    exam_date = models.DateField(null=True, blank=True)
    

    # ✅ Administrative + classification
    exam_type = models.CharField(max_length=64, choices=EXAM_TYPES, blank=True)
    exam_scope = models.CharField(max_length=32, blank=True)  # Bilateral / Right / Left / Limited / Complete
    exam_extent = models.CharField(max_length=32, blank=True)  # limited / complete
    cpt_code = models.CharField(max_length=32, blank=True)
    
    # ✅ Clinical context
    technique = models.TextField(blank=True)
    operative_history = models.TextField(blank=True)
    indication_code = models.CharField(max_length=16, blank=True)  # e.g., "I73.9"

    # ✅ Roles and audit trail
    created_by = models.CharField(max_length=128)  # Later may use FK to user
    reading_physician = models.CharField(max_length=128, blank=True)
    status = models.CharField(max_length=32, choices=EXAM_STATUS, default="draft", blank=True)
    
    # ✅ Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # ✅ Signoff flags (for traceability, could be datetime later)
    signed_by_tech = models.BooleanField(default=False)
    signed_by_physician = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.exam_type.title()} Exam for {self.patient_name} ({self.mrn})"