
# 🧠 LUMEN: Carotid Exam Engine — Full Lifecycle Overview (Phase 1A + 1B)

## 🔄 From Template to Final Report

```
                            🧠 CAROTID WORKFLOW OVERVIEW
┌─────────────────────────────────────────────────────────────────────────────┐
│                        1. JSON TEMPLATE LOADING                            │
└─────────────────────────────────────────────────────────────────────────────┘

                  reports/exam_templates/carotid.json  (structure)
                                  │
                                  ▼
                    get_template(exam_type="carotid", site="mountsinai")
                                  │
                                  ▼
                  returns JSON describing all carotid segments
                  e.g. {"segments": [{ "id": "prox_ica_right", ... }, ...]}

┌─────────────────────────────────────────────────────────────────────────────┐
│               2. EXAM + SEGMENT OBJECTS FROM TEMPLATE                      │
└─────────────────────────────────────────────────────────────────────────────┘

           create_exam_from_template(exam_type, site, patient_data, created_by)
                                  │
                                  ▼
        ┌─────────────────────────────────────────────────────────────────────┐
        │ Creates Exam object → with Segment and Measurement children         │
        └─────────────────────────────────────────────────────────────────────┘
        • Each Segment: name, side, vessel
        • Each Measurement: initialized with PSV, EDV, CCA_PSV, etc. as blank/null

┌─────────────────────────────────────────────────────────────────────────────┐
│                    3. SITE-LEVEL LOGIC LOADS CRITERIA                      │
└─────────────────────────────────────────────────────────────────────────────┘

                  load_carotid_criteria(site="mountsinai")
                                  │
                                  ▼
       reads → reports/site/mountsinai/criteria/carotid.json

       Returns rules like:
       {
         "stenosis_thresholds": { "0_19": { "psv_max": 104 }, ... },
         "vertebral_rules": { "steal_direction": "retrograde", ... }
       }

┌─────────────────────────────────────────────────────────────────────────────┐
│                     4. SEGMENTS INTO DICTIONARY FORM                       │
└─────────────────────────────────────────────────────────────────────────────┘

                     for segment in exam.segments:
                         segment_dict[segment.name] = {
                             "psv": segment.measurement.psv,
                             "edv": segment.measurement.edv,
                             ...
                         }

      These are typed using:
      → ArterialSegmentBase
      → CarotidSegmentDict (adds ica_cca_ratio, stenosis_category, etc.)

┌─────────────────────────────────────────────────────────────────────────────┐
│                         5. CALCULATOR LOGIC APPLIED                        │
└─────────────────────────────────────────────────────────────────────────────┘

              calculator = CarotidCalculator(segment_dict, carotid_criteria)
              calculator.run_all()

   ▶ For each segment:
       • compute_ica_cca_ratio() → adds "ica_cca_ratio"
       • apply_stenosis_logic()  → adds "stenosis_category" + "stenosis_notes"
       • interpret_vertebral_waveform() → adds "vertebral_comment"

┌─────────────────────────────────────────────────────────────────────────────┐
│                         6. OUTPUT + INTEGRATION                            │
└─────────────────────────────────────────────────────────────────────────────┘

    calculator.get_segment_data()
        → gives structured dict[str, CarotidSegmentDict] with all fields

    calculator.export_json()
        → gives pretty-printed JSON (debug/log use)

    ⬇

    Optional:
    generate_conclusion(exam) → builds editable findings summary like:
    "Prox ICA R: Findings consistent with 60–79% stenosis."
    "Left Vertebral: Retrograde vertebral flow consistent with subclavian steal."

    ⬇

    Final Output:
    • Frontend Form (Formik + MeasurementTable)
    • PDF (WeasyPrint via PDF template)
    • HL7 Payload (NextGen via Mirth)
```

## ✅ Quick Reference — Key Modules and Their Role

| File / Component | Purpose |
|------------------|---------|
| `carotid.json` | Defines the structure of all carotid segments |
| `get_template()` | Loads template based on exam_type + site |
| `create_exam_from_template()` | Creates DB models from that template |
| `load_carotid_criteria()` | Loads threshold rules per site |
| `ArterialSegmentBase` | Shared segment fields (psv, edv, waveform, etc.) |
| `CarotidSegmentDict` | Extended carotid-specific fields |
| `CarotidCalculator` | Executes stenosis, ICA/CCA, vertebral logic |
