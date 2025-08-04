
# 🧠 Carotid Exam Template — Fullstack Walkthrough (Lumen Project)

This document provides a full technical breakdown of how the carotid exam template system works in the Lumen project — connecting backend template logic, dynamic React forms, and stenosis calculations.

---

## 🧱 Overview Diagram

```mermaid
flowchart TD
  A[Request to /api/templates/carotid/] --> B[Backend loads JSON template]
  B --> C[site_loader.py finds file]
  C --> D[Returns parsed template]
  D --> E[React fetches it via Axios]
  E --> F[CarotidExamPage.tsx sets state]
  F --> G[CarotidExamForm.tsx renders Formik form]
  G --> H[CarotidSegmentTable.tsx renders inputs]
  H --> I[User enters PSV/EDV]
  I --> J[Live calculations + conclusion (generateConclusion.ts)]
```

---

## 🔧 Backend Architecture

### 1. `carotid.json`

- Located in `exam_templates/`
- Defines carotid segment structure (e.g., `prox_ica_right`)
- Fields: `psv`, `edv`, `plaque`, `waveform`, etc.
- Structure groups for left/right/temporal arteries.

### 2. `template_registry.py`

- Registers templates by site and exam type.
- Maps `"mount_sinai_hospital"` + `"carotid"` → `carotid.json`

### 3. `site_loader.py`

- Loads the JSON file using `template_registry`.
- Provides parsed result to views.

### 4. `carotid_views.py`

- API view `GET /api/templates/carotid/?site=mount_sinai_hospital`
- Logs requests and returns parsed template JSON

---

## ⚛️ Frontend Flow

### 1. `CarotidExamPage.tsx`

- Calls `/api/templates/carotid/` via Axios
- Stores JSON in React state
- Passes data to `CarotidExamForm`

### 2. `CarotidExamForm.tsx`

- Formik-driven component
- Renders segment forms via `CarotidSegmentTable`
- Runs live calculations via `calculateCarotidStenosis.ts`
- Shows impression from `generateConclusion.ts`

### 3. `CarotidSegTableForm.tsx`

- Renders dynamic table using template
- Input fields for PSV and EDV per segment
- Formik `setFieldValue` binds to user input

---

## 🔢 Calculations

### `calculateCarotidStenosis.ts`

- Computes ICA/CCA ratio, detects thresholds
- Calculates stenosis grade per segment

### `generateConclusion.ts`

- Returns textual summary based on PSV/EDV and ratios
- Live output shown in read-only textarea

---

## 🔄 Sample Data Flow

```ts
// Example template segment
{
  id: "prox_ica_right",
  label: "Prox ICA (Right)",
  side: "right",
  measurements: [
    { name: "psv", unit: "cm/s" },
    { name: "edv", unit: "cm/s" }
  ]
}

// Example Formik values
{
  right: {
    prox_ica_right: { psv: 220, edv: 90 },
    ...
  },
  left: { ... },
  notes: "Post-CEA right side."
}
```

---

## 📋 Developer Notes

| Feature                         | Modify In                                          |
|----------------------------------|---------------------------------------------------|
| Add % stenosis dropdown         | `carotid.json`, `CarotidSegTableForm.tsx`         |
| Add FMD/disease dropdowns       | `carotid.json`, `CarotidSegTableForm.tsx`         |
| ICD/CPT metadata per exam       | `CarotidExamForm.tsx`, `Exam` model               |
| Submit data to backend          | `onSubmit` in `CarotidExamForm.tsx`               |
| HL7 + PDF output                | `preliminary_report.py`, `oru_payload.py`         |

---

## ✅ Summary

This carotid workflow is built to be modular and site-driven, using a JSON template to control segment fields. It's fully dynamic on the frontend, easily extendable, and hooks into Lumen's architecture for eventual HL7 + PDF + exam persistence.

