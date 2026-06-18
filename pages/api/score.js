import { Redis } from "@upstash/redis";

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function getWeekKey() {
  const now = new Date();
  const year = now.getFullYear();
  const week = Math.floor(
    (now - new Date(year, 0, 1)) / (7 * 24 * 60 * 60 * 1000)
  );
  return `redflag:hof:${year}-W${String(week).padStart(2, "0")}`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET") {
    const redis = getRedis();
    if (!redis) return res.status(200).json({ scores: [] });

    try {
      const key = getWeekKey();
      const raw = await redis.zrange(key, 0, 9, { rev: true, withScores: true });

      const scores = [];
      for (let i = 0; i < raw.length; i += 2) {
        const member = typeof raw[i] === "string" ? JSON.parse(raw[i]) : raw[i];
        scores.push({ ...member, rf: Number(raw[i + 1]) });
      }

      return res.status(200).json({ scores });
    } catch {
      return res.status(200).json({ scores: [] });
    }
  }

  if (req.method === "POST") {
    const { pseudo, archetype, archetypeEmoji, archetypeColor, storyTitle, storyEmoji, title, rf, chaos, manipulation, heartbreak, toxicity } = req.body || {};

    if (!rf || !archetype || !title) {
      return res.status(400).json({ error: "Données manquantes" });
    }

    const rfScore = Math.min(99999, Math.max(0, parseInt(rf)));
    const redis = getRedis();
    if (!redis) return res.status(200).json({ ok: true });

    try {
      const key = getWeekKey();
      const member = JSON.stringify({
        pseudo: (pseudo || "Anonyme").slice(0, 20),
        archetype,
        archetypeEmoji,
        archetypeColor,
        storyTitle,
        storyEmoji,
        title,
        chaos: parseInt(chaos) || 0,
        manipulation: parseInt(manipulation) || 0,
        heartbreak: parseInt(heartbreak) || 0,
        toxicity: parseInt(toxicity) || 0,
        at: Date.now(),
      });

      await redis.zadd(key, { score: rfScore, member });
      await redis.expire(key, 60 * 60 * 24 * 14);

      return res.status(200).json({ ok: true });
    } catch {
      return res.status(200).json({ ok: true });
    }
  }

  return res.status(405).end();
}
