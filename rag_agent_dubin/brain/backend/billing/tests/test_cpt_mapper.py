import pytest
from billing.services.cpt_mapper import get_cpt_code


@pytest.mark.parametrize("exam_type, scope, extent, expected", [
    ("carotid", "bilateral", "", "93880"),
    ("carotid", "unilateral", "", "93882"),
    ("renal", "unilateral", "", "93975"),
    ("renal", "bilateral", "", "93976"),
    ("aorta", "", "complete", "93978"),
    ("ivc", "", "limited", "93979"),
    ("hd_access", "maturation", "", "93990"),
    ("hd_access", "follow_up", "", "93990"),
    ("le_arterial", "segmental", "", "93923"),
    ("ue_arterial", "", "complete", "93930"),
])
def test_get_cpt_code_valid(exam_type, scope, extent, expected):
    """
    Test that valid exam_type + scope or extent combinations return the correct CPT code.

    Args:
        exam_type (str): Type of exam (e.g., 'carotid', 'renal')
        scope (str): Scope of the exam (e.g., 'bilateral', 'unilateral')
        extent (str): Extent of the exam (e.g., 'complete', 'segmental')
        expected (str): The expected CPT code

    Asserts:
        That the returned CPT code matches the expected value.
    """
    assert get_cpt_code(exam_type, scope, extent) == expected


def test_get_cpt_code_missing_returns_empty():
    """
    Test that the function returns an empty string for unrecognized exam_type, scope, or extent.

    Asserts:
        That unmatched combinations return an empty string rather than throwing an error.
    """
    assert get_cpt_code("unknown_type", "bilateral", "complete") == ""
    assert get_cpt_code("carotid", "nonsense", "nonsense") == ""


def test_get_cpt_code_strict_raises():
    """
    Test that strict mode raises a ValueError when no CPT code can be found.

    Asserts:
        That the function raises ValueError for invalid inputs when strict=True.
    """
    with pytest.raises(ValueError):
        get_cpt_code("nonexistent", "left", "full", strict=True)
