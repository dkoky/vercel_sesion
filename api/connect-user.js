import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { user } = JSON.parse(req.body);

  const exists = await redis.get(`session:${user}`);
  if (exists) {
    return res.status(403).json({ message: "User already connected" });
  }

  await redis.set(`session:${user}`, "connected", { ex: 3600 });
  return res.status(200).json({ message: "User marked as connected" });
}
