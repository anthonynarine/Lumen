import pytest
from report_template.registry.template_registry import get_template

# ✅ Test: Ensure the carotid template loads successfully and contains expected fields
def test_valid_carotid_template_loads_successfully():
    """
    Loads a valid carotid template for Mount Sinai (v1.0.0) and verifies:
    - The template ID is 'carotid'
    - The template contains a 'segments' key
    """
    tpl = get_template("carotid", site="mount_sinai_gp1c", version="1.0.0")
    assert tpl["id"] == "carotid"
    assert "segments" in tpl


# ❌ Test: Ensure a missing exam_type raises FileNotFoundError
def test_raises_file_not_found_for_invalid_exam_type():
    """
    Tries to load a non-existent template called 'not_real'.
    Should raise FileNotFoundError due to missing JSON file.
    """
    with pytest.raises(FileNotFoundError):
        get_template("not_real", site="mount_sinai_gp1c")


# ❌ Test: Ensure a valid template with the wrong site triggers ValueError
def test_raises_value_error_for_wrong_site():
    """
    Loads the carotid template but provides an incorrect site name.
    Should raise ValueError due to site mismatch.
    """
    with pytest.raises(ValueError, match="Site mismatch"):
        get_template("carotid", site="wrong_site")


# ❌ Test: Ensure a valid template with the wrong version triggers ValueError
def test_raises_value_error_for_wrong_version():
    """
    Loads the carotid template but provides a non-matching version string.
    Should raise ValueError due to version mismatch.
    """
    with pytest.raises(ValueError, match="Version mismatch"):
        get_template("carotid", site="mount_sinai_gp1c", version="999.0.0")
