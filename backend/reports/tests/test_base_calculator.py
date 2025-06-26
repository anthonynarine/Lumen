# report/tests/test_base_calculator.py

"""
Unit tests for the base calculator utilities:
- resolve_value_from_segment
- evaluate_expression_with_variables
- calculate_from_segment

These utilities are shared across all vascular calculators (carotid, renal, mesenteric, etc.)
and ensure safe extraction, evaluation, and calculation from raw segment data.
"""

import pytest
from decimal import Decimal
from reports.calculators.base_calculator import (
    resolve_value_from_segment,
    evaluate_expression_with_variables,
    calculate_from_segment,
)

# TO RUN IN TERMINAL: \Lumen\Lumen\backend> BACKEND ROOT 
# pytest reports/tests/test_base_calculator.py -v


# -----------------------------------------------------------------------------
# ✅ Test for ICA/CCA Ratio Calculation (Domain-Specific)
# -----------------------------------------------------------------------------

def test_ica_cca_ratio_calculation():
    """
    Simulates a real-world carotid segment to verify ICA/CCA ratio logic.
    Example: ICA PSV = 300, CCA PSV = 100 → Ratio = 3.0
    """
    segment = {
        "psv": 300,
        "cca_psv": 100
    }
    expression = "psv / cca_psv"
    required_fields = ["psv", "cca_psv"]

    ratio = calculate_from_segment(expression, segment, required_fields)

    assert ratio == Decimal("3.0")
    
    
def test_ica_cca_ratio_divide_by_zero():
    """
    Should return None if CCA PSV is zero (to avoid division by zero).
    """
    segment = {
        "psv": 300,
        "cca_psv": 0
    }
    expression = "psv / cca_psv"
    required_fields = ["psv", "cca_psv"]

    ratio = calculate_from_segment(expression, segment, required_fields)

    assert ratio is None


# -----------------------------------------------------------------------------
# ✅ Tests for resolve_value_from_segment
# -----------------------------------------------------------------------------

def test_resolve_value_valid_number():
    """Should return a Decimal when the value is a valid number."""
    segment = {"psv": 300}
    assert resolve_value_from_segment(segment, "psv") == Decimal("300")


def test_resolve_value_missing_field():
    """Should return None if the field is not present in the segment."""
    segment = {"psv": 300}
    assert resolve_value_from_segment(segment, "edv") is None


def test_resolve_value_invalid_type():
    """Should return None if the field value cannot be converted to Decimal."""
    segment = {"psv": "not_a_number"}
    assert resolve_value_from_segment(segment, "psv") is None


# -----------------------------------------------------------------------------
# ✅ Tests for evaluate_expression_with_variables
# -----------------------------------------------------------------------------

def test_evaluate_expression_valid_math():
    """Should correctly evaluate a valid math expression using provided variables."""
    expression = "psv / cca_psv"
    variables = {"psv": 300, "cca_psv": 100}
    result = evaluate_expression_with_variables(expression, variables)
    assert result == Decimal("3.0")


def test_evaluate_expression_divide_by_zero():
    """Should return None if the expression causes division by zero."""
    expression = "psv / cca_psv"
    variables = {"psv": 300, "cca_psv": 0}
    result = evaluate_expression_with_variables(expression, variables)
    assert result is None


def test_evaluate_expression_invalid_variable():
    """Should return None if the expression references a missing variable."""
    expression = "psv + unknown"
    variables = {"psv": 300}
    result = evaluate_expression_with_variables(expression, variables)
    assert result is None


# -----------------------------------------------------------------------------
# ✅ Tests for calculate_from_segment
# -----------------------------------------------------------------------------

def test_calculate_from_segment_success():
    """
    Should resolve all required fields from the segment and evaluate the expression correctly.
    """
    segment = {"psv": 300, "cca_psv": 100}
    result = calculate_from_segment("psv / cca_psv", segment, ["psv", "cca_psv"])
    assert result == Decimal("3.0")


def test_calculate_from_segment_missing_field():
    """
    Should return None if one or more required fields are missing from the segment.
    """
    segment = {"psv": 300}
    result = calculate_from_segment("psv / cca_psv", segment, ["psv", "cca_psv"])
    assert result is None


def test_calculate_from_segment_invalid_input():
    """
    Should return None if a required field has an invalid value (e.g., a string).
    """
    segment = {"psv": "bad", "cca_psv": 100}
    result = calculate_from_segment("psv / cca_psv", segment, ["psv", "cca_psv"])
    assert result is None
