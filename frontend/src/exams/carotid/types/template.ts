/**
 * Template-driven segment definition loaded from backend.
 * Used to render fields dynamically in forms.
 */
export interface SegmentDefinition {
    /** Unique segment key — e.g., 'prox_ica' */
    id: string;

    /** Human-readable label — e.g., 'Proximal ICA' */
    label: string;

    /** Artery name — e.g., ICA, CCA, ECA */
    artery: string;

    /** Laterality — matches the Formik `side` property */
    side: "right" | "left";
}
