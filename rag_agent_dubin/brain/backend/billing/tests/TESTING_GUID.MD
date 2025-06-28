# 🧪 Billing App — Testing Guide

This guide explains how to run full test suites, individual test files, or single test cases inside the `billing/` app using `pytest`.

---

## 📦 Requirements

Ensure you're in your virtual environment and `pytest-django` is installed:

```bash
pip install pytest-django
Your pytest.ini should be in the backend/ folder and include:

[pytest]
DJANGO_SETTINGS_MODULE = lumen_core.settings
python_files = tests/test_*.py

📁 Directory Layout (simplified)

billing/
├── services/
│   ├── cpt_mapper.py
│   ├── icd_mapper.py
│   └── ...
├── tests/
│   ├── test_api_endpoints.py
│   ├── test_cpt_mapper.py
│   ├── test_icd_mapper.py
│   └── ...


🚀 Run All Billing Tests
From the backend/ directory:
pytest billing

🧪 Run a Specific Test File
pytest billing/tests/test_cpt_mapper.py

🧪 Run a Single Test Function
Use :: to run a specific test:
pytest billing/tests/test_cpt_mapper.py::test_get_cpt_code_for_carotid

You can also pass -v for verbose output:
pytest billing/tests/test_api_endpoints.py::test_get_icd_map -v

🧹 Cleanup Test Cache (optional)
If you run into weird caching issues:

pytest --cache-clear
📋 Best Practices
Use test_*.py filenames and test_* function names

Group related tests into logical files (e.g., test_claim_payload.py)

Document purpose of each test suite in the top docstring

