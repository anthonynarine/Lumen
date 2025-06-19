# 🧾 Billing App — Lumen Vascular Reporting System

## 🧠 Overview

The `billing` app is responsible for generating **structured insurance claim payloads** for all vascular ultrasound exams performed within Lumen. It centralizes CPT/ICD-10 mappings, applies billing logic based on exam type and scope, and provides exportable outputs compatible with EMR and clearinghouse systems (e.g., NextGen, HL7, X12 837P).

This app is designed to be modular, testable, and extensible — supporting automated billing workflows across all vascular exam types.

---

## 🗂️ App Directory Structure

```
billing/
├── services/
│   ├── cpt_mapper.py          # CPT logic per exam type/scope
│   ├── icd_mapper.py          # ICD-10 codes based on indication
│   ├── claim_payload.py       # generate_claim_payload(exam) → dict
│   └── combo_rules.py         # (Optional) CPT ↔ ICD compatibility logic
├── views.py                   # API endpoints for CPT/ICD maps + claim generation
├── urls.py                    # Route registration
├── tests/                     # Unit and integration tests
└── models.py                  # Optional: claim logs, payer config, billing status
```

---

## 🔁 Services and Functionality

### ✅ 1. CPT Mapping Service (`cpt_mapper.py`)
Maps each exam type and scope to the correct **Current Procedural Terminology (CPT)** code.

Example:
```python
CPT_MAP = {
    "carotid": {
        "complete_bilateral": "93880",
        "unilateral": "93882",
    },
    "renal": {
        "complete_bilateral": "93975",
    },
}
```

---

### ✅ 2. ICD-10 Mapping Service (`icd_mapper.py`)
Maps clinical indications to **ICD-10 codes**, based on parsed or selected data from the exam object.

Example:
```python
ICD10_MAP = {
    "carotid": ["I73.9"],  # Peripheral vascular disease, unspecified
    "renal": ["I77.3"],    # Arterial fibromuscular dysplasia
}
```

---

### ✅ 3. Claim Payload Generator (`claim_payload.py`)
Main entrypoint for generating the billing claim. Pulls from `Exam` data and mapping services.

```python
def generate_claim_payload(exam) -> dict:
    return {
        "patient": exam.patient_data,
        "provider": getattr(exam, "signed_by", exam.created_by),
        "facility": "Mount Sinai Cardiovascular Institute",
        "exam_date": exam.date_performed.isoformat(),
        "cpt_code": get_cpt_code(exam.exam_type, exam.scope),
        "icd_codes": get_icd_codes(exam.exam_type, exam.indication),
        "modifiers": [],  # Optional
    }
```

---

### ✅ 4. API Endpoints (`views.py`)
- `GET /billing/cpt/` → Returns all CPT codes
- `GET /billing/icd/` → Returns all ICD-10 codes
- `POST /billing/generate/` → Generates claim payload from an `exam_id`

---

## 📤 Output Payload Format

Example:
```json
{
  "patient": {
    "name": "Marlin Risinger",
    "dob": "1954-12-08",
    "mrn": "E118748"
  },
  "provider": "Jeffrey W. Olin, DO",
  "facility": "Mount Sinai Cardiovascular Institute",
  "exam_date": "2025-04-09",
  "cpt_code": "93880",
  "icd_codes": ["I73.9"],
  "modifiers": []
}
```

---

## 🎯 Future Capabilities

- 🔄 Convert to HL7 ORU or X12 837P format
- 🧾 Submit to billing clearinghouse or EMR
- ✅ Add validation logic (payer-specific)
- 🤖 RAG Agent integration for billing Q&A
- 📊 Claim dashboard (status tracking, logs)

---

## 📌 Developer Notes

- All CPT/ICD mappings are JSON-driven and can be updated independently of business logic
- Compatible with Lumen’s exam model and template-driven reporting
- Will support multi-site configurations with custom payer logic
- Use `auth_integration` for all endpoint access control
- Fully testable with exam fixture data

---
