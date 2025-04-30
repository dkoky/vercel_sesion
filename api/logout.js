import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { user } = JSON.parse(req.body);
  await redis.del(`session:${user}`);
  return res.status(200).json({ message: "User disconnected" });
}
