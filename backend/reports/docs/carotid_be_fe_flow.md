Lumen – Carotid Exam Workflow (Backend → Frontend)
1. Overview

The Carotid Duplex Exam evaluates extracranial carotid arteries using grayscale + color Doppler + spectral analysis.
In Lumen, this exam is driven entirely by a JSON template (templates/carotid/carotid.json), which defines:

Segments (anatomical locations)

Measurements (PSV, EDV, ICA/CCA ratio, etc.)

Flags (plaque, stenosis, waveform, direction)

Dropdowns (stenosis %, waveform types, plaque morphology)

Display grouping (Right, Left, Temporal arteries)

Outputs:

Segment-level measurements stored in DB

Derived values (ICA/CCA ratio, stenosis categories)

Preliminary report text (editable)

Finalized report (future: PDF + HL7 ORU → EPIC)

2. Backend Flow
Template Loading

File: template_registry.py

Endpoint: GET /api/templates/carotid/?site=mount_sinai_hospital

Loads carotid.json, validates site + version, returns JSON.

Exam Creation

File: exam_factory.py → create_exam_from_template

Uses template to:

Create Exam (patient metadata, scope, CPT)

Create Segment (e.g. cca_prox_right)

Create Measurement objects (psv, edv, etc.)

Endpoint: POST /api/carotid/exams/

Serializer: CarotidExamSerializer

Segment Updates

Endpoint: PATCH /api/carotid/exams/:id/segments/

Payload example:

{
  "ica_prox_right": { "psv": 300, "edv": 95, "plaque_type": "calcified" },
  "cca_mid_left": { "psv": 130 }
}


Updates Measurement for each segment.

Calculations

File: carotid_calculator.py (not shown here)

Endpoint: POST /api/carotid/exams/:id/calculate/

Derives:

ICA/CCA ratio

Stenosis classification (0–19%, 20–49%, 50–69%, 70–99%, occluded)

Saves results to measurement.calculated_fields.

Findings / Reports

File: conclusion_generator.py (called in carotid_views.py)

Endpoint: GET /api/carotid/exams/:id/conclusion/

Auto-generates clinical conclusion → saved as PreliminaryReport.

Technologist can edit before physician sign-off.

Future Outputs

PDF Export → get_carotid_pdf (not implemented yet).

HL7 ORU Payload → get_carotid_oru_payload → outbound to Mirth → EPIC.

3. Frontend Flow
Template Fetch

File: CarotidExamPage.tsx

Calls:

examApi.get("/api/templates/carotid/?site=mount_sinai_hospital")


Passes JSON → buildCarotidTemplate → normalized arrays (templateNormalizer).

Form Rendering

File: CarotidExamForm.tsx

Uses Formik with shape:

{
  metadata: { patientName, mrn, dob, accession, examDate, laterality, icd10Codes, cptCode },
  left: { cca_prox: { psv, edv, ... }, ... },
  right: { ica_prox: { psv, edv, ... }, ... },
  notes: ""
}


Renders SegmentTableFormik for Left + Right.

Segment Table

File: SegmentTable.tsx

Sorts segments anatomically (subclavian → CCA → bifurcation → ICA → ECA → vertebral).

Renders rows with PSV/EDV + dropdowns/checkboxes as defined by flags.

Segment Row

File: SegmentRow.tsx

Conditional fields based on template flags:

supportsPlaque → checkbox

supportsStenosis → dropdown (% stenosis)

supportsWaveform → waveform dropdown

supportsDirection → direction dropdown

4. Data Contracts
Template JSON (carotid.json)
{
  "id": "carotid",
  "version": "1.0.0",
  "site": "mount_sinai_hospital",
  "segments": [ ... ],
  "display": { "groups": [ ... ] },
  "units": { "psv": "cm/s", "edv": "cm/s", "ica_cca_ratio": "ratio" },
  "dropdowns": { "stenosisPercent": [...], "waveformShape": [...] }
}

API Sequence

GET /api/templates/carotid/ → JSON template

POST /api/carotid/exams/ → create Exam

PATCH /api/carotid/exams/:id/segments/ → update measurements

POST /api/carotid/exams/:id/calculate/ → run calculator

GET /api/carotid/exams/:id/conclusion/ → get findings

5. Future Enhancements

PDF export with WeasyPrint.

HL7 outbound integration with Mirth.

AI Template Agent to auto-generate JSON templates from protocol docs.

QC tools: velocity outlier detection, peer review.