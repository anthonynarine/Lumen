# reports/site/loader.py

import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# Point to centralized template folder in report_template/templates
BASE_DIR = Path(__file__).resolve().parents[2] / "report_template" / "templates"


def load_carotid_criteria(site: str = None) -> dict:
    """
    Load carotid criteria JSON from the centralized templates folder.

    All criteria files live under:
        report_template/templates/<exam_type>/<exam_type>.json

    Example:
        report_template/templates/carotid/carotid.json

    Args:
        site (str, optional): Currently unused. Included for compatibility
                            with previous interface.

    Returns:
        dict: Parsed JSON containing stenosis thresholds and vertebral rules.

    Raises:
        FileNotFoundError: If carotid.json is not found.
        json.JSONDecodeError: If the file is present but invalid.
    """
    path = BASE_DIR / "carotid" / "carotid.json"

    logger.debug(f"📁 Resolved carotid criteria path: {path}")

    if not path.exists():
        raise FileNotFoundError(f"Carotid criteria not found at path: {path}")

    with open(path, "r") as f:
        return json.load(f)
