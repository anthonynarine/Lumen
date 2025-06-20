import pytest
from rest_framework.test import APIClient

client = APIClient()

@pytest.mark.django_db
def test_get_cpt_map():
    response = client.get("/billing/cpt/")
    assert response.status_code == 200
    assert isinstance(response.data, dict)
    assert "carotid" in response.data


@pytest.mark.django_db
def test_get_icd_map():
    response = client.get("/billing/icd/")
    assert response.status_code == 200
    assert isinstance(response.data, dict)
    assert "carotid" in response.data
    for code_obj in response.data["carotid"]:
        assert "code" in code_obj
        assert "label" in code_obj
