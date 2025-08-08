// src/exams/carotid/dropdownOptions.ts

export const STENOSIS_OPTIONS = [
    "Normal",
    "0–19%",
    "20–39%",
    "40–59%",
    "60–79%",
    "80–99%",
    "Occluded",
    "String Sign",
    "Not Visualized",
    "Not Evaluated",
    "Patent",
    ] as const;

export const WAVEFORM_OPTIONS = [
    "Triphasic",
    "Biphasic",
    "Monophasic",
    ] as const;

export const DIRECTION_OPTIONS = [
    "Antegrade",
    "Retrograde",
    "Bidirectional",
    ] as const;
    

export const PLAQUE_MORPHOLOGY_OPTIONS = [
    "Homogeneous",
    "Heterogeneous",
    "Calcified",
    ] as const;

