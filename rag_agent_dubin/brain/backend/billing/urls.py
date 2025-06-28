from django.urls import path
from . import views

urlpatterns = [
    path(
        "cpt/", views.get_cpt_map, name="get_cpt_map"),
    # 📌 GET /billing/cpt/
    # Returns a JSON mapping of exam types and scopes to CPT codes
    # Used for billing UI dropdowns or claim generation logic

    path("icd/", views.get_icd_map, name="get_icd_map"),
    # 📌 GET /billing/icd/
    # Returns a JSON mapping of exam types to ICD-10 code objects
    # Each object includes both code and label, for display and billing
]
