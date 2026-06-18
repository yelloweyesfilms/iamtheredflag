// Badge definitions and localStorage helpers for I AM THE RED FLAG

export const BADGES = [
  { id: "first-blood", emoji: "🩸", name: "First Blood", desc: "Terminer une première histoire", rarity: "common", rarityColor: "#94a3b8" },
  { id: "heartbreaker", emoji: "💔", name: "Heartbreaker", desc: "Briser 3+ cœurs en une seule partie", rarity: "uncommon", rarityColor: "#f43f5e" },
  { id: "high-roller", emoji: "🎰", name: "High Roller", desc: "Obtenir 1 000+ RF points en une partie", rarity: "uncommon", rarityColor: "#f59e0b" },
  { id: "chaos-addict", emoji: "🔥", name: "Chaos Addict", desc: "Jouer 3 dramas", rarity: "common", rarityColor: "#f97316" },
  { id: "serial-red-flag", emoji: "🚩", name: "Serial Red Flag", desc: "Jouer 5 dramas", rarity: "rare", rarityColor: "#E85C3A" },
  { id: "manipulation-master", emoji: "🐍", name: "Manipulation Master", desc: "500+ points de manipulation en une partie", rarity: "rare", rarityColor: "#22c55e" },
  { id: "ultra-chaos", emoji: "💥", name: "Ultra Chaos", desc: "500+ points de chaos en une partie", rarity: "rare", rarityColor: "#f97316" },
  { id: "hall-of-famer", emoji: "🏆", name: "Hall of Famer", desc: "Soumettre un score au classement", rarity: "uncommon", rarityColor: "#f59e0b" },
  { id: "challenger-winner", emoji: "⚔️", name: "Challenger", desc: "Battre un ami en mode versus", rarity: "rare", rarityColor: "#a855f7" },
  { id: "toxic-royalty", emoji: "👑", name: "Toxic Royalty", desc: "Jouer avec l'archétype Toxic Queen", rarity: "uncommon", rarityColor: "#a855f7" },
  { id: "completionist", emoji: "🎭", name: "Completionist", desc: "Jouer les 5 dramas disponibles", rarity: "epic", rarityColor: "#06b6d4" },
  { id: "final-boss", emoji: "☠️", name: "Final Boss", desc: "Atteindre 5 000+ RF points en une partie", rarity: "legendary", rarityColor: "#E85C3A" },
];

export const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];

export function getEarnedBadges() {
  try { return JSON.parse(localStorage.getItem("rf_badges") || "[]"); } catch { return []; }
}
export function getStoriesPlayed() {
  try { return JSON.parse(localStorage.getItem("rf_stories_played") || "[]"); } catch { return []; }
}
export function getBestRF() {
  try { return parseInt(localStorage.getItem("rf_best_rf") || "0"); } catch { return 0; }
}
export function hasSubmittedHof() {
  try { return localStorage.getItem("rf_submitted_hof") === "1"; } catch { return false; }
}
export function markHofSubmitted() {
  try { localStorage.setItem("rf_submitted_hof", "1"); } catch {}
}
export function recordStoryPlayed(storyId) {
  const played = getStoriesPlayed();
  if (!played.includes(storyId)) {
    try { localStorage.setItem("rf_stories_played", JSON.stringify([...played, storyId])); } catch {}
  }
}
export function updateBestRF(rfPoints) {
  const current = getBestRF();
  if (rfPoints > current) {
    try { localStorage.setItem("rf_best_rf", String(rfPoints)); } catch {}
  }
}
export function computeNewBadges({ rf, chaos, manipulation, hearts, archetypeId, storyId, wonVersus, hofSubmitted }) {
  const gamesPlayed = parseInt(localStorage.getItem("rf_games_played") || "0");
  const storiesPlayed = getStoriesPlayed();
  const allStoriesAfter = storiesPlayed.includes(storyId) ? storiesPlayed : [...storiesPlayed, storyId];
  const conditions = {
    "first-blood": gamesPlayed >= 1,
    "heartbreaker": hearts >= 3,
    "high-roller": rf >= 1000,
    "chaos-addict": gamesPlayed >= 3,
    "serial-red-flag": gamesPlayed >= 5,
    "manipulation-master": manipulation >= 500,
    "ultra-chaos": chaos >= 500,
    "hall-of-famer": hofSubmitted,
    "challenger-winner": wonVersus === true,
    "toxic-royalty": archetypeId === "toxic-queen",
    "completionist": allStoriesAfter.length >= 5,
    "final-boss": rf >= 5000,
  };
  const alreadyEarned = getEarnedBadges();
  const newBadges = [];
  for (const badge of BADGES) {
    if (!alreadyEarned.includes(badge.id) && conditions[badge.id]) newBadges.push(badge);
  }
  if (newBadges.length > 0) {
    try { localStorage.setItem("rf_badges", JSON.stringify([...alreadyEarned, ...newBadges.map((b) => b.id)])); } catch {}
  }
  return newBadges;
}
