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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from report_template.registry.template_registry import get_template
from reports.models import Exam

from reports.serializers.carotid import CarotidExamSerializer
from reports.calculators.carotid_calculator import run_carotid_calculator
from reports.services.conclusion_generator import generate_conclusion
from reports.types.segments.carotid_segments import build_segment_dict

# If implemented later:
# from reports.pdf_templates.renderer import render_pdf
# from reports.hl7.oru_payload_builder import build_oru_message

import logging
logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_carotid_template(request):
    """
    Returns the carotid JSON template for front-end form rendering.
    Accepts optional ?site= param (defaults to "mount_sinai_hospital").
    """
    site = request.query_params.get("site", "mount_sinai_hospital")
    logger.info(f"Template request received for site: {site}")

    try:
        template = get_template("carotid", site)
        logger.info(f"Loaded carotid template for site: {site}")
        return Response({
            "message": f"Carotid template loaded for site '{site}'.",
            "template": template
        }, status=status.HTTP_200_OK)

    except FileNotFoundError as e:
        logger.error(f"Template not found for site '{site}': {str(e)}")
        return Response({
            "message": f"No carotid template found for site '{site}'.",
            "error": str(e)
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        logger.exception(f"Unhandled error while loading carotid template for site '{site}'")
        return Response({
            "message": f"Unexpected error while loading carotid template.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def create_carotid_exam(request):
    """
    Creates a new Carotid Exam instance from frontend input.
    """
    logger.info("Create carotid exam request received")
    data = request.data.copy()
    data["exam_type"] = "carotid"

    logger.debug(f"Submitted data: {data}")

    try:
        serializer = CarotidExamSerializer(data=data)
        if serializer.is_valid():
            exam = serializer.save()
            logger.info(f"Carotid exam created: ID={exam.id}, patient={exam.patient_name}")
            return Response({
                "message": "Carotid exam created successfully.",
                "exam": CarotidExamSerializer(exam).data
            }, status=status.HTTP_201_CREATED)

        logger.warning(f"Validation failed for carotid exam creation: {serializer.errors}")
        return Response({
            "message": "Validation failed.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.exception("Unhandled exception during carotid exam creation")
        return Response({
            "message": "An unexpected error occurred while creating the carotid exam.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PATCH"])
def update_carotid_segments(request, exam_id):
    """
    Updates raw measurement values in existing carotid segments.
    Payload format:
    {
        "prox_ica_right": { "psv": 300, "edv": 100 },
        "distal_cca_left": { "psv": 120 }
    }
    """
    logger.info(f"Segment update request received for exam ID: {exam_id}")

    try:
        exam = get_object_or_404(Exam, id=exam_id, exam_type="carotid")
        payload = request.data
        updated_count = 0

        for segment_name, updates in payload.items():
            try:
                segment = exam.segments.get(name=segment_name)
                measurement = segment.measurement
                if not measurement:
                    logger.warning(f"No measurement found for segment '{segment_name}'")
                    continue

                for field, value in updates.items():
                    if hasattr(measurement, field):
                        setattr(measurement, field, value)

                measurement.save()
                updated_count += 1
                logger.debug(f"Updated segment '{segment_name}'")

            except Exception as inner_exc:
                logger.warning(f"Failed to update segment '{segment_name}': {str(inner_exc)}")

        logger.info(f"Segment update complete: {updated_count} segments updated")
        return Response({
            "message": "Segment data updated successfully.",
            "segments_updated": updated_count
        }, status=status.HTTP_200_OK)

    except Exam.DoesNotExist:
        logger.warning(f"Exam ID {exam_id} not found or not a carotid exam.")
        return Response({
            "message": "Carotid exam not found.",
            "exam_id": exam_id
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        logger.exception(f"Unhandled exception while updating segments for exam ID {exam_id}")
        return Response({
            "message": "An unexpected error occurred while updating segment data.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def calculate_carotid_exam(request, exam_id):
    """
    Runs the carotid calculator logic and saves results to calculated_fields.
    """
    logger.info(f"Calculation request received for exam ID: {exam_id}")

    try:
        exam = get_object_or_404(Exam, id=exam_id, exam_type="carotid")
        run_carotid_calculator(exam)
        exam.refresh_from_db()
        logger.info(f"Calculation complete for exam ID: {exam.id}")
        return Response(CarotidExamSerializer(exam).data)

    except Exception as e:
        logger.exception(f"Unhandled exception while calculating carotid exam ID {exam_id}")
        return Response({
            "message": "An error occurred during carotid calculation.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_carotid_conclusion(request, exam_id):
    """
    Returns the generated clinical conclusion based on the carotid segment data. 
    """
    logger.info(f"Conclusion request received for exam ID: {exam_id}")

    try:
        exam = get_object_or_404(Exam, id=exam_id, exam_type="carotid")
        segments = build_segment_dict(exam)
        conclusion = generate_conclusion(segments)

        logger.info(f"Conclusion generated for exam ID {exam_id}")
        return Response({
            "message": "Conclusion generated successfully.",
            "conclusion": conclusion
        }, status=status.HTTP_200_OK)

    except Exam.DoesNotExist:
        logger.warning(f"Exam ID {exam_id} not found or not a carotid exam.")
        return Response({
            "message": "Carotid exam not found.",
            "exam_id": exam_id
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        logger.exception(f"Unhandled exception while generating conclusion for exam ID {exam_id}")
        return Response({
            "message": "An unexpected error occurred while generating the conclusion.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_carotid_pdf(request, exam_id):
    """
    Returns PDF export of the carotid exam (placeholder for now).
    """
    logger.info(f"PDF export requested for exam ID: {exam_id}")

    try:
        return Response({
            "message": "PDF generation not yet implemented for carotid exams.",
            "exam_id": exam_id
        }, status=status.HTTP_501_NOT_IMPLEMENTED)

    except Exception as e:
        logger.exception(f"Unhandled exception during PDF generation for exam ID {exam_id}")
        return Response({
            "message": "An error occurred during PDF generation.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_carotid_oru_payload(request, exam_id):
    """
    Returns HL7 ORU payload for the carotid exam (placeholder for now).
    """
    logger.info(f"HL7 ORU payload requested for exam ID: {exam_id}")

    try:
        return Response({
            "message": "HL7 ORU generation not yet implemented for carotid exams.",
            "exam_id": exam_id
        }, status=status.HTTP_501_NOT_IMPLEMENTED)

    except Exception as e:
        logger.exception(f"Unhandled exception during HL7 ORU generation for exam ID {exam_id}")
        return Response({
            "message": "An error occurred while generating HL7 ORU payload.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
