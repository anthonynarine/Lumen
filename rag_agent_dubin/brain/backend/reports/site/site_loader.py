# reports/site/loader.py

import json
import logging
from pathlib import Path

# Step 1: Set up logger
logger = logging.getLogger(__name__)

# Step 2: Set the root directory for all site folders
BASE_DIR = Path(__file__).resolve().parent


def load_carotid_criteria(site: str) -> dict:
    """
    Load site-specific carotid criteria from a structured JSON file.

    Each site should have a file located at:
        reports/site/<site>/criteria/carotid.json

    Example folder structure:
        reports/
            site/
                mountsinai/
                    criteria/
                        carotid.json

    Args:
        site (str): The name of the site (e.g., "mountsinai", "cedars", "nyu").
                    Can include spaces or underscores (e.g., "Mount Sinai").

    Returns:
        dict: Parsed JSON containing stenosis thresholds and vertebral rules.

    Raises:
        FileNotFoundError: If the carotid.json file is not found for the given site.
        json.JSONDecodeError: If the file is present but contains invalid JSON.
    """

    # Step 3: Normalize site name to match folder convention
    normalized = site.lower().replace(" ", "").replace("_", "")

    # Step 4: Construct full path to the carotid criteria JSON file
    path = BASE_DIR / normalized / "criteria" / "carotid.json"

    # Step 5: Debug log for visibility
    logger.debug(f"📁 Resolved carotid criteria path: {path}")

    # Step 6: Validate and load
    if not path.exists():
        raise FileNotFoundError(f"Carotid criteria not found for site '{site}' at path: {path}")

    with open(path, "r") as f:
        return json.load(f)
