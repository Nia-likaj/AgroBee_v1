"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardTabs from "@/components/DashboardTabs";
import WeatherRecommendations from "@/components/dashboard/WeatherRecommendations";
import { GrowthRateCard } from "@/components/dashboard/GrowthRateCard";

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

function calcPlantHealth(
  tempC: number,
  humidity: number,
  rain: number,
  wind: number
) {
  const humScore = 100 - Math.abs(humidity - 65) * 1.4;
  const tempScore = 100 - Math.abs(tempC - 22) * 4.0;
  const rainPenalty = Math.min(rain * 8, 25);
  const windPenalty = Math.min((wind - 20) * 1.2, 20);
  const score = humScore * 0.45 + tempScore * 0.55 - rainPenalty - windPenalty;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export default function DashboardPage() {
  const [city, setCity] = useState<City>(AL_CITIES[0]);
  const [data, setData] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(false);

  const plantHealth = useMemo(() => {
    if (!data) return 0;
    return calcPlantHealth(data.temperatureC, data.humidityPct, data.precipitationMm, data.windKmh);
  }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
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
        console.error("Weather fetch error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [city.lat, city.lon]);

  const handleCityChange = (cityName: string) => {
    const found = AL_CITIES.find((c) => c.name === cityName);
    if (found) setCity(found);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {data && (
        <DashboardHero
          city={city.name}
          plantHealth={plantHealth}
          humidity={data.humidityPct}
          temperature={data.temperatureC}
          wind={data.windKmh}
          rain={data.precipitationMm}
          updatedAt={data.updatedAt}
          cities={AL_CITIES.map((c) => c.name)}
          onCityChange={handleCityChange}
        />
      )}

      <div className="mt-8">
        <DashboardTabs />
      </div>

      {data && (
        <div className="mt-8">
          <GrowthRateCard
            plantHealth={plantHealth}
            humidity={data.humidityPct}
            temperature={data.temperatureC}
            wind={data.windKmh}
            rain={data.precipitationMm}
            updatedAt={data.updatedAt}
          />
        </div>
      )}

      {data && (
        <WeatherRecommendations 
          temperature={data.temperatureC}
          humidity={data.humidityPct}
        />
      )}
    </main>
  );
}
