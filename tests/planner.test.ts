import { describe, expect, it } from 'vitest';
import { createTripPlan, estimateTripCost, suggestTripTheme } from '../src/planner';

describe('planner', () => {
  it('creates a realistic half-day itinerary from city, vibe, budget and hours', () => {
    const plan = createTripPlan({ city: 'Singapore', vibe: 'foodie', budget: 120, hours: 6, startTime: '10:00' });

    expect(plan.title).toContain('Singapore');
    expect(plan.stops).toHaveLength(4);
    expect(plan.stops[0].time).toBe('10:00');
    expect(plan.stops.some((stop) => stop.kind === 'food')).toBe(true);
    expect(plan.totalCost).toBeLessThanOrEqual(120);
    expect(plan.packingList).toContain('portable charger');
  });

  it('keeps plans under budget by switching to leaner activities', () => {
    const plan = createTripPlan({ city: 'Tokyo', vibe: 'culture', budget: 35, hours: 5, startTime: '09:30' });

    expect(plan.totalCost).toBeLessThanOrEqual(35);
    expect(plan.stops.every((stop) => stop.cost <= 15)).toBe(true);
  });

  it('estimates trip cost from selected stops', () => {
    expect(estimateTripCost([{ cost: 12 }, { cost: 8 }, { cost: 25 }])).toBe(45);
  });

  it('suggests a default theme from user inputs', () => {
    expect(suggestTripTheme('coffee photos')).toBe('aesthetic');
    expect(suggestTripTheme('museum history')).toBe('culture');
  });
});
