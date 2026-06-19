import { Redis } from "@upstash/redis";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
}

function getTodayKey() {
  const d = new Date();
  return `redflag:daily:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const THEMES = [
  "une colocation qui tourne mal entre deux ex",
  "un anniversaire surprise qui révèle tout",
  "une rupture par message pendant les vacances",
  "un dîner de famille qui dégénère",
  "une promotion volée par un(e) collègue jaloux",
  "un ex qui réapparaît le jour de la Saint-Valentin",
  "une fête d'entreprise qui tourne au désastre",
  "une rencontre sur une app de dating qui cache quelque chose",
  "une trahison entre meilleures amies",
  "un mariage annulé à la dernière minute",
  "une jalousie entre frères et sœurs",
  "un groupe de vacances qui éclate",
  "une déclaration d'amour au mauvais moment",
  "un secret révélé dans un groupe WhatsApp",
  "une dispute en avion ou en voiture sans pouvoir partir",
  "une compétition sportive entre ex",
  "un appartement en commun après la rupture",
  "une infidélité découverte via les stories Instagram",
  "une dispute d'argent entre amis proches",
  "un ex qui sort avec ton/ta meilleur(e) ami(e)",
];

function buildPrompt(theme) {
  return `Tu es le créateur du jeu viral "I AM THE RED FLAG" — un jeu de micro-dramas où le joueur EST le red flag, le problème, le manipulateur.

Génère UNE histoire complète en JSON sur ce thème : "${theme}"

RÈGLES ABSOLUES :
- En français, ton mordant, drôle, dramatique
- Le joueur est TOUJOURS le problème / le toxic / le manipulateur
- Chaque choix doit être délicieux, un peu choquant, satisfaisant à choisir
- Les conséquences sont courtes, percutantes, avec une pointe d'humour noir (2-3 phrases max)
- 4 scènes exactement, 3 choix par scène
- La dernière scène s'appelle toujours "L'ÉPILOGUE"
- Les rfTag sont des labels stylisés courts en majuscules (ex: MASTERCLASS, NUCLEAR, GASLIGHTING, CINÉMATIQUE, LÉGENDAIRE, CHIRURGICAL, POÉTIQUE, CHEF-D'ŒUVRE)
- Les stats rf vont de 100 à 1500, croissant au fil des scènes

FORMAT JSON STRICT (réponds UNIQUEMENT avec ce JSON, rien d'autre) :
{
  "id": "slug-unique-en-minuscules",
  "title": "TITRE EN MAJUSCULES",
  "emoji": "1 emoji",
  "tagline": "une accroche courte et choc",
  "description": "description en 1-2 phrases",
  "difficulty": "MOT STYLISÉ",
  "difficultyColor": "#hexcolor",
  "scenes": [
    {
      "id": "s1",
      "title": "TITRE SCÈNE",
      "situation": "La situation (2-3 phrases immersives, présent)",
      "tone": "1 emoji",
      "choices": [
        {
          "id": "c1",
          "text": "Action concrète du joueur",
          "icon": "1 emoji",
          "rfTag": "TAG",
          "consequence": "Ce qui se passe (2-3 phrases, percutant)",
          "stats": { "chaos": 10, "manipulation": 30, "heartbreak": 10, "rf": 200 }
        },
        { "id": "c2", "text": "...", "icon": "...", "rfTag": "...", "consequence": "...", "stats": { "chaos": 0, "manipulation": 0, "heartbreak": 0, "rf": 0 } },
        { "id": "c3", "text": "...", "icon": "...", "rfTag": "...", "consequence": "...", "stats": { "chaos": 0, "manipulation": 0, "heartbreak": 0, "rf": 0 } }
      ]
    },
    { "id": "s2", "title": "...", "situation": "...", "tone": "...", "choices": [...] },
    { "id": "s3", "title": "...", "situation": "...", "tone": "...", "choices": [...] },
    { "id": "s4", "title": "L'ÉPILOGUE", "situation": "...", "tone": "🚩", "choices": [...] }
  ]
}`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, s-maxage=3600");

  const redis = getRedis();
  const key = getTodayKey();

  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        const story = typeof cached === "string" ? JSON.parse(cached) : cached;
        return res.status(200).json({ story, cached: true });
      }
    } catch {}
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "No API key configured" });
  }

  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2500,
        messages: [{ role: "user", content: buildPrompt(theme) }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error("Empty response from Claude");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const story = JSON.parse(jsonMatch[0]);
    story.available = true;
    story.isDaily = true;
    story.generatedAt = new Date().toISOString();

    if (redis) {
      try {
        await redis.set(key, JSON.stringify(story), { ex: 60 * 60 * 26 });
      } catch {}
    }

    return res.status(200).json({ story, cached: false });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
