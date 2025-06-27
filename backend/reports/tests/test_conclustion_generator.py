# reports/tests/test_conclusion_generator.py

import pytest
from reports.services.conclusion_generator import generate_conclusion


@pytest.fixture
def sample_segments():
    return {
        "prox_ica_right": {
            "psv": 300,
            "cca_psv": 100,
            "ica_cca_ratio": 3.0,
            "stenosis_category": "50–69%",
        },
        "prox_vertebral_left": {
            "psv": 60,
            "edv": 20,
            "direction": "retrograde",
            "waveform": "normal",
            "vertebral_comment": "Retrograde vertebral flow is consistent with subclavian steal.",
        },
        "distal_ica_left": {
            "psv": 100,
            "edv": 35,
            # no stenosis or comment
        }
    }


def test_generate_conclusion_with_findings(sample_segments):
    """
    Test that generate_conclusion() correctly builds a multi-line summary
    when segments have meaningful findings.
    """
    conclusion = generate_conclusion(sample_segments)

    assert "Prox Ica Right: Findings consistent with 50–69% stenosis." in conclusion
    assert "Prox Vertebral Left: Retrograde vertebral flow is consistent with subclavian steal." in conclusion
    assert "Distal Ica Left" not in conclusion  # This segment has no findings


def test_generate_conclusion_with_no_findings():
    """
    Test fallback message when no segment has findings.
    """
    empty_segments = {
        "prox_cca_right": {
            "psv": 90,
            "edv": 30
            # no stenosis_category or vertebral_comment
        }
    }

    conclusion = generate_conclusion(empty_segments)
    assert conclusion == "No significant stenosis or vertebral abnormalities identified."
