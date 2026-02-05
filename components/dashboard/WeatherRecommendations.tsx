"use client";

import { useEffect, useState } from "react";

type Recommendation = {
  emoji: string;
  title: string;
  condition: string;
  tips: string[];
};

type Props = {
  temperature: number;
  humidity: number;
};

export default function WeatherRecommendations({ temperature, humidity }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const recommendations = getRecommendations(temperature, humidity);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [recommendations.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  };

  if (recommendations.length === 0) return null;

  const current = recommendations[currentIndex];

  return (
    <div className="mt-6 rounded-3xl border bg-white/60 p-6 shadow-sm backdrop-blur"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{current.emoji}</span>
          <div>
            <h3 className="text-sm font-semibold text-[color:var(--primary-dark)]">
              Këshilla për kushtet aktuale
            </h3>
            <p className="text-xs text-black/60">{current.condition}</p>
          </div>
        </div>

        {recommendations.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border bg-white/80 text-black/70 transition hover:bg-white hover:text-black"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              ←
            </button>
            <span className="text-xs text-black/50">
              {currentIndex + 1} / {recommendations.length}
            </span>
            <button
              onClick={goToNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border bg-white/80 text-black/70 transition hover:bg-white hover:text-black"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border bg-white/70 p-5"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="text-base font-semibold text-[color:var(--primary-dark)]">
          {current.title}
        </div>
        
        <ul className="mt-3 space-y-2">
          {current.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-black/75">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {recommendations.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {recommendations.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: idx === currentIndex ? "24px" : "8px",
                background: idx === currentIndex 
                  ? "linear-gradient(90deg, var(--primary), var(--accent))"
                  : "rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getRecommendations(temp: number, humidity: number): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // 🌱 Kushte ideale
  if (temp >= 13 && temp <= 24 && humidity >= 51 && humidity <= 75) {
    recommendations.push({
      emoji: "🌱",
      title: "Kushte optimale për rritje të shëndetshme.",
      condition: "Temp 13–24°C & Lagështia 51–75%",
      tips: [
        "Mbaj ujitje të rregullt, sipas nevojës së kulturës (pa përmbytje).",
        "Apliko mulchim të lehtë për të ruajtur lagështinë e tokës.",
        "Kjo është periudha më e mirë për rritje vegjetative dhe formim frutash.",
        "Mund të vazhdosh plehërimin normal (sidomos kalium për frutat).",
        "Monitoro gjethet për shenja të hershme stresi (parandalim).",
        "Ideal për mbjellje të reja dhe transplantim.",
      ],
    });
  }

  // ☀️ Vapë + thatësi
  if (temp >= 25 && temp <= 32 && humidity <= 50) {
    recommendations.push({
      emoji: "☀️",
      title: "Stres termik i mundshëm për bimët.",
      condition: "Temp 25–32°C & Lagështia ≤ 50%",
      tips: [
        "Rrit frekuencën e ujitjes, por jo sasinë për një herë.",
        "Ujit vetëm herët në mëngjes (ose vonë në mbrëmje nëse është e nevojshme).",
        "Vendos mulchim të trashë për të ulur avullimin.",
        "Shmang plehërimin me azot gjatë vapës së lartë.",
        "Gjethet mund të vyshken përkohësisht në mesditë — është normale.",
        "Në sera, përdor hijëzim 30–40% dhe ajrosje.",
      ],
    });
  }

  // 🌧 Ftohtë + shumë lagësht
  if (temp >= 6 && temp <= 12 && humidity >= 86) {
    recommendations.push({
      emoji: "🌧",
      title: "Rrezik i lartë për myk dhe sëmundje kërpudhore.",
      condition: "Temp 6–12°C & Lagështia ≥ 86%",
      tips: [
        "Redukto ujitjen në minimum; ujit vetëm kur toka është e thatë.",
        "Mos ujit gjethet – ujit vetëm në rrënjë.",
        "Siguro ajrosje të mirë, sidomos në sera.",
        "Kontrollo për shenja të mykut (njolla të bardha / gri).",
        "Shmang punimet e panevojshme në tokë.",
        "Konsidero spërkatje parandaluese sipas praktikave të sigurta.",
      ],
    });
  }

  // ❄️ Ftohtë / rrezik ngrice
  if (temp <= 5) {
    recommendations.push({
      emoji: "❄️",
      title: "Rritje shumë e ngadaltë – mbrojtja është prioritet.",
      condition: "Temp ≤ 5°C",
      tips: [
        "Ujitje shumë minimale; toka e ftohtë mban ujin më gjatë.",
        "Mbulo fidanët me agrofibër ose plastikë mbrojtëse.",
        "Shmang ujitjen në mbrëmje (rrit rrezikun e ngricës).",
        "Kontrollo drenazhimin për të shmangur kalbjen e rrënjëve.",
        "Ndalo plehërimin derisa temperaturat të rriten.",
        "Fokusohu në ruajtje, jo në rritje aktive.",
      ],
    });
  }

  // 🔥 Vapë ekstreme
  if (temp >= 33) {
    recommendations.push({
      emoji: "🔥",
      title: "Rrezik i lartë stresi dhe dëmtimi.",
      condition: "Temp ≥ 33°C",
      tips: [
        "Ujitje e kontrolluar, pa përmbytje.",
        "Hijëzim i detyrueshëm në sera ose kultura delikate.",
        "Mulchim i trashë për të mbajtur tokën të freskët.",
        "Shmang punimet dhe spërkatjet gjatë ditës.",
        "Monitoro shenjat e djegies së gjetheve dhe rënies së luleve.",
      ],
    });
  }

  // Nëse nuk ka kushte specifike, jep këshilla të përgjithshme
  if (recommendations.length === 0) {
    recommendations.push({
      emoji: "💡",
      title: "Kushte të moderuara – vazhdoni rutinën normale.",
      condition: `Temp ${temp.toFixed(1)}°C & Lagështia ${humidity}%`,
      tips: [
        "Mbaj ujitje të rregullt sipas nevojës së kulturës.",
        "Kontrollo tokën para se të ujitësh – mos e mbyt.",
        "Monitoro bimët për shenja stresi ose sëmundjesh.",
        "Vazhdo me planin normal të plehërimit.",
        "Ruaj një regjistër të kushteve dhe reagimit të bimëve.",
      ],
    });
  }

  return recommendations;
}
