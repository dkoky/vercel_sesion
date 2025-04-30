const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Método no permitido" });
    }

    const user = req.query.user;

    if (!user) {
      return res.status(400).json({ message: "Falta el parámetro 'user'" });
    }

    const exists = await redis.get(`session:${user}`);
    return res.status(200).json({ connected: !!exists });
  } catch (err) {
    console.error("Error en session-check:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
