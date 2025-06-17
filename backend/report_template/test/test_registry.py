import pytest
from report_template.registry.template_registry import get_template

def test_valid_carotid_template_loads_successfully():
    tpl = get_template("carotid", site="mount_sinai_gp1c", version="1.0.0")
    assert tpl["id"] == "carotid"
    assert "segments" in tpl

def test_raises_file_not_found_for_invalid_exam_type():
    with pytest.raises(FileNotFoundError):
        get_template("not_real", site="mount_sinai_gp1c")

def test_raises_value_error_for_wrong_site():
    with pytest.raises(ValueError, match="Site mismatch"):
        get_template("carotid", site="wrong_site")

def test_raises_value_error_for_wrong_version():
    with pytest.raises(ValueError, match="Version mismatch"):
        get_template("carotid", site="mount_sinai_gp1c", version="999.0.0")
