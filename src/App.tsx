import { useMemo, useState } from 'react';
import { createTripPlan, suggestTripTheme, type TripPlan, type Vibe } from './planner';
import './styles.css';

const vibes: Vibe[] = ['foodie', 'culture', 'aesthetic', 'nature', 'family'];

function useSavedTrips() {
  const [saved, setSaved] = useState<TripPlan[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tinytrip.saved') || '[]');
    } catch {
      return [];
    }
  });

  function save(plan: TripPlan) {
    const next = [plan, ...saved].slice(0, 6);
    setSaved(next);
    localStorage.setItem('tinytrip.saved', JSON.stringify(next));
  }

  return { saved, save };
}

export default function App() {
  const [city, setCity] = useState('Singapore');
  const [vibe, setVibe] = useState<Vibe>('foodie');
  const [budget, setBudget] = useState(100);
  const [hours, setHours] = useState(6);
  const [startTime, setStartTime] = useState('10:00');
  const [freeText, setFreeText] = useState('coffee photos');
  const [plan, setPlan] = useState<TripPlan>(() =>
    createTripPlan({ city: 'Singapore', vibe: 'foodie', budget: 100, hours: 6, startTime: '10:00' }),
  );
  const { saved, save } = useSavedTrips();

  const suggested = useMemo(() => suggestTripTheme(freeText), [freeText]);

  function generate() {
    setPlan(createTripPlan({ city, vibe, budget, hours, startTime }));
  }

  function applySuggestion() {
    setVibe(suggested);
  }

  return (
    <main>
      <header className="hero">
        <nav className="topbar">
          <div className="brand"><span>✦</span> TinyTrip Studio</div>
          <a href="https://github.com/00anon0X/tinytrip-studio">GitHub</a>
        </nav>
        <section className="hero-grid">
          <div>
            <p className="eyebrow">Consumer weekend planner</p>
            <h1>Plan a tiny trip people actually want to take.</h1>
            <p className="lede">
              Turn a city, vibe, budget, and free afternoon into a compact itinerary with costs,
              pacing, packing reminders, and saveable plans. No account. No API key. Just a better Saturday.
            </p>
            <div className="hero-actions">
              <a className="primary" href="#planner">Plan now</a>
              <span className="pill">Local-first · mobile-friendly · open source</span>
            </div>
          </div>
          <div className="preview-card" aria-label="Example tiny trip preview">
            <div className="photo-gradient" />
            <strong>Golden-hour snack walk</strong>
            <span>Singapore · foodie · $82 estimate</span>
          </div>
        </section>
      </header>

      <section id="planner" className="planner-shell">
        <form className="control-card" onSubmit={(event) => { event.preventDefault(); generate(); }}>
          <div className="form-row">
            <label htmlFor="city">City</label>
            <input id="city" value={city} onChange={(event) => setCity(event.target.value)} />
          </div>
          <div className="form-row">
            <label htmlFor="vibe">Vibe</label>
            <select id="vibe" value={vibe} onChange={(event) => setVibe(event.target.value as Vibe)}>
              {vibes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="form-split">
            <div className="form-row">
              <label htmlFor="budget">Budget</label>
              <input id="budget" type="number" min="20" value={budget} onChange={(event) => setBudget(Number(event.target.value))} />
            </div>
            <div className="form-row">
              <label htmlFor="hours">Hours</label>
              <input id="hours" type="number" min="3" max="12" value={hours} onChange={(event) => setHours(Number(event.target.value))} />
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="start">Start time</label>
            <input id="start" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
          </div>
          <div className="form-row suggest-row">
            <label htmlFor="freeText">Describe your mood</label>
            <input id="freeText" value={freeText} onChange={(event) => setFreeText(event.target.value)} />
            <button type="button" className="ghost" onClick={applySuggestion}>Use “{suggested}”</button>
          </div>
          <button className="generate" type="submit">Generate trip</button>
        </form>

        <article className="itinerary-card">
          <div className="itinerary-head">
            <div>
              <p className="eyebrow">Your tiny itinerary</p>
              <h2>{plan.title}</h2>
              <p>{plan.subtitle}</p>
            </div>
            <button className="save" type="button" onClick={() => save(plan)}>Save this trip</button>
          </div>
          <div className="timeline">
            {plan.stops.map((stop) => (
              <div className="stop" data-testid="trip-stop" key={`${stop.time}-${stop.title}`}>
                <span className="time">{stop.time}</span>
                <div>
                  <strong>{stop.title}</strong>
                  <p>{stop.description}</p>
                  <small>{stop.kind} · ${stop.cost}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="packing">
            <strong>Packing list</strong>
            <div>{plan.packingList.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
        </article>
      </section>

      <section className="saved-panel">
        <div>
          <p className="eyebrow">Saved trips</p>
          <h2>{saved.length} saved</h2>
        </div>
        <div className="saved-grid">
          {saved.length === 0 ? <p>No saved trips yet. Generate one above.</p> : saved.map((trip) => (
            <div className="saved-card" key={trip.id}>
              <strong>{trip.title}</strong>
              <span>{trip.subtitle}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
