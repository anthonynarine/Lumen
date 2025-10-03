# 📄 Serializer Architecture – Lumen

This document describes the structure and design philosophy behind the **serializer layer** in the Lumen project.  
The serializers are split into **arterial** and **venous** paths, each with a **base serializer** and **exam‑specific serializers**.

---

## 🔹 High-Level Layout

```
serializers/
│
├── exam_base_serializer.py          # ✅ Universal exam metadata
│
├── arterial_serializers/
│   ├── base_arterial_serializer.py  # ✅ Core arterial fields
│   ├── carotid_serializer.py        # Carotid-specific
│   ├── renal_serializer.py          # Renal-specific
│   ├── mesenteric_serializer.py     # SMA/Celiac-specific
│   └── aortoiliac_serializer.py     # Aorto-iliac-specific
│
└── venous_serializers/
    ├── base_venous_serializer.py    # ✅ Core venous fields
    ├── le_venous_serializer.py      # LE venous reflux
    ├── ue_venous_serializer.py      # UE venous
    ├── ivc_serializer.py            # IVC
    └── hda_serializer.py            # Hemodialysis access

---

## 🔹 Base Serializers

### `ExamBaseSerializer`
- Universal serializer for exam‑level metadata.  
- Fields: patient name, MRN, accession, DOB, gender, exam type, scope, CPT/ICD codes, created_by, status, history.  
- Shared across **arterial and venous** exams.

### `ArterialMeasurementSerializer`
- Core fields common to **all arterial exams**:
  - PSV / EDV  
  - Plaque morphology  
  - Artery diameters (diameter, AP/TR, longitudinal)  
  - Waveform  
  - Stenosis category  
  - Additional data, calculated fields  

### `VenousMeasurementSerializer`
- Core fields common to **all venous exams**:
  - Compressibility  
  - Patency  
  - Reflux (binary)  
  - Additional data, calculated fields  

---

## 🔹 Exam-Specific Serializers

Each exam type extends the appropriate base:

### Carotid
- **CarotidMeasurementSerializer** → adds ICA/CCA ratio + vertebral direction.  
- **CarotidExamSerializer** → wraps carotid exam with carotid segments + measurements.  

### Renal
- **RenalMeasurementSerializer** → adds RAR + RI.  
- **RenalExamSerializer** → renal exam segments.  

### Mesenteric
- **MesentericMeasurementSerializer** → SMA/CA PSV, stenosis %.  
- **MesentericExamSerializer**.  

### Venous (Lower Extremity)
- **LEVenousMeasurementSerializer** → reflux duration, acute vs chronic thrombus.  
- **LEVenousExamSerializer**.  

### Venous (Upper Extremity)
- **UEVenousMeasurementSerializer** → catheter‑related findings.  
- **UEVenousExamSerializer**.  

### IVC
- **IVCMeasurementSerializer** → patency only.  
- **IVCExamSerializer**.  

### Dialysis Access
- **HDAVenousMeasurementSerializer** → anastomotic PSV, maturation status.  
- **HDAExamSerializer**.  

---

## 🔹 Why This Structure?

- **Clean separation** → Arterial vs Venous follow different clinical paradigms.  
- **Extendable** → Each exam type extends the correct base, only adding what’s needed.  
- **Maintainable** → Easier to locate the right serializer for debugging or feature requests.  
- **Future-proof** → Adding new modalities (mesenteric, dialysis, grafts) requires only a new serializer file extending the correct base.  

---

## 🚀 Developer Guidelines

- Always add **universal fields** to the **base arterial/venous serializer**.  
- Add **exam-specific fields** to the respective exam serializer only.  
- Keep naming consistent:
  - Base: `ArterialMeasurementSerializer`, `VenousMeasurementSerializer`  
  - Exam: `<ExamType>MeasurementSerializer`, `<ExamType>ExamSerializer`  
- Document changes in this file (`serializers_doc.md`) when adding new exam types.
