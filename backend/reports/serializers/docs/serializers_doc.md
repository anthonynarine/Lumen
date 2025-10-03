# 📄 Serializers in Lumen

## Overview
Serializers transform database models into JSON for the API and back.  
In Lumen, we now follow an **arterial vs venous split** to reflect clinical workflows:

- **Arterial serializers** → Carotid, Renal, Mesenteric, Aorto-Iliac, Peripheral Arterial  
- **Venous serializers** → LE Venous, UE Venous, IVC, Dialysis Access  

Each path has a **base serializer** for shared fields, and **exam-specific serializers** that extend the base.

---

## 🔹 Directory Structure

```
serializers/
  arterial_serializers/
    base_arterial_serializer.py   # ExamBaseSerializer, ArterialMeasurementSerializer
    carotid_serializer.py         # CarotidExamSerializer
    renal_serializer.py           # RenalExamSerializer
    mesenteric_serializer.py      # MesentericExamSerializer
    aortoiliac_serializer.py      # Aorto-IliacExamSerializer
  venous_serializers/
    base_venous_serializer.py     # VenousMeasurementSerializer
    le_venous_serializer.py       # LEVenousExamSerializer
    ue_venous_serializer.py       # UEVenousExamSerializer
    ivc_serializer.py             # IVCExamSerializer
    hdaccess_serializer.py        # HD Access ExamSerializer
```

---

## 🔹 Base Serializers

### `ExamBaseSerializer` (arterial base)
- Universal patient + exam metadata:
  - Patient: name, MRN, DOB, accession, gender  
  - Exam: type, scope, extent, CPT, ICD-10  
  - Clinical: technique, operative history, history array  
  - Workflow: created_by, status, created_at/updated_at  
- Shared across **arterial and venous** serializers.  

### `ArterialMeasurementSerializer`
- Fields common to all arterial exams:
  - `psv` → Peak Systolic Velocity  
  - `edv` → End Diastolic Velocity  
  - `plaqueMorphology` → plaque description (DB: `plaque_type`)  
  - `arteryDiameter` / `apTr` / `longitudinal` → aneurysm/diameter measures  
  - `waveform` → waveform classification  
  - `stenosis_category` → categorical stenosis grade  
  - `additional_data` / `calculated_fields`  

### `VenousMeasurementSerializer`
- Fields common to all venous exams:
  - `compressibility` → compressible vs non-compressible  
  - `patency` → patent vs occluded  
  - `reflux` → binary reflux finding  
  - `additional_data` / `calculated_fields`  

---

## 🔹 Exam-Specific Serializers

### Carotid
- **CarotidMeasurementSerializer** → extends `ArterialMeasurementSerializer` with:
  - `ica_cca_ratio` (carotid-specific)  
  - `direction` (vertebral flow direction)  
- **CarotidExamSerializer** → wraps carotid segments + measurements.  

### Renal
- **RenalMeasurementSerializer** → extends arterial base with:
  - `rar` (renal-aortic ratio)  
  - `ri` (resistive index)  
- **RenalExamSerializer**  

### Mesenteric
- **MesentericMeasurementSerializer** → extends arterial base with:
  - SMA/celiac PSV, stenosis%  
- **MesentericExamSerializer**  

### Aorto-Iliac
- **AortoIliacMeasurementSerializer** → extends arterial base with:
  - Detailed aneurysm diameters  
  - Plaque type (calcified vs soft)  
- **AortoIliacExamSerializer**  

### LE Venous
- **LEVenousMeasurementSerializer** → extends venous base with:
  - `refluxDuration` (if measured)  
  - `thrombusType` (acute vs chronic)  
- **LEVenousExamSerializer**  

### UE Venous
- **UEVenousMeasurementSerializer** → extends venous base with:
  - Catheter-related fields  
- **UEVenousExamSerializer**  

### IVC
- **IVCMeasurementSerializer** → venous base, simplified:
  - Patency only  
- **IVCExamSerializer**  

### Dialysis Access
- **HDAVenousMeasurementSerializer** → venous base with:
  - Anastomotic PSV/EDV  
  - Maturation status  
- **HDAExamSerializer**.  

---

## 🔹 Guidelines for Developers

- Add **universal fields** to the base arterial/venous serializer.  
- Add **exam-specific fields** only to the corresponding exam serializer.  
- Naming convention:
  - Base: `ArterialMeasurementSerializer`, `VenousMeasurementSerializer`  
  - Exam: `<ExamType>MeasurementSerializer`, `<ExamType>ExamSerializer`  
- Use `additional_data` for optional/site-specific fields.  
- Document all changes in this file (`serializers_doc.md`).  

---

## ✅ Summary
- **Arterial vs Venous split** keeps logic clean and clinically aligned.  
- **Exam-specific serializers** extend the correct base.  
- **additional_data** ensures future flexibility without migrations.  
- This structure supports scalable, maintainable serializers across all modalities.
