import type { Edge } from 'reactflow';
import type { ViewSettings } from '@/store/types';

const PROFILE_THRESHOLDS: Record<ViewSettings['largeGraphSafetyProfile'], {
  nodeThreshold: number;
  lowDetailZoomThreshold: number;
  farZoomReductionThreshold: number;
  interactionCooldownMs: number;
}> = {
  performance: {
    nodeThreshold: 100,
    lowDetailZoomThreshold: 0.6,
    farZoomReductionThreshold: 0.5,
    interactionCooldownMs: 240,
  },
  balanced: {
    nodeThreshold: 300,
    lowDetailZoomThreshold: 0.5,
    farZoomReductionThreshold: 0.4,
    interactionCooldownMs: 180,
  },
  quality: {
    nodeThreshold: 500,
    lowDetailZoomThreshold: 0.42,
    farZoomReductionThreshold: 0.34,
    interactionCooldownMs: 130,
  },
};

export function isLargeGraphSafetyActive(
  nodeCount: number,
  _edgeCount: number,
  mode: ViewSettings['largeGraphSafetyMode'],
  profile: ViewSettings['largeGraphSafetyProfile'] = 'balanced'
): boolean {
  if (mode === 'on') return true;
  if (mode === 'off') return false;
  return nodeCount >= PROFILE_THRESHOLDS[profile].nodeThreshold;
}

export function getSafetyAdjustedEdges(edges: Edge[], safetyActive: boolean): Edge[] {
  if (!safetyActive) return edges;

  let changed = false;
  const adjusted = edges.map((edge) => {
    if (!edge.animated) return edge;
    changed = true;
    return { ...edge, animated: false };
  });

  return changed ? adjusted : edges;
}

export function shouldEnableViewportCulling(safetyActive: boolean): boolean {
  return safetyActive;
}

export function isLowDetailModeActive(safetyActive: boolean, zoom: number): boolean {
  return isLowDetailModeActiveForProfile(safetyActive, zoom, 'balanced');
}

export function isLowDetailModeActiveForProfile(
  safetyActive: boolean,
  zoom: number,
  profile: ViewSettings['largeGraphSafetyProfile']
): boolean {
  if (!safetyActive) return false;
  return zoom <= PROFILE_THRESHOLDS[profile].lowDetailZoomThreshold;
}

export function isInteractionLowDetailModeActive(
  safetyActive: boolean,
  isInteracting: boolean
): boolean {
  if (!safetyActive) return false;
  return isInteracting;
}

export function isFarZoomReductionActive(safetyActive: boolean, zoom: number): boolean {
  return isFarZoomReductionActiveForProfile(safetyActive, zoom, 'balanced');
}

export function isFarZoomReductionActiveForProfile(
  safetyActive: boolean,
  zoom: number,
  profile: ViewSettings['largeGraphSafetyProfile']
): boolean {
  if (!safetyActive) return false;
  return zoom <= PROFILE_THRESHOLDS[profile].farZoomReductionThreshold;
}

export function getInteractionLodCooldownMs(
  profile: ViewSettings['largeGraphSafetyProfile']
): number {
  return PROFILE_THRESHOLDS[profile].interactionCooldownMs;
}
