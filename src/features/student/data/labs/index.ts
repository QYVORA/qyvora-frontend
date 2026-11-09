export {
  LAB_CATALOGUE,
  LAB_MODULE_MATRIX,
  getLabsForModule,
  getLabCoverage,
} from './lab-module-matrix';
export type {
  LabCatalogueEntry,
  LabModuleEntry,
  LabTrack,
  LabDiscipline,
  LabStatus,
  ModuleCoverage,
} from './lab-module-matrix';

export {
  UNIFIED_LABS,
  CONTENT_LABS,
  PRACTICAL_LABS,
  LAB_FORMAT_LABELS,
  LAB_FORMAT_SHORT_LABELS,
  getUnifiedLabById,
  getRecommendedLabs,
  getNewLabs,
  getLabsByFormat,
} from './unified';
export type { UnifiedLab, LabFormat } from './unified';
