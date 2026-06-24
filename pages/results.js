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
  if (rfPoints >= 18000) return { label: "MYTHIC",    color: "#ff6b6b" };
  if (rfPoints >= 8000)  return { label: "LEGENDARY", color: "#f59e0b" };
  if (rfPoints >= 3000)  return { label: "EPIC",      color: "#a855f7" };
  if (rfPoints >= 1000)  return { label: "RARE",      color: "#3b82f6" };
  if (rfPoints >= 300)   return { label: "UNCOMMON",  color: "#22c55e" };
  return                        { label: "COMMON",    color: "#94a3b8" };
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

const BASE = "#06040a";
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [cardImageLoaded, setCardImageLoaded] = useState(false);

  const { story: storyId, archetype: archetypeId, rf, chaos, manipulation, heartbreak, hearts } = router.query;
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
    { label: "Toxicité",     icon: "😈", value: toxicityPct,                                  color: RED        },
    { label: "Chaos",        icon: "🔥", value: Math.round((chaosScore   / traitMax) * 100), color: "#f97316"  },
    { label: "Manipulation", icon: "🐍", value: Math.round((manipScore   / traitMax) * 100), color: "#22c55e"  },
    { label: "Cœurs brisés", icon: "💔", value: Math.round((heartScore   / traitMax) * 100), color: "#f43f5e"  },
  ];

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

  const fade = (p) => ({
    opacity: phase >= p ? 1 : 0,
    transform: phase >= p ? "translateY(0)" : "translateY(24px)",
    transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
  });

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

      <div style={{ minHeight: "100vh", background: BASE, color: "#fff", fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div style={{ ...fade(1), position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 24px 48px", overflow: "hidden" }}>
          {/* glows */}
          <div style={{ position: "absolute", top: -160, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: `radial-gradient(circle, ${color}40 0%, ${color}15 45%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -120, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
          {/* stripes */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${color}, #ff0040, ${color})` }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${color}, #ff0040, ${color})` }} />

          {/* header */}
          <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 13 }}>🚩</span>
            <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>I AM THE RED FLAG</span>
          </div>

          {/* rarity badge */}
          <div style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 6, background: `${rarity.color}18`, border: `1px solid ${rarity.color}50`, borderRadius: 100, padding: "5px 16px" }}>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 3, color: rarity.color, textTransform: "uppercase" }}>◆ {rarity.label}</span>
          </div>

          {/* emoji */}
          <div style={{ fontSize: 72, marginBottom: 12, filter: `drop-shadow(0 0 40px ${color}90)`, lineHeight: 1 }}>{archetype?.emoji || "🚩"}</div>

          {/* TU ES label */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, width: "100%", maxWidth: 340 }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${color}50)` }} />
            <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 5, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>TU ES</span>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}50, transparent)` }} />
          </div>

          {/* archetype name */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            {(archetype?.name || ssrArchetypeName || "").toUpperCase().split(" ").map((word, i) => (
              <div key={i} style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(54px, 18vw, 86px)", letterSpacing: "1px", lineHeight: 0.9, color: "#fff", textShadow: `0 0 60px ${color}70, 0 0 120px ${color}30`, display: "block" }}>{word}</div>
            ))}
          </div>

          {/* quote */}
          <div style={{ textAlign: "center", fontSize: "clamp(14px, 4vw, 18px)", fontStyle: "italic", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, maxWidth: 300, marginBottom: 28 }}>
            "{identityLine}"
          </div>

          {/* RF pts + top% */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: `${color}18`, border: `1px solid ${color}45`, borderRadius: 100, padding: "7px 16px" }}>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 15, letterSpacing: "2px", color, textTransform: "uppercase" }}>🚩 {rfPoints.toLocaleString()} RF</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "7px 16px" }}>
              <span style={{ fontSize: 11 }}>👑</span>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 13, letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{topPct.toUpperCase()}</span>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "rgba(255,255,255,0.15)", animation: "bounce 2s ease infinite" }}>↓</div>
        </div>

        {/* ── CARTE + PARTAGE ──────────────────────────────────── */}
        <div style={{ ...fade(2), padding: "48px 24px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 4, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>TA CARTE</div>

          {/* card preview */}
          <div onClick={() => ogCardUrl && setShowShareModal(true)} style={{ cursor: "pointer", position: "relative", marginBottom: 24, display: "inline-block" }}>
            {!cardImageLoaded && ogCardUrl && (
              <div style={{ width: "min(240px, 68vw)", aspectRatio: "9/16", background: `${color}08`, borderRadius: 20, border: `2px dashed ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 40, opacity: 0.3 }}>🚩</span>
              </div>
            )}
            {ogCardUrl && (
              <img
                src={ogCardUrl}
                onLoad={() => setCardImageLoaded(true)}
                style={{ width: "min(240px, 68vw)", borderRadius: 20, display: cardImageLoaded ? "block" : "none", boxShadow: `0 24px 80px ${color}60, 0 0 0 2px ${color}50` }}
                alt="Carte Red Flag"
              />
            )}
            {cardImageLoaded && (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)", borderRadius: 20, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14 }}>
                <div style={{ background: color, borderRadius: 100, padding: "5px 16px", fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: 2, textTransform: "uppercase" }}>AGRANDIR →</div>
              </div>
            )}
          </div>

          {/* share button */}
          <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => setShowShareModal(true)}
              style={{ width: "100%", padding: "22px 24px", background: `linear-gradient(135deg, ${color} 0%, #c0392b 50%, #a855f7 100%)`, border: "none", borderRadius: 18, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: "2px", cursor: "pointer", boxShadow: `0 16px 60px ${color}50`, textTransform: "uppercase" }}
            >
              📲 PARTAGER MA CARTE
            </button>
            <button
              onClick={() => {
                const challengeUrl = `${shareUrl}&challenger_rf=${rfPoints}&challenger=${encodeURIComponent(archetype?.name || "Red Flag")}`;
                const text = `⚔️ Je te défie sur I AM THE RED FLAG !\n\n${archetype?.emoji || "🚩"} ${archetype?.name?.toUpperCase()} — ${rfPoints.toLocaleString()} RF à battre\n\n`;
                if (navigator.share) { navigator.share({ title: "⚔️ Red Flag Versus", text, url: challengeUrl }).catch(() => {}); }
                else { navigator.clipboard.writeText(text + challengeUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }
              }}
              style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${color}30`, borderRadius: 14, color: "rgba(255,255,255,0.5)", fontFamily: "inherit", fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: 0.5 }}
            >
              ⚔️ Défier quelqu'un — {rfPoints.toLocaleString()} RF à battre
            </button>
            <a
              href="https://wearthedrama.com/collections/red-flags%E2%84%A2"
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "100%", padding: "13px", background: `${color}06`, border: `1px solid ${color}20`, borderRadius: 14, color, fontFamily: "inherit", fontSize: 13, fontWeight: 800, textDecoration: "none", textAlign: "center", display: "block", boxSizing: "border-box" }}
            >
              👕 PORTER MON ARCHÉTYPE IRL →
            </a>
          </div>
        </div>

        {/* ── STATS ────────────────────────────────────────────── */}
        <div style={{ ...fade(3), maxWidth: 440, margin: "0 auto", padding: "48px 24px 0" }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 4, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>POWER STATS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {traits.map((t) => (
              <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 22, width: 30, flexShrink: 0 }}>{t.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", width: 110, flexShrink: 0 }}>{t.label}</span>
                <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${t.value}%`, background: `linear-gradient(90deg, ${t.color}cc, ${t.color})`, borderRadius: 5, boxShadow: `0 0 12px ${t.color}80` }} />
                </div>
                <span style={{ fontSize: 22, fontWeight: 900, color: t.color, width: 56, textAlign: "right", fontFamily: "'Anton', sans-serif", letterSpacing: "1px" }}>{t.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TITRE + HOF ───────────────────────────────────────── */}
        <div style={{ ...fade(3), maxWidth: 440, margin: "0 auto", padding: "32px 24px 0" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "20px 24px", marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 6 }}>🏆 TITRE OBTENU</div>
            <div style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif", fontSize: "clamp(30px, 9vw, 42px)", letterSpacing: "2px", color: "#fff", lineHeight: 1 }}>{title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4, letterSpacing: 1 }}>{story?.emoji} {story?.title}</div>
          </div>

          {/* Hall of Fame */}
          <div style={{ background: `${RED}05`, border: `1px solid ${RED}18`, borderRadius: 18, padding: "20px 24px", marginBottom: 12 }}>
            {submitted ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 17, color: "#fff", letterSpacing: "1px" }}>🏆 DANS LE HALL OF FAME</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{rfPoints.toLocaleString()} RF enregistrés</div>
                </div>
                <a href="/hall-of-fame" style={{ fontSize: 11, fontWeight: 800, color: RED, textDecoration: "none", background: `${RED}12`, border: `1px solid ${RED}28`, borderRadius: 8, padding: "7px 12px", whiteSpace: "nowrap" }}>VOIR →</a>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 15, letterSpacing: "1px", color: "#fff", marginBottom: 12 }}>🏆 HALL OF FAME</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value.slice(0, 20))} placeholder="Ton pseudo..." maxLength={20} style={{ flex: 1, padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                  <button onClick={handleHofSubmit} disabled={submitting} style={{ flexShrink: 0, padding: "11px 20px", background: submitting ? "rgba(232,92,58,0.3)" : `linear-gradient(135deg, ${RED}, #c0392b)`, border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 15, letterSpacing: "1px", cursor: submitting ? "default" : "pointer" }}>{submitting ? "..." : "GO"}</button>
                </div>
              </>
            )}
          </div>

          {/* badges */}
          {newBadges.length > 0 && (
            <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 18, padding: "18px 24px", marginBottom: 12 }}>
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
        </div>

        {/* ── NAV LINKS ─────────────────────────────────────────── */}
        <div style={{ ...fade(4), maxWidth: 440, margin: "0 auto", padding: "24px 24px 100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
            <a href="/confessions" style={{ padding: "14px 6px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><span style={{ fontSize: 20 }}>😈</span><span>Confesser</span></a>
            <a href={`/play?story=${storyId}&archetype=${archetypeId}`} style={{ padding: "14px 6px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><span style={{ fontSize: 20 }}>🔄</span><span>Rejouer</span></a>
            <a href="/" style={{ padding: "14px 6px", background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 14, color, fontSize: 11, fontWeight: 800, textDecoration: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><span style={{ fontSize: 20 }}>🚩</span><span>Autre drama</span></a>
          </div>
          <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.1)", lineHeight: 1.8 }}>
            I AM THE RED FLAG — Simulation dramatique fictive et satirique.<br />
            <a href="https://verticalclap.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(232,92,58,0.22)", textDecoration: "none", fontWeight: 700 }}>Powered by Vertical Clap</a>
          </p>
        </div>
      </div>

      <RedFlagNav />

      {/* ── SHARE MODAL ───────────────────────────────────────── */}
      {showShareModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowShareModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "24px 24px 60px", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
        >
          <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button
              onClick={() => setShowShareModal(false)}
              style={{ alignSelf: "flex-end", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "8px 18px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: 1, marginBottom: 20, textTransform: "uppercase", fontFamily: "inherit" }}
            >✕ Fermer</button>

            <img src={ogCardUrl} style={{ width: "min(280px, 76vw)", borderRadius: 20, marginBottom: 28, boxShadow: `0 24px 80px ${color}70, 0 0 0 2px ${color}50` }} alt="Carte Red Flag" />

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={async () => { isMobile ? await handleInstagramShare() : await handleShare(); }}
                style={{ width: "100%", padding: "22px", background: `linear-gradient(135deg, ${color}, #a855f7)`, border: "none", borderRadius: 16, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 24, letterSpacing: "2px", cursor: "pointer", boxShadow: `0 12px 40px ${color}50`, textTransform: "uppercase" }}
              >
                📲 {isMobile ? "PARTAGER" : "COPIER LE LIEN"}
              </button>
              {isMobile && (
                <button
                  onClick={handleShare}
                  style={{ width: "100%", padding: "15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, color: "rgba(255,255,255,0.5)", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  {copied ? "✓ COPIÉ !" : "🔗 Copier le lien"}
                </button>
              )}
              <button
                onClick={handleSaveCard}
                style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, color: "rgba(255,255,255,0.3)", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                💾 Télécharger la carte (PNG)
              </button>
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.12)", marginTop: 24, textAlign: "center", lineHeight: 1.7 }}>
              Enregistre l'image puis colle-la dans tes stories Instagram ou TikTok
            </p>
          </div>
        </div>
      )}

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
