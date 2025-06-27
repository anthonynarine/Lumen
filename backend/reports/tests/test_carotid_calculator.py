import pytest
from unittest.mock import MagicMock
from reports.calculators.carotid_calculator import (
    CarotidCalculator,
    run_carotid_calculator,
    save_segment_results_to_exam,
)

# ------------------------------------------------------------------------------
# Mock criteria simulating carotid.json
# ------------------------------------------------------------------------------

MOCK_CRITERIA = {
    "stenosis_thresholds": {
        "0_19": {"psv_max": 104},
        "20_39": {"psv_min": 105, "psv_max": 109},
        "40_59": {"psv_min": 110, "psv_max": 179},
        "60_79": {"psv_min": 180, "psv_max": 240, "edv_max": 134},
        "80_99": {"psv_min": 241, "edv_min": 135},
        "upgrade_if_ratio_gt": 4
    },
    "vertebral_rules": {
        "steal_direction": "retrograde",
        "pre_steal_waveforms": ["bidirectional", "early_systolic_deceleration"]
    }
}

# ------------------------------------------------------------------------------
# ICA/CCA Ratio
# ------------------------------------------------------------------------------

def test_ica_cca_ratio_calculation():
    segments = {
        "prox_ica_right": {"psv": 300, "cca_psv": 100}
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    assert segments["prox_ica_right"]["ica_cca_ratio"] == 3.0

# ------------------------------------------------------------------------------
# Stenosis Classification
# ------------------------------------------------------------------------------

def test_stenosis_category_classification_60_79():
    segments = {
        "prox_ica_right": {"psv": 200, "edv": 90, "cca_psv": 100}
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    assert segments["prox_ica_right"]["stenosis_category"] == "60–79%"

def test_upgrade_to_greater_equal_70():
    segments = {
        "prox_ica_right": {"psv": 200, "edv": 90, "cca_psv": 40}  # ratio = 5.0
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    assert segments["prox_ica_right"]["stenosis_category"] == "≥70% (ICA/CCA > 4)"
    assert "stenosis_notes" in segments["prox_ica_right"]

# ------------------------------------------------------------------------------
# Vertebral Interpretation
# ------------------------------------------------------------------------------

def test_vertebral_comment_steal():
    segments = {
        "vertebral_left": {"direction": "retrograde"}
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    assert "subclavian steal" in segments["vertebral_left"]["vertebral_comment"].lower()

def test_vertebral_comment_pre_steal():
    segments = {
        "vertebral_left": {"waveform": "bidirectional"}
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    assert "pre-steal" in segments["vertebral_left"]["vertebral_comment"].lower()

def test_vertebral_comment_normal():
    segments = {
        "vertebral_left": {"direction": "antegrade", "waveform": "normal"}
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    assert "normal" in segments["vertebral_left"]["vertebral_comment"].lower()

# ------------------------------------------------------------------------------
# Export + Logging Utilities
# ------------------------------------------------------------------------------

def test_export_segments_returns_processed_dict():
    segments = {
        "prox_ica_right": {"psv": 200, "edv": 90, "cca_psv": 100}
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    output = calc.get_segment_data()

    assert isinstance(output, dict)
    assert "prox_ica_right" in output
    assert output["prox_ica_right"]["stenosis_category"] == "60–79%"
    assert output["prox_ica_right"]["ica_cca_ratio"] == 2.0

def test_export_json_serializes_output():
    segments = {
        "prox_ica_right": {"psv": 300, "cca_psv": 100}
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    json_output = calc.export_json()

    assert isinstance(json_output, str)
    assert '"ica_cca_ratio": 3.0' in json_output

def test_log_all_segments_runs(caplog):
    segments = {
        "prox_ica_right": {"psv": 300, "cca_psv": 100}
    }
    calc = CarotidCalculator(segments, MOCK_CRITERIA)
    calc.run_all()

    with caplog.at_level("DEBUG"):
        calc.log_all_segments()

    assert "Segment: prox_ica_right" in caplog.text
    assert "ica_cca_ratio" in caplog.text

# ------------------------------------------------------------------------------
# Calculator Helpers (New)
# ------------------------------------------------------------------------------

def test_save_segment_results_to_exam_saves_fields():
    mock_exam = MagicMock()
    mock_segment = MagicMock()
    mock_measurement = MagicMock()

    mock_exam.segments.get.return_value = mock_segment
    mock_segment.measurement = mock_measurement

    data = {
        "prox_ica_right": {
            "stenosis_category": "60–79%",
            "ica_cca_ratio": 2.2,
        }
    }

    save_segment_results_to_exam(mock_exam, data)

    assert mock_measurement.calculated_fields == data["prox_ica_right"]
    mock_measurement.save.assert_called_once()

def test_run_carotid_calculator_executes(mocker):
    mock_exam = MagicMock()
    mocker.patch("reports.calculators.carotid_calculator.build_segment_dict", return_value={
        "prox_ica_right": {"psv": 200, "edv": 90, "cca_psv": 100}
    })
    mocker.patch("reports.calculators.carotid_calculator.load_carotid_criteria", return_value=MOCK_CRITERIA)
    mock_calc_instance = MagicMock()
    mocker.patch("reports.calculators.carotid_calculator.CarotidCalculator", return_value=mock_calc_instance)

    run_carotid_calculator(mock_exam)

    mock_calc_instance.run_all.assert_called_once()
    mock_calc_instance.get_segment_data.assert_called_once()
