import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ARCHETYPES } from "../lib/redFlagData";
import RedFlagNav from "../components/RedFlagNav";

const BASE = "#09090f";
const RED = "#E85C3A";
const PURPLE = "#a855f7";

const REACTIONS = ["🚩", "😈", "💀", "🔥"];
const REACTION_LABELS = { "🚩": "Red Flag", "😈": "Toxic", "💀": "Dévasté", "🔥": "Relatable" };

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

function ConfessionCard({ c, onReact }) {
  const [localReactions, setLocalReactions] = useState(c.reactions || {});
  const [reacted, setReacted] = useState(null);
  const color = c.archetypeColor ? `#${c.archetypeColor}` : RED;

  function handleReact(emoji) {
    if (reacted) return;
    setReacted(emoji);
    setLocalReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    onReact(c.id, emoji);
  }

  const total = Object.values(localReactions).reduce((s, v) => s + (v || 0), 0);

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      padding: "18px 18px 14px",
      marginBottom: 12,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, ${color}, ${color}44)`, borderRadius: "3px 0 0 3px" }} />

      <div style={{ paddingLeft: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 20, padding: "3px 9px" }}>
            <span style={{ fontSize: 12 }}>{c.archetypeEmoji || "🚩"}</span>
            {c.archetypeId && (
              <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: 0.5, textTransform: "uppercase" }}>
                {ARCHETYPES.find((a) => a.id === c.archetypeId)?.name || c.archetypeId}
              </span>
            )}
          </div>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{timeAgo(c.at)}</span>
        </div>

        <p style={{ margin: "0 0 14px", fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.55, fontStyle: "italic" }}>
          "{c.text}"
        </p>

        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {REACTIONS.map((emoji) => {
            const count = localReactions[emoji] || 0;
            const isActive = reacted === emoji;
            return (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                title={REACTION_LABELS[emoji]}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: isActive ? `${color}20` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? color + "50" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 20, padding: "4px 9px",
                  fontSize: 12, color: isActive ? color : "rgba(255,255,255,0.4)",
                  cursor: reacted ? "default" : "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "inherit",
                }}
              >
                <span>{emoji}</span>
                {count > 0 && <span style={{ fontSize: 11, fontWeight: 700 }}>{count.toLocaleString()}</span>}
              </button>
            );
          })}
          {total > 0 && (
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: 4 }}>
              {total.toLocaleString()} réactions
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfessionsPage() {
  const router = useRouter();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [archetypeId, setArchetypeId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    fetch("/api/confessions")
      .then((r) => r.json())
      .then((d) => { setConfessions(d.confessions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit() {
    if (text.trim().length < 5) { setError("Ta confession est trop courte."); return; }
    setSubmitting(true);
    setError("");
    try {
      const arch = ARCHETYPES.find((a) => a.id === archetypeId);
      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          archetypeId: arch?.id || null,
          archetypeEmoji: arch?.emoji || "🚩",
          archetypeColor: arch?.color?.replace("#", "") || "E85C3A",
        }),
      });
      const data = await res.json();
      if (data.confession) {
        setConfessions((prev) => [data.confession, ...prev]);
      }
      setText("");
      setArchetypeId("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setError("Erreur réseau. Réessaie.");
    }
    setSubmitting(false);
  }

  async function handleReact(id, emoji) {
    try {
      await fetch("/api/confessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, emoji }),
      });
    } catch {}
  }

  const selectedArch = ARCHETYPES.find((a) => a.id === archetypeId);

  return (
    <>
      <Head>
        <title>Confessions 🚩 — I AM THE RED FLAG</title>
        <meta name="description" content="Le mur des confessions Red Flag. Des vraies histoires. Anonymes. Relatable." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/api/icon?size=512" />
        <meta name="theme-color" content="#09090f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: BASE, color: "#fff", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", position: "relative" }}>
        <div style={{ position: "fixed", top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: `radial-gradient(circle, ${RED}10 0%, transparent 60%)`, pointerEvents: "none" }} />

        <div style={{ height: 3, background: `linear-gradient(90deg, ${RED}, ${PURPLE}, ${RED})` }} />

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px 80px" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer", padding: 0 }}>
              ← Retour
            </button>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: RED, textTransform: "uppercase" }}>
              🚩 CONFESSIONS
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 38, letterSpacing: "2px", color: "#fff", lineHeight: 1, marginBottom: 6 }}>
              LE MUR DES<br />CONFESSIONS
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>
              Des vraies histoires. Anonymes. Relatable.
            </p>
          </div>

          <div style={{ background: `${RED}08`, border: `1px solid ${RED}25`, borderRadius: 18, padding: "20px", marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: RED, textTransform: "uppercase", marginBottom: 12 }}>
              😈 TON MOVE LE PLUS RED FLAG
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {ARCHETYPES.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setArchetypeId(archetypeId === a.id ? "" : a.id)}
                  title={a.name}
                  style={{
                    background: archetypeId === a.id ? `${a.color}25` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${archetypeId === a.id ? a.color + "60" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 20, padding: "5px 10px", fontSize: 14, cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {a.emoji}
                </button>
              ))}
            </div>
            {selectedArch && (
              <div style={{ fontSize: 10, color: selectedArch.color, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>
                {selectedArch.name} sélectionné
              </div>
            )}

            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => { setText(e.target.value.slice(0, 160)); setError(""); }}
              placeholder="Mon move le plus red flag : ..."
              maxLength={160}
              rows={3}
              style={{
                width: "100%", padding: "12px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, color: "#fff", fontSize: 14,
                fontFamily: "'Inter', sans-serif", outline: "none",
                resize: "none", boxSizing: "border-box",
                lineHeight: 1.5,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: text.length > 140 ? RED : "rgba(255,255,255,0.2)" }}>{text.length}/160</span>
              {error && <span style={{ fontSize: 10, color: RED }}>{error}</span>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || text.trim().length < 5}
              style={{
                width: "100%", padding: "13px",
                background: submitted ? "rgba(34,197,94,0.2)" : submitting || text.trim().length < 5 ? "rgba(232,92,58,0.2)" : `linear-gradient(135deg, ${RED}, #c0392b)`,
                border: "none", borderRadius: 10, color: "#fff",
                fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: "1.5px",
                cursor: submitting || text.trim().length < 5 ? "default" : "pointer",
                boxShadow: submitted || submitting || text.trim().length < 5 ? "none" : "0 6px 20px rgba(232,92,58,0.3)",
                transition: "all 0.2s ease",
              }}
            >
              {submitted ? "✓ CONFESSION POSTÉE !" : submitting ? "Envoi..." : "🚩 POSTER ANONYMEMENT"}
            </button>
          </div>

          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 16 }}>
            {loading ? "Chargement..." : `${confessions.length} CONFESSIONS`}
          </div>

          {!loading && confessions.map((c) => (
            <ConfessionCard key={c.id} c={c} onReact={handleReact} />
          ))}

          {!loading && confessions.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
              Personne n'a encore avoué. Sois le premier.
            </div>
          )}

          <div style={{ marginTop: 28, padding: "18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
              Découvre quel archétype Red Flag tu es vraiment.
            </div>
            <button
              onClick={() => router.push("/")}
              style={{ padding: "12px 24px", background: `linear-gradient(135deg, ${RED}, #c0392b)`, border: "none", borderRadius: 12, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: "1.5px", cursor: "pointer", boxShadow: "0 6px 20px rgba(232,92,58,0.25)" }}
            >
              🚩 FAIRE LE DIAGNOSTIC
            </button>
          </div>
        </div>
      </div>

      <RedFlagNav />

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${BASE}; }
        button { font-family: inherit; }
        textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </>
  );
}
