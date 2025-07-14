/**
 * Utility to calculate ICA/CCA ratio and stenosis category for carotid exams.
 * Mirrors backend logic for classifying ICA stenosis using PSV, EDV, and ICA/CCA ratio.
 * 
 * This is based on Mount Sinai vascular lab velocity criteria.
 */

export type Segment = {
  psv?: number;
  edv?: number;
  ica_cca_ratio?: number;
};

export type SegmentValues = {
  [segmentId: string]: Segment;
};

export type CarotidValues = {
  right: SegmentValues;
  left: SegmentValues;
};

export type StenosisResult = {
  percent?: string;
  notes?: string;
  icaCcaRatio?: number;
};

export type CalcResult = {
  stenosisRight: StenosisResult;
  stenosisLeft: StenosisResult;
};

// ✅ Used across UI, PDF, HL7, etc.
export type CarotidCalculations = CalcResult;

/**
 * Computes stenosis classification and ICA/CCA ratios from raw PSV/EDV data.
 *
 * @param values - Measurement data for left/right ICA + CCA
 * @returns Classification result per side with ratio and notes
 */
export const calculateCarotidStenosis = (values: CarotidValues): CalcResult => {
  const thresholds = {
    "0_19": { psv_max: 124 },
    "20_39": { psv_min: 125, psv_max: 154 },
    "40_59": { psv_min: 155, psv_max: 184 },
    "60_79": { psv_min: 185, psv_max: 239, edv_max: 100 },
    "80_99": { psv_min: 240, edv_min: 135 },
    upgrade_if_ratio_gt: 4.0,
  };

  const classifyStenosis = (segment: Segment): StenosisResult => {
    const { psv, edv, ica_cca_ratio } = segment;
    const result: StenosisResult = {};

    if (psv === undefined) {
      result.notes = "No PSV available for classification.";
      return result;
    }

    if (psv <= thresholds["0_19"].psv_max) {
      result.percent = "0–19%";
    } else if (psv >= thresholds["20_39"].psv_min && psv <= thresholds["20_39"].psv_max) {
      result.percent = "20–39%";
    } else if (psv >= thresholds["40_59"].psv_min && psv <= thresholds["40_59"].psv_max) {
      result.percent = "40–59%";
    } else if (psv >= thresholds["60_79"].psv_min && psv <= thresholds["60_79"].psv_max) {
      if (edv !== undefined && edv <= thresholds["60_79"].edv_max) {
        if (ica_cca_ratio !== undefined && ica_cca_ratio > thresholds.upgrade_if_ratio_gt) {
          result.percent = "≥70% (ICA/CCA > 4)";
          result.notes = "Ratio > 4.0 suggests upgrade to ≥70% stenosis.";
        } else {
          result.percent = "60–79%";
        }
      } else {
        result.percent = "Uncertain (60–79%)";
        result.notes = "Missing or high EDV prevents firm classification.";
      }
    } else if (psv >= thresholds["80_99"].psv_min) {
      if (edv !== undefined && edv >= thresholds["80_99"].edv_min) {
        result.percent = "80–99%";
      } else {
        result.percent = "Uncertain (PSV > 240)";
        result.notes = "PSV suggests high-grade, but EDV does not meet confirmation threshold.";
      }
    }

    return result;
  };

  const computeRatio = (icaPsv?: number, ccaPsv?: number): number | undefined => {
    if (!icaPsv || !ccaPsv || ccaPsv === 0) return undefined;
    return parseFloat((icaPsv / ccaPsv).toFixed(2));
  };

  const icaRight = values.right?.prox_ica?.psv;
  const ccaRight = values.right?.prox_cca?.psv;
  const ratioRight = computeRatio(icaRight, ccaRight);

  const icaLeft = values.left?.prox_ica?.psv;
  const ccaLeft = values.left?.prox_cca?.psv;
  const ratioLeft = computeRatio(icaLeft, ccaLeft);

  const rightSegment: Segment = {
    ...values.right?.prox_ica,
    ica_cca_ratio: ratioRight,
  };

  const leftSegment: Segment = {
    ...values.left?.prox_ica,
    ica_cca_ratio: ratioLeft,
  };

  return {
    stenosisRight: {
      ...classifyStenosis(rightSegment),
      icaCcaRatio: ratioRight,
    },
    stenosisLeft: {
      ...classifyStenosis(leftSegment),
      icaCcaRatio: ratioLeft,
    },
  };
};
