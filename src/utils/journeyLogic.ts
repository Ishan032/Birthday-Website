export interface TiltResult {
  rotateX: number;
  rotateY: number;
  parallaxX: number;
  parallaxY: number;
}

export interface HeartSwirlState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  opacity: number;
}

export const TOTAL_STEPS = 5;

export function clampStep(step: number): number {
  if (!Number.isFinite(step)) return 1;
  return Math.max(1, Math.min(TOTAL_STEPS, Math.round(step)));
}

export function getNextStep(currentStep: number): number {
  return clampStep(currentStep + 1);
}

export function getProgressPercent(currentStep: number): number {
  const clamped = clampStep(currentStep);
  return Math.round((clamped / TOTAL_STEPS) * 100);
}

export function computePolaroidTilt(
  normX: number,
  normY: number,
  maxTiltDeg = 12,
  maxParallaxPx = 8,
): TiltResult {
  const cx = Math.max(-1, Math.min(1, normX));
  const cy = Math.max(-1, Math.min(1, normY));
  return {
    rotateX: Number((-cy * maxTiltDeg).toFixed(3)),
    rotateY: Number((cx * maxTiltDeg).toFixed(3)),
    parallaxX: Number((cx * maxParallaxPx).toFixed(3)),
    parallaxY: Number((cy * maxParallaxPx).toFixed(3)),
  };
}

export function stepHeartFinale(
  state: HeartSwirlState,
  dt: number,
  swirlSpeed = 2.6,
  radialExpand = 4.6,
  riseAccel = 6.5,
  fadeRate = 0.42,
): HeartSwirlState {
  const safeDt = Math.max(0, Math.min(dt, 0.16));
  const nextAngle = state.angle + swirlSpeed * safeDt;
  const nextRadius = state.radius + radialExpand * safeDt;
  const nextVy = state.vy + riseAccel * safeDt;
  const nextY = state.y + nextVy * safeDt;
  const nextOpacity = Math.max(0, state.opacity - fadeRate * safeDt);

  return {
    x: Math.cos(nextAngle) * nextRadius,
    y: nextY,
    z: state.z + Math.sin(nextAngle) * radialExpand * 0.4 * safeDt,
    vx: Math.cos(nextAngle) * radialExpand,
    vy: nextVy,
    angle: nextAngle,
    radius: nextRadius,
    opacity: nextOpacity,
  };
}
