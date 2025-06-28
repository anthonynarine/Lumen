# reports/services/conclusion_generator.py

from reports.types.segments.carotid_segments import CarotidSegmentDict


def format_segment_name(segment_key: str) -> str:
    """
    Convert internal segment keys into human-readable names.

    Transforms keys like 'prox_ica_right' into 'Prox ICA Right' for cleaner
    appearance in the clinical report output.

    Args:
        segment_key (str): Raw key from the segment dictionary.

    Returns:
        str: Human-readable name with title-cased words.
    """
    return segment_key.replace("_", " ").title()


def generate_conclusion(segments: dict[str, CarotidSegmentDict]) -> str:
    """
    Generate a clinical conclusion summary from annotated carotid segment data.

    This function scans all segment dictionaries and extracts meaningful findings
    such as:
    - ICA/CCA ratio-derived stenosis categories
    - Vertebral artery flow abnormalities

    These are returned as a multi-line, human-readable summary suitable for use
    in the ReportConclusion field, PDF export, and HL7 payloads.

    Args:
        segments (dict[str, CarotidSegmentDict]):
            A dictionary mapping segment keys to processed segment data.
            Each segment is expected to contain calculated fields like
            'stenosis_category' and 'vertebral_comment'.

    Returns:
        str: An editable, paragraph-style clinical conclusion.
            Returns a fallback message if no findings are present.
    """
    lines: list[str] = []

    for segment_key, segment in segments.items():
        name = format_segment_name(segment_key)

        # Include stenosis interpretation if available
        if segment.get("stenosis_category"):
            lines.append(f"{name}: Findings consistent with {segment['stenosis_category']} stenosis.")

        # Include vertebral flow comment if present
        if segment.get("vertebral_comment"):
            lines.append(f"{name}: {segment['vertebral_comment']}")

    # Fallback if no findings exist in any segment
    if not lines:
        return "No significant stenosis or vertebral abnormalities identified."

    return "\n".join(lines)
