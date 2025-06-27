# reports/views/carotid_views.py

"""
Carotid Exam Views (API Layer)

This module defines API endpoints for carotid ultrasound workflows, including:
- Loading the form template
- Creating exams
- Updating segment measurements
- Running calculations
- Returning report text
- Generating PDF and HL7 payloads

These endpoints orchestrate interaction between the frontend and the calculator/serializer layer.
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_list_or_404

from report_template.registry.template_registry import get_template
from reports.models import Exam
from reports.serializers import ExamSerializer
from reports.calculators.carotid_calculator import run_carotid_calculator