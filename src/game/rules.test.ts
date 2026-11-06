import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStackOverlap,
  calculateBuilderScore,
  checkCatchCollision,
  calculateRushScore
} from './rules.ts';

test('Waffle Stack: perfect alignment within tolerance snaps and preserves width', () => {
  const result = calculateStackOverlap(102, 100, 200, 4);
  assert.equal(result.isPerfect, true);
  assert.equal(result.isMiss, false);
  assert.equal(result.newWidth, 200);
  assert.equal(result.newX, 100);
  assert.equal(result.cutWidth, 0);
});

test('Waffle Stack: overhang to the right cuts off excess layer', () => {
  const result = calculateStackOverlap(150, 100, 200, 4);
  assert.equal(result.isPerfect, false);
  assert.equal(result.isMiss, false);
  assert.equal(result.newWidth, 150);
  assert.equal(result.cutWidth, 50);
  assert.equal(result.cutSide, 'right');
});

test('Waffle Stack: overhang to the left cuts off excess layer', () => {
  const result = calculateStackOverlap(80, 100, 200, 4);
  assert.equal(result.isPerfect, false);
  assert.equal(result.isMiss, false);
  assert.equal(result.newWidth, 180);
  assert.equal(result.cutWidth, 20);
  assert.equal(result.cutSide, 'left');
});

test('Waffle Stack: total miss triggers collapse', () => {
  const result = calculateStackOverlap(400, 100, 200, 4);
  assert.equal(result.isMiss, true);
  assert.equal(result.newWidth, 0);
});

test('Waffle Builder: calculates creative score and challenge bonus', () => {
  const toppings = ['strawberry', 'butter', 'syrup', 'choco', 'strawberry'];
  const reqs = ['strawberry', 'butter', 'syrup'];
  const result = calculateBuilderScore(toppings, reqs);

  // 4 distinct toppings: strawberry, butter, syrup, choco -> 4 * 150 = 600
  // 5 total items -> 5 * 40 = 200
  // challenge met -> +300
  // total = 1100
  assert.equal(result.distinct, 4);
  assert.equal(result.challengeMet, true);
  assert.equal(result.score, 1100);
});

test('Syrup Catch: detects plate collision with margin', () => {
  // Plate at X: 100, W: 88, Y: 460, H: 20
  const hit = checkCatchCollision(120, 465, 10, 100, 88, 460, 20);
  assert.equal(hit, true);

  const miss = checkCatchCollision(300, 465, 10, 100, 88, 460, 20);
  assert.equal(miss, false);
});

test('Rush Order: computes 100% accuracy and tips multiplier', () => {
  const result = calculateRushScore(5, 5, 18.50);
  assert.equal(result.accuracy, 100);
  // 18.50 * 50 + 100 * 5 = 925 + 500 = 1425
  assert.equal(result.totalScore, 1425);
});
