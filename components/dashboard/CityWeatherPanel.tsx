"use client";

import { useEffect, useMemo, useState } from "react";

type City = { name: string; lat: number; lon: number };

const AL_CITIES: City[] = [
  { name: "Tiranë", lat: 41.3275, lon: 19.8187 },
  { name: "Durrës", lat: 41.3231, lon: 19.4414 },
  { name: "Shkodër", lat: 42.0683, lon: 19.5126 },
  { name: "Vlorë", lat: 40.4661, lon: 19.4914 },
  { name: "Elbasan", lat: 41.1125, lon: 20.0822 },
  { name: "Korçë", lat: 40.6186, lon: 20.7808 },
  { name: "Fier", lat: 40.7239, lon: 19.5561 },
  { name: "Berat", lat: 40.7058, lon: 19.9522 },
  { name: "Gjirokastër", lat: 40.0764, lon: 20.1381 },
  { name: "Kukës", lat: 42.0769, lon: 20.4219 },
  { name: "Lezhë", lat: 41.7836, lon: 19.6437 },
  { name: "Dibër (Peshkopi)", lat: 41.6850, lon: 20.4289 },
  { name: "Pogradec", lat: 40.9025, lon: 20.6525 },
  { name: "Sarandë", lat: 39.8756, lon: 20.0053 },
  { name: "Lushnjë", lat: 40.9419, lon: 19.7047 },
  { name: "Kavajë", lat: 41.1856, lon: 19.5569 },
  { name: "Krujë", lat: 41.5092, lon: 19.7928 },
  { name: "Laç", lat: 41.6356, lon: 19.7131 },
  { name: "Burrel", lat: 41.6103, lon: 20.0089 },
  { name: "Përmet", lat: 40.2336, lon: 20.3517 },
  { name: "Tepelenë", lat: 40.2950, lon: 20.0189 },
  { name: "Shëngjin", lat: 41.8135, lon: 19.5935 },
];

type WeatherState = {
  temperatureC: number;
  humidityPct: number;
  windKmh: number;
  precipitationMm: number;
  updatedAt: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function calcPlantHealth(
  tempC: number,
  humidity: number,
  rain: number,
  wind: number
) {
  // 1️⃣ Lagështia ideale rreth 65%
  const humScore =
    100 - Math.abs(humidity - 65) * 1.4;

  // 2️⃣ Temperatura ideale rreth 22°C
  const tempScore =
    100 - Math.abs(tempC - 22) * 4.0;

  // 3️⃣ Penalizime
  const rainPenalty = Math.min(rain * 8, 25);
  const windPenalty = Math.min((wind - 20) * 1.2, 20);

  // 4️⃣ Kombinimi final
  const score =
    humScore * 0.45 +
    tempScore * 0.55 -
    rainPenalty -
    windPenalty;

  // 5️⃣ Kufizim 0–100
  return Math.max(0, Math.min(100, Math.round(score)));
}

export default function CityWeatherPanel() {
  const [city, setCity] = useState<City>(AL_CITIES[0]);
  const [data, setData] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const plantHealth = useMemo(() => {
    if (!data) return 0;
    return calcPlantHealth(data.temperatureC, data.humidityPct, data.precipitationMm, data.windKmh);
  }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        // Use current values via hourly "current" fields (supported by Open-Meteo)
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
          `&current=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m` +
          `&timezone=auto`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        const current = json?.current;
        if (!current) throw new Error("No current data");

        const next: WeatherState = {
          temperatureC: Number(current.temperature_2m),
          humidityPct: Number(current.relative_humidity_2m),
          precipitationMm: Number(current.precipitation),
          windKmh: Number(current.windspeed_10m),
          updatedAt: String(current.time),
        };

        if (!cancelled) setData(next);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Gabim në leximin e të dhënave");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 5 * 60 * 1000); // refresh çdo 5 min
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [city.lat, city.lon, city.name]);

  return (
    <div className="rounded-3xl border bg-white/55 p-6 shadow-sm backdrop-blur md:p-8" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-black/55">Kushtet aktuale • {city.name}</div>
          <div className="mt-1 text-xl font-semibold text-[color:var(--primary-dark)] md:text-2xl">
            Monitorim në kohë reale
          </div>
          <div className="mt-2 text-sm text-black/65">
            Të dhënat vijnë nga Open-Meteo; "Plant Health" është një skorë e llogaritur.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--primary-dark)]">
            Live
          </span>

          <select
            value={city.name}
            onChange={(e) => {
              const found = AL_CITIES.find((c) => c.name === e.target.value);
              if (found) setCity(found);
            }}
            className="rounded-xl border bg-white/70 px-3 py-2 text-sm font-semibold text-[color:var(--primary-dark)] outline-none"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
          >
            {AL_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <KpiCard label="Plant Health" value={`${plantHealth}%`} pct={plantHealth} />
        <KpiCard label="Lagështia" value={data ? `${data.humidityPct}%` : "—"} pct={data?.humidityPct ?? 0} />
        <KpiCard label="Temperatura" value={data ? `${data.temperatureC.toFixed(1)}°C` : "—"} pct={data ? Math.min(100, Math.max(0, (data.temperatureC + 10) * 2.5)) : 0} />
        <KpiCard label="Era" value={data ? `${data.windKmh.toFixed(1)} km/h` : "—"} pct={data ? Math.min(100, data.windKmh * 2) : 0} />
      </div>

      {data && (
        <div className="mt-5 rounded-3xl border bg-white/70 p-5" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="text-xs text-black/55">Informacion shtesë</div>
          <div className="mt-2 text-sm text-black/65">
            Reshje: {data.precipitationMm} mm • Era: {data.windKmh.toFixed(1)} km/h
          </div>
          <div className="mt-3 rounded-2xl border bg-white/60 p-3 text-xs text-black/65" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            {loading ? "Po rifreskoj të dhënat…" : err ? `Gabim: ${err}` : `Përditësuar: ${data.updatedAt}`}
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="rounded-3xl border bg-white/70 p-5" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="text-xs text-black/55">{label}</div>
      <div className="mt-1 text-lg font-semibold text-[color:var(--primary-dark)]">{value}</div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full border bg-white/70" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${clamp(pct, 0, 100)}%`,
            background: "linear-gradient(90deg, var(--accent), var(--primary))",
          }}
        />
      </div>
    </div>
  );
}
