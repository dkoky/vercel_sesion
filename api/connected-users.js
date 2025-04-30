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

    const keys = await redis.keys("session:*");
    const users = keys.map((key) => key.replace("session:", ""));

    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error en connected-users:", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
