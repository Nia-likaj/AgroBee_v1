"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { calcGrowthRateScore, buildWeeklyGrowthSeries } from "@/lib/growth";

export function GrowthRateCard({
  plantHealth,
  humidity,
  temperature,
  wind,
  rain,
  updatedAt,
}: {
  plantHealth: number;
  humidity: number;
  temperature: number;
  wind: number;
  rain: number;
  updatedAt: string;
}) {
  const growthRate = useMemo(() => {
    return calcGrowthRateScore({ plantHealth, humidity, temperature, wind, rain });
  }, [plantHealth, humidity, temperature, wind, rain]);

  const series = useMemo(() => {
    // seedKey e lidhur me updatedAt => ndryshon kur përditësohen të dhënat
    return buildWeeklyGrowthSeries(growthRate, `growth:${updatedAt}`);
  }, [growthRate, updatedAt]);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-black/55">Growth rate</div>
          <div className="mt-1 text-2xl font-semibold text-[color:var(--primary-dark)]">{growthRate}%</div>
        </div>

        <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--primary-dark)]">
          Live
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full border bg-white/70">
        <div
          className="h-full rounded-full"
          style={{
            width: `${growthRate}%`,
            background: "linear-gradient(90deg, var(--accent), var(--primary))",
          }}
        />
      </div>

      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tickCount={6} tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.95)', 
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="growth" 
              stroke="var(--primary)" 
              strokeWidth={3} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
