"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardTabs from "@/components/DashboardTabs";
import WeatherRecommendations from "@/components/dashboard/WeatherRecommendations";
import { GrowthRateCard } from "@/components/dashboard/GrowthRateCard";
import { AL_CITIES, type City, type WeatherState, calcPlantHealth, fetchWeather } from "@/lib/weather";

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
      const result = await fetchWeather(city.lat, city.lon);
      if (!cancelled) {
        if (result) setData(result);
        setLoading(false);
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
      {loading && !data ? (
        <div className="animate-pulse rounded-[28px] bg-white/40 h-72 border" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
      ) : data ? (
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
      ) : null}

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
