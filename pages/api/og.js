import { ImageResponse } from "next/og";

export const config = { runtime: "edge" };

const W = 1080;
const H = 1920;

export default function handler(req) {
  const { searchParams } = new URL(req.url, "https://iamtheredflag.com");

  const title        = (searchParams.get("title") || "RED FLAG").toUpperCase();
  const archetype    = searchParams.get("archetype") || "Red Flag Energy";
  const emoji        = searchParams.get("archetypeEmoji") || "🚩";
  const colorHex     = searchParams.get("archetypeColor") || "E85C3A";
  const color        = `#${colorHex}`;
  const rf           = parseInt(searchParams.get("rf") || "0");
  const chaos        = parseInt(searchParams.get("chaos") || "0");
  const manipulation = parseInt(searchParams.get("manipulation") || "0");
  const heartbreak   = parseInt(searchParams.get("heartbreak") || "0");
  const hearts       = parseInt(searchParams.get("hearts") || "0");
  const toxicity     = parseInt(searchParams.get("toxicity") || "0");
  const sig          = searchParams.get("sig") || searchParams.get("quote") || "I never start drama. I improve it.";
  const storyTitle   = searchParams.get("storyTitle") || "";
  const topPct       = searchParams.get("topPct") || "";

  const maxStat   = Math.max(chaos, manipulation, heartbreak, 1);
  const chaosPct  = Math.min(100, Math.round((chaos / maxStat) * 100));
  const manipPct  = Math.min(100, Math.round((manipulation / maxStat) * 100));
  const heartPct  = Math.min(100, Math.round((heartbreak / maxStat) * 100));

  const archLen     = archetype.length;
  const archFontSize = archLen > 20 ? 64 : archLen > 14 ? 80 : archLen > 10 ? 96 : 112;

  return new ImageResponse(
    (
      <div style={{ width: W, height: H, background: "#09090f", display: "flex", flexDirection: "column", fontFamily: "sans-serif", overflow: "hidden", position: "relative" }}>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 620, background: `linear-gradient(180deg, ${color}35 0%, ${color}08 80%, transparent 100%)`, display: "flex" }} />

        <div style={{ position: "absolute", top: -150, right: -150, width: 600, height: 600, background: `radial-gradient(circle, ${color}20 0%, transparent 65%)`, display: "flex" }} />
        <div style={{ position: "absolute", bottom: -100, left: -100, width: 500, height: 500, background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 65%)", display: "flex" }} />

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${color}, #a855f7, ${color})`, display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "56px 72px 56px", position: "relative", zIndex: 1 }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28, display: "flex" }}>🚩</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", display: "flex" }}>I AM THE RED FLAG</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: 2, textTransform: "uppercase", display: "flex" }}>iamtheredflag.com</span>
              </div>
            </div>
            {storyTitle && (
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: color, background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 20, padding: "7px 20px", display: "flex", textTransform: "uppercase" }}>
                {storyTitle}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 40 }}>
            <div style={{ fontSize: 96, lineHeight: 1, display: "flex", marginBottom: 20, filter: `drop-shadow(0 0 40px ${color}80)` }}>
              {emoji}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 4, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", display: "flex", marginBottom: 10 }}>
              YOU ARE
            </div>
            <div style={{ fontSize: archFontSize, fontWeight: 900, color, lineHeight: 0.9, letterSpacing: "-3px", textTransform: "uppercase", display: "flex", textShadow: `0 0 80px ${color}60`, marginBottom: 32 }}>
              {archetype.toUpperCase()}
            </div>
            <div style={{ fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,0.55)", lineHeight: 1.4, display: "flex", maxWidth: 860, borderLeft: `4px solid ${color}`, paddingLeft: 20 }}>
              "{sig}"
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", display: "flex", marginBottom: 40 }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", display: "flex" }}>TITRE OBTENU</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-1px", display: "flex" }}>{title}</span>
            </div>
            {topPct && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${color}15`, border: `1px solid ${color}35`, borderRadius: 100, padding: "10px 24px" }}>
                <span style={{ fontSize: 16, display: "flex" }}>🏆</span>
                <span style={{ fontSize: 18, fontWeight: 900, color, display: "flex" }}>{topPct.toUpperCase()} DES RED FLAGS</span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20, display: "flex" }}>🚩</span>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", display: "flex" }}>RED FLAG POINTS</span>
            </div>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#fff", letterSpacing: "-2px", display: "flex" }}>{rf.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 56, flex: 1 }}>
            {[
              { label: "TOXICITY",     value: toxicity, color: "#E85C3A", icon: "😈" },
              { label: "CHAOS",        value: chaosPct, color: "#f97316", icon: "🔥" },
              { label: "MANIPULATION", value: manipPct, color: "#22c55e", icon: "🐍" },
              { label: "HEARTBREAK",   value: heartPct, color: "#f43f5e", icon: "💔" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 16, width: 24, display: "flex" }}>{s.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", width: 180, display: "flex", flexShrink: 0 }}>{s.label}</span>
                <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden", display: "flex" }}>
                  <div style={{ height: "100%", width: `${s.value}%`, background: s.color, borderRadius: 5, boxShadow: `0 0 12px ${s.color}80`, display: "flex" }} />
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: s.color, width: 60, textAlign: "right", display: "flex", justifyContent: "flex-end" }}>{s.value}%</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ background: "#fff", color: "#09090f", fontSize: 14, fontWeight: 900, padding: "8px 16px", borderRadius: 4, display: "flex", transform: "rotate(-1.5deg)", letterSpacing: 0.5 }}>
              Why avoid red flags when you can become one?
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, display: "flex" }}>💔</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: 1, display: "flex" }}>{hearts} hearts broken</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H }
  );
}
