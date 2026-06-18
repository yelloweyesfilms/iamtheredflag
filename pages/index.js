import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ARCHETYPES, STORIES } from "../lib/redFlagData";
import RedFlagNav from "../components/RedFlagNav";

const BASE = "#09090f";
const RED = "#E85C3A";

const TAGS = ["CHAOS", "MANIPULATION", "HEARTBREAK", "GASLIGHTING", "RED FLAG ENERGY", "MAIN CHARACTER", "TOXIC QUEEN", "DRAMA", "NOT SORRY"];

const RARITIES = {
  "red-flag-energy":       { label: "ICONIC",     color: RED },
  "emotionally-expensive": { label: "RARE",        color: "#f59e0b" },
  "delusional":            { label: "EPIC",        color: "#ec4899" },
  "heartbreaker":          { label: "RARE",        color: "#f43f5e" },
  "master-manipulator":    { label: "LEGENDARY",   color: "#22c55e" },
  "chaos-director":        { label: "LEGENDARY",   color: "#f97316" },
  "toxic-queen":           { label: "MYTHIC",      color: "#a855f7" },
  "main-character":        { label: "EPIC",        color: "#a855f7" },
};

export default function RedFlagHub() {
  const router = useRouter();
  const [step, setStep] = useState("landing");
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [hoveredArchetype, setHoveredArchetype] = useState(null);
  const [hoveredStory, setHoveredStory] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const count = parseInt(localStorage.getItem("rf_games_played") || "0");
    setGamesPlayed(count);
  }, []);

  function handleSelectArchetype(a) {
    setSelectedArchetype(a);
    setStep("stories");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePlayStory(story) {
    if (!story.available) return;
    if (selectedArchetype) {
      router.push(`/play?story=${story.id}&archetype=${selectedArchetype.id}`);
    } else {
      router.push(`/play?story=${story.id}`);
    }
  }

  return (
    <>
      <Head>
        <title>I AM THE RED FLAG 🚩 — not sorry.</title>
        <meta name="description" content="Pour une fois, tu es le problème. Mens. Manipule. Crée le chaos. Découvre ton archétype Red Flag." />
        <meta property="og:title" content="I AM THE RED FLAG 🚩 — not sorry." />
        <meta property="og:description" content="Pour une fois, tu n'es pas la victime. Tu es le problème." />
        <meta property="og:image" content="https://iamtheredflag.com/api/icon?size=512" />
        <meta property="og:url" content="https://iamtheredflag.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: BASE, color: "#fff", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>

        {step === "landing" && (
          <>
            <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 700, background: `radial-gradient(circle, ${RED}18 0%, transparent 60%)`, pointerEvents: "none" }} />
            <div style={{ position: "fixed", bottom: 0, right: 0, width: 500, height: 500, background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${RED} 30%, #a855f7 70%, transparent)` }} />

            <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 18px 100px", position: "relative", zIndex: 1 }}>
              <div style={{ paddingTop: 40, textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 60, lineHeight: 1, marginBottom: 12, filter: `drop-shadow(0 0 40px ${RED}80)` }}>🚩</div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(58px, 19vw, 80px)", letterSpacing: "1px", lineHeight: 0.9, textTransform: "uppercase", color: "#fff" }}>I AM THE</div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(58px, 19vw, 80px)", letterSpacing: "1px", lineHeight: 0.9, textTransform: "uppercase", color: RED, textShadow: `0 0 80px ${RED}60`, marginBottom: 16 }}>RED FLAG</div>
                <div style={{ fontSize: "clamp(22px, 6vw, 30px)", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.75)", marginBottom: 24, letterSpacing: "0.5px" }}>not sorry.</div>
              </div>

              <div style={{ overflowX: "auto", display: "flex", gap: 6, padding: "4px 0 16px", scrollbarWidth: "none", marginBottom: 8 }}>
                {TAGS.map((tag) => (
                  <div key={tag} style={{ flexShrink: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "5px 12px", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {tag}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", marginBottom: 36, marginTop: 8 }}>
                <div style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif", fontSize: "clamp(22px, 6.5vw, 32px)", letterSpacing: "3px", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", lineHeight: 1.2 }}>
                  POUR UNE FOIS,<br />TU ES LE PROBLÈME.
                </div>
              </div>

              <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { icon: "🎭", title: "Découvre ton profil toxique", desc: "Réponds à des questions sans filtre et découvre ton vrai visage." },
                  { icon: "👑", title: "Débloque des titres", desc: "Deviens la Reine du Chaos, le Maître Manipulateur et plus encore." },
                  { icon: "🚩", title: "Accumule des drapeaux rouges", desc: "Plus tu assumes ton côté sombre, plus tu montes dans le classement." },
                  { icon: "🔗", title: "Partage ton diagnostic", desc: "Affiche fièrement ton résultat et défie tes amis." },
                ].map((f, i) => (
                  <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: `${RED}10`, border: `1px solid ${RED}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{f.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 32 }}>
                {[{ icon: "🫦", verb: "MENS." }, { icon: "🐍", verb: "MANIPULE." }, { icon: "💔", verb: "BRISE." }, { icon: "🔥", verb: "CHAOS." }, { icon: "🎭", verb: "RÉVÈLE." }].map((a) => (
                  <div key={a.verb} style={{ textAlign: "center", padding: "12px 4px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{a.icon}</div>
                    <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: 0.5, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{a.verb}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setSelectedArchetype(null); setStep("stories"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ width: "100%", padding: "20px 24px", background: `linear-gradient(135deg, ${RED}, #c0392b)`, border: "none", borderRadius: 16, color: "#fff", fontFamily: "'Anton', sans-serif", fontSize: 19, letterSpacing: "2px", cursor: "pointer", boxShadow: `0 16px 50px ${RED}50, 0 4px 12px rgba(0,0,0,0.5)`, textTransform: "uppercase", marginBottom: 10 }}>
                DÉCOUVRE TON DIAGNOSTIC RED FLAG →
              </button>
              <button onClick={() => { setStep("archetype"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ width: "100%", padding: "13px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: "rgba(255,255,255,0.3)", fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 36 }}>
                🎭 Expert Mode — Choisir mon archétype
              </button>

              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", textAlign: "center", marginBottom: 16 }}>🃏 8 ARCHÉTYPES À DÉBLOQUER</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {ARCHETYPES.map((a) => {
                    const rarity = RARITIES[a.id];
                    return (
                      <div key={a.id} style={{ aspectRatio: "3/4", background: `linear-gradient(160deg, ${a.color}20 0%, ${a.color}08 60%, transparent 100%)`, border: `1px solid ${a.color}30`, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "10px 6px 8px", position: "relative", overflow: "hidden", cursor: "pointer" }}
                        onClick={() => { setStep("archetype"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: a.color }} />
                        <div style={{ fontSize: 32, filter: "blur(3px)", lineHeight: 1, flexGrow: 1, display: "flex", alignItems: "center" }}>{a.emoji}</div>
                        <div style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1, color: rarity.color, textTransform: "uppercase", marginBottom: 4 }}>◆ {rarity.label}</div>
                        <div style={{ fontSize: 8, fontFamily: "'Anton', sans-serif", letterSpacing: "0.5px", color: "rgba(255,255,255,0.6)", textAlign: "center", textTransform: "uppercase", lineHeight: 1.2 }}>{a.name.toUpperCase()}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}>Révélé après ton diagnostic</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <button onClick={() => router.push("/defi")} style={{ padding: "13px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, color: "#f59e0b", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🎯 WEEKLY CHALLENGE</button>
                <button onClick={() => router.push("/hall-of-fame")} style={{ padding: "13px", background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 12, color: "rgba(245,158,11,0.6)", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>🏆 HALL OF FAME</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                <button onClick={() => router.push("/profil")} style={{ padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {mounted && gamesPlayed > 0 ? `🏅 PROFIL · ${gamesPlayed} drama${gamesPlayed > 1 ? "s" : ""}` : "🏅 MON PROFIL"}
                </button>
                <button onClick={() => router.push("/confessions")} style={{ padding: "12px", background: `${RED}06`, border: `1px solid ${RED}15`, borderRadius: 12, color: `${RED}99`, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>😈 CONFESSIONS</button>
              </div>

              <div style={{ textAlign: "center", padding: "24px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, marginBottom: 20 }}>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(18px, 5vw, 24px)", letterSpacing: "1px", lineHeight: 1.3, color: "rgba(255,255,255,0.75)" }}>POURQUOI ÉVITER LES RED FLAGS</div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(18px, 5vw, 24px)", letterSpacing: "1px", lineHeight: 1.3, color: RED }}>QUAND TU PEUX EN DEVENIR UN ?</div>
              </div>

              <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.1)", lineHeight: 1.8 }}>
                Simulation fictive · Contenu satirique<br />
                <a href="https://verticalclap.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(232,92,58,0.25)", textDecoration: "none", fontWeight: 700 }}>Powered by Vertical Clap</a>
              </p>
            </div>
          </>
        )}

        {step === "archetype" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 18px 100px" }}>
            <button onClick={() => setStep("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", padding: "0 0 24px 0", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>← Retour</button>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: RED, textTransform: "uppercase", marginBottom: 8 }}>ÉTAPE 1 / 2</div>
              <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 32, letterSpacing: "1px", margin: 0, textTransform: "uppercase" }}>Quel est ton archétype ?</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 8, marginBottom: 0, lineHeight: 1.5 }}>Ton archétype détermine tes bonus et ton style de jeu.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ARCHETYPES.map((a) => (
                <button key={a.id} onClick={() => handleSelectArchetype(a)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", fontFamily: "inherit" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${a.color}18`, border: `1.5px solid ${a.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{a.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{a.name}</div>
                    <div style={{ fontSize: 11, fontStyle: "italic", color: "rgba(255,255,255,0.35)", marginBottom: 5 }}>"{a.tagline}"</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: a.color, background: `${a.color}15`, display: "inline-block", padding: "2px 8px", borderRadius: 6, letterSpacing: 0.5 }}>{a.bonus}</div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 18, flexShrink: 0 }}>→</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "stories" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 18px 100px" }}>
            <button onClick={() => selectedArchetype ? setStep("archetype") : setStep("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", padding: "0 0 20px 0", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>← {selectedArchetype ? "Changer d'archétype" : "Retour"}</button>
            {selectedArchetype ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${selectedArchetype.color}12`, border: `1px solid ${selectedArchetype.color}30`, borderRadius: 12, padding: "10px 14px", marginBottom: 24 }}>
                <span style={{ fontSize: 20 }}>{selectedArchetype.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: selectedArchetype.color }}>{selectedArchetype.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{selectedArchetype.bonus}</div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${RED}06`, border: `1px solid ${RED}20`, borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
                <span style={{ fontSize: 22 }}>🔍</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: RED }}>MODE DIAGNOSTIC</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Ton archétype sera révélé à la fin — joue honnêtement</div>
                </div>
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: RED, textTransform: "uppercase", marginBottom: 8 }}>{selectedArchetype ? "ÉTAPE 2 / 2" : "ÉTAPE 1 / 1"}</div>
              <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 30, letterSpacing: "1px", margin: 0, textTransform: "uppercase" }}>Choisis ton drama.</h1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {STORIES.map((story) => {
                const locked = !story.available;
                return (
                  <button key={story.id} onClick={() => handlePlayStory(story)} disabled={locked}
                    style={{ width: "100%", background: locked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)", border: locked ? "1.5px solid rgba(255,255,255,0.04)" : "1.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 16px", cursor: locked ? "not-allowed" : "pointer", textAlign: "left", opacity: locked ? 0.5 : 1, fontFamily: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ fontSize: 34, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{story.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 15, fontWeight: 900, color: locked ? "rgba(255,255,255,0.3)" : "#fff" }}>{story.title}</span>
                          <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: story.difficultyColor, background: `${story.difficultyColor}20`, padding: "2px 7px", borderRadius: 5 }}>{story.difficulty}</span>
                          {story.comingSoon && <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", padding: "2px 7px", borderRadius: 5 }}>BIENTÔT</span>}
                        </div>
                        <div style={{ fontSize: 12, fontStyle: "italic", color: "rgba(255,255,255,0.45)", marginBottom: 5 }}>{story.tagline}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>{story.description}</div>
                        {!locked && <div style={{ marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>4 scènes · ~3 min</div>}
                      </div>
                      {!locked && <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 18, flexShrink: 0 }}>→</div>}
                    </div>
                  </button>
                );
              })}
            </div>
            <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.15)", marginTop: 20 }}>Nouvelles histoires chaque semaine</p>
          </div>
        )}
      </div>

      <RedFlagNav />

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: ${BASE}; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
