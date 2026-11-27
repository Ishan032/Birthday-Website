import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TOTAL_STEPS,
  clampStep,
  getNextStep,
  getProgressPercent,
  computePolaroidTilt,
  stepHeartFinale,
} from './journeyLogic';

test('step navigation clamps and increments through all 5 steps', () => {
  assert.equal(TOTAL_STEPS, 5);
  assert.equal(clampStep(0), 1);
  assert.equal(clampStep(7), 5);
  assert.equal(getNextStep(1), 2);
  assert.equal(getNextStep(4), 5);
  assert.equal(getNextStep(5), 5);
});

test('progress bar percentage scales linearly from 20% to 100%', () => {
  assert.equal(getProgressPercent(1), 20);
  assert.equal(getProgressPercent(2), 40);
  assert.equal(getProgressPercent(3), 60);
  assert.equal(getProgressPercent(4), 80);
  assert.equal(getProgressPercent(5), 100);
});

test('polaroid 3D tilt and parallax clamp within bounds', () => {
  const center = computePolaroidTilt(0, 0);
  assert.equal(center.rotateX, 0);
  assert.equal(center.rotateY, 0);

  const corner = computePolaroidTilt(2, -2, 12, 8);
  assert.equal(corner.rotateX, 12);
  assert.equal(corner.rotateY, 12);
  assert.equal(corner.parallaxX, 8);
  assert.equal(corner.parallaxY, -8);
});

test('finale heart swirl expands outward, rises upward, and fades out', () => {
  let state = {
    x: 1,
    y: 0,
    z: -2,
    vx: 0,
    vy: 0.5,
    angle: 0,
    radius: 1,
    opacity: 0.92,
  };

  for (let i = 0; i < 40; i++) {
    state = stepHeartFinale(state, 0.1);
  }

  assert.ok(state.radius > 10, 'heart should spiral outward');
  assert.ok(state.y > 10, 'heart should float up off screen');
  assert.equal(state.opacity, 0, 'heart should fade away completely');
});
