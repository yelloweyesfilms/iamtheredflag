import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import RedFlagNav from "../components/RedFlagNav";

const BASE = "#09090f";
const RED = "#E85C3A";
const GOLD = "#f59e0b";
const PURPLE = "#a855f7";

const RANK_STYLES = [
  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", color: GOLD, label: "👑" },
  { bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.25)", color: "#94a3b8", label: "🥈" },
  { bg: "rgba(180,120,60,0.08)", border: "rgba(180,120,60,0.25)", color: "#b47c3c", label: "🥉" },
];

function StatPill({ icon, value, color }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, color,
      background: `${color}15`, border: `1px solid ${color}30`,
      borderRadius: 6, padding: "2px 7px",
      display: "inline-flex", alignItems: "center", gap: 3,
    }}>
      {icon} {value}%
    </span>
  );
}

export default function HallOfFame() {
  const router = useRouter();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekLabel, setWeekLabel] = useState("");

  useEffect(() => {
    const now = new Date();
    const monday = new Date(now);
    const day = now.getDay();
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    setWeekLabel(`${fmt(monday)} — ${fmt(sunday)}`);

    fetch("/api/score")
      .then((r) => r.json())
      .then((d) => { setScores(d.scores || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Hall of Fame 🏆 — I AM THE RED FLAG</title>
        <meta name="description" content="Les Red Flags les plus toxiques de la semaine. Top 10 scores." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/api/icon?size=512" />
        <meta name="theme-color" content="#09090f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: BASE, color: "#fff", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "fixed", top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: `radial-gradient(circle, ${GOLD}12 0%, transparent 60%)`, pointerEvents: "none" }} />

        <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD}, ${RED}, ${PURPLE})` }} />

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer", padding: 0 }}>
              ← Retour
            </button>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: GOLD, textTransform: "uppercase" }}>
              🏆 HALL OF FAME
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 12 }}>🏆</div>
            <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 38, letterSpacing: "2px", margin: "0 0 8px", color: "#fff" }}>
              TOP RED FLAGS
            </h1>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 12, fontStyle: "italic" }}>
              Les plus toxiques de la semaine
            </div>
            <div style={{ display: "inline-block", background: `${GOLD}15`, border: `1px solid ${GOLD}30`, borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1 }}>
              SEMAINE DU {weekLabel.toUpperCase()}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              Chargement du classement...
            </div>
          ) : scores.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚩</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                Personne encore cette semaine.
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 24 }}>
                Sois le premier Red Flag du classement.
              </div>
              <button
                onClick={() => router.push("/")}
                style={{ background: `linear-gradient(135deg, ${RED}, #c0392b)`, border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 800, padding: "12px 24px", cursor: "pointer" }}
              >
                JOUER MAINTENANT 🚩
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {scores.map((s, i) => {
                const rank = RANK_STYLES[i] || { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", label: `${i + 1}` };
                return (
                  <div key={i} style={{ background: rank.bg, border: `1.5px solid ${rank.border}`, borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: i < 3 ? 22 : 14, fontWeight: 900, color: rank.color, width: 28, textAlign: "center", flexShrink: 0 }}>
                      {rank.label}
                    </div>

                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.archetypeColor ? "#" + s.archetypeColor : RED}18`, border: `1.5px solid ${s.archetypeColor ? "#" + s.archetypeColor : RED}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {s.archetypeEmoji || "🚩"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>
                          {s.pseudo}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: s.archetypeColor ? `#${s.archetypeColor}` : RED, background: `${s.archetypeColor ? "#" + s.archetypeColor : RED}15`, padding: "1px 6px", borderRadius: 5 }}>
                          {s.title}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
                        {s.storyEmoji} {s.storyTitle} · {s.archetype}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <StatPill icon="😈" value={s.toxicity} color={RED} />
                        <StatPill icon="🔥" value={Math.min(99, Math.round(s.chaos / 20))} color="#f97316" />
                        <StatPill icon="🐍" value={Math.min(99, Math.round(s.manipulation / 20))} color="#22c55e" />
                      </div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: "1px", color: i === 0 ? GOLD : "#fff", lineHeight: 1 }}>
                        {s.rf.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: RED, textTransform: "uppercase", marginTop: 2 }}>RF PTS</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 28 }}>
            <button
              onClick={() => router.push("/")}
              style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg, ${RED}, #c0392b)`, border: "none", borderRadius: 14, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 16, letterSpacing: "1.5px", cursor: "pointer", boxShadow: `0 8px 25px rgba(232,92,58,0.3)` }}
            >
              🚩 JOUER ET ENTRER AU HALL OF FAME
            </button>
            <button
              onClick={() => router.push("/defi")}
              style={{ width: "100%", marginTop: 10, padding: "13px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              🎯 Défi de la semaine
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.12)", marginTop: 24 }}>
            Classement remis à zéro chaque lundi
          </p>
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
