# 📄 Serializer Architecture – Lumen

This document describes the structure and design philosophy behind the **serializer layer** in the Lumen project.  
We now use a **per-exam directory structure** with arterial/venous base serializers.

---

## 🔹 High-Level Layout

```
serializers/
│
├── exam_base_serializer.py       # ✅ Universal exam metadata
├── arterial_base.py              # ✅ Core arterial fields
├── venous_base.py                # ✅ Core venous fields
│
├── carotid/
│   ├── measurement_serializer.py # CarotidMeasurementSerializer
│   ├── exam_serializer.py        # CarotidExamSerializer
│   └── __init__.py
│
├── renal/
│   ├── measurement_serializer.py # RenalMeasurementSerializer
│   ├── exam_serializer.py        # RenalExamSerializer
│   └── __init__.py
│
├── mesenteric/
│   ├── measurement_serializer.py # MesentericMeasurementSerializer
│   ├── exam_serializer.py
│   └── __init__.py
│
└── venous/
    ├── le/
    │   ├── measurement_serializer.py # LEVenousMeasurementSerializer
    │   ├── exam_serializer.py
    │   └── __init__.py
    ├── ue/
    │   ├── measurement_serializer.py # UEVenousMeasurementSerializer
    │   ├── exam_serializer.py
    │   └── __init__.py
    ├── ivc/
    │   ├── measurement_serializer.py # IVCMeasurementSerializer
    │   ├── exam_serializer.py
    │   └── __init__.py
    └── hdaccess/
        ├── measurement_serializer.py # HDAVenousMeasurementSerializer
        ├── exam_serializer.py
        └── __init__.py
```

---

## 🔹 Base Serializers

### `ExamBaseSerializer`
- Universal serializer for exam-level metadata shared across all modalities.

### `ArterialMeasurementSerializer`
- Core arterial fields: PSV, EDV, plaque morphology, aneurysm diameters (arteryDiameter, apTr, longitudinal), waveform, stenosis category, additional_data, calculated_fields.

### `VenousMeasurementSerializer`
- Core venous fields: compressibility, patency, reflux, additional_data, calculated_fields.

---

## 🔹 Exam-Specific Serializers

Each exam type lives in its own folder and extends the appropriate base:

- **Carotid** → ICA/CCA ratio, vertebral direction.  
- **Renal** → RAR, RI.  
- **Mesenteric** → SMA/celiac PSV, stenosis%.  
- **Aorto-Iliac** → aneurysm, calcified plaque markers.  
- **LE Venous** → reflux duration, thrombus chronicity.  
- **UE Venous** → catheter-related fields.  
- **IVC** → patency only.  
- **Dialysis Access** → anastomotic PSV/EDV, maturation status.

---

## 🚀 Developer Guidelines

- Add shared fields to `arterial_base.py` or `venous_base.py`.  
- Add modality-specific fields in that exam’s folder.  
- Keep naming consistent:
  - Base: `ArterialMeasurementSerializer`, `VenousMeasurementSerializer`
  - Exam: `<ExamType>MeasurementSerializer`, `<ExamType>ExamSerializer`
- When adding a new exam type:
  1. Create new folder under `serializers/`
  2. Add `measurement_serializer.py`, `exam_serializer.py`, and `__init__.py`
  3. Update `serializers/__init__.py`
  4. Update `serializers_doc.md` and `serializer_structure.md`
