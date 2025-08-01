// js/risk-weights.js

export const RISK_WEIGHTS = {
  checklist: {
    moldVisible: 5,
    leakingPipes: 5,
    noVentilation: 5,
    pestDroppings: 5,
    electrical: 5,
    tripHazards: 5,
    leadPaint: 5,
    noSmokeAlarm: 5,
    noCOAlarm: 5,
    poorLighting: 5,
    coldDrafts: 5,
    overheating: 5,
    asbestos: 5,
    clutter: 5,
    noHotWater: 5,
    unsafeStairs: 5,
    waterHazards: 5,
    structuralDamage: 5,
    otherHazards: 5,
    windowSafety: 5,
    unstoredChemicals: 5,
    radonRisk: 5,
    fireEscape: 5,
    flammableStorage: 5,
    indoorPollution: 5,
    petDander: 5,
    fallPrevention: 5
  },
  sdoh: {
    foodInsecurity:       { opt1: 10, opt2: 5, opt3: 0 },
    housingStabilityAffordability: { opt1: 10, opt2: 5, opt3: 0 },
    housingQualityMaintenance:     { opt1: 10, opt2: 5, opt3: 0 },
    utilityTransportBarriers:      { opt1: 10, opt2: 5, opt3: 0 },
    financialStrain:     { opt1: 10, opt2: 5, opt3: 0 },
    employmentStatus:    { opt1: 10, opt2: 5, opt3: 0 },
    socialConnection:    { opt1: 10, opt2: 5, opt3: 0 },
    educationLevel:      { opt1: 10, opt2: 5, opt3: 0 },
    healthcareAccess:    { opt1: 10, opt2: 5, opt3: 0 },
    neighborhoodSafety:  { opt1: 10, opt2: 5, opt3: 0 },
    languageBarrier:     { opt1: 10, opt2: 5, opt3: 0 }
  }
};
