# reports/urls/carotid_urls.py

from django.urls import path
from reports.views import carotid_views as views

urlpatterns = [
    # 🔹 Load JSON template used to render the carotid form UI
    path("templates/carotid/", views.get_carotid_template, name="carotid-template"),

    # 🔹 Create a new carotid exam instance (segments auto-populated from template)
    path("reports/carotid/", views.create_carotid_exam, name="create-carotid-exam"),

    # 🔹 Update measurement values for specific segments in a given exam
    path("reports/carotid/<int:exam_id>/segments/", views.update_carotid_segments, name="update-carotid-segments"),

    # 🔹 Run ICA/CCA ratio, stenosis %, vertebral logic and persist output
    path("reports/carotid/<int:exam_id>/calculate/", views.calculate_carotid_exam, name="calculate-carotid"),

    # 🔹 Generate an editable clinical conclusion from segment results
    path("reports/carotid/<int:exam_id>/conclusion/", views.get_carotid_conclusion, name="carotid-conclusion"),

    # 🔹 Return the PDF export of the report (placeholder for now)
    path("reports/carotid/<int:exam_id>/pdf/", views.get_carotid_pdf, name="carotid-pdf"),

    # 🔹 Return HL7 ORU message payload (placeholder for now)
    path("reports/carotid/<int:exam_id>/oru_payload/", views.get_carotid_oru_payload, name="carotid-oru"),
]
