export type ScoreInput = {
  feasibility: number;
  freeSlotFit: number;
  deadlineSafety: number;
  costEfficiency: number;
  energyFit: number;
  batchingBonus: number;
};

export function computeSchedulingScore(input: ScoreInput): number {
  return (
    input.feasibility * 40 +
    input.freeSlotFit * 25 +
    input.deadlineSafety * 15 +
    input.costEfficiency * 10 +
    input.energyFit * 5 +
    input.batchingBonus * 5
  );
}
