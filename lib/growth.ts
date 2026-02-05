type GrowthInputs = {
  plantHealth: number;   // 0-100
  humidity: number;      // 0-100
  temperature: number;   // °C
  wind: number;          // km/h
  rain: number;          // mm (p.sh. 0-10)
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Score 0..100 me maksimum në "target" dhe bie gradualisht kur largohet.
 * spread = sa tolerant është (sa më i madh spread, aq më pak penalizon).
 */
function bellScore(value: number, target: number, spread: number) {
  const z = (value - target) / spread;
  // Gaussian-like: e^(-z^2) -> 1 në target, bie simetrikisht
  return clamp(Math.exp(-(z * z)) * 100, 0, 100);
}

/** 0..100 (i kombinuar) */
export function calcGrowthRateScore(i: GrowthInputs) {
  // Targets të arsyeshme (mund t'i tunosh më vonë sipas kulturës)
  const tempScore = bellScore(i.temperature, 24, 6);     // optimum rreth 24°C
  const humScore  = bellScore(i.humidity, 65, 15);       // optimum rreth 65%
  const rainScore = bellScore(i.rain, 1.2, 2.0);         // pak shi/ujitje e lehtë
  const windPenalty = clamp((i.wind - 12) * 2.0, 0, 25); // mbi 12 km/h penalizon (max 25)

  // Pesha (shuma 1.0)
  const wHealth = 0.45;
  const wTemp   = 0.20;
  const wHum    = 0.20;
  const wRain   = 0.15;

  const base =
    i.plantHealth * wHealth +
    tempScore * wTemp +
    humScore * wHum +
    rainScore * wRain;

  const final = clamp(base - windPenalty, 0, 100);

  return Math.round(final);
}

function hashToUnit(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // 0..1
}

function fract(n: number) {
  return n - Math.floor(n);
}

/** kthen 7 pika 0..100 rreth baseScore */
export function buildWeeklyGrowthSeries(baseScore: number, seedKey: string) {
  const seed01 = hashToUnit(seedKey);
  const out: { day: string; growth: number }[] = [];
  let x = seed01;

  const labels = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];

  for (let idx = 0; idx < 7; idx++) {
    x = fract(x * 9301 + 49297 + idx * 233);
    const noise = (x - 0.5) * 14;        // +/- 7
    const trend = (idx - 3) * 1.2;       // trend i lehtë
    const v = clamp(baseScore + noise + trend, 0, 100);

    out.push({ day: labels[idx], growth: Math.round(v) });
  }
  return out;
}
