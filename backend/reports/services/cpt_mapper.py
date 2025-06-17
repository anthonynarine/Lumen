"""
CPT Mapper Service for Vascular Exams

This module provides a centralized mapping of CPT (Current Procedural Terminology) codes
based on the type and scope/extent of vascular ultrasound exams.

It is used to auto-populate the `cpt_code` field on the `Exam` model based on user-selected
exam metadata such as exam type (e.g., "carotid", "renal"), scope ("bilateral", "unilateral"),
and extent ("complete", "limited").

Usage Example:
---------------
    from reports.services.cpt_mapper import get_cpt_code

    cpt_code = get_cpt_code(
        exam_type="le_venous",
        scope="bilateral"
    )
    # → "93970"

This service ensures that CPT selection is:
    ✅ Centralized and easy to update
    ✅ Accurate per clinical billing standards
    ✅ Used consistently in serializers, views, and report generators

"""

CPT_MAP = {
    "le_venous": {
        "unilateral": "93971",
        "bilateral": "93970"
    },
    "aorta": {
        "complete": "93978",
        "limited": "93979"
    },
    "renal": {
        "unilateral": "93975",
        "bilateral": "93976"
    },
    "carotid": {
        "unilateral": "93882",
        "bilateral": "93880"
    },
    # Add more mappings as needed
}


def get_cpt_code(exam_type: str, scope: str = "", extent: str = "") -> str:
    """
    Return the CPT code based on the given exam_type and scope or extent.

    Parameters:
        exam_type (str): Type of the vascular exam (e.g., 'renal', 'carotid')
        scope (str): Scope of the exam (e.g., 'unilateral', 'bilateral')
        extent (str): Extent of the exam (e.g., 'complete', 'limited')

    Returns:
        str: The corresponding CPT code if matched, otherwise an empty string.

    Notes:
        - Scope is checked before extent.
        - CPT values are derived from Mount Sinai billing standards.
    """
    key_map = CPT_MAP.get(exam_type, {})
    cpt = key_map.get(scope) or key_map.get(extent)
    return cpt or ""
