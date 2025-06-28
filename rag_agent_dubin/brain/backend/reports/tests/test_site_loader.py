# reports/tests/test_site_loader.py

import pytest
from reports.site.site_loader import load_carotid_criteria

# to run Lumen\backend> 
# pytest reports/tests/test_site_loader.py -v


def test_load_valid_site_criteria():
    """Should load mountsinai carotid.json successfully and include required keys."""
    criteria = load_carotid_criteria("mountsinai")
    
    assert isinstance(criteria, dict)
    assert "stenosis_thresholds" in criteria
    assert "vertebral_rules" in criteria
    assert criteria["stenosis_thresholds"]["80_99"]["psv_min"] == 241


def test_load_unknown_site_raises_error():
    """Should raise FileNotFoundError if site folder or file is missing."""
    with pytest.raises(FileNotFoundError):
        load_carotid_criteria("unknownsite")

