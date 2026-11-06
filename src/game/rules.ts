/**
 * Core game calculation logic and rules for Just Wafflin' Fun Zone.
 */

export interface StackOverlapResult {
  isMiss: boolean;
  isPerfect: boolean;
  newWidth: number;
  newX: number;
  cutWidth: number;
  cutSide: 'none' | 'left' | 'right';
}

export function calculateStackOverlap(
  currentX: number,
  prevX: number,
  currentWidth: number,
  tolerance: number = 4
): StackOverlapResult {
  const diff = currentX - prevX;

  if (Math.abs(diff) <= tolerance) {
    return {
      isMiss: false,
      isPerfect: true,
      newWidth: currentWidth,
      newX: prevX,
      cutWidth: 0,
      cutSide: 'none'
    };
  }

  if (diff > 0) {
    // Overhang to the right
    const overlap = currentWidth - diff;
    if (overlap <= 0) {
      return { isMiss: true, isPerfect: false, newWidth: 0, newX: currentX, cutWidth: currentWidth, cutSide: 'right' };
    }
    return {
      isMiss: false,
      isPerfect: false,
      newWidth: overlap,
      newX: currentX,
      cutWidth: diff,
      cutSide: 'right'
    };
  } else {
    // Overhang to the left
    const overlap = currentWidth + diff;
    if (overlap <= 0) {
      return { isMiss: true, isPerfect: false, newWidth: 0, newX: currentX, cutWidth: currentWidth, cutSide: 'left' };
    }
    return {
      isMiss: false,
      isPerfect: false,
      newWidth: overlap,
      newX: prevX,
      cutWidth: -diff,
      cutSide: 'left'
    };
  }
}

export function calculateBuilderScore(
  toppings: string[],
  challengeReqs: string[] = []
): { score: number; distinct: number; challengeMet: boolean } {
  if (toppings.length === 0) return { score: 0, distinct: 0, challengeMet: false };

  const distinct = new Set(toppings).size;
  const challengeMet = challengeReqs.length > 0 && challengeReqs.every(req => toppings.includes(req));

  let score = distinct * 150 + toppings.length * 40;
  if (challengeMet) score += 300;

  return { score, distinct, challengeMet };
}

export function checkCatchCollision(
  itemX: number,
  itemY: number,
  itemRadius: number,
  plateX: number,
  plateWidth: number,
  plateY: number,
  plateHeight: number
): boolean {
  return (
    itemY + itemRadius >= plateY &&
    itemY - itemRadius <= plateY + plateHeight &&
    itemX >= plateX - 10 &&
    itemX <= plateX + plateWidth + 10
  );
}

export function calculateRushScore(
  correctCount: number,
  totalOrders: number,
  tipsEarned: number
): { accuracy: number; totalScore: number } {
  const accuracy = totalOrders > 0 ? Math.round((correctCount / totalOrders) * 100) : 0;
  const totalScore = Math.round(tipsEarned * 50 + accuracy * 5);
  return { accuracy, totalScore };
}
