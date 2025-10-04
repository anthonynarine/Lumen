# 📄 Serializers in Lumen

## Overview
Serializers transform database models into JSON for the API and back.  
In Lumen, we now follow a **per-exam directory structure** with shared bases for arterial and venous workflows:

- **Universal serializer** → `ExamBaseSerializer`
- **Arterial base** → `ArterialMeasurementSerializer`
- **Venous base** → `VenousMeasurementSerializer`
- **Exam-specific directories** → Carotid, Renal, Mesenteric, Aorto-Iliac, Venous (LE, UE, IVC, HD Access)

---

## 🔹 Directory Structure

```
serializers/
  exam_base_serializer.py       # Universal exam metadata
  arterial_base.py              # Shared arterial fields
  venous_base.py                # Shared venous fields

  carotid/
    measurement_serializer.py   # CarotidMeasurementSerializer
    exam_serializer.py          # CarotidExamSerializer
    __init__.py

  renal/
    measurement_serializer.py   # RenalMeasurementSerializer
    exam_serializer.py          # RenalExamSerializer
    __init__.py

  mesenteric/
    measurement_serializer.py   # MesentericMeasurementSerializer
    exam_serializer.py
    __init__.py

  aortoiliac/
    measurement_serializer.py   # AortoIliacMeasurementSerializer
    exam_serializer.py
    __init__.py

  venous/
    le/
      measurement_serializer.py # LEVenousMeasurementSerializer
      exam_serializer.py
      __init__.py
    ue/
      measurement_serializer.py # UEVenousMeasurementSerializer
      exam_serializer.py
      __init__.py
    ivc/
      measurement_serializer.py # IVCMeasurementSerializer
      exam_serializer.py
      __init__.py
    hdaccess/
      measurement_serializer.py # HDAVenousMeasurementSerializer
      exam_serializer.py
      __init__.py
```

---

## 🔹 Base Serializers

### `ExamBaseSerializer`
- Universal patient + exam metadata shared across all exam types.

### `ArterialMeasurementSerializer`
- PSV, EDV, plaqueMorphology, aneurysm diameters (arteryDiameter, apTr, longitudinal), waveform, stenosis category, additional_data, calculated_fields.

### `VenousMeasurementSerializer`
- Compressibility, patency, reflux, additional_data, calculated_fields.

---

## 🔹 Exam-Specific Serializers

### Carotid
- **CarotidMeasurementSerializer** → adds ICA/CCA ratio + vertebral direction.  
- **CarotidExamSerializer** → wraps ExamBaseSerializer + carotid segments.

### Renal
- **RenalMeasurementSerializer** → adds RAR + RI.  
- **RenalExamSerializer**.

### Mesenteric
- **MesentericMeasurementSerializer** → adds SMA/celiac PSV + stenosis%.  
- **MesentericExamSerializer**.

### Aorto-Iliac
- **AortoIliacMeasurementSerializer** → adds aneurysm dimensions, calcified plaque flags.  
- **AortoIliacExamSerializer**.

### LE Venous
- **LEVenousMeasurementSerializer** → reflux duration, chronicity markers.  
- **LEVenousExamSerializer**.

### UE Venous
- **UEVenousMeasurementSerializer** → thoracic inlet/catheter fields.  
- **UEVenousExamSerializer**.

### IVC
- **IVCMeasurementSerializer** → patency only.  
- **IVCExamSerializer**.

### Dialysis Access
- **HDAVenousMeasurementSerializer** → anastomosis PSV/EDV, maturation status.  
- **HDAExamSerializer**.

---

## ✅ Guidelines for Developers

- Add **universal fields** to `ExamBaseSerializer`.  
- Add **arterial/venous shared fields** to `arterial_base.py` or `venous_base.py`.  
- Add **exam-specific fields** to that exam’s directory.  
- Always update this doc when adding or modifying serializers.
