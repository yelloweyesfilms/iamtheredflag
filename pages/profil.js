import { useState, useEffect } from "react";
import Head from "next/head";
import { LEVELS } from "../lib/redFlagData";
import { BADGES, RARITY_ORDER, getEarnedBadges, getStoriesPlayed, getBestRF, hasSubmittedHof } from "../lib/redFlagBadges";
import RedFlagNav from "../components/RedFlagNav";

const BASE = "#09090f";
const RED = "#E85C3A";

export default function ProfilPage() {
  const [mounted, setMounted] = useState(false);
  const [earnedIds, setEarnedIds] = useState([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [storiesPlayed, setStoriesPlayed] = useState([]);
  const [bestRF, setBestRF] = useState(0);
  const [hofSubmitted, setHofSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEarnedIds(getEarnedBadges());
    setGamesPlayed(parseInt(localStorage.getItem("rf_games_played") || "0"));
    setStoriesPlayed(getStoriesPlayed());
    setBestRF(getBestRF());
    setHofSubmitted(hasSubmittedHof());
  }, []);

  if (!mounted) return null;

  const currentTitle = (() => {
    let t = LEVELS[0];
    for (const lvl of LEVELS) { if (bestRF >= lvl.minRF) t = lvl; else break; }
    return t;
  })();
  const nextLevel = LEVELS.find((l) => l.minRF > bestRF);
  const progressToNext = nextLevel
    ? Math.min(100, Math.round(((bestRF - currentTitle.minRF) / (nextLevel.minRF - currentTitle.minRF)) * 100))
    : 100;

  const sortedBadges = [...BADGES].sort((a, b) => {
    const aEarned = earnedIds.includes(a.id);
    const bEarned = earnedIds.includes(b.id);
    if (aEarned && !bEarned) return -1;
    if (!aEarned && bEarned) return 1;
    return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
  });

  return (
    <>
      <Head>
        <title>Mon Profil Red Flag 🚩</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/api/icon?size=512" />
        <meta name="theme-color" content="#09090f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: BASE, color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 80px" }}>

          <div style={{ height: 3, background: `linear-gradient(90deg, ${RED}, #a855f7)`, marginBottom: 32 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textDecoration: "none" }}>←</a>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: "2px" }}>MON PROFIL</div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "24px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: `${RED}15`, border: `2px solid ${RED}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
                🚩
              </div>
              <div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, letterSpacing: "1px", color: RED, marginBottom: 4 }}>
                  {currentTitle.title.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                  Niveau {currentTitle.level} · {bestRF.toLocaleString()} RF max
                </div>
              </div>
            </div>

            {nextLevel && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase" }}>
                    Prochain titre
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: RED }}>{nextLevel.title}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${progressToNext}%`, background: `linear-gradient(90deg, ${RED}, #a855f7)`, borderRadius: 2, transition: "width 1s ease" }} />
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "right" }}>
                  {(nextLevel.minRF - bestRF).toLocaleString()} RF restants
                </div>
              </div>
            )}
            {!nextLevel && (
              <div style={{ textAlign: "center", fontSize: 12, color: RED, fontWeight: 800, letterSpacing: 1 }}>
                ☠️ RANG MAXIMUM ATTEINT
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { emoji: "🎭", value: gamesPlayed, label: "DRAMAS" },
              { emoji: "📖", value: storiesPlayed.length, label: "STORIES" },
              { emoji: "🏅", value: earnedIds.length, label: "BADGES" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.emoji}</div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: "1px", color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {hofSubmitted && (
            <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🏆</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#f59e0b" }}>Hall of Famer</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Score soumis au classement cette semaine</div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, letterSpacing: "2px", marginBottom: 14, color: "rgba(255,255,255,0.5)" }}>
              COLLECTION DE TITRES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LEVELS.map((lvl) => {
                const unlocked = bestRF >= lvl.minRF;
                return (
                  <div key={lvl.level} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    background: unlocked ? "rgba(232,92,58,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${unlocked ? "rgba(232,92,58,0.2)" : "rgba(255,255,255,0.04)"}`,
                    borderRadius: 12,
                    opacity: unlocked ? 1 : 0.45,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{unlocked ? "✅" : "🔒"}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: unlocked ? "#fff" : "rgba(255,255,255,0.4)" }}>
                          {lvl.title}
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>
                          Niveau {lvl.level}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: unlocked ? RED : "rgba(255,255,255,0.2)", textAlign: "right" }}>
                      {lvl.minRF.toLocaleString()} RF
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, letterSpacing: "2px", marginBottom: 14, color: "rgba(255,255,255,0.5)" }}>
              BADGES ({earnedIds.length}/{BADGES.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {sortedBadges.map((badge) => {
                const earned = earnedIds.includes(badge.id);
                return (
                  <div key={badge.id} style={{
                    background: earned ? `${badge.rarityColor}08` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${earned ? badge.rarityColor + "30" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: 14, padding: "14px",
                    opacity: earned ? 1 : 0.35,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8, filter: earned ? "none" : "grayscale(1)" }}>
                      {badge.emoji}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: earned ? "#fff" : "rgba(255,255,255,0.4)", marginBottom: 3 }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
                      {badge.desc}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: earned ? badge.rarityColor : "rgba(255,255,255,0.15)" }}>
                      {badge.rarity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 28, textAlign: "center" }}>
            <a href="/" style={{ display: "inline-block", background: `linear-gradient(135deg, ${RED}, #c0392b)`, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: "1.5px", padding: "14px 32px", borderRadius: 12, textDecoration: "none", boxShadow: "0 6px 20px rgba(232,92,58,0.3)" }}>
              JOUER UN DRAMA →
            </a>
          </div>
        </div>
      </div>

      <RedFlagNav />

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${BASE}; }
      `}</style>
    </>
  );
}
