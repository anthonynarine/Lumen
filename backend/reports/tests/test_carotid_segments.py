import pytest
from reports.models import Exam, Segment, Measurement
from reports.types.segments.carotid_segments import build_segment_dict


@pytest.mark.django_db
def test_build_segment_dict_constructs_correct_shape():
    # Step 1: Create an exam
    exam = Exam.objects.create(
        patient_name="Segment Test",
        mrn="MRN-123",
        dob="1980-01-01",
        accession="ACC-789",
        exam_type="carotid",
        exam_scope="bilateral",
        exam_extent="complete",
        cpt_code="93880",
        created_by="tester"
    )

    # Step 2: Create a segment for ICA
    segment = Segment.objects.create(
        exam=exam,
        name="prox_ica_right"
    )

    # Step 3: Attach a valid measurement (only DB-backed fields)
    Measurement.objects.create(
        segment=segment,
        psv=250,
        edv=100,
        direction="antegrade",
        waveform="normal"
        # ❌ Removed cca_psv, morphology, plaque_description
    )

    # Step 4: Build dict
    result = build_segment_dict(exam)

    # Step 5: Verify structure
    assert isinstance(result, dict)
    assert "prox_ica_right" in result
    assert "psv" in result["prox_ica_right"]
    assert result["prox_ica_right"]["psv"] == 250
