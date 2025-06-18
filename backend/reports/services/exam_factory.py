from report_template.registry.template_registry import get_template
from reports.models.exam import Exam
from reports.models.segment import Segment
from reports.models.measurements import Measurement


def generate_placeholder_name(gender: str = "unspecified") -> str:
    """
    Generates a placeholder patient name when none is provided.

    Format: "John Doe #001", "Jane Doe #002", or "Patient #003"
    """
    count = Exam.objects.count() + 1
    if gender.lower() == "male":
        return f"John Doe #{count:03}"
    elif gender.lower() == "female":
        return f"Jane Doe #{count:03}"
    else:
        return f"Patient #{count:03}"


def create_exam_from_template(exam_type: str, site: str, patient_data: dict, created_by: str) -> Exam:
    """
    Creates a full Exam instance (with segments + measurements) from a structured JSON template.

    Args:
        exam_type: e.g., "carotid"
        site: e.g., "mount_sinai_gp1c"
        patient_data: dict with patient name, mrn, dob, etc.
        created_by: username or technologist string

    Returns:
        Exam: fully initialized with segments and measurements
    """
    # Load JSON template from registry
    template = get_template(exam_type, site)

    # Extract and clean inputs
    gender = patient_data.get("gender", "unspecified")
    patient_name = patient_data.get("name") or generate_placeholder_name(gender)

    # Create base exam
    exam = Exam.objects.create(
        patient_name=patient_name,
        gender=gender,
        mrn=patient_data.get("mrn", ""),
        dob=patient_data.get("dob"),
        accession=patient_data.get("accession", ""),
        exam_type=exam_type,
        exam_scope=patient_data.get("scope", ""),
        exam_extent=patient_data.get("extent", ""),
        cpt_code=patient_data.get("cpt_code", ""),
        technique=patient_data.get("technique", ""),
        operative_history=patient_data.get("operative_history", ""),
        indication_code=patient_data.get("indication", ""),
        created_by=created_by,
        status="draft"
    )

    # Create all segments and measurements
    for seg in template["segments"]:
        segment = Segment.objects.create(
            exam=exam,
            name=seg["id"],
            artery=seg["vessel"].lower(),
            side=seg.get("side", "n/a")
        )

        measurement = Measurement.objects.create(segment=segment)
        for m in seg.get("measurements", []):
            field_name = m["name"].lower()
            if hasattr(measurement, field_name):
                setattr(measurement, field_name, None)  # initialize with blank value
        measurement.save()

    return exam
