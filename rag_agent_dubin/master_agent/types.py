# graph/types.py

from typing import TypedDict, Literal

class DubinState(TypedDict, total=False):
    input: str
    classification: Literal["dev", "clinical", "auth"]
    output: str
    agent: Literal["Julia", "Kadian", "KeyMaker"]
    sources: list | None
