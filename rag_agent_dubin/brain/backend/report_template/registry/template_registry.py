import json
from pathlib import Path
from functools import lru_cache

# Define the root directory where your template folders live
TEMPLATE_DIR = Path(__file__).resolve().parent.parent / "templates"

@lru_cache(maxsize=32)
def get_template(exam_type: str, site: str, version: str = "1.0.0") -> dict:
    """
    Loads a vascular exam template (e.g., carotid.json) based on exam_type, site, and version.

    This function reads a JSON template file from disk and returns it as a Python dictionary.
    It uses in-memory caching via @lru_cache to avoid repeated file reads for the same input.

    Args:
        exam_type (str): Type of exam (e.g., "carotid", "renal", etc.).
        site (str): Clinical site this template is associated with (e.g., "mount_sinai_gp1c").
        version (str, optional): Template version. Defaults to "1.0.0".

    Raises:
        FileNotFoundError: If the JSON template file does not exist.
        ValueError: If the loaded template does not match the expected site or version.

    Returns:
        dict: The parsed template as a Python dictionary.
    """

    # Build the expected path to the JSON file: templates/carotid/carotid.json
    path = TEMPLATE_DIR / exam_type / f"{exam_type}.json"

    # If the file doesn't exist, raise an error
    if not path.exists():
        raise FileNotFoundError(f"Template not found for {exam_type} at {path}")

    # Open and parse the JSON file
    with path.open() as f:
        data = json.load(f)

    # Ensure the file's "site" matches what the caller expects
    if data.get("site") != site:
        raise ValueError(f"Site mismatch: expected {site}, found {data.get('site')}")

    # Ensure the file's version matches
    if data.get("version") != version:
        raise ValueError(f"Version mismatch: expected {version}, found {data.get('version')}")

    # Return the loaded and validated template
    return data
