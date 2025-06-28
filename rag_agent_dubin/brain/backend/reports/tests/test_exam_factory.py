import pytest
from reports.services.exam_factory import create_exam_from_template
from reports.models.exam import Exam
from reports.models.segment import Segment
from reports.models.measurements import Measurement
from report_template.registry.template_registry import get_template


@pytest.mark.django_db
def test_create_exam_from_carotid_template():
    # Setup input
    patient_data = {
        "name": "Test Patient",
        "gender": "male",
        "mrn": "MRN123456",
        "dob": "1970-01-01",
        "accession": "ACC789",
        "scope": "bilateral",
        "extent": "complete",
        "cpt_code": "93880",
        "technique": "Standard technique",
        "operative_history": "None",
        "indication": "I73.9"
    }

    # Run service
    exam = create_exam_from_template("carotid", "mount_sinai_hospital", patient_data, created_by="anarine")

    # Assertions
    assert exam.exam_type == "carotid"
    assert exam.patient_name == "Test Patient"
    assert exam.created_by == "anarine"
    assert Exam.objects.count() == 1

    template = get_template("carotid", "mount_sinai_hospital")
    assert Segment.objects.count() == len(template["segments"])

    for segment in Segment.objects.all():
        assert segment.measurements.count() == 1
        m = segment.measurements.first()
        assert isinstance(m, Measurement)
