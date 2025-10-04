# ✅ Checklist: Adding a New Exam Serializer in Lumen

This checklist ensures consistency when adding a new exam type (e.g., Renal, Mesenteric, LE Venous).  
Follow these steps in order to keep the project clean and maintainable.

---

## 1. Create Folder
- Inside `reports/serializers/`, create a new directory:
  ```
  serializers/<exam_type>/
  ```

- Add the following files inside:
  - `measurement_serializer.py`
  - `exam_serializer.py`
  - `__init__.py`

---

## 2. Implement Serializers

### `measurement_serializer.py`
- Subclass from the appropriate base:
  - `ArterialMeasurementSerializer` for arterial exams
  - `VenousMeasurementSerializer` for venous exams
- Add exam-specific fields only.

### `exam_serializer.py`
- Subclass from `ExamBaseSerializer`.
- Add a `segments = SerializerMethodField()` that nests the exam’s measurement serializer.

### `__init__.py`
- Re-export serializers for clean imports:
  ```python
  from .measurement_serializer import <ExamType>MeasurementSerializer
  from .exam_serializer import <ExamType>ExamSerializer

  __all__ = [
      "<ExamType>MeasurementSerializer",
      "<ExamType>ExamSerializer",
  ]
  ```

---

## 3. Update Root Serializer Exports
- Open `reports/serializers/__init__.py`
- Add imports for the new exam serializers:
  ```python
  from .<exam_type> import <ExamType>ExamSerializer, <ExamType>MeasurementSerializer
  ```
- Append them to `__all__`.

---

## 4. Update Views
- Create or update a view module (e.g., `reports/views/<exam_type>_views.py`).
- Import the new exam serializer:
  ```python
  from reports.serializers.<exam_type> import <ExamType>ExamSerializer
  ```
- Use it for CRUD endpoints.

---

## 5. Update Docs
- Add new exam details to:
  - `serializers_doc.md`
  - `serializer_structure.md`

---

## 6. Write/Update Tests
- Add or update tests in `reports/tests/` for the new exam type.
- Confirm:
  - Exam creation works
  - Segments + measurements serialize correctly
  - Calculator + conclusion (if implemented) work with new serializer

---

## 7. Commit Changes
Example commit message:

```
feat(serializers): add <ExamType> serializers and views

- Added <ExamType>MeasurementSerializer extending appropriate base
- Added <ExamType>ExamSerializer with nested segments
- Updated serializers/__init__.py for exports
- Implemented <exam_type>_views with CRUD endpoints
- Updated documentation and tests
```

---

✅ Done! Your new exam type is fully integrated.
