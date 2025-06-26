# report/types/segments/carotid.py

from typing import Optional
from .base_arterial_segments import ArterialSegmentBase


class CarotidSegmentDict(ArterialSegmentBase):
    cca_psv: Optional[float]
    ica_cca_ratio: Optional[float]
    stenosis_category: Optional[str]
    vertebral_comment: Optional[str]
