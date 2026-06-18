import { Redis } from "@upstash/redis";

const KEY = "redflag:confessions";
const MAX_CONFESSIONS = 200;

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET") {
    const redis = getRedis();
    if (!redis) return res.status(200).json({ confessions: FALLBACK_CONFESSIONS });

    try {
      const raw = await redis.lrange(KEY, 0, 49);
      const confessions = raw.map((r) =>
        typeof r === "string" ? JSON.parse(r) : r
      );
      return res.status(200).json({ confessions });
    } catch {
      return res.status(200).json({ confessions: FALLBACK_CONFESSIONS });
    }
  }

  if (req.method === "POST") {
    const { text, archetypeId, archetypeEmoji, archetypeColor } = req.body || {};
    if (!text || text.length < 5 || text.length > 160) {
      return res.status(400).json({ error: "Texte invalide" });
    }

    const confession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: text.slice(0, 160),
      archetypeId: archetypeId || null,
      archetypeEmoji: archetypeEmoji || "🚩",
      archetypeColor: archetypeColor || "E85C3A",
      reactions: { "🚩": 0, "😈": 0, "💀": 0, "🔥": 0 },
      at: Date.now(),
    };

    const redis = getRedis();
    if (!redis) return res.status(200).json({ ok: true, confession });

    try {
      await redis.lpush(KEY, JSON.stringify(confession));
      await redis.ltrim(KEY, 0, MAX_CONFESSIONS - 1);
      return res.status(200).json({ ok: true, confession });
    } catch {
      return res.status(200).json({ ok: true, confession });
    }
  }

  if (req.method === "PATCH") {
    const { id, emoji } = req.body || {};
    const VALID = ["🚩", "😈", "💀", "🔥"];
    if (!id || !VALID.includes(emoji)) {
      return res.status(400).json({ error: "Invalide" });
    }

    const reactionKey = `redflag:reaction:${id}:${emoji}`;
    const redis = getRedis();
    if (!redis) return res.status(200).json({ ok: true });

    try {
      const count = await redis.incr(reactionKey);
      await redis.expire(reactionKey, 60 * 60 * 24 * 30);
      return res.status(200).json({ ok: true, count });
    } catch {
      return res.status(200).json({ ok: true });
    }
  }

  return res.status(405).end();
}

const FALLBACK_CONFESSIONS = [
  { id: "f1", text: "J'ai liké sa plus vieille photo Instagram à 3h du matin. Accidentellement. On y croit tous les deux.", archetypeEmoji: "🐍", archetypeColor: "22c55e", reactions: { "🚩": 847, "😈": 312, "💀": 203, "🔥": 156 }, at: Date.now() - 3600000 },
  { id: "f2", text: "J'ai annulé nos plans 10 minutes avant pour voir s'il allait chercher à me convaincre de rester. Il n'a pas cherché. J'ai annulé nos plans suivants aussi.", archetypeEmoji: "🔥", archetypeColor: "f97316", reactions: { "🚩": 1204, "😈": 589, "💀": 401, "🔥": 287 }, at: Date.now() - 7200000 },
  { id: "f3", text: "Je lui ai dit que j'étais 'très occupée ce weekend' et j'ai posté des stories depuis mon canapé.", archetypeEmoji: "✨", archetypeColor: "06b6d4", reactions: { "🚩": 2341, "😈": 1102, "💀": 678, "🔥": 445 }, at: Date.now() - 10800000 },
  { id: "f4", text: "Son ex m'a suivie sur Insta. J'ai attendu 6 heures avant de suivre en retour pour ne pas avoir l'air trop enthousiaste.", archetypeEmoji: "💸", archetypeColor: "f59e0b", reactions: { "🚩": 932, "😈": 445, "💀": 289, "🔥": 178 }, at: Date.now() - 14400000 },
  { id: "f5", text: "Je réponds 'ça va' quand ça ne va pas, et je m'offusque qu'il ne voie pas que ça ne va pas.", archetypeEmoji: "💔", archetypeColor: "f43f5e", reactions: { "🚩": 3821, "😈": 1567, "💀": 892, "🔥": 634 }, at: Date.now() - 18000000 },
  { id: "f6", text: "J'ai gardé ses messages pour les relire à 2h du mat et trouver des sous-entendus qui n'existaient probablement pas.", archetypeEmoji: "🤡", archetypeColor: "ec4899", reactions: { "🚩": 1547, "😈": 723, "💀": 412, "🔥": 298 }, at: Date.now() - 21600000 },
  { id: "f7", text: "Je lui ai dit 'fais ce que tu veux' en espérant très fort qu'il fasse ce que je voulais.", archetypeEmoji: "👑", archetypeColor: "a855f7", reactions: { "🚩": 4102, "😈": 2341, "💀": 1204, "🔥": 889 }, at: Date.now() - 25200000 },
];
