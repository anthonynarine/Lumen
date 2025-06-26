# report/types/segments/base.py

from typing import Optional, TypedDict


class ArterialSegmentBase(TypedDict, total=False):
    psv: Optional[float]
    edv: Optional[float]
    waveform: Optional[str]
    direction: Optional[str]
    plaque_type: Optional[str]
    has_dissection: Optional[bool]
    has_thrombus: Optional[bool]
    has_aneurysm: Optional[bool]
