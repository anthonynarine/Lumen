import logging
from report_template.registry.template_registry import get_template
from reports.models.exam import Exam
from reports.models.segment import Segment
from reports.models.measurements import Measurement

logger = logging.getLogger(__name__)  # module-level logger


def generate_placeholder_name(gender: str = "unspecified") -> str:
    """
    Generate a placeholder patient name when none is provided.

    Example outputs:
        - "John Doe #001" (male)
        - "Jane Doe #002" (female)
        - "Patient #003" (unspecified/other)

    Args:
        gender (str): Reported gender, case-insensitive. Defaults to "unspecified".

    Returns:
        str: Generated placeholder name.
    """
    count = Exam.objects.count() + 1
    if gender.lower() == "male":
        name = f"John Doe #{count:03}"
    elif gender.lower() == "female":
        name = f"Jane Doe #{count:03}"
    else:
        name = f"Patient #{count:03}"

    logger.warning(f"Generated placeholder name: {name} (gender={gender})")
    return name


def create_exam_from_template(exam_type: str, site: str, patient_data: dict, created_by: str) -> Exam:
    """
    Create a full Exam instance (with segments + measurements) from a structured JSON template.

    Workflow:
        1. Load JSON template via registry.
        2. Create an Exam record with patient + study metadata.
        3. Iterate through all template segments, creating Segment + Measurement rows.
        4. Initialize each measurement field (PSV, EDV, ICA/CCA ratio, etc.) to `None`.
        5. Store any declared unit overrides in `measurement.additional_data`.
        6. For non-core measurements (e.g. artery_diameter, ap_tr), initialize
           them in `measurement.additional_data` as well.

    Args:
        exam_type (str): Exam type identifier (e.g., "carotid", "renal").
        site (str): Clinical site identifier (e.g., "mount_sinai_hospital").
        patient_data (dict): Patient + exam metadata. Expected keys include:
            - "name", "gender", "mrn", "dob", "accession",
            - "scope", "extent", "cpt_code", "technique",
            - "operative_history", "indication"
        created_by (str): Identifier for the technologist creating the exam.

    Returns:
        Exam: Fully initialized Exam object with related Segment + Measurement objects.

    Raises:
        Exception: Any unhandled errors during template loading or exam creation.
    """
    try:
        # Step 1: Load JSON template
        template = get_template(exam_type, site)
        logger.info(f"Loaded template for exam_type={exam_type}, site={site}")

        # Step 2: Extract inputs and ensure patient name
        gender = patient_data.get("gender", "unspecified")
        patient_name = patient_data.get("name") or generate_placeholder_name(gender)

        # Step 3: Create base Exam
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
        logger.info(
            f"Exam created: id={exam.id}, type={exam_type}, "
            f"patient={patient_name}, created_by={created_by}"
        )

        # Step 4: Create segments + measurements from template
        for seg in template["segments"]:
            segment = Segment.objects.create(
                exam=exam,
                name=seg["id"],
                artery=seg["vessel"].lower(),
                side=seg.get("side", "n/a")
            )
            logger.debug(f"Segment created: id={segment.id}, name={segment.name}")

            measurement = Measurement.objects.create(segment=segment)

            # Step 5: Initialize measurement fields
            for m in seg.get("measurements", []):
                # Handle both compact ["psv", "edv"] and verbose [{"name": "psv"}] styles
                field_name = m if isinstance(m, str) else m.get("name")
                if not field_name:
                    continue

                if hasattr(measurement, field_name):
                    # Core fields: initialize on the model directly
                    setattr(measurement, field_name, None)
                else:
                    # Non-core fields: initialize in additional_data
                    measurement.additional_data[field_name] = None

                # Step 6: Store units if available (from template or field-level)
                units_map = template.get("units", {})  # global exam-level units override
                field_unit = None

                if isinstance(m, dict) and "unit" in m:
                    # Verbose style provided its own unit
                    field_unit = m["unit"]
                elif field_name in units_map:
                    # Compact style with units override block
                    field_unit = units_map[field_name]

                if field_unit:
                    measurement.additional_data[f"{field_name}_unit"] = field_unit

            measurement.save()
            logger.debug(f"Measurement initialized for segment={segment.name}")

        return exam

    except Exception as e:
        logger.exception(
            f"Failed to create exam from template: "
            f"exam_type={exam_type}, site={site}, error={e}"
        )
        raise
