import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { user } = req.query;
  const exists = await redis.get(`session:${user}`);
  return res.status(200).json({ connected: !!exists });
}
