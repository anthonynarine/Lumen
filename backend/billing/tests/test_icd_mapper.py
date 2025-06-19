from billing.services.icd_mapper import get_icd_codes

def test_get_icd_codes_valid():
    """
    ✅ Test that known exam types return the expected ICD-10 codes.
    Specifically checks that 'carotid' returns at least one known code (I65.23).
    """
    carotid_codes = get_icd_codes("carotid")
    assert any(code["code"] == "I65.23" for code in carotid_codes)


def test_get_icd_codes_missing_returns_empty():
    """
    ✅ Test that unknown exam types return an empty list (non-strict mode).
    This ensures the function handles missing keys gracefully.
    """
    assert get_icd_codes("nonexistent") == []


def test_get_icd_codes_strict_raises():
    """
    ✅ Test that unknown exam types raise ValueError when strict=True.
    This verifies the strict-mode enforcement of ICD-10 validation.
    """
    import pytest
    with pytest.raises(ValueError):
        get_icd_codes("unknown", strict=True)
