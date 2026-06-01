export type Vibe = 'foodie' | 'culture' | 'aesthetic' | 'nature' | 'family';

export type TripInput = {
  city: string;
  vibe: Vibe;
  budget: number;
  hours: number;
  startTime: string;
};

export type TripStop = {
  time: string;
  title: string;
  kind: 'food' | 'culture' | 'photo' | 'nature' | 'rest' | 'shop';
  description: string;
  cost: number;
};

export type TripPlan = {
  id: string;
  title: string;
  subtitle: string;
  totalCost: number;
  stops: TripStop[];
  packingList: string[];
};

const templates: Record<Vibe, Array<Omit<TripStop, 'time'>>> = {
  foodie: [
    { title: 'Neighbourhood breakfast crawl', kind: 'food', description: 'Start with a local bakery, kopi bar, or market stall cluster.', cost: 14 },
    { title: 'Signature bite stop', kind: 'food', description: 'Pick one iconic dish and one backup spot nearby.', cost: 22 },
    { title: 'Golden-hour snack walk', kind: 'photo', description: 'Walk a scenic strip with dessert or street snacks in hand.', cost: 12 },
    { title: 'Low-key dinner anchor', kind: 'food', description: 'Reserve a casual place that locals actually revisit.', cost: 34 },
  ],
  culture: [
    { title: 'Small museum or heritage house', kind: 'culture', description: 'Choose a compact exhibit with a clear theme.', cost: 12 },
    { title: 'Old-street walking loop', kind: 'culture', description: 'Connect murals, architecture, and one historical marker.', cost: 0 },
    { title: 'Tea, coffee, or bookstore pause', kind: 'rest', description: 'A deliberate rest stop keeps the day from becoming homework.', cost: 10 },
    { title: 'Evening performance or gallery', kind: 'culture', description: 'End with something timed: music, gallery night, or talks.', cost: 12 },
  ],
  aesthetic: [
    { title: 'Design-led cafe', kind: 'food', description: 'Pick a bright cafe with good seating and a distinctive interior.', cost: 16 },
    { title: 'Photo walk route', kind: 'photo', description: 'Stack 3 nearby visual spots instead of chasing the whole city.', cost: 0 },
    { title: 'Independent shop browse', kind: 'shop', description: 'Look for stationery, ceramics, vintage, or local design.', cost: 15 },
    { title: 'Sunset viewpoint', kind: 'photo', description: 'Arrive 35 minutes before sunset for the best light.', cost: 0 },
  ],
  nature: [
    { title: 'Gentle trail or garden loop', kind: 'nature', description: 'Prioritize shade, water points, and an easy exit route.', cost: 0 },
    { title: 'Picnic supply stop', kind: 'food', description: 'Buy fruit, sparkling water, and a simple sandwich.', cost: 14 },
    { title: 'Viewpoint reset', kind: 'nature', description: 'One scenic pause without rushing to the next attraction.', cost: 0 },
    { title: 'Recovery meal', kind: 'food', description: 'End near transit with a reliable casual restaurant.', cost: 24 },
  ],
  family: [
    { title: 'Easy breakfast landing', kind: 'food', description: 'Start somewhere with toilets, seats, and low waiting time.', cost: 18 },
    { title: 'Hands-on activity', kind: 'culture', description: 'Pick a museum corner, craft session, aquarium, or playground.', cost: 20 },
    { title: 'Snack and decompression break', kind: 'rest', description: 'Protect the mood with an intentional low-stimulation pause.', cost: 10 },
    { title: 'Treat stop before home', kind: 'food', description: 'A small reward makes the day feel complete.', cost: 12 },
  ],
};

const leanAlternatives: Array<Omit<TripStop, 'time'>> = [
  { title: 'Free landmark walk', kind: 'culture', description: 'Use a compact self-guided route around one neighbourhood.', cost: 0 },
  { title: 'Budget snack stop', kind: 'food', description: 'Choose a market, bakery, or supermarket picnic option.', cost: 7 },
  { title: 'Public garden reset', kind: 'nature', description: 'Add a free green-space pause to keep the day relaxed.', cost: 0 },
  { title: 'Golden-hour photo loop', kind: 'photo', description: 'Use natural light and one scenic street instead of paid attractions.', cost: 0 },
];

export function estimateTripCost(stops: Array<Pick<TripStop, 'cost'>>): number {
  return stops.reduce((total, stop) => total + stop.cost, 0);
}

export function suggestTripTheme(text: string): Vibe {
  const value = text.toLowerCase();
  if (/coffee|photo|design|cute|aesthetic/.test(value)) return 'aesthetic';
  if (/museum|history|gallery|temple|culture/.test(value)) return 'culture';
  if (/kid|child|family|playground/.test(value)) return 'family';
  if (/park|trail|garden|nature/.test(value)) return 'nature';
  return 'foodie';
}

function addMinutes(time: string, minutes: number): string {
  const [hour, minute] = time.split(':').map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function fitBudget(stops: Array<Omit<TripStop, 'time'>>, budget: number): Array<Omit<TripStop, 'time'>> {
  const fitted = [...stops];
  let index = fitted.length - 1;
  while (estimateTripCost(fitted) > budget && index >= 0) {
    const alternative = leanAlternatives[index % leanAlternatives.length];
    if (alternative.cost < fitted[index].cost) fitted[index] = alternative;
    index -= 1;
  }
  return fitted;
}

export function createTripPlan(input: TripInput): TripPlan {
  const hours = Math.max(3, Math.min(12, input.hours));
  const stopCount = Math.max(3, Math.min(5, Math.round(hours / 1.5)));
  const baseStops = templates[input.vibe].slice(0, stopCount);
  const fitted = fitBudget(baseStops, input.budget);
  const gap = Math.max(60, Math.floor((hours * 60) / fitted.length));
  const stops = fitted.map((stop, index) => ({ ...stop, time: addMinutes(input.startTime, index * gap) }));
  const totalCost = estimateTripCost(stops);
  const city = input.city.trim() || 'Your city';

  return {
    id: `${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
    title: `${city} ${input.vibe} tiny trip`,
    subtitle: `${hours} hours · about $${totalCost} · ${stops.length} stops`,
    totalCost,
    stops,
    packingList: ['portable charger', 'water bottle', 'comfortable shoes', input.vibe === 'nature' ? 'sun protection' : 'light jacket'],
  };
}
