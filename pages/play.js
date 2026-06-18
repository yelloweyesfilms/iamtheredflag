import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ARCHETYPES, STORIES, diagnoseArchetype } from "../lib/redFlagData";

const BASE = "#09090f";
const RED = "#E85C3A";

export default function PlayPage() {
  const router = useRouter();
  const { story: storyId, archetype: archetypeId, challenger_rf, challenger } = router.query;
  const challengerScore = challenger_rf ? parseInt(challenger_rf) : null;

  const [story, setStory] = useState(null);
  const [archetype, setArchetype] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState("choice");
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [totalStats, setTotalStats] = useState({ chaos: 0, manipulation: 0, heartbreak: 0, rf: 0, heartsBroken: 0 });
  const [fadeIn, setFadeIn] = useState(true);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [finalStats, setFinalStats] = useState(null);

  const gameOverLines = {
    "mariage-sabote": ["THE WEDDING", "IS OFF."],
    "side-piece-chronicles": ["THEY NEVER", "FOUND OUT."],
    "family-chaos": ["THE FAMILY", "WILL NEVER", "BE THE SAME."],
    "love-triangle": ["NOBODY", "WINS."],
    "office-villain": ["THE MEETING", "IS CANCELLED."],
  };

  function playGameOverSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sawtooth"; osc.frequency.setValueAtTime(120, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.4, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      osc.start(); osc.stop(ctx.currentTime + 1.4);
    } catch {}
  }

  function playRevealSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.12, 0.24, 0.36].forEach((delay, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine"; osc.frequency.setValueAtTime(440 * Math.pow(1.2, i), ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + delay); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
        osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + 0.3);
      });
    } catch {}
  }

  useEffect(() => {
    if (phase !== "gameover") return;
    if (typeof window !== "undefined") { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); playGameOverSound(); }
    const t = setTimeout(() => setPhase("analyzing"), 2800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "analyzing") return;
    if (analyzeStep === 7) playRevealSound();
    if (analyzeStep >= 7) {
      if (!finalStats || !archetype) return;
      const params = new URLSearchParams({
        story: story.id, archetype: archetype.id, diagnostic: isDiagnosticMode ? "1" : "0",
        rf: String(finalStats.rf), chaos: String(finalStats.chaos), manipulation: String(finalStats.manipulation),
        heartbreak: String(finalStats.heartbreak), hearts: String(finalStats.hearts),
        ...(challengerScore ? { challenger_rf: String(challengerScore), challenger: challenger || "" } : {}),
      });
      const t = setTimeout(() => { window.location.href = `/results?${params.toString()}`; }, 900);
      return () => clearTimeout(t);
    }
    const delay = analyzeStep === 0 ? 400 : analyzeStep < 5 ? 700 : 1000;
    const t = setTimeout(() => setAnalyzeStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [phase, analyzeStep, finalStats]);

  const isDiagnosticMode = !archetypeId;

  useEffect(() => {
    if (!storyId) return;
    const foundStory = STORIES.find((s) => s.id === storyId);
    if (foundStory) setStory(foundStory);
    if (archetypeId) {
      const foundArchetype = ARCHETYPES.find((a) => a.id === archetypeId);
      if (foundArchetype) setArchetype(foundArchetype);
    }
  }, [storyId, archetypeId]);

  if (!story || (!archetype && !isDiagnosticMode)) {
    return <div style={{ minHeight: "100vh", background: BASE, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Chargement du drama...</div>;
  }

  const scene = story.scenes[sceneIndex];
  const totalScenes = story.scenes.length;
  const progress = ((sceneIndex + (phase === "consequence" ? 0.5 : 0)) / totalScenes) * 100;

  function handleChoiceSelect(choice) {
    const mult = archetype ? archetype.multipliers : { chaos: 1, manipulation: 1, heartbreak: 1, rf: 1 };
    const gained = { chaos: Math.round(choice.stats.chaos * mult.chaos), manipulation: Math.round(choice.stats.manipulation * mult.manipulation), heartbreak: Math.round(choice.stats.heartbreak * mult.heartbreak), rf: Math.round(choice.stats.rf * mult.rf) };
    setTotalStats((prev) => ({ chaos: prev.chaos + gained.chaos, manipulation: prev.manipulation + gained.manipulation, heartbreak: prev.heartbreak + gained.heartbreak, rf: prev.rf + gained.rf, heartsBroken: prev.heartsBroken + (choice.stats.heartbreak > 30 ? 1 : 0) }));
    setSelectedChoice({ ...choice, gained });
    setPhase("consequence");
  }

  function handleContinue() {
    if (sceneIndex + 1 >= totalScenes) {
      const final = { rf: totalStats.rf + (selectedChoice?.gained?.rf || 0), chaos: totalStats.chaos + (selectedChoice?.gained?.chaos || 0), manipulation: totalStats.manipulation + (selectedChoice?.gained?.manipulation || 0), heartbreak: totalStats.heartbreak + (selectedChoice?.gained?.heartbreak || 0), hearts: totalStats.heartsBroken };
      if (isDiagnosticMode) {
        const diagId = diagnoseArchetype(final.chaos, final.manipulation, final.heartbreak, final.rf);
        const diagArchetype = ARCHETYPES.find((a) => a.id === diagId);
        if (diagArchetype) setArchetype(diagArchetype);
      }
      setFinalStats(final);
      setPhase("gameover");
      try { const prev = parseInt(localStorage.getItem("rf_games_played") || "0"); localStorage.setItem("rf_games_played", String(prev + 1)); } catch {}
      return;
    }
    setFadeIn(false);
    setTimeout(() => { setSceneIndex((i) => i + 1); setSelectedChoice(null); setPhase("choice"); setFadeIn(true); }, 250);
  }

  const rfTagColors = { STRATÉGIQUE: "#06b6d4", CHAOTIQUE: "#f97316", ICONIC: "#a855f7", MASTERCLASS: "#a855f7", GLACIAL: "#06b6d4", PSYCHOLOGIQUE: "#f43f5e", SUBTIL: "#22c55e", DÉVASTATEUR: "#E85C3A", NUCLEAR: "#f43f5e", "CHEF-D'ŒUVRE": "#a855f7", CINÉMATIQUE: "#f59e0b", ULTRA: "#E85C3A", PATIENT: "#22c55e", "CHAOS PASSIF": "#f97316", "PRINCIPAL ENERGY": "#a855f7", SARCASME: "#f59e0b", MINIMALISTE: "#06b6d4", DEVASTATEUR: "#E85C3A", NARCISSIQUE: "#f43f5e", "PRISE DE TERRITOIRE": "#a855f7", DIRECT: "#E85C3A", SPECTATEUR: "#22c55e", LÉGAL: "#06b6d4", CHIRURGICAL: "#f43f5e", "ARC DE RÉDEMPTION": "#22c55e", DIVISEUR: "#a855f7", BRUTAL: "#f43f5e", PROACTIF: "#f59e0b", "CONFRONTATION FROIDE": "#06b6d4" };

  return (
    <>
      <Head>
        <title>{story.title} — I AM THE RED FLAG 🚩</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: "100vh", background: BASE, color: "#fff", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(9,9,15,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ height: 3, background: "rgba(255,255,255,0.07)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${RED}, #a855f7)`, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer", padding: 0 }}>✕</button>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{story.emoji} {story.title}</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: isDiagnosticMode ? "rgba(255,255,255,0.15)" : archetype?.color, background: isDiagnosticMode ? "rgba(255,255,255,0.04)" : `${archetype?.color}15`, border: `1px solid ${isDiagnosticMode ? "rgba(255,255,255,0.08)" : archetype?.color + "30"}`, borderRadius: 8, padding: "3px 8px" }}>
              {isDiagnosticMode ? "?" : archetype?.emoji}
            </div>
          </div>
          {isDiagnosticMode && (
            <div style={{ background: "rgba(232,92,58,0.08)", borderTop: "1px solid rgba(232,92,58,0.15)", padding: "5px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ fontSize: 9 }}>🔍</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,92,58,0.6)", letterSpacing: 1.5, textTransform: "uppercase" }}>Diagnostic en cours — ton archétype sera révélé</span>
            </div>
          )}
          {challengerScore && (
            <div style={{ background: "rgba(168,85,247,0.08)", borderTop: "1px solid rgba(168,85,247,0.15)", padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 10 }}>⚔️</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(168,85,247,0.8)", letterSpacing: 1 }}>{challenger ? decodeURIComponent(challenger) : "Ton ami"} — {challengerScore.toLocaleString()} RF à battre</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: totalStats.rf >= challengerScore ? "#22c55e" : "rgba(255,255,255,0.3)" }}>{totalStats.rf >= challengerScore ? "✓ EN TÊTE" : `−${(challengerScore - totalStats.rf).toLocaleString()}`}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.04)", padding: "8px 16px", justifyContent: "space-between" }}>
            {[{ icon: "🚩", value: totalStats.rf, label: "RF" }, { icon: "🔥", value: totalStats.chaos, label: "CHAOS" }, { icon: "🐍", value: totalStats.manipulation, label: "MANIP" }, { icon: "💔", value: totalStats.heartbreak, label: "HEARTS" }].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, marginBottom: 1 }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{s.value.toLocaleString()}</div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 80px", opacity: fadeIn ? 1 : 0, transition: "opacity 0.25s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: RED, textTransform: "uppercase" }}>SCÈNE {sceneIndex + 1}/{totalScenes}</div>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>{scene.title}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 20px", marginBottom: 24 }}>
            <div style={{ fontSize: 36, textAlign: "center", marginBottom: 14, lineHeight: 1 }}>{scene.tone}</div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.82)", textAlign: "center" }}>{scene.situation}</p>
          </div>

          {phase === "choice" && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>QUE FAIS-TU ?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {scene.choices.map((choice) => {
                  const tagColor = rfTagColors[choice.rfTag] || "rgba(255,255,255,0.4)";
                  return (
                    <button key={choice.id} onClick={() => handleChoiceSelect(choice)}
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 12, fontFamily: "inherit" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{choice.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: 6 }}>
                          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: tagColor, background: `${tagColor}18`, padding: "2px 7px", borderRadius: 5, textTransform: "uppercase" }}>{choice.rfTag}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.45, fontWeight: 500 }}>{choice.text}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {phase === "consequence" && selectedChoice && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent: "center", flexWrap: "wrap" }}>
                {[{ icon: "🚩", value: selectedChoice.gained.rf, color: RED, label: "RF" }, { icon: "🔥", value: selectedChoice.gained.chaos, color: "#f97316", label: "CHAOS" }, { icon: "🐍", value: selectedChoice.gained.manipulation, color: "#22c55e", label: "MANIP" }, { icon: "💔", value: selectedChoice.gained.heartbreak, color: "#f43f5e", label: "HEARTS" }].map((s) => (
                  <div key={s.label} style={{ background: `${s.color}15`, border: `1px solid ${s.color}30`, borderRadius: 8, padding: "5px 10px", textAlign: "center" }}>
                    <span style={{ fontSize: 12 }}>{s.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: s.color, marginLeft: 4 }}>+{s.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(232,92,58,0.06)", border: "1.5px solid rgba(232,92,58,0.2)", borderRadius: 18, padding: "22px 20px", marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: RED, textTransform: "uppercase", marginBottom: 12 }}>{selectedChoice.icon} CONSÉQUENCE</div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>{selectedChoice.consequence}</p>
              </div>
              <button onClick={handleContinue} style={{ width: "100%", padding: "17px 24px", background: sceneIndex + 1 >= totalScenes ? "linear-gradient(135deg, #a855f7, #7c3aed)" : `linear-gradient(135deg, ${RED}, #c0392b)`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: 0.5, cursor: "pointer" }}>
                {sceneIndex + 1 >= totalScenes ? "VOIR MES RÉSULTATS 🏆" : "SCÈNE SUIVANTE →"}
              </button>
            </div>
          )}
        </div>
      </div>

      {phase === "gameover" && (
        <div style={{ position: "fixed", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ textAlign: "center", padding: "0 32px" }}>
            {(gameOverLines[story.id] || ["GAME", "OVER."]).map((line, i) => (
              <div key={i} style={{ fontFamily: "'Anton', sans-serif", fontSize: i === 0 ? 56 : 68, letterSpacing: "2px", lineHeight: 1, color: i === 0 ? "rgba(255,255,255,0.9)" : RED, textTransform: "uppercase" }}>{line}</div>
            ))}
            <div style={{ marginTop: 32, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>analyzing your damage...</div>
          </div>
        </div>
      )}

      {phase === "analyzing" && finalStats && (
        <div style={{ position: "fixed", inset: 0, background: "#09090f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "0 32px" }}>
          <div style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, color: RED, textTransform: "uppercase", marginBottom: 32, textAlign: "center", opacity: analyzeStep >= 0 ? 1 : 0, transition: "opacity 0.5s ease" }}>
              {isDiagnosticMode ? "🔍 IDENTIFYING YOUR RED FLAG TYPE..." : "🚩 ANALYZING YOUR RED FLAGS..."}
            </div>
            {[{ label: "CHAOS", icon: "🔥", value: finalStats.chaos, max: 500, color: "#f97316", step: 1 }, { label: "MANIPULATION", icon: "🐍", value: finalStats.manipulation, max: 500, color: "#22c55e", step: 2 }, { label: "HEARTBREAK", icon: "💔", value: finalStats.heartbreak, max: 500, color: "#f43f5e", step: 3 }, { label: "RED FLAG", icon: "🚩", value: finalStats.rf, max: 1000, color: RED, step: 4 }].map((s) => {
              const visible = analyzeStep >= s.step;
              const pct = Math.min(100, Math.round((s.value / s.max) * 100));
              return (
                <div key={s.label} style={{ marginBottom: 20, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: "all 0.4s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>{s.icon} {s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: s.color }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, background: s.color, width: visible ? `${pct}%` : "0%", transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 8px ${s.color}80` }} />
                  </div>
                </div>
              );
            })}
            {analyzeStep >= 6 && <div style={{ textAlign: "center" }}><div style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.35)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>YOU ARE</div></div>}
            {analyzeStep >= 7 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{archetype.emoji}</div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 36, letterSpacing: "2px", color: archetype.color, textShadow: `0 0 40px ${archetype.color}60`, textTransform: "uppercase" }}>{archetype.name}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${BASE}; }
        button { font-family: inherit; }
      `}</style>
    </>
  );
}
