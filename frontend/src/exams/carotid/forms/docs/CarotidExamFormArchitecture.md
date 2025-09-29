    🧾 Carotid Exam Form Architecture

    This document explains how the Carotid Exam Form is structured in Lumen, how data flows from the backend JSON template into the React form, and how Formik manages state for PSV/EDV/ratios, dropdowns, and checkboxes.

                    📐 High-Level Flow
    flowchart TD
        Backend["carotid.json template"] --> Normalizer["templateNormalizer()"]
        Normalizer --> CarotidExamForm["CarotidExamForm.tsx"]
        CarotidExamForm --> SegmentTableFormik["SegmentTableFormik (left/right)"]
        SegmentTableFormik --> SegmentTable["CarotidSegmentTable"]
        SegmentTable --> SegmentRow["SegmentRow (row per vessel)"]
        SegmentRow --> Formik["Formik state values"]
        Formik --> SegmentRow

⚙️ Components
1. CarotidExamForm.tsx

    CarotidExamForm

    Responsibilities

        Loads the backend-driven CarotidTemplate JSON.

        Normalizes the template into plain arrays (via templateNormalizer).

        Initializes Formik with metadata + left/right segment objects.

        Defines Yup validation schema for metadata.

        Wraps the form with Formik → passes values to SegmentTableFormik.

        Notable Features

        Keeps left/right sides separate.

        Handles technologist notes and save button at the bottom.

        On submit → currently logs payload, but will eventually POST /exams/.

        2. SegmentTableFormik.tsx

        SegmentTableFormik

        Bridge between Formik and UI.

        Accepts side="left" | "right" and the normalized segment definitions.

        Pulls only this side’s values from Formik (values.left or values.right).

        Passes down:

        side → “left” or “right”

        segments → array of definitions for that side

        values → only this side’s Formik object

        setFieldValue → so rows can update Formik paths like left.ica_prox.psv.

        3. CarotidSegmentTable.tsx

        SegmentTable

        Presentational component → renders the clinical table layout for one side.

        Applies clinical order so segments appear in a predictable workflow:

        Subclavian → CCA → Bifurcation → ICA → ECA → Vertebral → Temporal.

        Adds sticky headers for usability.

        Defines columns:

        Segment name

        PSV, EDV, ICA/CCA Ratio

        % Stenosis

        Plaque

        Waveform

        Direction

        Other findings

        Iterates over sorted segments → renders SegmentRow for each.

        4. SegmentRow.tsx

        SegmentRow

        Renders a single vessel segment row.

        Base path = ${side}.${id} (e.g., right.ica_prox).

        Handles:

        Numeric inputs → PSV, EDV, ICA/CCA ratio.

        Dropdowns → Stenosis %, Waveform, Direction, Disease Finding.

        Checkbox → Plaque present.

        Uses Formik <Field> for select/checkbox fields.

        Uses raw <input type="number"> for PSV/EDV with live updates via setFieldValue.

        Extensible

        Template-driven: if definition.supportsStenosis is true, stenosis dropdown appears.

        If template adds supportsStent or supportsDiameter, new inputs can render.


            🗄️ Data Sources

    carotid.json

    Defines segments, supported fields, dropdown options.

    Example: ICA segments support PSV, EDV, ICA/CCA ratio, stenosis, plaque, waveform.

    Shared dropdowns: stenosis categories, plaque morphology, waveforms, directions.

    dropdownOptions.ts

    Currently hardcoded in SegmentRow.

    TODO: Should be pulled from the template JSON (template.dropdowns) so UI is fully backend-driven.

    📦 Formik State Shape
    {
    metadata: {
        patientName: string,
        mrn: string,
        accessionNumber: string,
        dateOfBirth: string,
        examDate: string,
        referringMd: string,
        orderingMd: string,
        laterality: "bilateral" | "unilateral_right" | "unilateral_left" | "limited",
        icd10Codes: string[],
        cptCode: string
    },
    right: {
        ica_prox: { psv: 120, edv: 40, ica_cca_ratio: 2.5, stenosisPercent: "70–99%", plaquePresent: true }
        ...
    },
    left: { ... },
    notes: string
    }

            🎨 Design & Usability

    Tables are responsive with overflow-x-auto.

    Sticky headers help during long data entry.

    Dropdowns/checkboxes minimize typing and enforce structured inputs.

    Validation ensures metadata is complete before submission.

    Extensibility: new fields in JSON → auto-render without code changes.

    
        🚀 Next Improvements

    Dynamic Dropdowns
    Replace hardcoded arrays in SegmentRow.tsx with template.dropdowns.

    Design Polish

    Use Tailwind @theme tokens for Tron-style dark mode.

    Add conditional row highlighting (e.g., PSV > 230 → red background).

    Save Flow

    Hook up API call in onSubmit.

    Show success/error messages.

    Mobile UX
    Collapse into cards per segment instead of table on small screens.

        ✅ Summary:
    The Carotid Exam Form takes a backend-driven JSON template, normalizes it, and renders a Formik-powered, VascuPro-style worksheet with structured dropdowns, checkboxes, and numeric inputs. It’s modular, extensible, and designed for tech efficiency + physician-ready reporting.