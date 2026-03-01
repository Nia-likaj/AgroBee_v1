// lib/weather.ts — shared weather types, constants & helpers

export type City = { name: string; lat: number; lon: number };

export const AL_CITIES: City[] = [
  { name: "Tiranë",           lat: 41.3275, lon: 19.8187 },
  { name: "Durrës",           lat: 41.3231, lon: 19.4414 },
  { name: "Shkodër",          lat: 42.0683, lon: 19.5126 },
  { name: "Vlorë",            lat: 40.4661, lon: 19.4914 },
  { name: "Elbasan",          lat: 41.1125, lon: 20.0822 },
  { name: "Korçë",            lat: 40.6186, lon: 20.7808 },
  { name: "Fier",             lat: 40.7239, lon: 19.5561 },
  { name: "Berat",            lat: 40.7058, lon: 19.9522 },
  { name: "Gjirokastër",      lat: 40.0764, lon: 20.1381 },
  { name: "Kukës",            lat: 42.0769, lon: 20.4219 },
  { name: "Lezhë",            lat: 41.7836, lon: 19.6437 },
  { name: "Dibër (Peshkopi)", lat: 41.6850, lon: 20.4289 },
  { name: "Pogradec",         lat: 40.9025, lon: 20.6525 },
  { name: "Sarandë",          lat: 39.8756, lon: 20.0053 },
  { name: "Lushnjë",          lat: 40.9419, lon: 19.7047 },
  { name: "Kavajë",           lat: 41.1856, lon: 19.5569 },
  { name: "Krujë",            lat: 41.5092, lon: 19.7928 },
  { name: "Laç",              lat: 41.6356, lon: 19.7131 },
  { name: "Burrel",           lat: 41.6103, lon: 20.0089 },
  { name: "Përmet",           lat: 40.2336, lon: 20.3517 },
  { name: "Tepelenë",         lat: 40.2950, lon: 20.0189 },
  { name: "Shëngjin",         lat: 41.8135, lon: 19.5935 },
];

export type WeatherState = {
  temperatureC: number;
  humidityPct: number;
  windKmh: number;
  precipitationMm: number;
  updatedAt: string;
};

/** Calculates a 0-100 plant health score from current weather values. */
export function calcPlantHealth(
  tempC: number,
  humidity: number,
  rain: number,
  wind: number,
): number {
  const humScore    = 100 - Math.abs(humidity - 65) * 1.4;
  const tempScore   = 100 - Math.abs(tempC - 22) * 4.0;
  const rainPenalty = Math.min(rain * 8, 25);
  const windPenalty = Math.min((wind - 20) * 1.2, 20);
  const score = humScore * 0.45 + tempScore * 0.55 - rainPenalty - windPenalty;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Fetches current Open-Meteo data for a given lat/lon. Returns null on error. */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherState | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m` +
      `&timezone=auto`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const cur = json?.current;
    if (!cur) throw new Error("empty");
    return {
      temperatureC:    Number(cur.temperature_2m),
      humidityPct:     Number(cur.relative_humidity_2m),
      precipitationMm: Number(cur.precipitation),
      windKmh:         Number(cur.windspeed_10m),
      updatedAt:       String(cur.time),
    };
  } catch {
    return null;
  }
}
