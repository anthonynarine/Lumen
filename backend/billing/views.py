from django.views.decorators.cache import cache_page
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .services.cpt_mapper import CPT_MAP
from .services.icd_mapper import ICD10_MAP

# ⏳ Cache duration: 14 hours
CACHE_TIMEOUT = 60 * 60 * 14


@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(CACHE_TIMEOUT)
def get_cpt_map(request):
    """
    Retrieve the CPT code map for vascular ultrasound exams.

    Returns:
        Response: A JSON dictionary mapping exam types and scopes to CPT codes.
        Example:
            {
                "carotid": {
                    "bilateral": "93880",
                    "unilateral": "93882"
                },
                "renal": {
                    "bilateral": "93975",
                    "unilateral": "93976"
                }
            }

    Usage:
        GET /billing/cpt/

    Notes:
        - This endpoint is intended for frontend use or internal services that need
        to display or reference CPT codes per exam type.
        - CPT codes are critical for insurance billing and claims generation.
        - Cached for 14 hours to optimize frontend performance.
    """
    return Response(CPT_MAP)


@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(CACHE_TIMEOUT)
def get_icd_map(request):
    """
    Retrieve the ICD-10 code map for vascular ultrasound indications.

    Returns:
        Response: A JSON dictionary mapping exam types to lists of ICD-10 code objects.
        Each object includes a code and a human-readable label.
        Example:
            {
                "carotid": [
                    {"code": "I65.23", "label": "Occlusion and stenosis of bilateral carotid arteries"},
                    {"code": "I73.9", "label": "Peripheral vascular disease, unspecified"}
                ]
            }

    Usage:
        GET /billing/icd/

    Notes:
        - This endpoint is intended for UI dropdowns or backend claim generators
        needing indication-based ICD-10 codes.
        - ICD-10 codes justify medical necessity and support insurance reimbursement.
        - Cached for 14 hours to optimize performance and reduce server load.
    """
    return Response(ICD10_MAP)
