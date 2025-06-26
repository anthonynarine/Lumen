# report/calculators/base.py

from decimal import Decimal, InvalidOperation
from typing import Optional, Union
from math import isfinite

# Step 0: Allow any number-like input
Number = Union[int, float, Decimal]


def resolve_value_from_segment(segment: dict, field_name: str) -> Optional[Decimal]:
    """
    Safely extract a numeric field from a segment and convert to Decimal.

    Args:
        segment (dict): The measurement segment dictionary (e.g., for "prox_ica_right").
        field_name (str): The key to retrieve (e.g., "psv", "edv").

    Returns:
        Optional[Decimal]: Decimal value if valid, otherwise None.
    """
    # Step 1: Try to get the raw value from the dictionary
    raw_value = segment.get(field_name)
    if raw_value is None:
        return None

    # Step 2: Attempt to convert to Decimal
    try:
        return Decimal(str(raw_value))
    except (InvalidOperation, TypeError, ValueError):
        return None


def evaluate_expression_with_variables(
    expression: str, variables: dict[str, Number]
) -> Optional[Decimal]:
    """
    Safely evaluate a math expression using Decimal variables.

    Example:
        expression = "psv / cca_psv"
        variables = {"psv": 300, "cca_psv": 100}

    Args:
        expression (str): A simple math expression to evaluate.
        variables (dict): Variable name to number mapping.

    Returns:
        Optional[Decimal]: Result of the evaluation, or None if invalid.
    """
    try:
        # Step 1: Convert all input values to Decimal
        decimal_vars = {
            var_name: Decimal(str(var_value)) for var_name, var_value in variables.items()
        }

        # Step 2: Evaluate using only these safe variables (no builtins allowed)
        result = eval(expression, {"__builtins__": {}}, decimal_vars)

        # Step 3: Ensure result is valid and numeric
        if isinstance(result, (int, float, Decimal)) and isfinite(result):
            return Decimal(result)
    except Exception:
        return None


def calculate_from_segment(
    expression: str, segment: dict, required_fields: list[str]
) -> Optional[Decimal]:
    """
    Resolves required fields from a segment and evaluates the given math expression.

    Args:
        expression (str): The formula to evaluate (e.g., "psv / cca_psv").
        segment (dict): Segment dictionary with raw measurement fields.
        required_fields (list[str]): Field names that must be present to run the calculation.

    Returns:
        Optional[Decimal]: Result of the evaluated expression, or None.
    """
    # Step 1: Collect valid field values from the segment
    resolved_vars = {}
    for field_name in required_fields:
        value = resolve_value_from_segment(segment, field_name)
        if value is not None:
            resolved_vars[field_name] = value

    # Step 2: Skip calculation if any fields are missing
    if not resolved_vars:
        return None

    # Step 3: Evaluate the formula using the resolved variables
    return evaluate_expression_with_variables(expression, resolved_vars)
