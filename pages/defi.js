import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ARCHETYPES, STORIES } from "../lib/redFlagData";
import RedFlagNav from "../components/RedFlagNav";

const BASE = "#09090f";
const RED = "#E85C3A";
const PURPLE = "#a855f7";
const GOLD = "#f59e0b";

function getWeeklyChallenge() {
  const now = new Date();
  const weekNum = Math.floor(
    (now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000)
  );

  const availableStories = STORIES.filter((s) => s.available);

  const combos = [];
  for (const story of availableStories) {
    for (const arch of ARCHETYPES) {
      combos.push({ story, arch });
    }
  }

  const { story, arch } = combos[weekNum % combos.length];

  const bonusByArchetype = {
    "chaos-director":        { mult: "×3 sur Chaos",          color: "#f97316", reward: "🔥 Chaos Week" },
    "master-manipulator":    { mult: "×3 sur Manipulation",   color: "#22c55e", reward: "🐍 Serpent Week" },
    "heartbreaker":          { mult: "×3 sur Hearts Broken",  color: "#f43f5e", reward: "💔 Heartbreak Week" },
    "toxic-queen":           { mult: "×4 sur tous les scores", color: PURPLE,   reward: "👑 Queen Week" },
    "main-character":        { mult: "×3 sur RF Points",      color: "#06b6d4", reward: "✨ Main Character Week" },
    "delusional":            { mult: "×3 sur Chaos",          color: "#ec4899", reward: "🤡 Delulu Week" },
    "emotionally-expensive": { mult: "×3 sur Heartbreak",     color: "#f59e0b", reward: "💸 Drama Tax Week" },
    "red-flag-energy":       { mult: "×2 sur tout",           color: RED,       reward: "🚩 Full Red Flag Week" },
  };

  const bonus = bonusByArchetype[arch.id] || { mult: "×2 sur tout", color: RED, reward: "🚩 Red Flag Week" };

  return {
    id: `${story.id}-${arch.id}`,
    archetype: arch.id,
    title: `${arch.emoji} × ${story.emoji}`,
    subtitle: `${story.title} — joue en ${arch.name}.`,
    bonus: `${bonus.mult} cette semaine`,
    bonusColor: bonus.color,
    reward: `Badge exclusif ${bonus.reward}`,
    story,
    archObj: arch,
    weekNum,
    totalCombos: combos.length,
  };
}

function getDaysUntilMonday() {
  const now = new Date();
  const day = now.getDay();
  return day === 1 ? 7 : (8 - day) % 7;
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function calc() {
      const now = new Date();
      const nextMonday = new Date(now);
      const day = now.getDay();
      const daysUntil = day === 1 ? 7 : (8 - day) % 7;
      nextMonday.setDate(now.getDate() + daysUntil);
      nextMonday.setHours(0, 0, 0, 0);
      const diff = nextMonday - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {[
        { v: timeLeft.h, label: "H" },
        { v: timeLeft.m, label: "M" },
        { v: timeLeft.s, label: "S" },
      ].map(({ v, label }) => (
        <div key={label} style={{ textAlign: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", minWidth: 52 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {String(v).padStart(2, "0")}
            </div>
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RedFlagDefi() {
  const router = useRouter();
  const [challenge] = useState(() => getWeeklyChallenge());
  const [started, setStarted] = useState(false);

  const daysLeft = getDaysUntilMonday();

  function handlePlay() {
    setStarted(true);
    setTimeout(() => {
      router.push(`/play?story=${challenge.story.id}&archetype=${challenge.archetype}`);
    }, 600);
  }

  const arch = challenge.archObj;
  const story = challenge.story;

  return (
    <>
      <Head>
        <title>Défi de la Semaine 🎯 — I AM THE RED FLAG</title>
        <meta name="description" content={`Défi Red Flag : ${challenge.title}. ${challenge.bonus}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/api/icon?size=512" />
        <meta name="theme-color" content="#09090f" />
      </Head>

      <div style={{ minHeight: "100vh", background: BASE, color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "fixed", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: `radial-gradient(circle, ${arch?.color || RED}15 0%, transparent 60%)`, pointerEvents: "none" }} />

        <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD}, ${RED}, ${PURPLE})` }} />

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer", padding: 0 }}>
              ← Retour
            </button>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: GOLD, textTransform: "uppercase" }}>
              🎯 DÉFI DE LA SEMAINE
            </div>
          </div>

          <div style={{ background: `${arch?.color || RED}0e`, border: `2px solid ${arch?.color || RED}35`, borderRadius: 24, padding: "32px 24px", textAlign: "center", marginBottom: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${arch?.color || RED}, ${PURPLE})` }} />

            <div style={{ display: "inline-block", background: `${GOLD}18`, border: `1px solid ${GOLD}40`, borderRadius: 20, padding: "5px 14px", fontSize: 10, fontWeight: 800, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 20 }}>
              SEMAINE EN COURS · {daysLeft}J RESTANTS
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${arch?.color || RED}20`, border: `2px solid ${arch?.color || RED}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                {arch?.emoji || "🚩"}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 2 }}>
                  ARCHÉTYPE IMPOSÉ
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: arch?.color || RED }}>
                  {arch?.name}
                </div>
              </div>
            </div>

            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-2px", color: "#fff", margin: "0 0 10px", lineHeight: 1 }}>
              {challenge.title}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.5 }}>
              {challenge.subtitle}
            </p>

            <div style={{ background: `${challenge.bonusColor}12`, border: `1.5px solid ${challenge.bonusColor}35`, borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: challenge.bonusColor, textTransform: "uppercase", marginBottom: 4 }}>
                BONUS ACTIF
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
                {challenge.bonus}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `${GOLD}10`, border: `1px solid ${GOLD}30`, borderRadius: 10, padding: "10px 16px" }}>
              <span style={{ fontSize: 14 }}>🏅</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: GOLD, textTransform: "uppercase", marginBottom: 1 }}>
                  RÉCOMPENSE
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {challenge.reward}
                </div>
              </div>
            </div>
          </div>

          {story && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{story.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 3, letterSpacing: "-0.3px" }}>
                  {story.title}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                  {story.tagline}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                  {story.scenes?.length || 4} scènes · ~3 min
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10 }}>
              PROCHAIN DÉFI DANS
            </div>
            <Countdown />
          </div>

          <button
            onClick={handlePlay}
            disabled={started}
            style={{
              width: "100%", padding: "18px 24px",
              background: started ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${arch?.color || RED}, ${arch?.color ? arch.color + "bb" : "#c0392b"})`,
              border: "none", borderRadius: 14, color: "#fff",
              fontSize: 16, fontWeight: 800, letterSpacing: 0.5,
              cursor: started ? "default" : "pointer",
              boxShadow: started ? "none" : `0 8px 30px ${arch?.color || RED}35`,
              transition: "all 0.3s ease", marginBottom: 12,
            }}
          >
            {started ? "Lancement du défi..." : `RELEVER LE DÉFI ${arch?.emoji || "🚩"}`}
          </button>

          <button
            onClick={() => router.push("/")}
            style={{ width: "100%", padding: "13px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Jouer librement →
          </button>

          <div style={{ marginTop: 28, padding: "18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 12 }}>
              RÈGLES DU DÉFI
            </div>
            {[
              "Archétype imposé : pas de changement possible",
              "Histoire imposée cette semaine",
              "Bonus de score actif pendant toute la durée",
              "Partage ta carte pour valider ton défi",
              "Nouveau défi chaque lundi à minuit",
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 4 ? 8 : 0, fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>
                <span style={{ color: RED, flexShrink: 0, marginTop: 1 }}>→</span>
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>

      <RedFlagNav />

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${BASE}; }
        button { font-family: inherit; }
      `}</style>
    </>
  );
}
