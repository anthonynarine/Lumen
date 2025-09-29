    🛠️ Developer Quickstart – Exam Forms in Lumen

    This guide explains how to add new vascular exam types (renal, ABI, IVC, etc.) or new fields to existing templates (e.g., carotid).
    The form system is JSON-driven, Formik-powered, and modular, so once you learn the pattern, you can extend it quickly and consistently.

    ✅ Checklist – Adding a New Exam Type

    Follow these 5 steps whenever you add a new exam:

    Create a JSON Template

    Copy carotid.json as a base.

    Define segments, supports* flags, units, and dropdowns.

    Example: renal.json.

    Add TypeScript Types

    Create examFormTypes.ts and examTemplateTypes.ts in src/exams/<exam>/types/.

    Mirror carotid’s types.

    Define the shape of Formik values and template metadata.

    Build the Form Component

    Create <Exam>ExamForm.tsx using Formik.

    Normalize the template with templateNormalizer.

    Render segments with SegmentTableFormik.

    Add the Page Wrapper

    Create <Exam>ExamPage.tsx under pages/.

    Load the JSON template → pass into ExamForm.

    Hook into routing/navigation.

    Wire Up Backend

    Add endpoints like /api/exams/renal/.

    Ensure serializers + normalization logic support the new exam.

    Test POST /exams/ round-trips with dummy payloads.

    📂 Folder Structure

    Every exam module follows the same structure:

    src/exams/<exam>/
    ├── forms/
    │    ├── <Exam>ExamForm.tsx        # Formik wrapper (main form)
    │    ├── SegmentTable.tsx          # Table wrapper
    │    ├── SegmentTableFormik.tsx    # Connects Formik → table
    │    ├── SegmentRow.tsx            # Renders one segment row
    │
    ├── pages/
    │    └── <Exam>ExamPage.tsx        # Page wrapper (routing)
    │
    ├── types/
    │    ├── <exam>ExamFormTypes.ts    # Formik state typing
    │    └── <exam>TemplateTypes.ts    # JSON template typing
    │
    ├── utils/
    │    └── templateNormalizer.ts     # Converts JSON maps → arrays
    │
    └── templates/
        └── <exam>.json               # Backend-driven template

    🚀 Quickstart – Add a New Exam
    1. Create JSON Template

    Example: renal.json

    {
    "id": "renal",
    "version": "1.0.0",
    "title": "Renal Duplex Protocol",
    "segments": [
        { "id": "renal_art_prox_right", "label": "Renal Artery Prox (Right)", "side": "right", "vessel": "renal", "position": "prox", "measurements": ["psv", "edv"], "supportsWaveform": true, "supportsStenosis": true },
        { "id": "renal_art_mid_right",  "label": "Renal Artery Mid (Right)",  "side": "right", "vessel": "renal", "position": "mid",  "measurements": ["psv", "edv"], "supportsWaveform": true },
        { "id": "renal_art_dist_right", "label": "Renal Artery Dist (Right)", "side": "right", "vessel": "renal", "position": "dist", "measurements": ["psv", "edv"], "supportsWaveform": true }
    ],
    "units": { "psv": "cm/s", "edv": "cm/s" },
    "dropdowns": {
        "stenosisPercent": ["0–59%","60–99%","Occluded","Not Visualized"],
        "waveformShape": ["Triphasic","Biphasic","Monophasic","Absent"]
    }
    }

    2. Define Types

    src/exams/renal/types/renalExamFormTypes.ts

    export interface RenalFormValues {
    metadata: {
        patientName: string;
        mrn: string;
        accessionNumber: string;
        examDate: string;
    };
    left: Record<string, any>;
    right: Record<string, any>;
    notes: string;
    }


    src/exams/renal/types/renalTemplateTypes.ts

    export interface RenalSegmentDefinition {
    id: string;
    label: string;
    side: "left" | "right";
    vessel: string;
    position?: string;
    measurements: string[];
    supportsWaveform?: boolean;
    supportsStenosis?: boolean;
    }

    3. Build Form Component

    src/exams/renal/forms/RenalExamForm.tsx

    import React from "react";
    import { Formik, Form } from "formik";
    import * as Yup from "yup";
    import { SegmentTableFormik } from "../../carotid/forms/SegmentTableFormik"; 
    import { templateNormalizer } from "../utils/templateNormalizer";
    import { RenalTemplate, RenalFormValues } from "../types";

    interface Props {
    template: RenalTemplate;
    user: { id: string; name: string };
    }

    export const RenalExamForm: React.FC<Props> = ({ template, user }) => {
    const norm = React.useMemo(() => templateNormalizer(template), [template]);

    const initialValues: RenalFormValues = {
        metadata: { patientName: "", mrn: "", accessionNumber: "", examDate: "" },
        left: {},
        right: {},
        notes: ""
    };

    const validationSchema = Yup.object({
        metadata: Yup.object({
        patientName: Yup.string().required(),
        mrn: Yup.string().required(),
        accessionNumber: Yup.string().required(),
        examDate: Yup.string().required()
        })
    });

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={console.log}>
        {() => (
            <Form className="space-y-6">
            <h2 className="text-xl font-bold">Right Kidney</h2>
            <SegmentTableFormik side="right" segments={norm.right} />

            <h2 className="text-xl font-bold mt-8">Left Kidney</h2>
            <SegmentTableFormik side="left" segments={norm.left} />

            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded shadow">
                Save Exam
            </button>
            </Form>
        )}
        </Formik>
    );
    };

    4. Add Page Wrapper

    src/exams/renal/pages/RenalExamPage.tsx

    import React from "react";
    import { RenalExamForm } from "../forms/RenalExamForm";
    import renalTemplate from "../templates/renal.json";

    export const RenalExamPage = () => {
    const user = { id: "123", name: "Technologist A" };

    return <RenalExamForm template={renalTemplate} user={user} />;
    };

    5. Wire Backend

    Add /api/exams/renal/ in Django backend.

    Ensure serializers map to correct JSON → DB fields.

    Test with Postman or curl:

    curl -X POST http://localhost:8000/api/exams/renal/ -d @sample_payload.json

    🛠️ Adding a New Field to Existing Exam

    Update JSON template (e.g., add "supportsStent": true).

    Add units or dropdowns if required.

    UI updates automatically → SegmentRow.tsx conditionally renders fields.

    🧰 Debugging Tips

    Field not showing? → Check SegmentDefinition typing.

    Dropdown wrong? → Update dropdowns in JSON.

    Formik confusion? → Add <Debug /> inside form to inspect state.

    🎯 Summary

    Exams are backend-driven (JSON templates define structure).

    Frontend auto-renders based on JSON + Formik.

    Adding new exams or fields requires minimal boilerplate.

    All exams share the same form architecture → consistent UI + API flow.

    ⚡ With this system, you can spin up a new duplex exam type in under an hour — just by editing JSON and reusing the existing form engine.