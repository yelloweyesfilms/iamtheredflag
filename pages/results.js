import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ARCHETYPES, STORIES, getLevelTitle, getShareQuote } from "../lib/redFlagData";
import { computeNewBadges, recordStoryPlayed, updateBestRF, markHofSubmitted } from "../lib/redFlagBadges";
import RedFlagNav from "../components/RedFlagNav";

const ARCHETYPE_SIGNATURES = {
  "red-flag-energy":       "Tu assumes. Tu ne t'excuses pas. Tu recommences.",
  "emotionally-expensive": "Les autres paient le prix de ta présence. Et ils reviennent.",
  "delusional":            "La réalité est une option. Tu as choisi la tienne.",
  "heartbreaker":          "Tu n'as même pas à essayer. C'est pire.",
  "master-manipulator":    "Tu ne mens jamais. Tu reformules juste la vérité.",
  "chaos-director":        "Tu n'as pas commencé l'incendie. Enfin si.",
  "toxic-queen":           "La couronne ne glisse pas. Elle étouffe.",
  "main-character":        "Tout le monde joue un rôle dans ton histoire. Spoiler : c'est le tien.",
};

const IDENTITY_LINES = {
  "red-flag-energy":       "If life were a warning sign, you'd be the one everyone ignores.",
  "emotionally-expensive": "Being with you is free. Recovering from you isn't.",
  "delusional":            "Your version of events is the only version that matters.",
  "heartbreaker":          "You didn't ask to be dangerous. You just are.",
  "master-manipulator":    "The story always ends how you planned.",
  "chaos-director":        "You didn't start the fire. But you handed someone the lighter.",
  "toxic-queen":           "The crown doesn't slip. It suffocates.",
  "main-character":        "Everyone has a role. You have all of them.",
};

function getTopPct(rfPoints) {
  if (rfPoints >= 2000) return "top 5%";
  if (rfPoints >= 1500) return "top 10%";
  if (rfPoints >= 1000) return "top 20%";
  if (rfPoints >= 600)  return "top 35%";
  if (rfPoints >= 300)  return "top 50%";
  return "top 70%";
}

function getRarity(rfPoints) {
  if (rfPoints >= 18000) return { label: "MYTHIC",    color: "#ff6b6b", gradient: "linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #ff6b6b)", glow: "#ff6b6b" };
  if (rfPoints >= 8000)  return { label: "LEGENDARY", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #fde68a, #f59e0b)", glow: "#f59e0b" };
  if (rfPoints >= 3000)  return { label: "EPIC",      color: "#a855f7", gradient: "linear-gradient(135deg, #a855f7, #c084fc, #a855f7)", glow: "#a855f7" };
  if (rfPoints >= 1000)  return { label: "RARE",      color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #60a5fa, #3b82f6)", glow: "#3b82f6" };
  if (rfPoints >= 300)   return { label: "UNCOMMON",  color: "#22c55e", gradient: "linear-gradient(135deg, #22c55e, #4ade80, #22c55e)", glow: "#22c55e" };
  return                        { label: "COMMON",    color: "#94a3b8", gradient: "linear-gradient(135deg, #94a3b8, #cbd5e1, #94a3b8)", glow: "#94a3b8" };
}

export async function getServerSideProps({ query }) {
  const { story: storyId, archetype: archetypeId, rf, chaos, manipulation, heartbreak, hearts } = query;
  const story = STORIES.find((s) => s.id === storyId) || null;
  const archetype = ARCHETYPES.find((a) => a.id === archetypeId) || null;
  const rfPoints = parseInt(rf || "0");
  const chaosScore = parseInt(chaos || "0");
  const manipScore = parseInt(manipulation || "0");
  const heartScore = parseInt(heartbreak || "0");
  const heartsBroken = parseInt(hearts || "0");
  const maxStat = Math.max(rfPoints, chaosScore, manipScore, heartScore, 100);
  const title = getLevelTitle(rfPoints);
  const quote = getShareQuote(title);
  const toxicityPct = Math.min(100, Math.round(((chaosScore + manipScore + heartScore) / (maxStat * 3)) * 100));
  const sig = ARCHETYPE_SIGNATURES[archetypeId] || quote;
  const topPct = getTopPct(rfPoints);
  const ogCardUrl = storyId
    ? `https://iamtheredflag.com/api/og?` + new URLSearchParams({
        title, archetype: archetype?.name || "", archetypeEmoji: archetype?.emoji || "🚩",
        archetypeColor: archetype?.color?.replace("#", "") || "E85C3A",
        rf: String(rfPoints), chaos: String(chaosScore), manipulation: String(manipScore),
        heartbreak: String(heartScore), hearts: String(heartsBroken),
        toxicity: String(toxicityPct), sig, topPct, storyTitle: story?.title || "",
      }).toString()
    : "";
  return {
    props: { ssrTitle: title, ssrQuote: quote, ssrArchetypeName: archetype?.name || "", ssrArchetypeEmoji: archetype?.emoji || "🚩", ssrOgCardUrl: ogCardUrl },
  };
}

const BASE = "#09090f";
const RED = "#E85C3A";

export default function ResultsPage({ ssrTitle, ssrQuote, ssrArchetypeName, ssrArchetypeEmoji, ssrOgCardUrl }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newBadges, setNewBadges] = useState([]);

  const { story: storyId, archetype: archetypeId, rf, chaos, manipulation, heartbreak, hearts, challenger_rf, challenger } = router.query;
  const challengerScore = challenger_rf ? parseInt(challenger_rf) : null;
  const rfPoints = parseInt(rf || "0");
  const chaosScore = parseInt(chaos || "0");
  const manipScore = parseInt(manipulation || "0");
  const heartScore = parseInt(heartbreak || "0");
  const heartsBroken = parseInt(hearts || "0");

  useEffect(() => {
    setMounted(true);
    if (storyId && rf) {
      updateBestRF(rfPoints);
      recordStoryPlayed(storyId);
      const earned = computeNewBadges({ rf: rfPoints, chaos: chaosScore, manipulation: manipScore, hearts: heartsBroken, archetypeId, storyId, wonVersus: null, hofSubmitted: false });
      if (earned.length > 0) setNewBadges(earned);
    }
    const t1 = setTimeout(() => setPhase(1), 60);
    const t2 = setTimeout(() => setPhase(2), 400);
    const t3 = setTimeout(() => setPhase(3), 750);
    const t4 = setTimeout(() => setPhase(4), 1050);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (!mounted || !storyId) return null;

  const story = STORIES.find((s) => s.id === storyId);
  const archetype = ARCHETYPES.find((a) => a.id === archetypeId);
  const color = archetype?.color || RED;
  const rarity = getRarity(rfPoints);
  const maxStat = Math.max(rfPoints, chaosScore, manipScore, heartScore, 1);
  const title = getLevelTitle(rfPoints);
  const toxicityPct = Math.min(100, Math.round(((chaosScore + manipScore + heartScore) / (maxStat * 3)) * 100));
  const topPct = getTopPct(rfPoints);
  const signature = ARCHETYPE_SIGNATURES[archetypeId] || ssrQuote;
  const identityLine = IDENTITY_LINES[archetypeId] || signature;
  const isMobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  const traitMax = Math.max(chaosScore, manipScore, heartScore, toxicityPct, 1);
  const traits = [
    { label: "Manipulation", icon: "🐍", value: Math.round((manipScore  / traitMax) * 100), color: "#22c55e" },
    { label: "Chaos",        icon: "🔥", value: Math.round((chaosScore   / traitMax) * 100), color: "#f97316" },
    { label: "Heartbreak",   icon: "💔", value: Math.round((heartScore   / traitMax) * 100), color: "#f43f5e" },
    { label: "Toxicité",     icon: "😈", value: toxicityPct,                                  color: RED       },
  ].sort((a, b) => b.value - a.value);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/results?${new URLSearchParams(router.query).toString()}` : "";
  const ogCardUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/og?` + new URLSearchParams({
        title, archetype: archetype?.name || "", archetypeEmoji: archetype?.emoji || "🚩",
        archetypeColor: archetype?.color?.replace("#", "") || "E85C3A",
        rf: String(rfPoints), chaos: String(chaosScore), manipulation: String(manipScore),
        heartbreak: String(heartScore), hearts: String(heartsBroken),
        toxicity: String(toxicityPct), sig: signature, topPct, storyTitle: story?.title || "",
      }).toString()
    : "";

  const fade = (p, extra = {}) => ({ opacity: phase >= p ? 1 : 0, transform: phase >= p ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)", ...extra });

  async function handleShare() {
    const text = `🚩 I AM THE RED FLAG\n\n${archetype?.emoji} ${archetype?.name?.toUpperCase()}\n\n"${identityLine}"\n\n${topPct} des Red Flags · ${rfPoints.toLocaleString()} pts\n\n${shareUrl}`;
    if (navigator.share) {
      try { await navigator.share({ title: "I AM THE RED FLAG 🚩", text, url: shareUrl }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    }
  }

  async function handleSaveCard() {
    if (!ogCardUrl) return;
    try {
      const res = await fetch(ogCardUrl); const blob = await res.blob();
      const url = URL.createObjectURL(blob); const a = document.createElement("a");
      a.href = url; a.download = `red-flag-${archetypeId || "card"}.png`; a.click(); URL.revokeObjectURL(url);
    } catch { window.open(ogCardUrl, "_blank"); }
  }

  async function handleInstagramShare() {
    if (!ogCardUrl) return;
    try {
      const res = await fetch(ogCardUrl); const blob = await res.blob();
      const file = new File([blob], "red-flag-card.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "I AM THE RED FLAG 🚩" }); return; }
    } catch {}
    handleSaveCard();
  }

  async function handleHofSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pseudo: pseudo.trim() || "Anonyme", archetype: archetype?.name || "", archetypeEmoji: archetype?.emoji || "🚩", archetypeColor: archetype?.color?.replace("#", "") || "E85C3A", storyTitle: story?.title || "", storyEmoji: story?.emoji || "", title, rf: rfPoints, chaos: chaosScore, manipulation: manipScore, heartbreak: heartScore, toxicity: toxicityPct }) });
      markHofSubmitted();
      const hofBadge = computeNewBadges({ rf: rfPoints, chaos: chaosScore, manipulation: manipScore, hearts: heartsBroken, archetypeId, storyId, wonVersus: null, hofSubmitted: true });
      if (hofBadge.length > 0) setNewBadges((prev) => [...prev, ...hofBadge]);
      setSubmitted(true);
    } catch {}
    setSubmitting(false);
  }

  const archetypeWords = (archetype?.name || ssrArchetypeName || "").toUpperCase().split(" ");

  return (
    <>
      <Head>
        <title>{ssrTitle} — I AM THE RED FLAG 🚩</title>
        <meta name="description" content={`"${ssrQuote}" — ${ssrArchetypeName} 🚩`} />
        <meta property="og:title" content={`${ssrArchetypeEmoji} ${ssrTitle} — I AM THE RED FLAG`} />
        <meta property="og:description" content={`"${ssrQuote}" — ${ssrArchetypeName}`} />
        <meta property="og:site_name" content="I AM THE RED FLAG" />
        <meta property="og:type" content="website" />
        {ssrOgCardUrl && <meta property="og:image" content={ssrOgCardUrl} />}
        <meta property="og:image:width" content="1080" />
        <meta property="og:image:height" content="1920" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${ssrArchetypeEmoji} ${ssrTitle} — I AM THE RED FLAG`} />
        <meta name="twitter:description" content={`"${ssrQuote}"`} />
        {ssrOgCardUrl && <meta name="twitter:image" content={ssrOgCardUrl} />}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: BASE, color: "#fff", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>
        <div style={{ ...fade(1), position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px 48px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 120% 80% at 50% 0%, ${color}22 0%, transparent 65%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 800, letterSpacing: 3, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", whiteSpace: "nowrap" }}>🚩 I AM THE RED FLAG</div>
          <div style={{ marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6, background: `${rarity.color}15`, border: `1px solid ${rarity.color}50`, borderRadius: 100, padding: "5px 14px" }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: 2.5, color: rarity.color, textTransform: "uppercase" }}>◆ {rarity.label}</span>
          </div>
          <div style={{ fontSize: 56, marginBottom: 16, filter: `drop-shadow(0 0 32px ${color}80)`, lineHeight: 1 }}>{archetype?.emoji || "🚩"}</div>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            {archetypeWords.map((word, i) => (
              <div key={i} style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(52px, 17vw, 80px)", letterSpacing: "1px", lineHeight: 0.92, color: "#fff", textTransform: "uppercase", textShadow: `0 0 80px ${color}60`, display: "block" }}>{word}</div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: "clamp(15px, 4.2vw, 19px)", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, maxWidth: 320, marginBottom: 32 }}>"{identityLine}"</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `${color}20`, border: `1px solid ${color}45`, borderRadius: 100, padding: "7px 18px" }}>
            <span style={{ fontSize: 12 }}>🏆</span>
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: "2px", color, textTransform: "uppercase" }}>{topPct.toUpperCase()} DES RED FLAGS</span>
          </div>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 2, textTransform: "uppercase", animation: "bounce 2s ease infinite" }}>↓</div>
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 18px 100px" }}>
          <div style={{ ...fade(2), marginTop: 40, textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10 }}>🏆 TITLE UNLOCKED</div>
            <div style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif", fontSize: "clamp(34px, 10vw, 48px)", letterSpacing: "3px", color: "#fff", lineHeight: 1, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>{rfPoints.toLocaleString()} RF POINTS · {story?.emoji} {story?.title}</div>
          </div>

          <div style={{ ...fade(3), marginTop: 36 }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>POWER TRAITS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {traits.map((t, i) => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 14, background: i === 0 ? `${t.color}10` : "rgba(255,255,255,0.025)", border: `1px solid ${i === 0 ? t.color + "35" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
                  {i === 0 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: t.color }} />}
                  <div style={{ fontSize: i === 0 ? 28 : 22, lineHeight: 1, flexShrink: 0 }}>{t.icon}</div>
                  <div style={{ flex: 1, fontFamily: "'Anton', sans-serif", fontSize: i === 0 ? 16 : 13, letterSpacing: "1px", color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{t.label}</div>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: i === 0 ? 32 : 22, color: i === 0 ? t.color : "rgba(255,255,255,0.35)", lineHeight: 1 }}>{t.value}%</div>
                </div>
              ))}
            </div>
            {heartsBroken > 0 && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.15)", borderRadius: 14, padding: "10px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>💔</span><span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1 }}>Cœurs brisés</span></div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, color: "#f43f5e", lineHeight: 1 }}>{"💔".repeat(Math.min(heartsBroken, 5))}</div>
              </div>
            )}
          </div>

          {newBadges.length > 0 && (
            <div style={{ ...fade(3), marginTop: 20, background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 18, padding: "18px" }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: "#f59e0b", textTransform: "uppercase", marginBottom: 12 }}>🏅 BADGES DÉBLOQUÉS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {newBadges.map((badge) => (
                  <div key={badge.id} style={{ display: "flex", alignItems: "center", gap: 8, background: `${badge.rarityColor}12`, border: `1px solid ${badge.rarityColor}30`, borderRadius: 10, padding: "8px 12px" }}>
                    <span style={{ fontSize: 18 }}>{badge.emoji}</span>
                    <div><div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{badge.name}</div><div style={{ fontSize: 9, color: badge.rarityColor, fontWeight: 700, letterSpacing: 1 }}>{badge.rarity.toUpperCase()}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ ...fade(4), marginTop: 36 }}>
            {isMobile ? (
              <>
                <button onClick={handleInstagramShare} style={{ width: "100%", padding: "20px 24px", background: `linear-gradient(135deg, ${color} 0%, ${color}cc 50%, #a855f7 100%)`, border: "none", borderRadius: 18, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: "2.5px", cursor: "pointer", boxShadow: `0 16px 48px ${color}50`, textTransform: "uppercase", marginBottom: 8 }}>📲 PARTAGER MA CARTE</button>
                <button onClick={handleShare} style={{ width: "100%", padding: "13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, color: "rgba(255,255,255,0.45)", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 4 }}>{copied ? "✓ COPIÉ !" : "🔗 Copier le lien"}</button>
              </>
            ) : (
              <>
                <button onClick={handleShare} style={{ width: "100%", padding: "20px 24px", background: `linear-gradient(135deg, ${color}, ${color}cc)`, border: "none", borderRadius: 18, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: "2.5px", cursor: "pointer", boxShadow: `0 16px 48px ${color}45`, textTransform: "uppercase", marginBottom: 8 }}>{copied ? "✓ LIEN COPIÉ !" : "🔗 PARTAGER MON RÉSULTAT"}</button>
                <button onClick={handleSaveCard} style={{ width: "100%", padding: "13px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: "rgba(255,255,255,0.35)", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 4 }}>💾 Télécharger ma carte (PNG)</button>
              </>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: `${color}06`, border: `1px solid ${color}20`, borderRadius: 14, padding: "14px 18px", marginTop: 14, marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, letterSpacing: "1px", color: "#fff", lineHeight: 1 }}>⚔️ VERSUS</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}><span style={{ color }}>{rfPoints.toLocaleString()} RF</span> à battre</div>
              </div>
              <button onClick={() => {
                const challengeUrl = `${shareUrl}&challenger_rf=${rfPoints}&challenger=${encodeURIComponent(archetype?.name || "Red Flag")}`;
                const text = `⚔️ Je te défie sur I AM THE RED FLAG !\n\n${archetype?.emoji || "🚩"} ${archetype?.name?.toUpperCase()} — ${rfPoints.toLocaleString()} RF à battre\n\n`;
                if (navigator.share) { navigator.share({ title: "⚔️ Red Flag Versus", text, url: challengeUrl }).catch(() => {}); }
                else { navigator.clipboard.writeText(text + challengeUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }
              }} style={{ flexShrink: 0, padding: "10px 18px", background: `linear-gradient(135deg, ${color}, ${color}cc)`, border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 13, letterSpacing: "1px", cursor: "pointer" }}>ENVOYER →</button>
            </div>

            <div style={{ background: "rgba(232,92,58,0.04)", border: "1px solid rgba(232,92,58,0.15)", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
              {submitted ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div><div style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, color: "#fff", letterSpacing: "1px" }}>🏆 DANS LE HALL OF FAME</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{rfPoints.toLocaleString()} RF enregistrés</div></div>
                  <a href="/hall-of-fame" style={{ fontSize: 11, fontWeight: 800, color: RED, textDecoration: "none", background: `${RED}12`, border: `1px solid ${RED}28`, borderRadius: 8, padding: "7px 12px", whiteSpace: "nowrap" }}>VOIR →</a>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 15, letterSpacing: "1px", color: "#fff", marginBottom: 10 }}>🏆 HALL OF FAME</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value.slice(0, 20))} placeholder="Ton pseudo..." maxLength={20} style={{ flex: 1, padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                    <button onClick={handleHofSubmit} disabled={submitting} style={{ flexShrink: 0, padding: "10px 18px", background: submitting ? "rgba(232,92,58,0.3)" : `linear-gradient(135deg, ${RED}, #c0392b)`, border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: "1px", cursor: submitting ? "default" : "pointer" }}>{submitting ? "..." : "GO"}</button>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
              <a href="/confessions" style={{ padding: "12px 6px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}><span style={{ fontSize: 18 }}>😈</span><span>Confesser</span></a>
              <a href={`/play?story=${storyId}&archetype=${archetypeId}`} style={{ padding: "12px 6px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}><span style={{ fontSize: 18 }}>🔄</span><span>Rejouer</span></a>
              <a href="/" style={{ padding: "12px 6px", background: `${color}10`, border: `1px solid ${color}28`, borderRadius: 12, color, fontSize: 11, fontWeight: 800, textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}><span style={{ fontSize: 18 }}>🚩</span><span>Autre drama</span></a>
            </div>

            <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.1)", lineHeight: 1.8 }}>
              I AM THE RED FLAG — Simulation dramatique fictive et satirique.<br />
              <a href="https://verticalclap.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(232,92,58,0.22)", textDecoration: "none", fontWeight: 700 }}>Powered by Vertical Clap</a>
            </p>
          </div>
        </div>
      </div>

      <RedFlagNav />

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${BASE}; }
        button { font-family: inherit; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.15; } 50% { transform: translateX(-50%) translateY(6px); opacity: 0.35; } }
      `}</style>
    </>
  );
}
