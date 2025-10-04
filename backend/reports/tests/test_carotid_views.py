# reports/tests/test_carotid_views.py
# pytest reports/tests/test_carotid_views.py -v

import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from reports.models import Exam


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_create_carotid_exam(api_client):
    payload = {
        "patient_name": "Test Patient",
        "gender": "male",
        "mrn": "TEST123",
        "dob": "1980-01-01",
        "accession": "ACC456",
        "exam_scope": "bilateral",
        "exam_extent": "complete",
        "cpt_code": "93880",
        "technique": "Standard B-mode + color doppler",
        "operative_history": "",
        "indication_code": "I73.9",
        "created_by": "tech_user"
    }

    url = reverse("create-carotid-exam")
    response = api_client.post(url, payload, format="json")

    assert response.status_code == 201
    assert Exam.objects.count() == 1
    # return response.data["exam"]["id"]


@pytest.mark.django_db
def test_get_carotid_template(api_client):
    url = reverse("carotid-template")
    response = api_client.get(url)
    assert response.status_code == 200
    assert "template" in response.data


@pytest.mark.django_db
def test_update_segments_and_calculate(api_client):
    # Step 1: Create exam
    create_url = reverse("create-carotid-exam")
    response = api_client.post(create_url, {
        "patient_name": "Calc Patient",
        "gender": "male",
        "mrn": "C123",
        "dob": "1970-01-01",
        "exam_scope": "bilateral",
        "exam_extent": "complete",
        "cpt_code": "93880",
        "created_by": "tech"
    }, format="json")
    exam_id = response.data["exam"]["id"]

    # Step 2: Update segment
    patch_url = reverse("update-carotid-segments", args=[exam_id])
    payload = {
        "prox_ica_right": {
            "psv": 300,
            "edv": 100,
            "cca_psv": 70,
            "direction": "antegrade",
            "waveform": "triphasic"
        }
    }
    patch_response = api_client.patch(patch_url, payload, format="json")
    assert patch_response.status_code == 200
    assert "segments_updated" in patch_response.data

    # Step 3: Run calculation
    calc_url = reverse("calculate-carotid", args=[exam_id])
    calc_response = api_client.post(calc_url)
    assert calc_response.status_code == 200
    assert "segments" in calc_response.data


@pytest.mark.django_db
def test_get_conclusion(api_client):
    # Create and calculate exam
    create_url = reverse("create-carotid-exam")
    response = api_client.post(create_url, {
        "patient_name": "Conclusion Test",
        "gender": "female",
        "mrn": "X123",
        "dob": "1985-05-05",
        "exam_scope": "left",
        "exam_extent": "limited",
        "cpt_code": "93880",
        "created_by": "tech"
    }, format="json")
    exam_id = response.data["exam"]["id"]

    # Run conclusion
    conclusion_url = reverse("carotid-conclusion", args=[exam_id])
    response = api_client.get(conclusion_url)
    assert response.status_code == 200
    assert "conclusion" in response.data
