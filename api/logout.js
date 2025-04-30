import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const user = body?.user;

    if (!user) {
      return res.status(400).json({ message: "Falta el campo 'user'" });
    }

    await redis.del(`session:${user}`);
    return res.status(200).json({ message: "Usuario desconectado correctamente" });
  } catch (err) {
    console.error("Error en logout:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
