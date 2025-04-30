const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const user = body?.user;

    if (!user) {
      return res.status(400).json({ message: "Falta el campo 'user'" });
    }

    const existing = await redis.get(`session:${user}`);
    if (existing) {
      return res.status(403).json({ message: "Usuario ya conectado" });
    }

    await redis.set(`session:${user}`, "connected", { ex: 3600 });
    return res.status(200).json({ message: "Usuario conectado correctamente" });
  } catch (err) {
    console.error("Error en connect-user:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
