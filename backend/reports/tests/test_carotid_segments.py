from unittest.mock import MagicMock
from reports.types.segments.carotid_segments import build_segment_dict

# to run tests make sure .env is activated and in the backend root folder
# \backend> pytest reports/tests/test_carotid_segments.py  


def test_build_segment_dict_constructs_correct_shape():
    mock_exam = MagicMock()
    mock_segment_1 = MagicMock()
    mock_segment_2 = MagicMock()
    mock_meas_1 = MagicMock()
    mock_meas_2 = MagicMock()

    # Setup segment 1
    mock_segment_1.name = "prox_ica_right"
    mock_segment_1.measurement = mock_meas_1
    mock_meas_1.psv = 250
    mock_meas_1.edv = 100
    mock_meas_1.direction = "antegrade"
    mock_meas_1.waveform = "normal"
    mock_meas_1.cca_psv = 90
    mock_meas_1.morphology = "calcified"
    mock_meas_1.plaque_description = "heterogeneous"

    # Setup segment 2 with no measurement (should be skipped)
    mock_segment_2.name = "distal_ica_left"
    mock_segment_2.measurement = None

    mock_exam.segments.select_related.return_value.all.return_value = [
        mock_segment_1,
        mock_segment_2,
    ]

    result = build_segment_dict(mock_exam)

    # Assert only segment with measurement is included
    assert isinstance(result, dict)
    assert "prox_ica_right" in result
    assert "distal_ica_left" not in result

    seg = result["prox_ica_right"]
    assert seg["psv"] == 250
    assert seg["edv"] == 100
    assert seg["direction"] == "antegrade"
    assert seg["waveform"] == "normal"
    assert seg["cca_psv"] == 90
    assert seg["morphology"] == "calcified"
    assert seg["plaque"] == "heterogeneous"
